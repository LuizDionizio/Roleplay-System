export interface WorldPosition {
  x: number;
  y: number;
}

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
