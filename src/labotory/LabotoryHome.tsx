import { Link, useSearchParams } from 'react-router-dom'
import { projects } from '../data/projects'
import { useScrollReveal } from '../hooks/useScrollReveal'

export function LabotoryHome() {
  const [searchParams] = useSearchParams()
  const activeCategory = searchParams.get('category')
  const listRef = useScrollReveal<HTMLDivElement>({ stagger: 0.08, start: 'top 90%' })

  const visibleProjects = activeCategory
    ? projects.filter((p) => p.category === activeCategory)
    : projects

  return (
    <div>
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
              <div className="overflow-hidden">
                <img
                  src={project.cover}
                  alt={project.title}
                  className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  loading="lazy"
                />
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
