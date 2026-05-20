/**
 * ============================================================================
 * CAMADA DE RENDERIZAÇÃO - TOKENS DE PERSONAGENS (TokenLayer)
 * ============================================================================
 * 
 * RESPONSABILIDADE:
 * - Renderizar todos os tokens (fichas) de personagens ativos no tabuleiro.
 * - Gerenciar a visibilidade individual dos tokens em relação à Névoa de Guerra:
 *   - Esconde o token completamente na visão de Jogador (Player) se estiver no escuro.
 *   - Esmaece (reduz opacidade/escala cinza) o token na visão de Mestre (GM) se estiver no escuro.
 * - Registrar o clique de início de arrasto integrando com o contexto de interação global.
 * 
 * DESIGN DE PERFORMANCE:
 * - O componente interno `TokenItem` é embrulhado em `React.memo` para evitar
 *   que tokens individuais não modificados sofram re-renderizações durante movimentos
 *   de câmera ou pinceladas de névoa de guerra adjacentes.
 * 
 * O QUE NÃO FAZ:
 * - Não gerencia coordenadas lógicas de movimentação ou faz o cálculo de pan.
 * ============================================================================
 */

import { memo } from 'react';
import type { WorldPosition } from '../../core/spatial/types';
import type { FogState } from '../../systems/fog/types';
import type { ViewMode, PerspectiveState } from '../../systems/perspective/types';
import { useInteraction } from '../../core/interaction/interactionContext';
import { theme } from '../../theme';

export interface Token {
  id: string;
  name: string;
  initials: string;
  position: WorldPosition;
  color: string;
}

interface TokenLayerProps {
  tokens: Token[];
  fogState: FogState;
  isPositionRevealed: (position: WorldPosition) => boolean;
  perspectiveState: PerspectiveState;
}

interface TokenItemProps {
  token: Token;
  isRevealed: boolean;
  viewMode: ViewMode;
  isSelected: boolean;
  isDragging: boolean;
  onPointerDown: (tokenId: string, e: React.PointerEvent) => void;
}

/**
 * Item de Token Individual Memoizado para otimização de renderização.
 */
const TokenItem = memo(function TokenItem({
  token,
  isRevealed,
  viewMode,
  isSelected,
  isDragging,
  onPointerDown,
}: TokenItemProps) {
  const isPlayerHidden = viewMode === 'player' && !isRevealed;

  // Jogadores não devem ver absolutamente nada se o token estiver em zona de escuridão da névoa
  if (isPlayerHidden) return null;

  // Para o Mestre, tokens escondidos ficam apagados/esmaecidos para fins de controle táctico
  const gmDimmingClass =
    viewMode === 'gm' && !isRevealed ? 'opacity-40 grayscale-[0.5]' : '';

  return (
    <div
      className={`group absolute flex flex-col items-center justify-center transition-hover ${
        isDragging
          ? 'cursor-grabbing scale-110'
          : isSelected
          ? 'cursor-grab scale-[1.02]'
          : 'cursor-grab hover:scale-[1.04]'
      } ${gmDimmingClass}`}
      style={{
        zIndex: isDragging ? theme.zIndex.tokenDragging : theme.zIndex.token,
        left: token.position.x,
        top: token.position.y,
        transform: 'translate(-50%, -50%)',
      }}
      onPointerDown={(e) => onPointerDown(token.id, e)}
    >
      {/* Botão visual de representação do Token */}
      <div
        className="flex items-center justify-center size-12 rounded-full border transition-hover"
        style={{
          background: `linear-gradient(to bottom right, ${theme.colors.zinc[900]}, ${theme.colors.zinc[950]})`,
          boxShadow: isDragging
            ? theme.depth.glows.tokenActive
            : isSelected
            ? theme.depth.glows.tokenSelected
            : theme.depth.glows.tokenDefault,
          borderColor: isDragging
            ? theme.colors.amber[200]
            : isSelected
            ? theme.colors.amber[400]
            : theme.colors.amber[600],
        }}
      >
        <div className="flex size-full items-center justify-center rounded-full border border-amber-900/30 bg-zinc-900/80 backdrop-blur-sm">
          <span className={`text-sm font-bold tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${token.color}`}>
            {token.initials}
          </span>
        </div>
      </div>

      {/* Label de texto com o Nome do Personagem */}
      <span
        className={`absolute -bottom-7 px-2 py-0.5 rounded border bg-zinc-950/90 text-[10px] font-medium tracking-wide shadow-cinematic-sm blur-ambient-sm transition-hover ${
          isSelected
            ? 'border-amber-500/40 text-amber-200'
            : 'border-zinc-800/60 text-zinc-400 opacity-0 group-hover:opacity-100'
        }`}
      >
        {token.name}
      </span>
    </div>
  );
});

export const TokenLayer = memo(function TokenLayer({
  tokens,
  fogState,
  isPositionRevealed,
  perspectiveState,
}: TokenLayerProps) {
  const { selectedTokenId, draggingTokenId, handleTokenPointerDown } = useInteraction();

  return (
    <>
      {tokens.map((token) => {
        const isRevealed = fogState.isActive ? isPositionRevealed(token.position) : true;
        const isDragging = draggingTokenId === token.id;
        const isSelected = selectedTokenId === token.id;

        return (
          <TokenItem
            key={token.id}
            token={token}
            isRevealed={isRevealed}
            viewMode={perspectiveState.viewMode}
            isSelected={isSelected}
            isDragging={isDragging}
            onPointerDown={handleTokenPointerDown}
          />
        );
      })}
    </>
  );
});
