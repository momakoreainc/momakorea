import { useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import type { Project } from '../../types'

type ProjectCardProps = {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const imgRef = useRef<HTMLImageElement>(null)

  const handleEnter = () => {
    gsap.to(imgRef.current, { scale: 1.05, duration: 0.6, ease: 'power3.out' })
  }
  const handleLeave = () => {
    gsap.to(imgRef.current, { scale: 1, duration: 0.6, ease: 'power3.out' })
  }

  return (
    <Link
      to={`/work/${project.id}`}
      className="group block"
      data-reveal
      data-cursor-hover
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div className="overflow-hidden rounded-lg">
        <img
          ref={imgRef}
          src={project.cover}
          alt={project.title}
          className="aspect-[4/3] w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="mt-4 flex items-baseline justify-between">
        <h3 className="text-xl font-medium underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-current">
          {project.title}
        </h3>
        <span className="text-sm text-(--color-muted)">{project.year}</span>
      </div>
      <p className="mt-1 text-sm text-(--color-muted)">
        {project.category} · {project.location}
      </p>
    </Link>
  )
}
