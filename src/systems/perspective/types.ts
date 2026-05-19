export type ViewMode = 'gm' | 'player';
export type ToolMode = 'explore' | 'fog' | 'spotlight' | 'ping';

export interface PerspectiveState {
  viewMode: ViewMode;
  activeTool: ToolMode;
}
