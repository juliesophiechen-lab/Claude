import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { PlusIcon } from './icons'
import { AddPlaceSheet } from '../components/places/AddPlaceSheet'

export function AppShell() {
  const [addOpen, setAddOpen] = useState(false)

  return (
    <div className="relative mx-auto flex h-dvh max-w-md flex-col bg-canvas-soft md:max-w-lg md:shadow-2xl">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <Outlet />
      </div>

      <button
        onClick={() => setAddOpen(true)}
        aria-label="Ort hinzufügen"
        className="absolute bottom-[96px] left-1/2 z-[1075] flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-accent text-white shadow-[0_4px_16px_rgba(193,82,42,0.45)] active:scale-95"
      >
        <PlusIcon className="h-6 w-6" />
      </button>

      <BottomNav />

      <AddPlaceSheet open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  )
}
