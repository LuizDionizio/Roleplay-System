import { useState, useCallback } from 'react';
import { SCENE_REGISTRY } from './sceneRegistry';
import type { SceneState, SceneConfig } from './types';

export function useSceneSystem() {
  const [state, setState] = useState<SceneState>({
    currentSceneId: 'exploration',
    isTransitioning: false,
  });

  const setScene = useCallback((sceneId: string) => {
    setState(s => ({ ...s, currentSceneId: sceneId }));
  }, []);

  const currentSceneConfig: SceneConfig = SCENE_REGISTRY[state.currentSceneId] || SCENE_REGISTRY.exploration;

  return { 
    state, 
    currentSceneConfig,
    setScene 
  };
}
