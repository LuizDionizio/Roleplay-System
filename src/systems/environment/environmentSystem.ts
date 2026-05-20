import { useMemo } from 'react';
import { useSceneSystem } from '../narrative/sceneSystem';
import type { EnvironmentalConfig } from './types';

export function useEnvironmentSystem() {
  const { currentSceneConfig } = useSceneSystem();

  const environmentalConfig = useMemo<EnvironmentalConfig>(() => {
    // Dynamically adjust environment based on scene narrative weight
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
