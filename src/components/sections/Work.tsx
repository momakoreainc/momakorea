import type { Project } from '../../types'
import { useProjects } from '../../lib/useProjects'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { ProjectCard } from './ProjectCard'

function WorkGrid({ projects }: { projects: Project[] }) {
  const ref = useScrollReveal<HTMLDivElement>({ stagger: 0.15 })

  return (
    <div ref={ref} className="grid grid-cols-1 gap-x-8 gap-y-16 md:grid-cols-2">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}

export function Work() {
  const { projects } = useProjects()

  return (
    <section id="work" className="px-6 py-32 md:px-12">
      <h2 className="mb-16 text-sm tracking-widest text-(--color-muted)">Selected Work</h2>
      {projects && <WorkGrid projects={projects} />}
    </section>
  )
}
