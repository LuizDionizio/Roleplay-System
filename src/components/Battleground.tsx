import { useState, useEffect, useRef } from 'react'
import mapImage from '../assets/mapa.jpg'
import { PanelGlow } from './ui/PanelGlow'
import { MapToolbar } from './MapToolbar'
import { usePingSystem } from '../systems/spatial/pingSystem'
import { useSpotlightSystem, SPOTLIGHT_CONFIG } from '../systems/spatial/spotlightSystem'
import { useAmbienceSystem } from '../systems/atmosphere/ambienceSystem'
import { AMBIENCE_REGISTRY } from '../systems/atmosphere/ambienceRegistry'
import { useSceneSystem } from '../systems/narrative/sceneSystem'
import { SCENE_REGISTRY } from '../systems/narrative/sceneRegistry'
import { useFogSystem } from '../systems/fog/fogSystem'
import { FogOverlay } from '../systems/fog/FogOverlay'
import { usePerspectiveSystem } from '../systems/perspective/perspectiveSystem'
import { NarrativeToolbar } from './tools/NarrativeToolbar'

function MapCorner({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute size-6 border-amber-700/40 sm:size-8 ${className}`}
    />
  )
}

const INITIAL_TOKENS = [
  { id: 't1', name: 'Aldric', initials: 'AL', position: { x: 400, y: 200 }, color: 'text-amber-500/90' },
  { id: 't2', name: 'Mira', initials: 'MI', position: { x: 520, y: 280 }, color: 'text-emerald-500/90' },
  { id: 't3', name: 'Theron', initials: 'TH', position: { x: 350, y: 350 }, color: 'text-sky-500/90' },
]

export function Battleground() {
  const [mapScale, setMapScale] = useState(1)
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 })
  const [isMapPanning, setIsMapPanning] = useState(false)
  const mapPointerRef = useRef({ x: 0, y: 0 })

  // Token state
  const [tokens, setTokens] = useState(INITIAL_TOKENS)
  const [draggingTokenId, setDraggingTokenId] = useState<string | null>(null)
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null)
  const tokenPointerRef = useRef({ x: 0, y: 0 })

  const { pings, addPing } = usePingSystem()
  const { spotlight, lastPosition, toggleSpotlight, clearSpotlight } = useSpotlightSystem()
  const { state: ambienceState, toggleAmbience, setTrack } = useAmbienceSystem()
  const { currentSceneConfig, setScene } = useSceneSystem()
  const { fogState, revealArea, restoreFog, isPositionRevealed, setBrushSize } = useFogSystem()
  const { state: perspectiveState, setViewMode, setActiveTool } = usePerspectiveSystem()
  
  const [isAtmosphereMenuOpen, setIsAtmosphereMenuOpen] = useState(false)
  const [isSceneMenuOpen, setIsSceneMenuOpen] = useState(false)
  const [fogAction, setFogAction] = useState<'reveal' | 'restore' | null>(null)
  const [isSpacebarPressed, setIsSpacebarPressed] = useState(false)
  const mapImageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat && (e.target as HTMLElement).tagName !== 'INPUT') {
        setIsSpacebarPressed(true)
      }
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') setIsSpacebarPressed(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useEffect(() => {
    if (!fogAction) return

    const handlePointerMove = (e: PointerEvent) => {
      if (!mapImageRef.current) return
      const rect = mapImageRef.current.getBoundingClientRect()
      const x = (e.clientX - rect.left) / mapScale
      const y = (e.clientY - rect.top) / mapScale
      
      if (fogAction === 'reveal') revealArea({ x, y })
      if (fogAction === 'restore') restoreFog({ x, y })
    }

    const handlePointerUp = () => setFogAction(null)

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [fogAction, mapScale, revealArea, restoreFog])

  useEffect(() => {
    if (!draggingTokenId) return

    const handleTokenMove = (e: PointerEvent) => {
      const dx = (e.clientX - tokenPointerRef.current.x) / mapScale
      const dy = (e.clientY - tokenPointerRef.current.y) / mapScale

      setTokens(prev => prev.map(t =>
        t.id === draggingTokenId ? { ...t, position: { x: t.position.x + dx, y: t.position.y + dy } } : t
      ))
      tokenPointerRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleTokenUp = () => setDraggingTokenId(null)

    window.addEventListener('pointermove', handleTokenMove)
    window.addEventListener('pointerup', handleTokenUp)

    return () => {
      window.removeEventListener('pointermove', handleTokenMove)
      window.removeEventListener('pointerup', handleTokenUp)
    }
  }, [draggingTokenId, mapScale])

  useEffect(() => {
    if (!isMapPanning) return

    const handleMapPointerMove = (e: PointerEvent) => {
      const dx = e.clientX - mapPointerRef.current.x
      const dy = e.clientY - mapPointerRef.current.y

      setMapPosition((pos) => {
        const newX = Math.max(-1500, Math.min(pos.x + dx, 1500))
        const newY = Math.max(-1500, Math.min(pos.y + dy, 1500))
        return { x: newX, y: newY }
      })

      mapPointerRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleMapPointerUp = () => {
      setIsMapPanning(false)
    }

    window.addEventListener('pointermove', handleMapPointerMove)
    window.addEventListener('pointerup', handleMapPointerUp)

    return () => {
      window.removeEventListener('pointermove', handleMapPointerMove)
      window.removeEventListener('pointerup', handleMapPointerUp)
    }
  }, [isMapPanning])

  const handleMapAction = (action: string) => {
    if (action === 'zoom-in') setMapScale(s => Math.min(s + 0.25, 3))
    if (action === 'zoom-out') setMapScale(s => Math.max(0.5, s - 0.25))
    if (action === 'zoom-reset') {
      setMapScale(1)
      setMapPosition({ x: 0, y: 0 })
    }
    if (action === 'atmosphere') {
      setIsAtmosphereMenuOpen(prev => !prev)
      if (!ambienceState.isActive) {
        toggleAmbience()
      }
    }
  }

  return (
    <section className="relative flex min-h-0 flex-1 flex-col p-2 sm:p-3 lg:pr-1.5">
      {/* Map frame */}
      <div className="relative flex min-h-[240px] flex-1 flex-col sm:min-h-[320px]">
        <div className="pointer-events-none absolute -inset-px rounded-xl bg-gradient-to-br from-amber-900/25 via-transparent to-amber-950/20 opacity-60 sm:rounded-2xl" />

        <div
          className={`relative flex min-h-0 flex-1 overflow-hidden rounded-xl border border-subtle bg-[#08080a] shadow-cinematic-lg sm:rounded-2xl ${isMapPanning ? 'cursor-grabbing' : isSpacebarPressed || perspectiveState.activeTool === 'explore' ? 'cursor-grab' : 'cursor-crosshair'}`}
          onPointerDown={(e) => {
            if (e.button !== 0) return
            if ((e.target as HTMLElement).closest('.pointer-events-auto')) return

            const effectiveTool = isSpacebarPressed ? 'explore' : perspectiveState.activeTool
            if (effectiveTool === 'explore') {
              setIsMapPanning(true)
              setSelectedTokenId(null)
              mapPointerRef.current = { x: e.clientX, y: e.clientY }
              e.preventDefault()
            }
          }}
          onWheel={(e) => {
            const zoomDelta = e.deltaY > 0 ? -0.15 : 0.15
            setMapScale((s) => Math.max(0.5, Math.min(s + zoomDelta, 3)))
          }}
        >
          {/* Transform Wrapper for Map and Grid */}
          <div
            className={`absolute inset-0 ${isMapPanning ? '' : 'transition-cinematic'}`}
            style={{ transform: `translate(${mapPosition.x}px, ${mapPosition.y}px) scale(${mapScale})` }}
          >
            {/* Map Background */}
            <img
              ref={mapImageRef}
              src={mapImage}
              alt="Battleground Map"
              className="absolute inset-0 h-full w-full object-cover"
              onContextMenu={(e) => {
                e.preventDefault()
              }}
              onPointerDown={(e) => {
                const effectiveTool = isSpacebarPressed ? 'explore' : perspectiveState.activeTool
                if (effectiveTool === 'explore') return

                e.stopPropagation()
                e.preventDefault()

                const rect = e.currentTarget.getBoundingClientRect()
                const x = (e.clientX - rect.left) / mapScale
                const y = (e.clientY - rect.top) / mapScale

                if (effectiveTool === 'fog') {
                  if (e.button === 0) {
                    if (e.altKey) {
                      setFogAction('restore')
                      restoreFog({ x, y })
                    } else {
                      setFogAction('reveal')
                      revealArea({ x, y })
                    }
                  }
                } else if (effectiveTool === 'spotlight') {
                  if (e.button === 0) {
                    if (e.altKey) clearSpotlight()
                    else toggleSpotlight({ x, y })
                  } else if (e.button === 2) {
                    clearSpotlight()
                  }
                } else if (effectiveTool === 'ping') {
                  if (e.button === 0) {
                    addPing({ x, y })
                  }
                }
              }}
            />

            {/* Tabletop Grid Overlay */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[length:48px_48px] bg-[linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)]"
            />

            <FogOverlay isActive={fogState.isActive} revealedZones={fogState.revealedZones} viewMode={perspectiveState.viewMode} />

            {/* Spotlight Overlay */}
            <div 
              className={`pointer-events-none absolute z-20 flex size-[6000px] items-center justify-center transition-cinematic ${spotlight ? 'opacity-100' : 'opacity-0'}`}
              style={{
                left: spotlight?.position.x ?? lastPosition.x,
                top: spotlight?.position.y ?? lastPosition.y,
                transform: `translate(-50%, -50%) scale(${currentSceneConfig.spotlightScale})`,
                transitionDuration: `1000ms, 1000ms, 1000ms, ${currentSceneConfig.transitionDurationMs}ms`,
                transitionProperty: 'left, top, opacity, transform',
                background: `radial-gradient(circle ${SPOTLIGHT_CONFIG.defaultRadius}px at center, transparent 0%, rgba(12,10,8,0.15) 30%, rgba(8,8,10,0.7) 70%, rgba(8,8,10,0.9) 100%)`
              }}
            />


            {/* Spatial Pings */}
            {pings.map(ping => (
              <div
                key={ping.id}
                className="pointer-events-none absolute z-30 flex items-center justify-center"
                style={{
                  left: ping.position.x,
                  top: ping.position.y,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* Expanding ripples */}
                <div className="absolute size-16 rounded-full border-2 border-amber-500/80 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
                <div className="absolute size-16 rounded-full border border-amber-400/60 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite]" style={{ animationDelay: '400ms' }} />

                {/* Core glow */}
                <div className="absolute size-3 rounded-full bg-amber-400 shadow-[0_0_15px_4px_rgba(251,191,36,0.6)] animate-pulse" />
                <div className="absolute size-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
              </div>
            ))}

            {/* Interactive Tokens */}
            {tokens.map(token => {
              const isRevealed = fogState.isActive ? isPositionRevealed(token.position) : true;
              const isPlayerHidden = perspectiveState.viewMode === 'player' && !isRevealed;
              
              // True concealment for players
              if (isPlayerHidden) return null;

              // GM intuitive visual feedback for hidden tokens
              const gmDimmingClass = (perspectiveState.viewMode === 'gm' && !isRevealed) ? 'opacity-40 grayscale-[0.5]' : '';

              const isDragging = draggingTokenId === token.id
              const isSelected = selectedTokenId === token.id

              return (
                <div
                  key={token.id}
                  className={`group absolute flex flex-col items-center justify-center transition-hover z-40 ${isDragging
                      ? 'cursor-grabbing scale-110 !z-50'
                      : isSelected
                        ? 'cursor-grab scale-[1.02]'
                        : 'cursor-grab hover:scale-[1.04]'
                    } ${gmDimmingClass}`}
                  style={{
                    left: token.position.x,
                    top: token.position.y,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onPointerDown={(e) => {
                    if (e.button !== 0) return
                    e.stopPropagation() // Prevent map panning
                    setDraggingTokenId(token.id)
                    setSelectedTokenId(token.id)
                    tokenPointerRef.current = { x: e.clientX, y: e.clientY }
                    e.preventDefault()
                  }}
                >
                  {/* Token Chip */}
                  <div
                    className={`flex items-center justify-center size-12 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-950 border transition-hover ${isDragging
                        ? 'border-amber-300 shadow-[0_20px_40px_rgba(0,0,0,0.9),0_0_30px_rgba(217,119,6,0.5)] ring-2 ring-amber-400/50'
                        : isSelected
                          ? 'border-amber-400 shadow-[0_12px_24px_rgba(0,0,0,0.8),0_0_20px_rgba(217,119,6,0.4)] ring-2 ring-amber-500/40'
                          : 'border-amber-700/80 shadow-[0_6px_12px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.1)] ring-1 ring-amber-900/50 group-hover:border-amber-500 group-hover:shadow-[0_8px_16px_rgba(0,0,0,0.7)]'
                      }`}
                  >
                    <div className="flex size-full items-center justify-center rounded-full border border-amber-900/30 bg-zinc-900/80 backdrop-blur-sm">
                      <span className={`text-sm font-bold tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] ${token.color}`}>
                        {token.initials}
                      </span>
                    </div>
                  </div>

                  {/* Name Label */}
                  <span className={`absolute -bottom-7 px-2 py-0.5 rounded border bg-zinc-950/90 text-[10px] font-medium tracking-wide shadow-cinematic-sm blur-ambient-sm transition-hover ${isSelected
                      ? 'border-amber-500/40 text-amber-200'
                      : 'border-zinc-800/60 text-zinc-400 opacity-0 group-hover:opacity-100'
                    }`}>
                    {token.name}
                  </span>
                </div>
              )
            })}
          </div>

          <PanelGlow />

          <MapCorner className="left-2.5 top-2.5 border-l-2 border-t-2 sm:left-3 sm:top-3" />
          <MapCorner className="right-2.5 top-2.5 border-r-2 border-t-2 sm:right-3 sm:top-3" />
          <MapCorner className="bottom-2.5 left-2.5 border-b-2 border-l-2 sm:bottom-3 sm:left-3" />
          <MapCorner className="bottom-2.5 right-2.5 border-b-2 border-r-2 sm:bottom-3 sm:right-3" />

          {/* Atmospheric Vignette & Depth Layers */}
          <div
            aria-hidden
            className="absolute inset-0 bg-black pointer-events-none transition-cinematic"
            style={{ 
              opacity: currentSceneConfig.baseDarkness,
              transitionDuration: `${currentSceneConfig.transitionDurationMs}ms` 
            }}
          />
          
          {/* HUD Layer */}
          <NarrativeToolbar 
            state={perspectiveState} 
            fogState={fogState}
            onToolSelect={setActiveTool} 
            onViewSelect={setViewMode}
            onFogBrushSelect={setBrushSize}
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_50%,rgba(8,8,10,0.2)_75%,rgba(8,8,10,0.85)_100%)] pointer-events-none"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,10,8,0.4)_0%,transparent_10%,transparent_90%,rgba(8,8,10,0.6)_100%)] pointer-events-none"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 shadow-[inset_0_0_120px_rgba(0,0,0,0.4)]"
          />

          {/* Map HUD */}
          <div className="pointer-events-none absolute inset-x-3 bottom-3 z-10 flex items-end justify-between gap-3 sm:inset-x-4 sm:bottom-4">
            <div className="pointer-events-auto relative flex flex-col gap-2">
              {/* Atmosphere Popover */}
              {isAtmosphereMenuOpen && (
                <div className="absolute bottom-full mb-2 left-0 w-48 overflow-hidden rounded-xl border border-subtle bg-zinc-950/80 p-1 shadow-cinematic-md blur-ambient-md">
                  <div className="mb-1 flex items-center justify-between px-2 py-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500/70">Atmosfera</span>
                    <button 
                      onClick={() => {
                        toggleAmbience()
                        setIsAtmosphereMenuOpen(false)
                      }}
                      className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded border transition-colors ${
                        ambienceState.isActive 
                          ? 'border-focus text-amber-400 bg-amber-950/40' 
                          : 'border-subtle text-zinc-500 hover:border-amber-700/50 hover:text-amber-200/70'
                      }`}
                    >
                      {ambienceState.isActive ? 'Ligado' : 'Desligado'}
                    </button>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {Object.values(AMBIENCE_REGISTRY).map(track => {
                      const isSelected = track.id === ambienceState.currentTrackId
                      const isSuggested = track.id === currentSceneConfig.suggestedAmbienceId
                      
                      return (
                        <button
                          key={track.id}
                          onClick={() => setTrack(track.id)}
                          className={`flex items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition-hover ${
                            isSelected && ambienceState.isActive
                              ? 'bg-amber-900/20 text-amber-200'
                              : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-amber-100'
                          }`}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium tracking-wide">{track.name}</span>
                            {isSuggested && (
                              <span className="text-[9px] text-amber-600/70 tracking-widest uppercase mt-0.5">Sugestão da Cena</span>
                            )}
                          </div>
                          {isSelected && ambienceState.isActive && (
                            <span className="flex gap-0.5">
                              <span className="size-1 rounded-full bg-amber-400 animate-pulse" />
                              <span className="size-1 rounded-full bg-amber-500 animate-pulse" style={{ animationDelay: '200ms' }} />
                              <span className="size-1 rounded-full bg-amber-600 animate-pulse" style={{ animationDelay: '400ms' }} />
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              <MapToolbar 
                onAction={handleMapAction} 
                activeIds={ambienceState.isActive ? ['atmosphere'] : []} 
              />
              <div className="flex gap-1.5">
                <span className="rounded border border-subtle bg-zinc-950/70 px-2 py-1 text-[9px] uppercase tracking-[0.18em] text-amber-200/35 blur-ambient-md">
                  Grade · 1,5 m
                </span>
                <div className="relative hidden sm:block">
                  {/* Scene Popover */}
                  {isSceneMenuOpen && (
                    <div className="absolute bottom-full mb-2 left-0 w-40 overflow-hidden rounded-xl border border-subtle bg-zinc-950/80 p-1 shadow-cinematic-md blur-ambient-md">
                      <div className="mb-1 px-2 py-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500/70">Atmosfera Narrativa</span>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        {Object.values(SCENE_REGISTRY).map(scene => {
                          const isSelected = scene.id === currentSceneConfig.id
                          return (
                            <button
                              key={scene.id}
                              onClick={() => {
                                setScene(scene.id)
                                setIsSceneMenuOpen(false)
                              }}
                              className={`flex items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition-hover ${
                                isSelected
                                  ? 'bg-amber-900/20 text-amber-200'
                                  : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-amber-100'
                              }`}
                            >
                              <span className="font-medium tracking-wide">{scene.name}</span>
                              {isSelected && (
                                <span className="size-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={() => setIsSceneMenuOpen(prev => !prev)}
                    className="rounded border border-subtle bg-zinc-950/65 px-2 py-1 text-[9px] uppercase tracking-[0.18em] text-zinc-400 transition-hover hover:border-focus hover:text-amber-200 blur-ambient-md"
                  >
                    Cena · {currentSceneConfig.name}
                  </button>
                </div>
              </div>
            </div>
            <span className="rounded border border-subtle bg-zinc-950/70 px-2 py-1 text-[9px] uppercase tracking-[0.18em] text-amber-200/45 blur-ambient-md">
              Rodada 3
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
