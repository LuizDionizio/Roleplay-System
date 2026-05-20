import type { WorldPosition } from '../../core/spatial/types';
export type { WorldPosition };

export interface RevealZone {
  id: string;
  position: WorldPosition;
  radius: number;
}

export type FogBrushSize = 'small' | 'medium' | 'large';

export interface FogState {
  isActive: boolean;
  revealedZones: RevealZone[];
  activeBrushSize: FogBrushSize;
}
