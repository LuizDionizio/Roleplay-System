import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import mapImage from '../assets/mapa.jpg'
import { PanelGlow } from './ui/PanelGlow'
import { MapToolbar } from './MapToolbar'
import { usePingSystem } from '../systems/spatial/pingSystem'
import { useSpotlightSystem } from '../systems/spatial/spotlightSystem'
import { useAmbienceSystem } from '../systems/atmosphere/ambienceSystem'
import { AMBIENCE_REGISTRY } from '../systems/atmosphere/ambienceRegistry'
import { useSceneSystem } from '../systems/narrative/sceneSystem'
import { SCENE_REGISTRY } from '../systems/narrative/sceneRegistry'
import { useFogSystem } from '../systems/fog/fogSystem'
import { usePerspectiveSystem } from '../systems/perspective/perspectiveSystem'
import { NarrativeToolbar } from './tools/NarrativeToolbar'
import { useEnvironmentSystem } from '../systems/environment/environmentSystem'
import { getVignetteStyles } from '../systems/environment/cinematicEffects'

// Consolidate spatial layers and calculations
import { MapLayer } from './battleground/MapLayer'
import { FogLayer } from './battleground/FogLayer'
import { SpotlightLayer } from './battleground/SpotlightLayer'
import { PingLayer } from './battleground/PingLayer'
import { TokenLayer } from './battleground/TokenLayer'
import { EnvironmentLayer } from './battleground/EnvironmentLayer'
import {
  constrainPan,
  constrainScale,
  calculateZoom,
} from '../core/spatial/helpers'

// Interaction context
import { InteractionProvider, useInteraction } from '../core/interaction/interactionContext'
import type { WorldPosition } from '../core/spatial/types'

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
  const [tokens, setTokens] = useState(INITIAL_TOKENS)

  const { pings, addPing } = usePingSystem()
  const { spotlight, lastPosition, toggleSpotlight, clearSpotlight } = useSpotlightSystem()
  const { state: ambienceState, toggleAmbience, setTrack } = useAmbienceSystem()
  const { currentSceneConfig, setScene } = useSceneSystem()
  const { fogState, revealArea, restoreFog, isPositionRevealed, setBrushSize } = useFogSystem()
  const { state: perspectiveState, setViewMode, setActiveTool } = usePerspectiveSystem()
  const { environmentalConfig } = useEnvironmentSystem()
  
  const [isAtmosphereMenuOpen, setIsAtmosphereMenuOpen] = useState(false)
  const [isSceneMenuOpen, setIsSceneMenuOpen] = useState(false)

  // Interaction handlers
  const handlePan = useCallback((dx: number, dy: number) => {
    setMapPosition(pos => constrainPan({ x: pos.x + dx, y: pos.y + dy }))
  }, [])

  const handleZoom = useCallback((deltaY: number) => {
    setMapScale(s => calculateZoom(s, deltaY))
  }, [])

  const handleTokenDragMove = useCallback((tokenId: string, dx: number, dy: number) => {
    setTokens(prev => prev.map(t =>
      t.id === tokenId ? { ...t, position: { x: t.position.x + dx, y: t.position.y + dy } } : t
    ))
  }, [])

  const handleFogStroke = useCallback((position: WorldPosition, action: 'reveal' | 'restore') => {
    if (action === 'reveal') {
      revealArea(position)
    } else {
      restoreFog(position)
    }
  }, [revealArea, restoreFog])

  const handleFogStrokeEnd = useCallback(() => {}, [])

  const handlePing = useCallback((position: WorldPosition) => {
    addPing(position)
  }, [addPing])

  const handleSpotlight = useCallback((position: WorldPosition, isAltPressed: boolean, isRightClick: boolean) => {
    if (isRightClick || isAltPressed) {
      clearSpotlight()
    } else {
      toggleSpotlight(position)
    }
  }, [clearSpotlight, toggleSpotlight])

  return (
    <InteractionProvider
      activeTool={perspectiveState.activeTool}
      mapScale={mapScale}
      onPan={handlePan}
      onZoom={handleZoom}
      onTokenDragMove={handleTokenDragMove}
      onFogStrokeStart={handleFogStroke}
      onFogStrokeMove={handleFogStroke}
      onFogStrokeEnd={handleFogStrokeEnd}
      onPing={handlePing}
      onSpotlight={handleSpotlight}
    >
      <BattlegroundContent
        mapScale={mapScale}
        setMapScale={setMapScale}
        mapPosition={mapPosition}
        setMapPosition={setMapPosition}
        tokens={tokens}
        pings={pings}
        spotlight={spotlight}
        lastPosition={lastPosition}
        currentSceneConfig={currentSceneConfig}
        setScene={setScene}
        fogState={fogState}
        isPositionRevealed={isPositionRevealed}
        setBrushSize={setBrushSize}
        perspectiveState={perspectiveState}
        setViewMode={setViewMode}
        setActiveTool={setActiveTool}
        ambienceState={ambienceState}
        toggleAmbience={toggleAmbience}
        setTrack={setTrack}
        environmentalConfig={environmentalConfig}
        isAtmosphereMenuOpen={isAtmosphereMenuOpen}
        setIsAtmosphereMenuOpen={setIsAtmosphereMenuOpen}
        isSceneMenuOpen={isSceneMenuOpen}
        setIsSceneMenuOpen={setIsSceneMenuOpen}
      />
    </InteractionProvider>
  )
}

