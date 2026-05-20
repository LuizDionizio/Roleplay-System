export type SceneMood = 'exploration' | 'tension' | 'horror';

export interface SceneConfig {
  id: string;
  name: string;
  suggestedAmbienceId?: string;
  spotlightScale: number;      // e.g. 1.0 for exploration, 0.45 for horror
  baseDarkness: number;        // Global darkening of the battleground (opacity 0 to 1)
  transitionDurationMs: number;
  metadata?: Record<string, unknown>; // Scalability for future properties like weather particles
}

export interface SceneState {
  currentSceneId: string;
  isTransitioning: boolean;
}
