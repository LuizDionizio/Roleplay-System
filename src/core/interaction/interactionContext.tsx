/* eslint-disable react-refresh/only-export-components */
/**
 * ============================================================================
 * NÚCLEO DE INTERAÇÃO - DIRETOR DE EVENTOS (interactionCore / interactionContext)
 * ============================================================================
 * 
 * RESPONSABILIDADE:
 * - Capturar e gerenciar entradas físicas globais (mouse, toque, teclado) na área do mapa.
 * - Resolver o modo de interação ativo com base na ferramenta selecionada e modificadores (ex: Barra de Espaço).
 * - Otimizar eventos de arrasto (pan de mapa, arrasto de token, pintura de névoa)
 *   utilizando acumulação de deltas e agendamento via `requestAnimationFrame` (rAF).
 * - Proteger áreas interativas da interface do usuário (HUD) contra cliques fantasmas ou indesejados.
 * 
 * O QUE NÃO FAZ:
 * - Não armazena as coordenadas finais dos tokens (delega para o estado do Battleground).
 * - Não armazena o mapa de pixels revelados da névoa de guerra.
 * - Não toca áudios ou renderiza elementos visuais diretamente.
 * ============================================================================
 */

import type React from 'react';
import { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { ToolMode } from '../../systems/perspective/types';
import type { WorldPosition } from '../spatial/types';
import type { PointerState } from './pointerState';
import { INITIAL_POINTER_STATE } from './pointerState';
import type { InteractionMode } from './interactionModes';
import { resolveInteractionMode } from './toolResolver';
import { isInteractiveElement } from './inputGuards';
import { screenToWorld } from '../spatial/helpers';

export interface InteractionContextProps {
  pointerState: PointerState;
  activeMode: InteractionMode;
  isSpacePressed: boolean;
  selectedTokenId: string | null;
  setSelectedTokenId: (id: string | null) => void;
  draggingTokenId: string | null;
  registerMapContainerRef: (ref: React.RefObject<HTMLDivElement | null>) => void;
  registerMapImageRef: (ref: React.RefObject<HTMLImageElement | null>) => void;
  handleTokenPointerDown: (tokenId: string, e: React.PointerEvent) => void;
}

export const InteractionContext = createContext<InteractionContextProps | null>(null);

/**
 * Hook customizado para consumir os estados de gestos e ponteiro unificados.
 */
export function useInteraction() {
  const context = useContext(InteractionContext);
  if (!context) {
    throw new Error('useInteraction must be used within an InteractionProvider');
  }
  return context;
}

interface InteractionProviderProps {
  activeTool: ToolMode;
  mapScale: number;
  onPan: (dx: number, dy: number) => void;
  onZoom: (deltaY: number) => void;
  onTokenDragStart?: (tokenId: string) => void;
  onTokenDragMove: (tokenId: string, dx: number, dy: number) => void;
  onTokenDragEnd?: (tokenId: string) => void;
  onFogStrokeStart: (position: WorldPosition, action: 'reveal' | 'restore') => void;
  onFogStrokeMove: (position: WorldPosition, action: 'reveal' | 'restore') => void;
  onFogStrokeEnd: () => void;
  onPing: (position: WorldPosition) => void;
  onSpotlight: (position: WorldPosition, isAltPressed: boolean, isRightClick: boolean) => void;
  children: React.ReactNode;
}

export function InteractionProvider({
  activeTool,
  mapScale,
  onPan,
  onZoom,
  onTokenDragStart,
  onTokenDragMove,
  onTokenDragEnd,
  onFogStrokeStart,
  onFogStrokeMove,
  onFogStrokeEnd,
  onPing,
  onSpotlight,
  children,
}: InteractionProviderProps) {
  const [pointerState, setPointerState] = useState<PointerState>(INITIAL_POINTER_STATE);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const [draggingTokenId, setDraggingTokenId] = useState<string | null>(null);
  const [isMapPanning, setIsMapPanning] = useState(false);
  const [fogStrokeAction, setFogStrokeAction] = useState<'reveal' | 'restore' | null>(null);

  // Referências para o container DOM e imagem do mapa para fins de bounding box e conversão de espaço
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapImageRef = useRef<HTMLImageElement | null>(null);

  // Armazena as coordenadas físicas temporárias do ponteiro fora do fluxo React para evitar re-renderizações excessivas
  const pointerCoordsRef = useRef({ x: 0, y: 0 });

  const registerMapContainerRef = (ref: React.RefObject<HTMLDivElement | null>) => {
    containerRef.current = ref.current;
  };

  const registerMapImageRef = (ref: React.RefObject<HTMLImageElement | null>) => {
    mapImageRef.current = ref.current;
  };

  // Escuta de teclas de modificação globais (ex: Barra de espaço para navegação rápida)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignora atalhos de espaço caso o foco esteja em um input/text-area
      if (e.code === 'Space' && !e.repeat && (e.target as HTMLElement).tagName !== 'INPUT') {
        setIsSpacePressed(true);
        setPointerState((curr) => ({
          ...curr,
          modifiers: {
            ...curr.modifiers,
            space: true,
          },
        }));
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
        setPointerState((curr) => ({
          ...curr,
          modifiers: {
            ...curr.modifiers,
            space: false,
          },
        }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Determina dinamicamente o modo ativo atual
  const activeMode = resolveInteractionMode(activeTool, isSpacePressed, draggingTokenId);

  // Início de arrasto de tokens (disparado diretamente de TokenItem)
  const handleTokenPointerDown = (tokenId: string, e: React.PointerEvent) => {
    if (e.button !== 0) return; // Apenas botão esquerdo
    e.stopPropagation();        // Evita iniciar pan de mapa simultaneamente
    e.preventDefault();

    setDraggingTokenId(tokenId);
    setSelectedTokenId(tokenId);
    pointerCoordsRef.current = { x: e.clientX, y: e.clientY };

    if (onTokenDragStart) {
      onTokenDragStart(tokenId);
    }
  };

  // Evento de zoom pela roda do mouse (wheel)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault(); // Evita scroll padrão da página
      onZoom(e.deltaY);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [onZoom]);

  // Eventos de clique inicial no container principal do mapa
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handlePointerDown = (e: PointerEvent) => {
      // Ignora clique se o clique tiver como alvo o HUD, sidebars ou inputs
      if (isInteractiveElement(e.target as HTMLElement)) return;

      const mapImg = mapImageRef.current;
      if (!mapImg) return;

      const rect = mapImg.getBoundingClientRect();
      const worldPos = screenToWorld(e.clientX, e.clientY, rect, mapScale);

      // Resolve o modo de interação instantâneo
      const currentMode = resolveInteractionMode(activeTool, isSpacePressed, draggingTokenId);

      if (currentMode === 'explore') {
        if (e.button === 0) { // Botão esquerdo: inicia pan de câmera
          setIsMapPanning(true);
          setSelectedTokenId(null); // Desmarca token se clicar no fundo
          pointerCoordsRef.current = { x: e.clientX, y: e.clientY };
          e.preventDefault();
        }
      } else if (currentMode === 'fog-draw') {
        if (e.button === 0) { // Botão esquerdo: inicia traço de névoa (Alt inverte para revelar)
          const action = e.altKey ? 'restore' : 'reveal';
          setFogStrokeAction(action);
          onFogStrokeStart(worldPos, action);
          e.preventDefault();
        }
      } else if (currentMode === 'spotlight-place') {
        if (e.button === 0 || e.button === 2) { // Botão esquerdo ou direito define foco de luz
          onSpotlight(worldPos, e.altKey, e.button === 2);
          e.preventDefault();
        }
      } else if (currentMode === 'ping-place') {
        if (e.button === 0) { // Botão esquerdo emite ping espacial
          onPing(worldPos);
          e.preventDefault();
        }
      }
    };

    container.addEventListener('pointerdown', handlePointerDown);
    return () => {
      container.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [activeTool, isSpacePressed, draggingTokenId, mapScale, onFogStrokeStart, onSpotlight, onPing]);

  // Efeito centralizado que gerencia o fluxo de movimentos contínuos (Arrasto do mapa, arrasto de token, desenho da névoa)
  // Agendado sob requestAnimationFrame para garantir fluidez a taxas de atualização elevadas.
  useEffect(() => {
    const anyActive = isMapPanning || draggingTokenId !== null || fogStrokeAction !== null;
    if (!anyActive) return;

    let rafId: number | null = null;
    let pendingPan = { dx: 0, dy: 0 };
    let pendingDrag = { dx: 0, dy: 0 };
    let pendingFogPos: WorldPosition | null = null;

    const handlePointerMove = (e: PointerEvent) => {
      const dx = e.clientX - pointerCoordsRef.current.x;
      const dy = e.clientY - pointerCoordsRef.current.y;

      if (isMapPanning) {
        pendingPan.dx += dx;
        pendingPan.dy += dy;
        pointerCoordsRef.current = { x: e.clientX, y: e.clientY };
      } else if (draggingTokenId !== null) {
        // Divide o deslocamento de tela pela escala para que o arrasto do token acompanhe exatamente o cursor
        const worldDx = dx / mapScale;
        const worldDy = dy / mapScale;
        pendingDrag.dx += worldDx;
        pendingDrag.dy += worldDy;
        pointerCoordsRef.current = { x: e.clientX, y: e.clientY };
      } else if (fogStrokeAction !== null) {
        const mapImg = mapImageRef.current;
        if (mapImg) {
          const rect = mapImg.getBoundingClientRect();
          pendingFogPos = screenToWorld(e.clientX, e.clientY, rect, mapScale);
        }
      }

      // Agenda a aplicação de transformações React no início da próxima atualização de tela física
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          rafId = null;
          if (isMapPanning && (pendingPan.dx !== 0 || pendingPan.dy !== 0)) {
            onPan(pendingPan.dx, pendingPan.dy);
            pendingPan = { dx: 0, dy: 0 };
          }
          if (draggingTokenId !== null && (pendingDrag.dx !== 0 || pendingDrag.dy !== 0)) {
            onTokenDragMove(draggingTokenId, pendingDrag.dx, pendingDrag.dy);
            pendingDrag = { dx: 0, dy: 0 };
          }
          if (fogStrokeAction !== null && pendingFogPos !== null) {
            onFogStrokeMove(pendingFogPos, fogStrokeAction);
            pendingFogPos = null;
          }
        });
      }
    };

    const handlePointerUp = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      if (isMapPanning) {
        setIsMapPanning(false);
      }
      if (draggingTokenId !== null) {
        if (onTokenDragEnd) {
          onTokenDragEnd(draggingTokenId);
        }
        setDraggingTokenId(null);
      }
      if (fogStrokeAction !== null) {
        onFogStrokeEnd();
        setFogStrokeAction(null);
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isMapPanning, draggingTokenId, fogStrokeAction, mapScale, onPan, onTokenDragMove, onTokenDragEnd, onFogStrokeMove, onFogStrokeEnd]);

  return (
    <InteractionContext.Provider
      value={{
        pointerState,
        activeMode,
        isSpacePressed,
        selectedTokenId,
        setSelectedTokenId,
        draggingTokenId,
        registerMapContainerRef,
        registerMapImageRef,
        handleTokenPointerDown,
      }}
    >
      {children}
    </InteractionContext.Provider>
  );
}
