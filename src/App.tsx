import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { Home } from './pages/Home'
import { ProjectDetail } from './pages/ProjectDetail'
import { initSmoothScroll, scrollToTarget } from './lib/smoothScroll'

function ScrollReset() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    scrollToTarget(0, { immediate: true })
  }, [pathname, hash])

  return null
}

function App() {
  useEffect(() => {
    const cleanup = initSmoothScroll()
    return () => cleanup?.()
  }, [])

  return (
    <BrowserRouter>
      <Layout>
        <ScrollReset />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/work/:slug" element={<ProjectDetail />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
