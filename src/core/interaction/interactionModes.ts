export type InteractionMode = 'explore' | 'token-drag' | 'fog-draw' | 'spotlight-place' | 'ping-place' | 'locked';

export interface ModifierState {
  shift: boolean;
  ctrl: boolean;
  alt: boolean;
  space: boolean;
}
