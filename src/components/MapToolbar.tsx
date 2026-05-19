const MAP_TOOLBAR_ACTIONS = [
  { id: 'zoom-in', label: 'Aproximar' },
  { id: 'zoom-out', label: 'Afastar' },
  { id: 'zoom-reset', label: 'Resetar zoom' },
  { id: 'atmosphere', label: 'Atmosfera' },
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
    case 'atmosphere':
      return (
        <svg {...props} aria-hidden>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" opacity="0.4" />
          <circle cx="12" cy="12" r="4" />
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

export function MapToolbar({ 
  onAction, 
  activeIds = [] 
}: { 
  onAction: (id: string) => void;
  activeIds?: string[];
}) {
  return (
    <div
      role="toolbar"
      aria-label="Ferramentas do mapa"
      className="flex items-center gap-0.5 rounded-lg border border-amber-900/20 bg-zinc-950/55 p-0.5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md"
    >
      {MAP_TOOLBAR_ACTIONS.map((action, index) => {
        const isActive = activeIds.includes(action.id)
        
        return (
          <span key={action.id} className="flex items-center">
            {index > 0 && (
              <span aria-hidden className="mx-0.5 h-4 w-px bg-amber-900/20" />
            )}
            <button
              type="button"
              aria-label={action.label}
              title={action.label}
              onClick={() => onAction(action.id)}
              className={`flex size-7 items-center justify-center rounded-md transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-amber-700/50 sm:size-8 ${
                isActive 
                  ? 'bg-amber-950/50 text-amber-400 shadow-[inset_0_0_8px_rgba(251,191,36,0.2)]' 
                  : 'text-zinc-500 hover:bg-amber-950/35 hover:text-amber-200/70'
              }`}
            >
              <MapToolbarIcon id={action.id} />
            </button>
          </span>
        )
      })}
    </div>
  )
}
