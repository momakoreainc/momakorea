import { useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import gsap from 'gsap'
import { projects } from '../data/projects'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { prefersReducedMotion } from '../lib/motionPreference'

const HERO_IMAGE = `${import.meta.env.BASE_URL}projects/jeonju-exhibition-convention-center/cover.jpg`

export function LabotoryHome() {
  const [searchParams] = useSearchParams()
  const activeCategory = searchParams.get('category')
  const listRef = useScrollReveal<HTMLDivElement>({ stagger: 0.08, start: 'top 90%' })
  const heroImgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    gsap.from(heroImgRef.current, { scale: 1.1, duration: 1.8, ease: 'power2.out' })
  }, [])

  const visibleProjects = activeCategory
    ? projects.filter((p) => p.category === activeCategory)
    : projects

  return (
    <div>
      <section className="relative flex min-h-screen flex-col justify-end overflow-hidden px-6 pb-16 md:px-16 md:pb-20">
        <img
          ref={heroImgRef}
          src={HERO_IMAGE}
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-black/55" />
        <p className="text-sm tracking-widest text-white/70">Interior Design Studio — Jeonju, Korea</p>
        <h1 className="mt-4 max-w-3xl text-4xl leading-[1.05] font-medium tracking-tight text-white md:text-7xl">
          Imagining is key
          <br />
          to more creative.
        </h1>
      </section>

      <section id="about" className="px-6 py-16 md:px-16 md:py-24">
        <p className="max-w-lg text-2xl leading-snug font-medium md:text-3xl">
          We create interior identity
          <br />
          through space and material.
        </p>
        <p className="mt-6 max-w-md text-sm text-neutral-500">
          MoMaKorea designs spaces with care — from open communication to considered
          realization.
        </p>
      </section>

      <section id="work" className="px-6 pb-24 md:px-16">
        <p className="mb-10 text-xs tracking-widest text-neutral-400 uppercase">
          {activeCategory ?? 'All Projects'}
        </p>
        <div ref={listRef} className="flex flex-col">
          {visibleProjects.map((project) => (
            <Link
              key={project.id}
              to={`/project/${project.id}`}
              className="group mb-20 block last:mb-0"
              data-reveal
            >
              <div className="relative overflow-hidden">
                <img
                  src={project.cover}
                  alt={project.title}
                  className="aspect-[16/10] w-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.03] group-hover:opacity-50 group-hover:blur-[2px]"
                  loading="lazy"
                />
                <div className="texture-paper absolute inset-y-0 left-0 flex w-56 -translate-x-full items-start p-6 transition-transform duration-700 ease-out group-hover:translate-x-0 md:w-64">
                  <span className="text-sm text-neutral-600">{project.title}</span>
                </div>
              </div>
              <div className="mt-5 flex items-baseline justify-between">
                <h2 className="text-xl font-medium md:text-2xl">{project.title}</h2>
                <span className="text-sm text-neutral-400">{project.year}</span>
              </div>
              <p className="mt-1 text-sm text-neutral-500">
                {project.category} · {project.location}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section id="contact" className="border-t border-neutral-200 px-6 py-16 md:px-16">
        <a
          href="mailto:info@momakorea.com"
          className="block text-3xl font-medium tracking-tight md:text-5xl"
        >
          Let&apos;s talk →
        </a>
        <p className="mt-6 text-sm text-neutral-500">
          3F, 181 Songcheonjungang-ro, Deokjin-gu, Jeonju &middot; (+82) 63-236-0908
        </p>
      </section>
    </div>
  )
}
