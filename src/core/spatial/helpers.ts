/**
 * ============================================================================
 * NÚCLEO ESPACIAL - AJUDANTES E AUXILIARES (spatialCore / helpers)
 * ============================================================================
 * 
 * RESPONSABILIDADE:
 * - Prover funções puras de conversão entre coordenadas de tela (Screen/Viewport)
 *   e coordenadas do mundo virtual (World Space).
 * - Aplicar restrições geométricas de pan (deslocamento) e zoom (escala).
 * - Realizar cálculos geométricos puros de distância espacial.
 * 
 * O QUE NÃO FAZ:
 * - Não gerencia estado de viewport (não armazena pan/zoom/escala).
 * - Não escuta eventos de ponteiro (mouse/touch/pointer).
 * - Não causa renderizações de componentes React.
 * ============================================================================
 */

import type { WorldPosition, SpatialBounds } from './types';

/**
 * Limites espaciais padrões para a viewport do Battleground.
 */
export const DEFAULT_SPATIAL_BOUNDS: SpatialBounds = {
  minScale: 0.5,   // Zoom mínimo (afastado)
  maxScale: 3.0,   // Zoom máximo (aproximado)
  minPanX: -1500,  // Limite esquerdo de deslocamento
  maxPanX: 1500,   // Limite direito de deslocamento
  minPanY: -1500,  // Limite superior de deslocamento
  maxPanY: 1500,   // Limite inferior de deslocamento
};

/**
 * Converte coordenadas de tela (clientX, clientY) para coordenadas do mundo virtual,
 * levando em conta o retângulo limitador do mapa e a escala atual do zoom.
 * 
 * Fórmula: (Coordenada_Tela - Canto_Esquerdo) / Escala
 */
export function screenToWorld(
  clientX: number,
  clientY: number,
  rect: DOMRect | { left: number; top: number },
  scale: number
): WorldPosition {
  return {
    x: (clientX - rect.left) / scale,
    y: (clientY - rect.top) / scale,
  };
}

/**
 * Converte coordenadas do mundo virtual para coordenadas de tela de forma absoluta,
 * para posicionamento estático ou sobreposição HUD.
 * 
 * Fórmula: Coordenada_Mundo * Escala + Canto_Esquerdo
 */
export function worldToScreen(
  position: WorldPosition,
  rect: DOMRect | { left: number; top: number },
  scale: number
): { x: number; y: number } {
  return {
    x: position.x * scale + rect.left,
    y: position.y * scale + rect.top,
  };
}

/**
 * Restringe a escala de zoom (escala) dentro dos limites espaciais permitidos.
 */
export function constrainScale(scale: number, bounds: SpatialBounds = DEFAULT_SPATIAL_BOUNDS): number {
  return Math.max(bounds.minScale, Math.min(scale, bounds.maxScale));
}

/**
 * Restringe o deslocamento (pan) para garantir que o usuário não arraste a câmera para fora do mundo.
 */
export function constrainPan(
  pan: { x: number; y: number },
  bounds: SpatialBounds = DEFAULT_SPATIAL_BOUNDS
): { x: number; y: number } {
  return {
    x: Math.max(bounds.minPanX, Math.min(pan.x, bounds.maxPanX)),
    y: Math.max(bounds.minPanY, Math.min(pan.y, bounds.maxPanY)),
  };
}

/**
 * Calcula a escala de zoom resultante com base na direção de rotação do scroll (deltaY).
 */
export function calculateZoom(
  currentScale: number,
  deltaY: number,
  bounds: SpatialBounds = DEFAULT_SPATIAL_BOUNDS
): number {
  const zoomDelta = deltaY > 0 ? -0.15 : 0.15;
  return constrainScale(currentScale + zoomDelta, bounds);
}

/**
 * Calcula a distância euclidiana reta entre dois pontos no espaço do mundo virtual.
 */
export function distance(p1: WorldPosition, p2: WorldPosition): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Verifica se o ponto p2 está dentro de um raio de ação (radius) a partir do ponto p1.
 */
export function isWithinRadius(p1: WorldPosition, p2: WorldPosition, radius: number): boolean {
  return distance(p1, p2) <= radius;
}
