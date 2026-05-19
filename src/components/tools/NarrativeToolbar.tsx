import type { PerspectiveState, ToolMode, ViewMode } from '../../systems/perspective/types';
import type { FogState, FogBrushSize } from '../../systems/fog/types';
import { ToolButton } from './ToolButton';

function BrushIcon({ size }: { size: FogBrushSize }) {
  const radii = { small: 2.5, medium: 4.5, large: 7.5 };
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r={radii[size]} />
    </svg>
  );
}

function CursorIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
      <path d="m13 13 6 6" />
    </svg>
  );
}

function FogIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.5 19c2.5 0 4.5-2 4.5-4.5S20 10 17.5 10c-.3 0-.6.1-.9.1A7.5 7.5 0 0 0 3 13.5c0 3.6 2.6 6.6 6 7.3" />
      <path d="M7 19h7" />
    </svg>
  );
}

function SpotlightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" opacity="0.4" />
    </svg>
  );
}

function PingIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="2.5" />
      <circle cx="12" cy="12" r="8" opacity="0.4" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function MaskIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z" opacity="0.2" fill="currentColor"/>
      <path d="M12 3v18c4.97 0 9-4.03 9-9s-4.03-9-9-9z" />
    </svg>
  );
}

interface NarrativeToolbarProps {
  state: PerspectiveState;
  fogState: FogState;
  onToolSelect: (tool: ToolMode) => void;
  onViewSelect: (view: ViewMode) => void;
  onFogBrushSelect: (size: FogBrushSize) => void;
}

export function NarrativeToolbar({ state, fogState, onToolSelect, onViewSelect, onFogBrushSelect }: NarrativeToolbarProps) {
  return (
    <div className="pointer-events-none absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-30">
      <div className="pointer-events-auto flex flex-col gap-0.5 rounded-xl border border-subtle bg-zinc-950/60 p-1 shadow-cinematic-md blur-ambient-md">
        <ToolButton
          icon={<CursorIcon />}
          label="Explorar (Navegação)"
          isActive={state.activeTool === 'explore'}
          onClick={() => onToolSelect('explore')}
        />
        <ToolButton
          icon={<FogIcon />}
          label="Névoa Narrativa"
          isActive={state.activeTool === 'fog'}
          onClick={() => onToolSelect('fog')}
        />
        {state.activeTool === 'fog' && (
          <div className="flex flex-col gap-0.5 pl-1.5 ml-2.5 border-l-2 border-amber-900/30">
            <ToolButton
              icon={<BrushIcon size="small" />}
              label="Pincel Pequeno"
              isActive={fogState.activeBrushSize === 'small'}
              onClick={() => onFogBrushSelect('small')}
            />
            <ToolButton
              icon={<BrushIcon size="medium" />}
              label="Pincel Médio"
              isActive={fogState.activeBrushSize === 'medium'}
              onClick={() => onFogBrushSelect('medium')}
            />
            <ToolButton
              icon={<BrushIcon size="large" />}
              label="Pincel Grande"
              isActive={fogState.activeBrushSize === 'large'}
              onClick={() => onFogBrushSelect('large')}
            />
          </div>
        )}
        <ToolButton
          icon={<SpotlightIcon />}
          label="Luz Focal"
          isActive={state.activeTool === 'spotlight'}
          onClick={() => onToolSelect('spotlight')}
        />
        <ToolButton
          icon={<PingIcon />}
          label="Ping Espacial"
          isActive={state.activeTool === 'ping'}
          onClick={() => onToolSelect('ping')}
        />
      </div>

      <div className="pointer-events-auto flex flex-col gap-0.5 rounded-xl border border-subtle bg-zinc-950/60 p-1 shadow-cinematic-md blur-ambient-md">
        <ToolButton
          icon={<MaskIcon />}
          label="Visão do Mestre"
          isActive={state.viewMode === 'gm'}
          onClick={() => onViewSelect('gm')}
        />
        <ToolButton
          icon={<EyeIcon />}
          label="Visão do Jogador"
          isActive={state.viewMode === 'player'}
          onClick={() => onViewSelect('player')}
        />
      </div>
    </div>
  );
}
