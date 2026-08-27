import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { AddPlaceSheet } from '../components/places/AddPlaceSheet'

export function AppShell() {
  const [addOpen, setAddOpen] = useState(false)

  return (
    <div className="relative mx-auto flex h-dvh max-w-md flex-col overflow-x-hidden bg-canvas-soft md:max-w-lg md:shadow-2xl">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <Outlet />
      </div>

      <BottomNav onOpenAdd={() => setAddOpen(true)} />

      {/* Rendered here rather than inside BottomNav: <nav> has backdrop-blur,
          which (per the CSS spec) makes it a containing block for absolutely
          positioned descendants, squishing the sheet down to nav-bar height
          instead of covering the full screen like every other sheet does. */}
      <AddPlaceSheet open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  )
}
