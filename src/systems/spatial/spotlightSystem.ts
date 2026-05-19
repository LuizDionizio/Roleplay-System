import { useState, useCallback } from 'react';
import type { SpotlightData, WorldPosition } from './types';

export const SPOTLIGHT_CONFIG = {
  defaultRadius: 350,
  clickTolerance: 30, // Distance to consider a click "the same spot" to toggle off
};

export function useSpotlightSystem() {
  const [spotlight, setSpotlight] = useState<SpotlightData | null>(null);
  const [lastPosition, setLastPosition] = useState<WorldPosition>({ x: 0, y: 0 });

  const toggleSpotlight = useCallback((position: WorldPosition) => {
    setSpotlight((current) => {
      // If there's an active spotlight, check if we clicked near it to toggle off
      if (current) {
        const dx = current.position.x - position.x;
        const dy = current.position.y - position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < SPOTLIGHT_CONFIG.clickTolerance) {
          return null; // Turn off spotlight
        }
      }

      // Otherwise, turn on or move spotlight
      setLastPosition(position);
      return {
        id: 'spotlight-active',
        position,
        timestamp: Date.now(),
        radius: SPOTLIGHT_CONFIG.defaultRadius,
      };
    });
  }, []);

  const clearSpotlight = useCallback(() => {
    setSpotlight(null);
  }, []);

  return { spotlight, lastPosition, toggleSpotlight, clearSpotlight };
}
