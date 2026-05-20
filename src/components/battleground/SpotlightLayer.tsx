/**
 * ============================================================================
 * CAMADA DE RENDERIZAÇÃO - LUZ FOCAL NARRATIVA (SpotlightLayer)
 * ============================================================================
 * 
 * RESPONSABILIDADE:
 * - Renderizar a máscara de holofote dinâmica (gradiente radial) sobre o mapa.
 * - Aplicar efeitos visuais de opacidade e transições fluidas usando tokens de motion.
 * - Centralizar o elemento com base na coordenada lógica da luz ou na última coordenada conhecida.
 * 
 * O QUE NÃO FAZ:
 * - Não faz checagens de proximidade ou gerencia a posição da luz focal.
 * - Não escuta ou manipula interações físicas de clique.
 * ============================================================================
 */

import { memo } from 'react';
import type { SpotlightData } from '../../systems/spatial/types';
import type { WorldPosition } from '../../core/spatial/types';
import { SPOTLIGHT_CONFIG } from '../../systems/spatial/spotlightSystem';
import { theme } from '../../theme';

interface SpotlightLayerProps {
  spotlight: SpotlightData | null;
  lastPosition: WorldPosition;
  spotlightScale: number;
  transitionDurationMs: number;
}

export const SpotlightLayer = memo(function SpotlightLayer({
  spotlight,
  lastPosition,
  spotlightScale,
  transitionDurationMs,
}: SpotlightLayerProps) {
  return (
    <div
      className={`pointer-events-none absolute flex size-[6000px] items-center justify-center transition-cinematic ${
        spotlight ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        zIndex: theme.zIndex.spotlight,
        left: spotlight?.position.x ?? lastPosition.x,
        top: spotlight?.position.y ?? lastPosition.y,
        transform: `translate(-50%, -50%) scale(${spotlightScale})`,
        transitionDuration: `${theme.motion.timing.lightTransition}, ${theme.motion.timing.lightTransition}, ${theme.motion.timing.lightTransition}, ${transitionDurationMs}ms`,
        transitionProperty: 'left, top, opacity, transform',
        // Gradiente radial escuro simula a escuridão ao redor da área de destaque iluminada central
        background: `radial-gradient(circle ${SPOTLIGHT_CONFIG.defaultRadius}px at center, transparent 0%, ${theme.colors.mapDarkness.light} 30%, ${theme.colors.mapDarkness.medium} 70%, ${theme.colors.mapDarkness.dark} 100%)`,
      }}
    />
  );
});
