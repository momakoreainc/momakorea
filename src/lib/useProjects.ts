import { useEffect, useState } from 'react'
import type { Project } from '../types'

let cache: Project[] | null = null
let inflight: Promise<Project[]> | null = null

function fetchProjects(): Promise<Project[]> {
  if (cache) return Promise.resolve(cache)
  if (!inflight) {
    inflight = fetch('/api/projects', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load projects: ${res.status}`)
        return res.json() as Promise<Project[]>
      })
      .then((data) => {
        cache = data
        return data
      })
      .finally(() => {
        inflight = null
      })
  }
  return inflight
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[] | null>(cache)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (cache) return
    fetchProjects()
      .then(setProjects)
      .catch(() => setError('Failed to load projects.'))
  }, [])

  return { projects, loading: projects === null && !error, error }
}
