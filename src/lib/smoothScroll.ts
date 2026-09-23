import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from './motionPreference'

gsap.registerPlugin(ScrollTrigger)

let lenisInstance: Lenis | null = null

export function initSmoothScroll() {
  if (prefersReducedMotion()) return null

  const lenis = new Lenis({ autoRaf: false })
  lenisInstance = lenis

  lenis.on('scroll', ScrollTrigger.update)

  const tick = (time: number) => {
    lenis.raf(time * 1000)
  }
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)

  return () => {
    gsap.ticker.remove(tick)
    lenis.destroy()
    lenisInstance = null
  }
}

export function scrollToTarget(target: string | number, options?: { immediate?: boolean }) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, options)
    return
  }
  if (typeof target === 'number') {
    window.scrollTo({ top: target, behavior: options?.immediate ? 'auto' : 'smooth' })
    return
  }
  document.querySelector(target)?.scrollIntoView({ behavior: options?.immediate ? 'auto' : 'smooth' })
}
