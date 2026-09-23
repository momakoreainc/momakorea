import { Link, useParams } from 'react-router-dom'
import { projects } from '../data/projects'
import { useScrollReveal } from '../hooks/useScrollReveal'

export function ProjectDetail() {
  const { slug } = useParams()
  const index = projects.findIndex((p) => p.id === slug)
  const project = projects[index]
  const ref = useScrollReveal<HTMLDivElement>({ start: 'top 95%' })

  if (!project) {
    return (
      <section className="px-6 py-32 text-center md:px-12">
        <p className="text-(--color-muted)">Project not found.</p>
        <Link to="/#work" className="mt-4 inline-block underline" data-cursor-hover>
          ← Back to Work
        </Link>
      </section>
    )
  }

  const prev = projects[(index - 1 + projects.length) % projects.length]
  const next = projects[(index + 1) % projects.length]

  return (
    <article ref={ref} className="px-6 pt-28 pb-32 md:px-12">
      <Link
        to="/#work"
        className="mb-10 inline-block text-sm text-(--color-muted) transition-colors hover:text-(--color-fg)"
        data-cursor-hover
        data-reveal
      >
        ← Back to Work
      </Link>

      <div data-reveal>
        <p className="text-sm text-(--color-muted)">
          {project.category} · {project.location} · {project.year}
        </p>
        <h1 className="mt-2 text-4xl font-medium tracking-tight md:text-6xl">{project.title}</h1>
        <p className="mt-6 max-w-xl text-lg text-(--color-muted)">{project.summary}</p>
      </div>

      <img
        src={project.cover}
        alt={project.title}
        className="mt-12 aspect-video w-full rounded-lg object-cover"
        data-reveal
      />

      <div className="mt-16 flex flex-col gap-20">
        {project.sections.map((section) => (
          <div key={section.heading} data-reveal>
            <img
              src={section.image}
              alt={section.heading}
              className="aspect-[4/3] w-full rounded-lg object-cover md:aspect-video"
              loading="lazy"
            />
            <h2 className="mt-6 text-2xl font-medium">{section.heading}</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-(--color-muted)">{section.body}</p>
          </div>
        ))}
      </div>

      <nav
        className="mt-24 flex items-center justify-between border-t border-white/10 pt-8"
        data-reveal
      >
        <Link
          to={`/work/${prev.id}`}
          className="text-sm text-(--color-muted) transition-colors hover:text-(--color-fg)"
          data-cursor-hover
        >
          ← {prev.title}
        </Link>
        <Link
          to={`/work/${next.id}`}
          className="text-sm text-(--color-muted) transition-colors hover:text-(--color-fg)"
          data-cursor-hover
        >
          {next.title} →
        </Link>
      </nav>
    </article>
  )
}
