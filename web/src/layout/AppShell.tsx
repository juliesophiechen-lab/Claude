import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export function AppShell() {
  return (
    <div className="relative mx-auto flex h-dvh max-w-md flex-col bg-canvas-soft md:max-w-lg md:shadow-2xl">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <Outlet />
      </div>

      <BottomNav />
    </div>
  )
}
