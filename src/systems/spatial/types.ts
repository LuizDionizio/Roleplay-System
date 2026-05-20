import type { WorldPosition } from '../../core/spatial/types';
export type { WorldPosition };

export interface SpatialEntity {
  id: string;
  position: WorldPosition;
}

export interface SpatialEffect extends SpatialEntity {
  timestamp: number;
  duration?: number;
}

export interface PingData extends SpatialEffect {
  color?: string;
}

export interface SpotlightData extends SpatialEffect {
  radius: number;
}
