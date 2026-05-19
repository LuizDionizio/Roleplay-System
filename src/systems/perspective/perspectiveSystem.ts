import { useState, useCallback } from 'react';
import type { PerspectiveState, ViewMode, ToolMode } from './types';

export function usePerspectiveSystem() {
  const [state, setState] = useState<PerspectiveState>({
    viewMode: 'gm',
    activeTool: 'explore',
  });

  const setViewMode = useCallback((mode: ViewMode) => {
    setState(current => ({ ...current, viewMode: mode }));
  }, []);

  const setActiveTool = useCallback((tool: ToolMode) => {
    setState(current => ({ ...current, activeTool: tool }));
  }, []);

  return { state, setViewMode, setActiveTool };
}
