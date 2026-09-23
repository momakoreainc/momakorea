import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches
    if (!isFinePointer || !dotRef.current || !ringRef.current) return

    document.body.classList.add('cursor-none')

    const dotX = gsap.quickTo(dotRef.current, 'x', { duration: 0.15, ease: 'power3' })
    const dotY = gsap.quickTo(dotRef.current, 'y', { duration: 0.15, ease: 'power3' })
    const ringX = gsap.quickTo(ringRef.current, 'x', { duration: 0.4, ease: 'power3' })
    const ringY = gsap.quickTo(ringRef.current, 'y', { duration: 0.4, ease: 'power3' })

    const handleMove = (e: MouseEvent) => {
      dotX(e.clientX)
      dotY(e.clientY)
      ringX(e.clientX)
      ringY(e.clientY)
    }

    const handleEnter = (e: Event) => {
      if ((e.target as HTMLElement).closest('[data-cursor-hover]')) {
        ringRef.current?.classList.add('scale-150')
      }
    }
    const handleLeave = (e: Event) => {
      if ((e.target as HTMLElement).closest('[data-cursor-hover]')) {
        ringRef.current?.classList.remove('scale-150')
      }
    }

    window.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseover', handleEnter)
    document.addEventListener('mouseout', handleLeave)

    return () => {
      document.body.classList.remove('cursor-none')
      window.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseover', handleEnter)
      document.removeEventListener('mouseout', handleLeave)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-50 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-(--color-accent)"
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-50 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-(--color-accent) transition-transform duration-200"
      />
    </>
  )
}
