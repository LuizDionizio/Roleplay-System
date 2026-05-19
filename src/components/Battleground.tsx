import { useState, useEffect, useRef } from 'react'
import mapImage from '../assets/mapa.jpg'
import { PanelGlow } from './ui/PanelGlow'
import { MapToolbar } from './MapToolbar'

function MapCorner({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute size-6 border-amber-700/40 sm:size-8 ${className}`}
    />
  )
}

export function Battleground() {
  const [mapScale, setMapScale] = useState(1)
  const [mapPosition, setMapPosition] = useState({ x: 0, y: 0 })
  const [isMapPanning, setIsMapPanning] = useState(false)
  const mapPointerRef = useRef({ x: 0, y: 0 })

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
  }

  return (
    <section className="relative flex min-h-0 flex-1 flex-col p-2 sm:p-3 lg:pr-1.5">
      {/* Map frame */}
      <div className="relative flex min-h-[240px] flex-1 flex-col sm:min-h-[320px]">
        <div className="pointer-events-none absolute -inset-px rounded-xl bg-gradient-to-br from-amber-900/25 via-transparent to-amber-950/20 opacity-60 sm:rounded-2xl" />

        <div 
          className={`relative flex min-h-0 flex-1 overflow-hidden rounded-xl border border-amber-900/20 bg-[#08080a] shadow-[0_0_0_1px_rgba(0,0,0,0.8),0_32px_100px_-20px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(212,175,55,0.06)] sm:rounded-2xl ${isMapPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
          onPointerDown={(e) => {
            if (e.button !== 0) return
            if ((e.target as HTMLElement).closest('.pointer-events-auto')) return
            
            setIsMapPanning(true)
            mapPointerRef.current = { x: e.clientX, y: e.clientY }
            e.preventDefault()
          }}
          onWheel={(e) => {
            const zoomDelta = e.deltaY > 0 ? -0.15 : 0.15
            setMapScale((s) => Math.max(0.5, Math.min(s + zoomDelta, 3)))
          }}
        >
          {/* Transform Wrapper for Map and Grid */}
          <div 
            className={`absolute inset-0 ${isMapPanning ? '' : 'transition-transform duration-300 ease-out'}`}
            style={{ transform: `translate(${mapPosition.x}px, ${mapPosition.y}px) scale(${mapScale})` }}
          >
            {/* Map Background */}
            <img
              src={mapImage}
              alt="Battleground Map"
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Tabletop Grid Overlay */}
            <div
              aria-hidden
              className="absolute inset-0 bg-[length:48px_48px] bg-[linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)]"
            />
          </div>

          <PanelGlow />

          <MapCorner className="left-2.5 top-2.5 border-l-2 border-t-2 sm:left-3 sm:top-3" />
          <MapCorner className="right-2.5 top-2.5 border-r-2 border-t-2 sm:right-3 sm:top-3" />
          <MapCorner className="bottom-2.5 left-2.5 border-b-2 border-l-2 sm:bottom-3 sm:left-3" />
          <MapCorner className="bottom-2.5 right-2.5 border-b-2 border-r-2 sm:bottom-3 sm:right-3" />
          
          {/* Atmospheric Vignette & Depth Layers */}
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
            <div className="pointer-events-auto flex flex-col gap-2">
              <MapToolbar onAction={handleMapAction} />
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
  )
}
