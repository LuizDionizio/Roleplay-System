import type { ModifierState } from './interactionModes';

export interface PointerState {
  isDown: boolean;
  button: number;
  clientX: number;
  clientY: number;
  worldX: number;
  worldY: number;
  startX: number;
  startY: number;
  startWorldX: number;
  startWorldY: number;
  modifiers: ModifierState;
}

export const INITIAL_POINTER_STATE: PointerState = {
  isDown: false,
  button: -1,
  clientX: 0,
  clientY: 0,
  worldX: 0,
  worldY: 0,
  startX: 0,
  startY: 0,
  startWorldX: 0,
  startWorldY: 0,
  modifiers: {
    shift: false,
    ctrl: false,
    alt: false,
    space: false,
  },
};
