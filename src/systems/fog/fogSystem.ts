/**
 * ============================================================================
 * SISTEMA NARRATIVO - NÉVOA DE GUERRA (fogSystem)
 * ============================================================================
 * 
 * RESPONSABILIDADE:
 * - Gerenciar o estado lógico de visibilidade da névoa de guerra (Fog of War).
 * - Armazenar o vetor de áreas reveladas pelos cliques/pincéis do Mestre (GM).
 * - Decidir se coordenadas espaciais estão visíveis para os jogadores (`isPositionRevealed`).
 * 
 * O QUE NÃO FAZ:
 * - Não desenha na tela ou gerencia elementos de interface (Canvas/DOM)
 *   (delega a renderização para o componente visual `<FogOverlay />`).
 * - Não escuta ou captura gestos físicos do ponteiro.
 * ============================================================================
 */

import { useState, useCallback } from 'react';
import type { WorldPosition, FogState, FogBrushSize } from './types';
import { distance } from '../../core/spatial/helpers';

// Tamanhos pré-definidos de pincel de revelação (raio em coordenadas virtuais do mundo)
const BRUSH_RADII: Record<FogBrushSize, number> = {
  small: 150,
  medium: 300,
  large: 500,
};

// Limite de pixels de deslocamento mínimo antes de registrar um novo ponto na trilha,
// evitando acúmulo desnecessário de objetos no vetor de estado em movimentos muito lentos.
const DISTANCE_THRESHOLD = 30;

export function useFogSystem() {
  const [fogState, setFogState] = useState<FogState>({
    isActive: true, // Habilitado por padrão no protótipo cinematográfico
    revealedZones: [],
    activeBrushSize: 'medium',
  });

  const toggleFog = useCallback(() => {
    setFogState(current => ({ ...current, isActive: !current.isActive }));
  }, []);

  const setBrushSize = useCallback((size: FogBrushSize) => {
    setFogState(current => ({ ...current, activeBrushSize: size }));
  }, []);

  /**
   * Adiciona uma nova zona revelada à lista de visibilidade.
   */
  const revealArea = useCallback((position: WorldPosition) => {
    setFogState(current => {
      // Otimização de performance: descarta pontos adjacentes redundantes
      if (current.revealedZones.length > 0) {
        const lastZone = current.revealedZones[current.revealedZones.length - 1];
        if (distance(lastZone.position, position) < DISTANCE_THRESHOLD) {
          return current;
        }
      }

      const radius = BRUSH_RADII[current.activeBrushSize];

      return {
        ...current,
        revealedZones: [
          ...current.revealedZones,
          {
            id: `reveal-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            position,
            radius,
          }
        ]
      };
    });
  }, []);

  /**
   * Remove zonas reveladas que estejam sob a ação de restauração da névoa.
   */
  const restoreFog = useCallback((position: WorldPosition) => {
    setFogState(current => {
      const radius = BRUSH_RADII[current.activeBrushSize];
      return {
        ...current,
        revealedZones: current.revealedZones.filter(zone => {
          const dist = distance(zone.position, position);
          // Restaura a névoa filtrando (deletando) zonas que estejam dentro de 45% do raio do pincel
          return dist > radius * 0.45;
        })
      };
    });
  }, []);

  /**
   * Verifica se uma dada coordenada do mundo está atualmente revelada (dentro de alguma zona de visibilidade).
   * 
   * Nota: É utilizada uma tolerância visual (70% do raio nominal do pincel) para compensar a suavização visual (blur)
   * aplicada pelo Canvas ao renderizar os furos de névoa, garantindo consistência lógica.
   */
  const isPositionRevealed = useCallback((position: WorldPosition) => {
    if (!fogState.isActive) return true;
    
    for (const zone of fogState.revealedZones) {
      const dist = distance(zone.position, position);
      
      if (dist <= zone.radius * 0.7) {
        return true;
      }
    }
    
    return false;
  }, [fogState]);

  return { fogState, toggleFog, setBrushSize, revealArea, restoreFog, isPositionRevealed };
}
