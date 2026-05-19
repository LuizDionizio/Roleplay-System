import { useState, useCallback } from 'react';
import type { LightSource } from './types';
import type { WorldPosition } from '../spatial/types';

export const LIGHTING_CONFIG = {
  defaultBlendMode: 'screen', // Cinematic blend mode
  maxLights: 50,
};

// Initialize with empty array
const INITIAL_LIGHTS: LightSource[] = [];

export function useLightingSystem() {
  const [lights, setLights] = useState<LightSource[]>(INITIAL_LIGHTS);

  const addLight = useCallback((position: WorldPosition, presetId: string = 'torch') => {
    const id = `light-${Date.now()}`;
    setLights(current => [...current, { id, position, presetId }]);
  }, []);

  const removeLight = useCallback((id: string) => {
    setLights(current => current.filter(l => l.id !== id));
  }, []);

  return { lights, addLight, removeLight };
}
