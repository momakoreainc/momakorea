import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Hero } from '../components/sections/Hero'
import { Work } from '../components/sections/Work'
import { About } from '../components/sections/About'
import { Contact } from '../components/sections/Contact'
import { scrollToTarget } from '../lib/smoothScroll'

export function Home() {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return
    const timeout = setTimeout(() => scrollToTarget(hash), 100)
    return () => clearTimeout(timeout)
  }, [hash])

  return (
    <>
      <Hero />
      <Work />
      <About />
      <Contact />
    </>
  )
}
