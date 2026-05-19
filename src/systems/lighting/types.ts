import type { WorldPosition } from '../spatial/types';

export interface LightFlickerConfig {
  speed: 'slow' | 'normal' | 'fast';
  intensity: 'subtle' | 'moderate' | 'dramatic';
}

export interface LightPreset {
  id: string;
  name: string;
  color: string;           // e.g., 'rgba(251, 146, 60, 0.6)'
  radius: number;          // World-space radius in pixels
  flicker: LightFlickerConfig;
}

export interface LightSource {
  id: string;
  position: WorldPosition;
  presetId: string;
}
