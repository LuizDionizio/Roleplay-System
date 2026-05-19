import { useState, useEffect } from 'react'
import { PanelGlow } from './ui/PanelGlow'
import { ChevronIcon } from './ui/ChevronIcon'

const LOG_ENTRIES = [
  { time: '21:04', type: 'system', text: 'Sala de sessão iniciada.' },
  { time: '21:07', type: 'narration', text: 'A luz das tochas dança sobre a pedra antiga.' },
  { time: '21:09', type: 'player', author: 'Mira', text: 'Verifico o corredor em busca de armadilhas.' },
  { time: '21:11', type: 'roll', text: 'Investigação — 17 (sucesso)' },
  { time: '21:14', type: 'narration', text: 'Um sussurro percorre os corredores vazios.' },
  { time: '21:16', type: 'player', author: 'Theron', text: 'Mantenho a espada erguida e avanço com cautela.' },
]

function LogMessage({ entry }: { entry: (typeof LOG_ENTRIES)[number] }) {
  const styles = {
    system: 'text-zinc-500 italic',
    narration: 'text-amber-200/90 font-medium',
    player: 'text-zinc-300',
    roll: 'text-amber-500 font-medium bg-amber-950/20 px-2 py-0.5 rounded border border-amber-900/30 inline-block mt-1',
  }

  return (
    <div className="group relative flex gap-3 px-4 py-1.5 transition-colors hover:bg-white/[0.02]">
      <time className="w-10 shrink-0 pt-0.5 text-xs text-zinc-600">
        {entry.time}
      </time>
      <div className="min-w-0 flex-1">
        {entry.author && (
          <span className="mr-2 font-medium text-amber-700/80">
            {entry.author}
          </span>
        )}
        <span className={`text-sm leading-relaxed ${styles[entry.type as keyof typeof styles]}`}>
          {entry.text}
        </span>
      </div>
    </div>
  )
}

export function Chronicle({ open, setOpen }: { open: boolean, setOpen: (open: boolean | ((prev: boolean) => boolean)) => void }) {
  const [chronicleHeight, setChronicleHeight] = useState(224) // 224px = 14rem
  const [isResizingChronicle, setIsResizingChronicle] = useState(false)

  useEffect(() => {
    if (!isResizingChronicle) return

    const handlePointerMove = (e: PointerEvent) => {
      // Calculate height from pointer to the bottom edge of screen
      const newHeight = document.documentElement.clientHeight - e.clientY
      setChronicleHeight(Math.max(150, Math.min(newHeight, 500)))
    }

    const handlePointerUp = () => {
      setIsResizingChronicle(false)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    document.body.style.userSelect = 'none'

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      document.body.style.userSelect = ''
    }
  }, [isResizingChronicle])

  return (
    <footer
      className={`relative z-30 flex w-full shrink-0 flex-col transition-[height,transform,opacity] duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
        open ? 'h-[var(--chronicle-height)] translate-y-0 opacity-100' : 'h-0 translate-y-full opacity-0 sm:h-2 sm:translate-y-0 sm:opacity-100'
      }`}
      style={{ '--chronicle-height': `${chronicleHeight}px` } as React.CSSProperties}
    >
      <div
        className={`absolute inset-x-0 bottom-0 flex h-[var(--chronicle-height)] flex-col border-t border-amber-900/20 bg-zinc-950/95 shadow-[0_-8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
          open ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
        {/* Resize Handle */}
        {open && (
          <div
            className="absolute inset-x-0 top-0 hidden h-1.5 cursor-row-resize hover:bg-amber-500/20 active:bg-amber-500/40 sm:block"
            onPointerDown={(e) => {
              if (e.button !== 0) return
              setIsResizingChronicle(true)
              e.preventDefault()
            }}
          />
        )}

        <div className="flex shrink-0 items-center justify-between border-b border-amber-900/20 px-4 pt-1 sm:pt-1.5">
          <div className="flex gap-6">
            <button className="relative pb-2 pt-2 text-xs font-semibold tracking-widest text-amber-200/90 uppercase transition-colors hover:text-amber-100">
              Crônica
              <span className="absolute inset-x-0 bottom-0 h-px bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
            </button>
            <button className="pb-2 pt-2 text-xs font-medium tracking-widest text-zinc-500 uppercase transition-colors hover:text-zinc-300">
              Combate
            </button>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Recolher painel"
            className="group flex size-6 items-center justify-center rounded hover:bg-white/5"
          >
            <ChevronIcon direction="down" className="text-amber-700/50 group-hover:text-amber-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {LOG_ENTRIES.map((entry, i) => (
            <LogMessage key={i} entry={entry} />
          ))}
        </div>

        <div className="shrink-0 p-3 sm:p-4">
          <div className="relative flex rounded-lg border border-amber-900/20 bg-zinc-900/50 shadow-inner transition-colors focus-within:border-amber-700/50 focus-within:bg-zinc-900/80">
            <PanelGlow className="opacity-0 transition-opacity focus-within:opacity-100" />
            <input
              type="text"
              placeholder="Descreva sua ação ou digite / para comandos..."
              className="w-full bg-transparent px-4 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
            />
            <button className="m-1 shrink-0 rounded-md px-3 text-xs font-medium text-amber-700/80 transition-colors hover:bg-amber-950/50 hover:text-amber-500">
              Enviar
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Cinematic Collapsed Tab */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Expandir painel"
        aria-expanded={open}
        className={`group absolute inset-x-0 bottom-0 hidden h-2 items-center justify-center border-t border-amber-900/20 bg-zinc-950/80 transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] hover:h-4 hover:bg-zinc-900/90 hover:shadow-[0_0_15px_rgba(212,175,55,0.1)] sm:flex ${
          open ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        <ChevronIcon direction="up" className="text-amber-700/30 transition-transform duration-300 group-hover:scale-110 group-hover:text-amber-500" />
      </button>

      {/* Mobile Swipe Tab */}
      <button
        onClick={() => setOpen((p) => !p)}
        className={`absolute -top-6 left-1/2 flex h-6 w-16 -translate-x-1/2 items-center justify-center rounded-t-lg border-x border-t border-amber-900/20 bg-zinc-950/90 shadow-lg backdrop-blur-md transition-opacity sm:hidden ${
          open ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <ChevronIcon direction="up" className="text-amber-700/50" />
      </button>
    </footer>
  )
}
