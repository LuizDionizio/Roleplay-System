import { useState } from 'react'

const PLAYERS = [
  { name: 'Aldric', role: 'Mestre', status: 'online', initials: 'AL' },
  { name: 'Mira', role: 'Ladina', status: 'online', initials: 'MI' },
  { name: 'Theron', role: 'Paladino', status: 'away', initials: 'TH' },
  { name: 'Elara', role: 'Maga', status: 'online', initials: 'EL' },
]

const LOG_ENTRIES = [
  { time: '21:04', type: 'system', text: 'Sala de sessão iniciada.' },
  { time: '21:07', type: 'narration', text: 'A luz das tochas dança sobre a pedra antiga.' },
  { time: '21:09', type: 'player', author: 'Mira', text: 'Verifico o corredor em busca de armadilhas.' },
  { time: '21:11', type: 'roll', text: 'Investigação — 17 (sucesso)' },
  { time: '21:14', type: 'narration', text: 'Um sussurro percorre os corredores vazios.' },
  { time: '21:16', type: 'player', author: 'Theron', text: 'Mantenho a espada erguida e avanço com cautela.' },
]

function PanelGlow({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_0_1px_0_rgba(212,175,55,0.08)] ring-1 ring-amber-900/20 ${className}`}
    />
  )
}

function MapCorner({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute size-6 border-amber-700/40 sm:size-8 ${className}`}
    />
  )
}

const MAP_TOOLBAR_ACTIONS = [
  { id: 'zoom-in', label: 'Aproximar' },
  { id: 'zoom-out', label: 'Afastar' },
  { id: 'zoom-reset', label: 'Resetar zoom' },
  { id: 'fullscreen', label: 'Tela cheia' },
  { id: 'ping', label: 'Marcador' },
] as const

