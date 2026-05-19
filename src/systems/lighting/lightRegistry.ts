import type { LightPreset } from './types';

export const LIGHT_REGISTRY: Record<string, LightPreset> = {
  torch: {
    id: 'torch',
    name: 'Tocha',
    color: 'rgba(245, 158, 11, 0.45)', // Warm amber
    radius: 350,
    flicker: { speed: 'fast', intensity: 'subtle' }
  },
  ember: {
    id: 'ember',
    name: 'Brasa',
    color: 'rgba(220, 38, 38, 0.3)', // Deep red/orange
    radius: 180,
    flicker: { speed: 'slow', intensity: 'subtle' }
  },
  ritual: {
    id: 'ritual',
    name: 'Ritual',
    color: 'rgba(20, 184, 166, 0.35)', // Eerie teal
    radius: 450,
    flicker: { speed: 'slow', intensity: 'moderate' }
  }
};
