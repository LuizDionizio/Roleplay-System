import { useState } from 'react'
import { Battleground } from './components/Battleground'
import { Sidebar } from './components/Sidebar'
import { Chronicle } from './components/Chronicle'

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
        <Battleground />
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      </div>

      <Chronicle open={chronicleOpen} setOpen={setChronicleOpen} />
    </div>
  )
}

export default App
