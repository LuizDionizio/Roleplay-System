export interface AmbienceTrack {
  id: string;
  name: string;
  url: string;
  baseVolume: number;
  category: 'weather' | 'nature' | 'dungeon' | 'civilization'; // semantic categories
}

export interface AtmosphereState {
  isActive: boolean;
  currentTrackId: string | null;
  globalVolume: number;
  isTransitioning: boolean;
}

export interface AudioLayer {
  trackId: string;
  audio: HTMLAudioElement;
  targetVolume: number;
}
