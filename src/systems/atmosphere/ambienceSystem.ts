import { useState, useEffect, useRef, useCallback } from 'react';
import type { AtmosphereState, AudioLayer } from './types';
import { AMBIENCE_REGISTRY } from './ambienceRegistry';

export const AMBIENCE_CONFIG = {
  crossfadeDurationMs: 5000, // Cinematic 5-second crossfade
};

export function useAmbienceSystem() {
  const [state, setState] = useState<AtmosphereState>({
    isActive: false,
    currentTrackId: 'rain',
    globalVolume: 1.0,
    isTransitioning: false,
  });

  const layersRef = useRef<AudioLayer[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Master Engine Loop: smoothly interpolates volume for all active audio layers
  useEffect(() => {
    const loop = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const deltaTime = time - lastTimeRef.current;
      lastTimeRef.current = time;

      let anyTransitioning = false;
      const maxVolumeChange = deltaTime / AMBIENCE_CONFIG.crossfadeDurationMs;

      // Iterate backwards so we can safely splice/remove dead layers
      for (let i = layersRef.current.length - 1; i >= 0; i--) {
        const layer = layersRef.current[i];
        
        // Determine target volume
        if (layer.trackId === state.currentTrackId && state.isActive) {
          const track = AMBIENCE_REGISTRY[layer.trackId];
          layer.targetVolume = track ? track.baseVolume * state.globalVolume : 0;
        } else {
          layer.targetVolume = 0; // Fading out because it's no longer the active track or system is off
        }

        const currentVol = layer.audio.volume;
        if (Math.abs(currentVol - layer.targetVolume) > 0.001) {
          anyTransitioning = true;
          // Step towards target
          const step = Math.sign(layer.targetVolume - currentVol) * maxVolumeChange;
          let nextVol = currentVol + step;
          
          // Clamp to target to prevent overshooting
          if ((step > 0 && nextVol > layer.targetVolume) || (step < 0 && nextVol < layer.targetVolume)) {
            nextVol = layer.targetVolume;
          }
          nextVol = Math.max(0, Math.min(1, nextVol));
          
          layer.audio.volume = nextVol;
        } else if (layer.targetVolume === 0 && currentVol === 0) {
          // Cleanup dead layer completely from memory
          layer.audio.pause();
          layer.audio.src = '';
          layersRef.current.splice(i, 1);
        }
      }

      setState(s => s.isTransitioning !== anyTransitioning ? { ...s, isTransitioning: anyTransitioning } : s);

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = null; // Reset time so we don't jump huge deltas on hot-reloads
    };
  }, [state.isActive, state.currentTrackId, state.globalVolume]);

  // Handle new track instantiation
  useEffect(() => {
    if (state.isActive && state.currentTrackId) {
      // Check if layer already exists
      const exists = layersRef.current.some(l => l.trackId === state.currentTrackId);
      if (!exists) {
        const track = AMBIENCE_REGISTRY[state.currentTrackId];
        if (track) {
          const audio = new Audio(track.url);
          audio.loop = true;
          audio.volume = 0; // Start muted, let the engine fade it in
          
          // Autoplay safety
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch((e) => {
              console.warn('Atmosphere playback blocked by browser (autoplay policy):', e);
              setState(s => ({ ...s, isActive: false }));
            });
          }

          layersRef.current.push({
            trackId: state.currentTrackId,
            audio,
            targetVolume: track.baseVolume * state.globalVolume
          });
        }
      }
    }
  }, [state.isActive, state.currentTrackId, state.globalVolume]);

  // Master cleanup on unmount
  useEffect(() => {
    return () => {
      layersRef.current.forEach(layer => {
        layer.audio.pause();
        layer.audio.src = '';
      });
      layersRef.current = [];
    };
  }, []);

  const toggleAmbience = useCallback(() => {
    setState(s => ({ ...s, isActive: !s.isActive }));
  }, []);

  const setTrack = useCallback((trackId: string) => {
    setState(s => ({ ...s, currentTrackId: trackId, isActive: true }));
  }, []);

  return { state, toggleAmbience, setTrack };
}