function MapToolbarIcon({ id }: { id: (typeof MAP_TOOLBAR_ACTIONS)[number]['id'] }) {
  const stroke = 'currentColor'
  const props = {
    className: 'size-3.5 sm:size-4',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke,
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  switch (id) {
    case 'zoom-in':
      return (
        <svg {...props} aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <path d="M11 8v6M8 11h6M21 21l-4.35-4.35" />
        </svg>
      )
    case 'zoom-out':
      return (
        <svg {...props} aria-hidden>
          <circle cx="11" cy="11" r="7" />
          <path d="M8 11h6M21 21l-4.35-4.35" />
        </svg>
      )
    case 'zoom-reset':
      return (
        <svg {...props} aria-hidden>
          <path d="M4 12a8 8 0 0 1 13.66-5.66M20 12a8 8 0 0 1-13.66 5.66" />
          <path d="M16 4v4h-4M8 20v-4h4" />
        </svg>
      )
    case 'fullscreen':
      return (
        <svg {...props} aria-hidden>
          <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" />
        </svg>
      )
    case 'ping':
      return (
        <svg {...props} aria-hidden>
          <circle cx="12" cy="12" r="2.5" />
          <circle cx="12" cy="12" r="6" opacity="0.45" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2" opacity="0.55" />
        </svg>
      )
  }
}

function MapToolbar() {
  return (
    <div
      role="toolbar"
      aria-label="Ferramentas do mapa"
      className="flex items-center gap-0.5 rounded-lg border border-amber-900/20 bg-zinc-950/55 p-0.5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md"
    >
      {MAP_TOOLBAR_ACTIONS.map((action, index) => (
        <span key={action.id} className="flex items-center">
          {index > 0 && (
            <span aria-hidden className="mx-0.5 h-4 w-px bg-amber-900/20" />
          )}
          <button
            type="button"
            aria-label={action.label}
            title={action.label}
            className="flex size-7 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-amber-950/35 hover:text-amber-200/70 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-amber-700/50 sm:size-8"
          >
            <MapToolbarIcon id={action.id} />
          </button>
        </span>
      ))}
    </div>
  )
}

function ChevronIcon({
  direction = 'right',
  className = '',
}: {
  direction?: 'left' | 'right' | 'up' | 'down'
  className?: string
}) {
  const rotation = {
    right: '',
    left: 'rotate-180',
    up: '-rotate-90',
    down: 'rotate-90',
  }[direction]

  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`size-3 transition-transform duration-300 ease-out ${rotation} ${className}`}
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

function LogMessage({ entry }: { entry: (typeof LOG_ENTRIES)[number] }) {
  const base = 'rounded-lg border px-3.5 py-2.5 sm:px-4 sm:py-3'

  if (entry.type === 'narration') {
    return (
      <div className={`${base} border-amber-900/15 bg-amber-950/10 shadow-[0_0_24px_rgba(120,53,15,0.06)]`}>
        <p className="font-serif text-[15px] leading-relaxed italic text-zinc-400/95 sm:text-base sm:leading-7">
          {entry.text}
        </p>
      </div>
    )
  }

  if (entry.type === 'system') {
    return (
      <p className="px-1 text-[13px] leading-6 tracking-wide text-zinc-600 sm:text-sm">
        <span className="text-amber-800/60">◆</span> {entry.text}
      </p>
    )
  }

  if (entry.type === 'roll') {
    return (
      <div className={`${base} border-emerald-900/25 bg-emerald-950/15`}>
        <p className="font-mono text-[13px] tracking-wide text-emerald-300/85 sm:text-sm">
          {entry.text}
        </p>
      </div>
    )
  }

  return (
    <div className={`${base} border-zinc-800/50 bg-zinc-900/30`}>
      <p className="text-[15px] leading-relaxed text-zinc-300/90 sm:text-base sm:leading-7">
        <span className="font-medium text-amber-200/75">{entry.author}</span>
        <span className="text-zinc-600"> · </span>
        {entry.text}
      </p>
    </div>
  )
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [chronicleOpen, setChronicleOpen] = useState(true)

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-[#08080a] text-zinc-300 selection:bg-amber-950/50 selection:text-amber-50">
      {/* Ambient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_-10%,rgba(146,103,35,0.14),transparent_55%),radial-gradient(ellipse_50%_35%_at_0%_100%,rgba(69,26,3,0.1),transparent_50%),radial-gradient(ellipse_40%_30%_at_100%_80%,rgba(28,25,23,0.9),transparent_60%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.025] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]"
      />

      {/* Main workspace */}
      <div className="relative flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Map stage */}
        <section className="relative flex min-h-0 flex-1 flex-col p-2 sm:p-3 lg:pr-1.5">
          {/* Map frame */}
          <div className="relative flex min-h-[240px] flex-1 flex-col sm:min-h-[320px]">
            <div className="pointer-events-none absolute -inset-px rounded-xl bg-gradient-to-br from-amber-900/25 via-transparent to-amber-950/20 opacity-60 sm:rounded-2xl" />

            <div className="relative flex min-h-0 flex-1 overflow-hidden rounded-xl border border-amber-900/20 bg-[#0c0c0e] shadow-[0_0_0_1px_rgba(0,0,0,0.8),0_32px_100px_-20px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(212,175,55,0.06)] sm:rounded-2xl">
              <PanelGlow />

              <MapCorner className="left-2.5 top-2.5 border-l-2 border-t-2 sm:left-3 sm:top-3" />
              <MapCorner className="right-2.5 top-2.5 border-r-2 border-t-2 sm:right-3 sm:top-3" />
              <MapCorner className="bottom-2.5 left-2.5 border-b-2 border-l-2 sm:bottom-3 sm:left-3" />
              <MapCorner className="bottom-2.5 right-2.5 border-b-2 border-r-2 sm:bottom-3 sm:right-3" />

              {/* Grid texture */}
              <div
                aria-hidden
                className="absolute inset-0 bg-[length:48px_48px] bg-[linear-gradient(rgba(161,98,7,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(161,98,7,0.07)_1px,transparent_1px)]"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(8,8,10,0.35)_70%,rgba(8,8,10,0.85)_100%)]"
              />
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.04] bg-[repeating-linear-gradient(45deg,#a16207_0,#a16207_1px,transparent_0,transparent_12px)]"
              />

              {/* Depth layers */}
              <div
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,10,8,0.5)_0%,transparent_25%,transparent_75%,rgba(8,8,10,0.7)_100%)]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 shadow-[inset_0_0_160px_rgba(0,0,0,0.55)]"
              />

              {/* Map HUD */}
              <div className="pointer-events-none absolute inset-x-3 bottom-3 z-10 flex items-end justify-between gap-3 sm:inset-x-4 sm:bottom-4">
                <div className="pointer-events-auto flex flex-col gap-2">
                  <MapToolbar />
                  <div className="flex gap-1.5">
                    <span className="rounded border border-amber-900/25 bg-zinc-950/70 px-2 py-1 text-[9px] uppercase tracking-[0.18em] text-amber-200/35 backdrop-blur-md">
                      Grade · 1,5 m
                    </span>
                    <span className="hidden rounded border border-zinc-800/45 bg-zinc-950/65 px-2 py-1 text-[9px] uppercase tracking-[0.18em] text-zinc-500 backdrop-blur-md sm:inline">
                      Cena · Catacumbas
                    </span>
                  </div>
                </div>
                <span className="rounded border border-amber-900/25 bg-zinc-950/70 px-2 py-1 text-[9px] uppercase tracking-[0.18em] text-amber-200/45 backdrop-blur-md">
                  Rodada 3
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Sidebar */}
        <aside
          className={`relative flex shrink-0 flex-col overflow-hidden border-amber-900/15 bg-zinc-950/50 shadow-[-8px_0_40px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-[width,max-height] duration-300 ease-out ${
            sidebarOpen
              ? 'w-full max-h-[min(36vh,18rem)] border-t lg:max-h-none lg:w-60 lg:border-l lg:border-t-0 xl:w-64'
              : 'w-full max-h-9 border-t lg:max-h-none lg:w-9 lg:border-l lg:border-t-0'
          }`}
        >
          <button
            type="button"
            aria-expanded={sidebarOpen}
            aria-label={sidebarOpen ? 'Recolher painel lateral' : 'Expandir painel lateral'}
            onClick={() => setSidebarOpen((open) => !open)}
            className={`absolute z-30 flex size-6 items-center justify-center rounded-full border border-amber-900/30 bg-zinc-950/90 text-amber-700/55 shadow-[0_4px_20px_rgba(0,0,0,0.4)] backdrop-blur-sm transition-colors hover:border-amber-800/45 hover:text-amber-200/70 lg:-left-2.5 lg:top-1/2 lg:-translate-y-1/2 lg:left-0 ${
              sidebarOpen
                ? 'top-3 left-1/2 -translate-x-1/2 max-lg:translate-y-0'
                : 'max-lg:hidden lg:top-1/2 lg:-translate-y-1/2'
            }`}
          >
            <ChevronIcon
              direction={sidebarOpen ? 'right' : 'left'}
              className={sidebarOpen ? '' : 'lg:rotate-0'}
            />
          </button>

          {/* Collapsed handle — desktop */}
          {!sidebarOpen && (
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="hidden h-full w-full flex-col items-center justify-center gap-3 py-8 transition-opacity duration-300 lg:flex"
              aria-label="Expandir painel lateral"
            >
              <span
                className="text-[9px] font-medium uppercase tracking-[0.35em] text-amber-700/45 [writing-mode:vertical-rl]"
              >
                Sala
              </span>
              <ChevronIcon direction="left" />
            </button>
          )}

          {/* Collapsed handle — mobile */}
          {!sidebarOpen && (
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex w-full items-center justify-center gap-2 py-2 lg:hidden"
              aria-label="Expandir painel lateral"
            >
              <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-amber-700/50">
                Conectados
              </span>
              <ChevronIcon direction="up" />
            </button>
          )}

          <div
            className={`flex min-h-0 flex-1 flex-col transition-opacity duration-300 ease-out ${
              sidebarOpen
                ? 'opacity-100'
                : 'pointer-events-none opacity-0 max-lg:absolute max-lg:inset-0 max-lg:overflow-hidden'
            }`}
          >
          <PanelGlow />

          {/* Session */}
          <header className="shrink-0 border-b border-amber-900/15 px-4 py-5 sm:px-5 sm:py-6">
            <p className="text-[10px] font-medium uppercase tracking-[0.32em] text-amber-700/55">
              Sessão
            </p>
            <h2 className="mt-1.5 font-serif text-base font-light tracking-wide text-zinc-200/90">
              Véu de Ashmere
            </h2>
            <div className="mt-3 space-y-1">
              <p className="text-xs text-zinc-500">Cena · Catacumbas</p>
              <p className="text-xs text-zinc-600">Rodada 3</p>
            </div>
            <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.28em] text-amber-700/45">
              Roleplay System
            </p>
            <div
              aria-hidden
              className="mt-4 h-px bg-gradient-to-r from-amber-900/40 via-amber-800/20 to-transparent"
            />
          </header>

          {/* Connected players */}
          <section className="flex min-h-0 flex-1 flex-col">
            <div className="shrink-0 px-4 pt-4 pb-1 sm:px-5 sm:pt-5">
              <h3 className="text-[10px] font-medium uppercase tracking-[0.32em] text-amber-600/65">
                Conectados
              </h3>
              <p className="mt-1 text-xs text-zinc-600">{PLAYERS.length} na sala</p>
            </div>

            <ul className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-x-auto overflow-y-auto px-4 py-3 sm:gap-3 sm:px-5 sm:py-4 lg:overflow-x-hidden">
              {PLAYERS.map((player) => (
                <li
                  key={player.name}
                  className="flex min-w-[220px] shrink-0 items-center gap-3 rounded-xl border border-zinc-800/40 bg-zinc-900/25 px-3.5 py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(212,175,55,0.04)] lg:min-w-0 lg:w-full"
                >
                  <div className="relative shrink-0">
                    <div className="flex size-10 items-center justify-center rounded-full border border-amber-800/30 bg-gradient-to-b from-zinc-800/90 to-zinc-950 font-serif text-xs text-amber-100/75 shadow-[0_0_16px_rgba(120,53,15,0.14)]">
                      {player.initials}
                    </div>
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-zinc-950 ${
                        player.status === 'online' ? 'bg-emerald-600/90' : 'bg-amber-600/55'
                      }`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium tracking-wide text-zinc-100">
                      {player.name}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-zinc-500">{player.role}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
          </div>
        </aside>
      </div>

      {/* Chronicle */}
      <footer className="relative shrink-0 overflow-hidden border-t border-amber-900/20 bg-zinc-950/85 shadow-[0_-12px_48px_rgba(0,0,0,0.5),0_0_60px_rgba(120,53,15,0.04)] backdrop-blur-xl">
        <PanelGlow />

        <button
          type="button"
          aria-expanded={chronicleOpen}
          aria-label={chronicleOpen ? 'Recolher crônica' : 'Expandir crônica'}
          onClick={() => setChronicleOpen((open) => !open)}
          className="relative z-10 flex w-full shrink-0 items-center justify-between gap-3 border-b border-amber-900/10 px-4 py-2 transition-colors hover:bg-zinc-900/20 sm:px-5 sm:py-2.5"
        >
          <div className="flex min-w-0 items-center gap-3">
            <h2 className="text-[10px] font-medium uppercase tracking-[0.32em] text-amber-700/55">
              Crônica
            </h2>
            {!chronicleOpen && (
              <span className="truncate text-[10px] text-zinc-600">
                {LOG_ENTRIES.length} entradas
              </span>
            )}
            {chronicleOpen && (
              <span className="hidden text-xs text-zinc-500 sm:inline">
                Registro da sessão e diálogo
              </span>
            )}
          </div>
          <span className="flex size-6 shrink-0 items-center justify-center rounded-md border border-amber-900/25 bg-zinc-950/60 text-amber-700/55">
            <ChevronIcon direction={chronicleOpen ? 'down' : 'up'} />
          </span>
        </button>

        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-out ${
            chronicleOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <div className="min-h-0 overflow-hidden">
        <div className="flex h-44 flex-col sm:h-48 md:h-[13.5rem] lg:h-56 xl:h-[15rem]">
          <div className="flex shrink-0 items-center justify-end gap-4 border-b border-amber-900/10 px-4 py-2 sm:px-5 sm:py-2.5">
            <div className="flex gap-2">
              {[
                { id: 'all', label: 'Tudo' },
                { id: 'chat', label: 'Chat' },
                { id: 'rolls', label: 'Dados' },
              ].map((tab) => (
                <span
                  key={tab.id}
                  className={`rounded-md px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] ${
                    tab.id === 'all'
                      ? 'border border-amber-800/40 bg-amber-950/35 text-amber-100/75 shadow-[0_0_20px_rgba(120,53,15,0.15)]'
                      : 'border border-transparent text-zinc-600 hover:text-zinc-500'
                  }`}
                >
                  {tab.label}
                </span>
              ))}
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
            <ol className="flex-1 space-y-3 overflow-y-auto px-4 py-3 sm:space-y-4 sm:px-5 sm:py-4">
              {LOG_ENTRIES.map((entry, i) => (
                <li key={i} className="flex gap-4 sm:gap-5">
                  <time className="w-11 shrink-0 pt-3 font-mono text-xs tabular-nums text-amber-900/50 sm:w-12 sm:text-[13px]">
                    {entry.time}
                  </time>
                  <div className="min-w-0 flex-1">
                    <LogMessage entry={entry} />
                  </div>
                </li>
              ))}
            </ol>

            <div className="hidden w-px shrink-0 bg-gradient-to-b from-transparent via-amber-900/20 to-transparent lg:block" />

            <div className="hidden shrink-0 flex-col justify-end border-l border-amber-900/10 p-4 lg:flex lg:w-80 xl:w-96 xl:p-5">
              <div className="flex w-full items-center gap-3 rounded-xl border border-zinc-800/50 bg-zinc-900/40 px-4 py-3.5 shadow-[inset_0_2px_8px_rgba(0,0,0,0.3),0_0_24px_rgba(120,53,15,0.05)]">
                <span className="flex-1 text-sm text-zinc-500">Fale com a mesa…</span>
                <span className="rounded-md border border-amber-900/35 bg-amber-950/40 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-amber-200/60">
                  Enviar
                </span>
              </div>
            </div>
          </div>

          {/* Mobile compose */}
          <div className="border-t border-amber-900/10 p-3 lg:hidden">
            <div className="flex items-center gap-3 rounded-xl border border-zinc-800/50 bg-zinc-900/40 px-4 py-3">
              <span className="flex-1 text-sm text-zinc-500">Fale com a mesa…</span>
              <span className="rounded-md border border-amber-900/35 bg-amber-950/40 px-3 py-1 text-[10px] uppercase tracking-wider text-amber-200/60">
                Enviar
              </span>
            </div>
          </div>
        </div>
        </div>
        </div>
      </footer>
    </div>
  )
}

export default App
