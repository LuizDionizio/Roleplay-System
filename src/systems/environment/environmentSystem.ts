/**
 * ============================================================================
 * SISTEMA ESPACIAL - CONFIGURAÇÃO AMBIENTAL (environmentSystem)
 * ============================================================================
 * 
 * RESPONSABILIDADE:
 * - Derivar as intensidades de vinheta, pulsação e estilos de movimento da atmosfera
 *   (estático, drifting, breathing) baseando-se no clima narrativo da cena atual.
 * - Integrar o clima da cena (horror, exploração) com as variáveis físicas do ambiente.
 * 
 * O QUE NÃO FAZ:
 * - Não lida com as equações trigonométricas e estilização da vinheta.
 *   (delega para `cinematicEffects.ts` e `<EnvironmentLayer />`).
 * ============================================================================
 */

import { useMemo } from 'react';
import { useSceneSystem } from '../narrative/sceneSystem';
import type { EnvironmentalConfig } from './types';

export function useEnvironmentSystem() {
  const { currentSceneConfig } = useSceneSystem();

  /**
   * Ajusta dinamicamente a configuração ambiental de acordo com o peso narrativo e a escuridão da cena atual.
   */
  const environmentalConfig = useMemo<EnvironmentalConfig>(() => {
    const isHorror = currentSceneConfig.id === 'horror' || currentSceneConfig.baseDarkness > 0.6;
    const isExploration = currentSceneConfig.id === 'exploration';
    
    return {
      motionStyle: isHorror ? 'breathing' : isExploration ? 'drifting' : 'static',
      motionIntensity: isHorror ? 0.7 : 0.3,
      vignetteIntensity: isHorror ? 0.9 : 0.5,
      pulseIntensity: isHorror ? 0.2 : 0.05,
    };
  }, [currentSceneConfig]);

  return { environmentalConfig };
}
