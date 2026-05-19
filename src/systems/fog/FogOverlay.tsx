import type { RevealZone } from './types';
import type { ViewMode } from '../perspective/types';

interface FogOverlayProps {
  isActive: boolean;
  revealedZones: RevealZone[];
  viewMode: ViewMode;
}

export function FogOverlay({ isActive, revealedZones, viewMode }: FogOverlayProps) {
  // GM sees the hidden areas faintly. Players see true concealment.
  const fillOpacity = viewMode === 'gm' ? '0.5' : '1';

  return (
    <div
      className={`absolute inset-0 z-10 pointer-events-none transition-cinematic ${
        isActive ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* SVG canvas must overflow visible so that it covers everything even when map scales/pans */}
      <svg
        className="absolute inset-0 h-full w-full"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <radialGradient id="fog-reveal-gradient">
            <stop offset="0%" stopColor="black" stopOpacity="1" />
            <stop offset="35%" stopColor="black" stopOpacity="0.85" />
            <stop offset="70%" stopColor="black" stopOpacity="0.3" />
            <stop offset="100%" stopColor="black" stopOpacity="0" />
          </radialGradient>

          <mask id="fog-mask">
            {/* Base white fills the entire space with fog */}
            <rect x="-10000" y="-10000" width="20000" height="20000" fill="white" />
            
            {/* Black gradients cut holes into the mask */}
            {revealedZones.map((zone) => (
              <circle
                key={zone.id}
                cx={zone.position.x}
                cy={zone.position.y}
                r={zone.radius}
                fill="url(#fog-reveal-gradient)"
              />
            ))}
          </mask>
        </defs>

        {/* Narrative dark fog layer. Opacity changes based on view mode. */}
        <rect
          x="-10000"
          y="-10000"
          width="20000"
          height="20000"
          fill={`rgba(8, 8, 10, ${fillOpacity})`}
          mask="url(#fog-mask)"
          className="transition-all duration-1000"
        />
      </svg>
    </div>
  );
}
