import { useState, useCallback } from 'react';
import type { WorldPosition, FogState, FogBrushSize } from './types';

const BRUSH_RADII: Record<FogBrushSize, number> = {
  small: 150,
  medium: 300,
  large: 500,
};

const DISTANCE_THRESHOLD = 30; // Lower threshold for drag consistency

export function useFogSystem() {
  const [fogState, setFogState] = useState<FogState>({
    isActive: true, // Default to true for the prototype presentation
    revealedZones: [],
    activeBrushSize: 'medium',
  });

  const toggleFog = useCallback(() => {
    setFogState(current => ({ ...current, isActive: !current.isActive }));
  }, []);

  const setBrushSize = useCallback((size: FogBrushSize) => {
    setFogState(current => ({ ...current, activeBrushSize: size }));
  }, []);

  const revealArea = useCallback((position: WorldPosition) => {
    setFogState(current => {
      // Optimization: avoid pushing overlapping zones if we're dragging slowly
      if (current.revealedZones.length > 0) {
        const lastZone = current.revealedZones[current.revealedZones.length - 1];
        const dx = lastZone.position.x - position.x;
        const dy = lastZone.position.y - position.y;
        if (Math.sqrt(dx * dx + dy * dy) < DISTANCE_THRESHOLD) {
          return current;
        }
      }

      const radius = BRUSH_RADII[current.activeBrushSize];

      return {
        ...current,
        revealedZones: [
          ...current.revealedZones,
          {
            id: `reveal-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            position,
            radius,
          }
        ]
      };
    });
  }, []);

  const restoreFog = useCallback((position: WorldPosition) => {
    setFogState(current => {
      const radius = BRUSH_RADII[current.activeBrushSize];
      return {
        ...current,
        revealedZones: current.revealedZones.filter(zone => {
          const dx = zone.position.x - position.x;
          const dy = zone.position.y - position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          // Restore uses a slightly smaller core radius to reliably clear overlapping points
          return distance > radius * 0.45;
        })
      };
    });
  }, []);

  const isPositionRevealed = useCallback((position: WorldPosition) => {
    if (!fogState.isActive) return true;
    
    // Check if the position falls within the effective visual radius (approx 70% of max radius) of any revealed zone
    for (const zone of fogState.revealedZones) {
      const dx = zone.position.x - position.x;
      const dy = zone.position.y - position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance <= zone.radius * 0.7) {
        return true;
      }
    }
    
    return false;
  }, [fogState]);

  return { fogState, toggleFog, setBrushSize, revealArea, restoreFog, isPositionRevealed };
}
