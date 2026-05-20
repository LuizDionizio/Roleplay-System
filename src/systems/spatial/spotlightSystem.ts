/**
 * ============================================================================
 * SISTEMA ESPACIAL - LUZ FOCAL NARRATIVA (spotlightSystem)
 * ============================================================================
 * 
 * RESPONSABILIDADE:
 * - Gerenciar a presença e o posicionamento lógico de um holofote dinâmico (Spotlight).
 * - Permitir ao Mestre (GM) focar a atenção dos jogadores em um ponto de interesse
 *   ou em um token específico do cenário.
 * - Tratar cliques próximos à luz focal ativa para desligá-la ou movê-la de lugar.
 * 
 * O QUE NÃO FAZ:
 * - Não desenha o elemento visual de sobreposição e nem define a cor ou o fade do z-index.
 *   (delega para a camada visual `<SpotlightLayer />`).
 * ============================================================================
 */

import { useState, useCallback } from 'react';
import type { SpotlightData, WorldPosition } from './types';
import { distance } from '../../core/spatial/helpers';

export const SPOTLIGHT_CONFIG = {
  defaultRadius: 350,  // Raio padrão da luz em coordenadas do mundo
  clickTolerance: 30,  // Tolerância física em coordenadas do mundo para desativar a luz caso clicada de novo
};

export function useSpotlightSystem() {
  const [spotlight, setSpotlight] = useState<SpotlightData | null>(null);
  
  // Mantém a última posição válida registrada para evitar saltos ou quebras de transição
  // na interface visual quando a luz é desligada.
  const [lastPosition, setLastPosition] = useState<WorldPosition>({ x: 0, y: 0 });

  /**
   * Liga, move ou desliga a luz focal baseado na nova posição do clique.
   * Se a nova posição for extremamente próxima da atual, desliga o foco.
   */
  const toggleSpotlight = useCallback((position: WorldPosition) => {
    setSpotlight((current) => {
      if (current) {
        const dist = distance(current.position, position);

        // Desliga caso o clique ocorra muito perto do foco atual
        if (dist < SPOTLIGHT_CONFIG.clickTolerance) {
          return null;
        }
      }

      setLastPosition(position);
      return {
        id: 'spotlight-active',
        position,
        timestamp: Date.now(),
        radius: SPOTLIGHT_CONFIG.defaultRadius,
      };
    });
  }, []);

  const clearSpotlight = useCallback(() => {
    setSpotlight(null);
  }, []);

  return { spotlight, lastPosition, toggleSpotlight, clearSpotlight };
}
