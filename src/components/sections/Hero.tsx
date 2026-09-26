import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { prefersReducedMotion } from '../../lib/motionPreference'

gsap.registerPlugin(SplitText)

const BG_IMAGES = [
  'projects/jeonju-exhibition-convention-center/cover.jpg',
  'projects/jeonju-kkotsim-hotel/cover.jpg',
  'projects/jeonju-museum-of-art/cover.jpg',
  'projects/wanju-sambong-library/cover.jpg',
  'projects/naju-udelight-cafe/cover.jpg',
].map((path) => `${import.meta.env.BASE_URL}${path}`)

const ROTATE_INTERVAL_MS = 6000

export function Hero() {
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const bgLayerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const headline = headlineRef.current
    if (!headline || prefersReducedMotion()) return

    let split: SplitText | undefined

    gsap.from(bgLayerRef.current, {
      scale: 1.12,
      duration: 1.8,
      ease: 'power2.out',
    })

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

  useEffect(() => {
    if (prefersReducedMotion()) return

    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % BG_IMAGES.length)
    }, ROTATE_INTERVAL_MS)

    return () => window.clearInterval(id)
  }, [])

  return (
    <section className="relative isolate flex min-h-screen flex-col justify-center overflow-hidden px-6 md:px-12">
      <div ref={bgLayerRef} className="absolute inset-0 -z-20">
        {BG_IMAGES.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1800ms] ease-in-out"
            style={{ opacity: i === activeIndex ? 1 : 0 }}
          />
        ))}
      </div>
      <div className="absolute inset-0 -z-10 bg-black/70" />

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
