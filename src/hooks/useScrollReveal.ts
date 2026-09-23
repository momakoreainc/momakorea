import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '../lib/motionPreference'

gsap.registerPlugin(ScrollTrigger)

type ScrollRevealOptions = {
  y?: number
  duration?: number
  stagger?: number
  start?: string
}

export function useScrollReveal<T extends HTMLElement>(options: ScrollRevealOptions = {}) {
  const ref = useRef<T>(null)
  const { y = 40, duration = 1, stagger = 0.1, start = 'top 80%' } = options

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (prefersReducedMotion()) return

    const targets = el.querySelectorAll('[data-reveal]')
    const ctx = gsap.context(() => {
      gsap.from(targets.length ? targets : el, {
        y,
        opacity: 0,
        duration,
        stagger,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start,
        },
      })
    }, el)

    return () => ctx.revert()
  }, [y, duration, stagger, start])

  return ref
}
