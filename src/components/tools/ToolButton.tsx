import type { ReactNode } from 'react';

interface ToolButtonProps {
  icon: ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  shortcut?: string;
}

export function ToolButton({ icon, label, isActive, onClick, shortcut }: ToolButtonProps) {
  return (
    <button
      onClick={onClick}
      title={`${label}${shortcut ? ` (${shortcut})` : ''}`}
      aria-label={label}
      aria-pressed={isActive}
      className={`group relative flex size-8 items-center justify-center rounded-lg transition-hover ${
        isActive
          ? 'bg-amber-950/40 text-amber-400 shadow-glow-subtle'
          : 'bg-zinc-950/40 text-zinc-500 hover:bg-amber-950/20 hover:text-amber-200/80'
      }`}
    >
      {/* Subtle border reveal on hover and active */}
      <div className={`absolute inset-0 rounded-lg border transition-hover ${
        isActive ? 'border-focus scale-100 opacity-100' : 'border-subtle scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100'
      }`} />
      
      {/* Quiet symbolic icon scaling */}
      <span className="relative z-10 transition-transform duration-300 ease-[cubic-bezier(0.2,1,0.2,1)] group-hover:scale-110">
        {icon}
      </span>
      
      {/* Ritualistic active indicator dot */}
      {isActive && (
        <span className="absolute -bottom-1 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-amber-500 shadow-glow-subtle" />
      )}
    </button>
  );
}
