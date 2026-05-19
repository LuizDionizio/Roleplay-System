import type { SceneConfig } from './types';

export const SCENE_REGISTRY: Record<string, SceneConfig> = {
  exploration: {
    id: 'exploration',
    name: 'Exploração',
    suggestedAmbienceId: 'forest',
    spotlightScale: 1.0, // 400px base radius * 1.0
    baseDarkness: 0.15,
    transitionDurationMs: 4000,
  },
  tension: {
    id: 'tension',
    name: 'Tensão',
    suggestedAmbienceId: 'wind',
    spotlightScale: 0.7, // 400px base radius * 0.7 = 280px
    baseDarkness: 0.45,
    transitionDurationMs: 5000,
  },
  horror: {
    id: 'horror',
    name: 'Horror',
    suggestedAmbienceId: 'rain',
    spotlightScale: 0.45, // 400px base radius * 0.45 = 180px
    baseDarkness: 0.8,
    transitionDurationMs: 6000,
  }
};
