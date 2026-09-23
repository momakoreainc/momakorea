import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { prefersReducedMotion } from '../../lib/motionPreference'

export function Preloader() {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const overlay = overlayRef.current
    if (!overlay) return

    if (prefersReducedMotion()) {
      overlay.remove()
      return
    }

    const finish = () => {
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.6,
        delay: 0.2,
        ease: 'power2.out',
        onComplete: () => overlay.remove(),
      })
    }

    if (document.fonts?.ready) {
      document.fonts.ready.then(finish)
    } else {
      finish()
    }
  }, [])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-(--color-bg)"
    >
      <span className="text-sm tracking-widest text-(--color-muted)">LOADING</span>
    </div>
  )
}