interface BattlegroundContentProps {
  mapScale: number
  setMapScale: React.Dispatch<React.SetStateAction<number>>
  mapPosition: { x: number; y: number }
  setMapPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>
  tokens: typeof INITIAL_TOKENS
  pings: ReturnType<typeof usePingSystem>['pings']
  spotlight: ReturnType<typeof useSpotlightSystem>['spotlight']
  lastPosition: WorldPosition
  currentSceneConfig: ReturnType<typeof useSceneSystem>['currentSceneConfig']
  setScene: ReturnType<typeof useSceneSystem>['setScene']
  fogState: ReturnType<typeof useFogSystem>['fogState']
  isPositionRevealed: ReturnType<typeof useFogSystem>['isPositionRevealed']
  setBrushSize: ReturnType<typeof useFogSystem>['setBrushSize']
  perspectiveState: ReturnType<typeof usePerspectiveSystem>['state']
  setViewMode: ReturnType<typeof usePerspectiveSystem>['setViewMode']
  setActiveTool: ReturnType<typeof usePerspectiveSystem>['setActiveTool']
  ambienceState: ReturnType<typeof useAmbienceSystem>['state']
  toggleAmbience: ReturnType<typeof useAmbienceSystem>['toggleAmbience']
  setTrack: ReturnType<typeof useAmbienceSystem>['setTrack']
  environmentalConfig: ReturnType<typeof useEnvironmentSystem>['environmentalConfig']
  isAtmosphereMenuOpen: boolean
  setIsAtmosphereMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
  isSceneMenuOpen: boolean
  setIsSceneMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
}

function BattlegroundContent({
  mapScale,
  setMapScale,
  mapPosition,
  setMapPosition,
  tokens,
  pings,
  spotlight,
  lastPosition,
  currentSceneConfig,
  setScene,
  fogState,
  isPositionRevealed,
  setBrushSize,
  perspectiveState,
  setViewMode,
  setActiveTool,
  ambienceState,
  toggleAmbience,
  setTrack,
  environmentalConfig,
  isAtmosphereMenuOpen,
  setIsAtmosphereMenuOpen,
  isSceneMenuOpen,
  setIsSceneMenuOpen,
}: BattlegroundContentProps) {
  const { isSpacePressed, draggingTokenId, registerMapContainerRef } = useInteraction()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    registerMapContainerRef(containerRef)
  }, [registerMapContainerRef])

  const handleMapAction = (action: string) => {
    if (action === 'zoom-in') setMapScale(s => constrainScale(s + 0.25))
    if (action === 'zoom-out') setMapScale(s => constrainScale(s - 0.25))
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

  // Deepen the vignette specifically when dragging a token to simulate focus/depth
  const isFocusing = draggingTokenId !== null
  const vignetteStyles = useMemo(() => getVignetteStyles(environmentalConfig, isFocusing), [environmentalConfig, isFocusing])

  const cursorClass = draggingTokenId 
    ? 'cursor-grabbing' 
    : isSpacePressed || perspectiveState.activeTool === 'explore' 
      ? 'cursor-grab' 
      : 'cursor-crosshair'

  return (
    <section className="relative flex min-h-0 flex-1 flex-col p-2 sm:p-3 lg:pr-1.5">
      {/* Map frame */}
      <div className="relative flex min-h-[240px] flex-1 flex-col sm:min-h-[320px]">
        <div className="pointer-events-none absolute -inset-px rounded-xl bg-gradient-to-br from-amber-900/25 via-transparent to-amber-950/20 opacity-60 sm:rounded-2xl" />

        <div
          ref={containerRef}
          className={`relative flex min-h-0 flex-1 overflow-hidden rounded-xl border border-subtle bg-[#08080a] shadow-cinematic-lg sm:rounded-2xl ${cursorClass}`}
        >
          {/* Transform Wrapper for Map and Grid */}
          <div
            className={`absolute inset-0 ${draggingTokenId ? '' : 'transition-cinematic'}`}
            style={{ transform: `translate(${mapPosition.x}px, ${mapPosition.y}px) scale(${mapScale})` }}
          >
            <MapLayer mapImage={mapImage} />

            <FogLayer fogState={fogState} perspectiveState={perspectiveState} />

            <SpotlightLayer
              spotlight={spotlight}
              lastPosition={lastPosition}
              spotlightScale={currentSceneConfig.spotlightScale}
              transitionDurationMs={currentSceneConfig.transitionDurationMs}
            />

            <PingLayer pings={pings} />

            <TokenLayer
              tokens={tokens}
              fogState={fogState}
              isPositionRevealed={isPositionRevealed}
              perspectiveState={perspectiveState}
            />
          </div>

          <PanelGlow />

          <MapCorner className="left-2.5 top-2.5 border-l-2 border-t-2 sm:left-3 sm:top-3" />
          <MapCorner className="right-2.5 top-2.5 border-r-2 border-t-2 sm:right-3 sm:top-3" />
          <MapCorner className="bottom-2.5 left-2.5 border-b-2 border-l-2 sm:bottom-3 sm:left-3" />
          <MapCorner className="bottom-2.5 right-2.5 border-b-2 border-r-2 sm:bottom-3 sm:right-3" />

          <EnvironmentLayer vignetteStyles={vignetteStyles} />
          
          {/* HUD Layer */}
          <NarrativeToolbar 
            state={perspectiveState} 
            fogState={fogState}
            onToolSelect={setActiveTool} 
            onViewSelect={setViewMode}
            onFogBrushSelect={setBrushSize}
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
