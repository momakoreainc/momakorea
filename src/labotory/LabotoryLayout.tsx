import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Sidebar } from './Sidebar'

type LabotoryLayoutProps = {
  children: ReactNode
}

export function LabotoryLayout({ children }: LabotoryLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4 lg:hidden">
        <Link to="/" className="flex items-center gap-2 text-base font-semibold tracking-tight">
          <img src={`${import.meta.env.BASE_URL}favicon.png`} alt="" className="h-5 w-5" />
          MoMaKorea
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="text-sm text-neutral-500"
          aria-label="Open menu"
        >
          Menu
        </button>
      </header>

      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <main className="pt-16 lg:ml-[56%] lg:pt-0">{children}</main>
    </div>
  )
}
