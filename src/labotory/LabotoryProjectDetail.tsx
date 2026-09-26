import { Link, useParams } from 'react-router-dom'
import { projects } from '../data/projects'
import { useScrollReveal } from '../hooks/useScrollReveal'

export function LabotoryProjectDetail() {
  const { slug } = useParams()
  const index = projects.findIndex((p) => p.id === slug)
  const project = projects[index]
  const ref = useScrollReveal<HTMLDivElement>({ start: 'top 95%' })

  if (!project) {
    return (
      <section className="px-6 py-24 md:px-16">
        <p className="text-neutral-500">Project not found.</p>
        <Link to="/" className="mt-4 inline-block text-sm underline">
          ← Back to Work
        </Link>
      </section>
    )
  }

  const prev = projects[(index - 1 + projects.length) % projects.length]
  const next = projects[(index + 1) % projects.length]

  return (
    <article ref={ref} className="px-6 pt-8 pb-16 md:px-16 md:pt-12 md:pb-24">
      <Link
        to="/"
        className="mb-10 inline-block text-sm text-neutral-500 hover:text-neutral-900"
        data-reveal
      >
        ← Back to Work
      </Link>

      <div data-reveal>
        <p className="text-sm text-neutral-500">
          {project.category} · {project.location} · {project.year}
        </p>
        <h1 className="mt-2 text-3xl font-medium tracking-tight md:text-5xl">{project.title}</h1>
        <p className="mt-6 max-w-xl text-neutral-600">{project.summary}</p>
      </div>

      <img
        src={project.cover}
        alt={project.title}
        className="mt-12 aspect-video w-full object-cover"
        data-reveal
      />

      <div className="mt-16 flex flex-col gap-16">
        {project.sections.map((section) => (
          <div key={section.heading} data-reveal>
            <img
              src={section.image}
              alt={section.heading}
              className="aspect-video w-full object-cover"
              loading="lazy"
            />
            <h2 className="mt-6 text-lg font-medium">{section.heading}</h2>
            <p className="mt-2 max-w-2xl text-neutral-600">{section.body}</p>
          </div>
        ))}
      </div>

      <nav
        className="mt-24 flex items-center justify-between border-t border-neutral-200 pt-8 text-sm"
        data-reveal
      >
        <Link to={`/project/${prev.id}`} className="text-neutral-500 hover:text-neutral-900">
          ← {prev.title}
        </Link>
        <Link to={`/project/${next.id}`} className="text-neutral-500 hover:text-neutral-900">
          {next.title} →
        </Link>
      </nav>
    </article>
  )
}
