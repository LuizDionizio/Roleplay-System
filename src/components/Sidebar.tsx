import { useState, useEffect } from 'react'
import { ChevronIcon } from './ui/ChevronIcon'

const PLAYERS = [
  { name: 'Aldric', role: 'Mestre', status: 'online', initials: 'AL' },
  { name: 'Mira', role: 'Ladina', status: 'online', initials: 'MI' },
  { name: 'Theron', role: 'Paladino', status: 'away', initials: 'TH' },
  { name: 'Elara', role: 'Maga', status: 'online', initials: 'EL' },
]

export function Sidebar({ open, setOpen }: { open: boolean, setOpen: (open: boolean | ((prev: boolean) => boolean)) => void }) {
  const [sidebarWidth, setSidebarWidth] = useState(256) // 256px = 16rem
  const [isResizingSidebar, setIsResizingSidebar] = useState(false)

  useEffect(() => {
    if (!isResizingSidebar) return

    const handlePointerMove = (e: PointerEvent) => {
      // Calculate width from pointer to the right edge of screen
      const newWidth = document.documentElement.clientWidth - e.clientX
      setSidebarWidth(Math.max(200, Math.min(newWidth, 480)))
    }

    const handlePointerUp = () => {
      setIsResizingSidebar(false)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    document.body.style.userSelect = 'none'

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      document.body.style.userSelect = ''
    }
  }, [isResizingSidebar])

  return (
    <aside
      className={`relative z-20 flex shrink-0 flex-col transition-cinematic ${
        open ? 'w-[var(--sidebar-width)] translate-x-0 opacity-100' : 'w-0 translate-x-full opacity-0 sm:w-2 sm:translate-x-0 sm:opacity-100'
      }`}
      style={{ '--sidebar-width': `${sidebarWidth}px` } as React.CSSProperties}
    >
      <div
        className={`absolute inset-y-0 right-0 flex w-[var(--sidebar-width)] flex-col border-l border-subtle bg-zinc-950/80 p-3 shadow-cinematic-lg blur-ambient-md transition-cinematic sm:p-4 ${
          open ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
      >
        <div className="flex items-center justify-between pb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-semibold tracking-widest text-amber-200/90 uppercase">
              Mesa
            </h2>
            <span className="flex size-4 items-center justify-center rounded-full bg-amber-900/30 text-[9px] font-medium text-amber-500">
              4
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Recolher painel"
            className="group flex size-6 items-center justify-center rounded transition-hover hover:bg-white/5"
          >
            <ChevronIcon direction="right" className="text-amber-700/50 group-hover:text-amber-500" />
          </button>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          {PLAYERS.map((player, i) => (
            <div
              key={i}
              className="group relative flex cursor-pointer items-center gap-3 rounded-lg border border-subtle bg-zinc-900/40 p-2.5 transition-hover hover:border-focus hover:bg-zinc-900/60"
            >
              <div className="relative flex size-10 shrink-0 items-center justify-center rounded-md bg-zinc-800 font-medium text-zinc-400 shadow-inner">
                {player.initials}
                <div
                  className={`absolute -right-1 -top-1 size-2.5 rounded-full border-2 border-zinc-900 ${
                    player.status === 'online' ? 'bg-emerald-500' : 'bg-amber-600'
                  }`}
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium text-zinc-200 group-hover:text-amber-100">
                  {player.name}
                </span>
                <span className="truncate text-xs text-zinc-500 group-hover:text-amber-700/70">
                  {player.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resize Handle */}
      {open && (
        <div
          className="absolute inset-y-0 left-0 hidden w-1.5 cursor-col-resize hover:bg-amber-500/20 active:bg-amber-500/40 sm:block"
          onPointerDown={(e) => {
            if (e.button !== 0) return
            setIsResizingSidebar(true)
            e.preventDefault()
          }}
        />
      )}

      {/* Desktop Cinematic Collapsed Tab */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Expandir painel"
        aria-expanded={open}
        className={`group absolute inset-y-0 right-0 hidden w-2 items-center justify-center border-l border-subtle bg-zinc-950/80 transition-cinematic hover:w-4 hover:bg-zinc-900/90 hover:shadow-glow-subtle sm:flex ${
          open ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
        }`}
      >
        <ChevronIcon direction="left" className="text-amber-700/30 transition-hover group-hover:scale-110 group-hover:text-amber-500" />
      </button>

      {/* Mobile Swipe Tab */}
      <button
        onClick={() => setOpen((p) => !p)}
        className={`absolute -left-6 top-1/2 flex h-16 w-6 -translate-y-1/2 items-center justify-center rounded-l-lg border-y border-l border-subtle bg-zinc-950/90 shadow-cinematic-md blur-ambient-md transition-cinematic sm:hidden ${
          open ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <ChevronIcon direction="left" className="text-amber-700/50" />
      </button>
    </aside>
  )
}
