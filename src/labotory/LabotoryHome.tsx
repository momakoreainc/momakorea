import { useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import gsap from 'gsap'
import type { Project } from '../types'
import { useProjects } from '../lib/useProjects'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { prefersReducedMotion } from '../lib/motionPreference'

const HERO_IMAGE = `${import.meta.env.BASE_URL}projects/jeonju-exhibition-convention-center/cover.jpg`

function WorkGrid({ projects }: { projects: Project[] }) {
  const [searchParams] = useSearchParams()
  const activeCategory = searchParams.get('category')
  const listRef = useScrollReveal<HTMLDivElement>({ stagger: 0.08, start: 'top 90%' })

  const visibleProjects = activeCategory
    ? projects.filter((p) => p.category === activeCategory)
    : projects

  return (
    <>
      <p className="mb-2 text-xs tracking-widest text-neutral-400 uppercase">Work</p>
      <p className="mb-10 text-2xl font-medium tracking-tight md:text-3xl">
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
    </>
  )
}

export function LabotoryHome() {
  const { projects } = useProjects()
  const heroImgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    gsap.from(heroImgRef.current, { scale: 1.1, duration: 1.8, ease: 'power2.out' })
  }, [])

  return (
    <div>
      <section className="relative isolate flex h-[60vh] max-h-[600px] min-h-[420px] flex-col justify-end overflow-hidden px-6 pb-16 md:px-16 md:pb-20">
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

      <section id="about" className="px-6 py-24 md:px-16 md:py-32">
        <p className="mb-10 text-xs tracking-widest text-neutral-400 uppercase">About</p>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <p className="max-w-lg text-2xl leading-snug font-medium md:text-3xl">
            We create interior identity
            <br />
            through space and material.
          </p>
          <div>
            <p className="max-w-md text-sm text-neutral-500">
              MoMaKorea designs spaces with care — from open communication to considered
              realization.
            </p>
            <div className="mt-8 flex flex-col gap-4">
              {[
                { step: '01', label: 'Open Communication' },
                { step: '02', label: 'Spatial Expression' },
                { step: '03', label: 'From Idea to Space' },
                { step: '04', label: 'Realization' },
              ].map((item) => (
                <div key={item.step} className="flex items-baseline gap-4 border-b border-neutral-200 pb-4">
                  <span className="text-xs text-neutral-400">{item.step}</span>
                  <span className="text-sm text-neutral-700">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="work" className="bg-neutral-50 px-6 py-24 md:px-16 md:py-32">
        {projects && <WorkGrid projects={projects} />}
      </section>

      <section id="contact" className="bg-neutral-900 px-6 py-24 text-white md:px-16 md:py-32">
        <p className="mb-10 text-xs tracking-widest text-neutral-400 uppercase">Contact</p>
        <a
          href="mailto:info@momakorea.com"
          className="block text-3xl font-medium tracking-tight md:text-5xl"
        >
          Let&apos;s talk →
        </a>
        <p className="mt-6 text-sm text-neutral-400">
          3F, 181 Songcheonjungang-ro, Deokjin-gu, Jeonju &middot; (+82) 63-236-0908
        </p>
      </section>
    </div>
  )
}
