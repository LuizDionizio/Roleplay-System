import type { AmbienceTrack } from './types';
import rainAudio from '../../assets/audio/rain.mp3';
import forestAudio from '../../assets/audio/forest.mp3';
import windAudio from '../../assets/audio/wind.mp3';

export const AMBIENCE_REGISTRY: Record<string, AmbienceTrack> = {
  rain: {
    id: 'rain',
    name: 'Heavy Rain',
    url: rainAudio,
    baseVolume: 0.5,
    category: 'weather',
  },
  forest: {
    id: 'forest',
    name: 'Deep Forest',
    url: forestAudio,
    baseVolume: 0.45,
    category: 'nature',
  },
  wind: {
    id: 'wind',
    name: 'Howling Wind',
    url: windAudio,
    baseVolume: 0.45,
    category: 'weather',
  },
};
