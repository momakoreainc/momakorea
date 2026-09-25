import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { LabotoryLayout } from './LabotoryLayout'
import { LabotoryHome } from './LabotoryHome'
import { LabotoryProjectDetail } from './LabotoryProjectDetail'
import { initSmoothScroll, scrollToTarget } from '../lib/smoothScroll'

function ScrollReset() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    scrollToTarget(0, { immediate: true })
  }, [pathname, hash])

  return null
}

export function LabotoryApp() {
  useEffect(() => {
    const cleanup = initSmoothScroll()
    return () => cleanup?.()
  }, [])

  return (
    <BrowserRouter basename="/new2">
      <LabotoryLayout>
        <ScrollReset />
        <Routes>
          <Route path="/" element={<LabotoryHome />} />
          <Route path="/project/:slug" element={<LabotoryProjectDetail />} />
        </Routes>
      </LabotoryLayout>
    </BrowserRouter>
  )
}
