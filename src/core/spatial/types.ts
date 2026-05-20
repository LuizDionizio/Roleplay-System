/**
 * ============================================================================
 * NÚCLEO ESPACIAL - MODELO DE TIPOS (spatialCore / types)
 * ============================================================================
 * 
 * RESPONSABILIDADE:
 * - Definir as estruturas de dados fundamentais do espaço virtual bidimensional.
 * - Uniformizar tipos usados por sistemas de névoa, luz focal, tokens e pings.
 * 
 * O QUE NÃO FAZ:
 * - Não possui lógica executável ou métodos auxiliares.
 * ============================================================================
 */

/**
 * Representa uma coordenada vetorial absoluta de duas dimensões (X, Y) no plano cartesiano do mundo virtual.
 */
export interface WorldPosition {
  x: number;
  y: number;
}

/**
 * Representa o estado atual de posicionamento e ampliação da câmera (viewport).
 */
export interface ViewportState {
  x: number;      // Deslocamento horizontal do pan
  y: number;      // Deslocamento vertical do pan
  scale: number;  // Fator de zoom da escala de visualização
}

/**
 * Define as caixas delimitadoras e extremos do zoom/pan permitidos.
 */
export interface SpatialBounds {
  minScale: number;
  maxScale: number;
  minPanX: number;
  maxPanX: number;
  minPanY: number;
  maxPanY: number;
}
