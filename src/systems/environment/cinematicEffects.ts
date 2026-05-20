import type { EnvironmentalConfig } from './types';
import React from 'react';

export function getVignetteStyles(config: EnvironmentalConfig, isFocusing: boolean): React.CSSProperties {
  // A dynamic cinematic vignette that scales with the config intensity
  // When focusing (e.g. dragging a token), the vignette subtly tightens to create depth of field
  const effectiveIntensity = isFocusing ? Math.min(1, config.vignetteIntensity + 0.25) : config.vignetteIntensity;
  
  const edgeOpacity = Math.min(1, 0.4 + (effectiveIntensity * 0.6));
  const midOpacity = effectiveIntensity * 0.3;
  
  return {
    background: `radial-gradient(ellipse at center, transparent 0%, transparent ${isFocusing ? '35%' : '40%'}, rgba(8,8,10,${midOpacity}) 75%, rgba(8,8,10,${edgeOpacity}) 100%)`,
    transition: 'background 0.8s cubic-bezier(0.2, 1, 0.2, 1)',
  };
}
