import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { prefersReducedMotion } from '../../lib/motionPreference'

gsap.registerPlugin(SplitText)

export function Hero() {
  const headlineRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const headline = headlineRef.current
    if (!headline || prefersReducedMotion()) return

    let split: SplitText | undefined

    document.fonts.ready.then(() => {
      split = SplitText.create(headline, { type: 'lines', mask: 'lines' })
      gsap.from(split.lines, {
        y: '110%',
        duration: 1,
        stagger: 0.08,
        delay: 0.6,
        ease: 'power4.out',
      })
    })

    return () => split?.revert()
  }, [])

  return (
    <section className="flex min-h-screen flex-col justify-center px-6 md:px-12">
      <p className="mb-4 text-sm tracking-widest text-(--color-muted)" data-reveal>
        Interior Design Studio — Jeonju, Korea
      </p>
      <h1
        ref={headlineRef}
        className="text-5xl leading-[1.05] font-medium tracking-tight md:text-8xl"
      >
        Imagining is key
        <br />
        to more creative.
      </h1>
      <p className="mt-6 max-w-md text-(--color-muted)" data-reveal>
        MoMaKorea designs spaces with care — from open communication to considered realization.
      </p>
      <div className="mt-10 flex items-center gap-2 text-sm text-(--color-muted)" data-reveal>
        <span className="h-px w-8 bg-(--color-muted)" />
        Scroll to explore
      </div>
    </section>
  )
}
