export function PanelGlow({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(212,175,55,0.08)] ring-1 ring-amber-900/20 ${className}`}
    />
  )
}
