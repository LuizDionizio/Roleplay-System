import { useState, useCallback } from 'react';
import type { PingData, WorldPosition } from './types';

const DEFAULT_PING_DURATION = 2500; // 2.5 seconds

export function usePingSystem() {
  const [pings, setPings] = useState<PingData[]>([]);

  const addPing = useCallback((position: WorldPosition, color: string = 'amber') => {
    const id = `ping-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newPing: PingData = {
      id,
      position,
      timestamp: Date.now(),
      duration: DEFAULT_PING_DURATION,
      color,
    };
    
    setPings((current) => [...current, newPing]);

    // Auto-remove ping after duration
    setTimeout(() => {
      setPings((current) => current.filter((p) => p.id !== id));
    }, DEFAULT_PING_DURATION);
  }, []);

  return { pings, addPing };
}
