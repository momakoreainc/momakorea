import { put, list } from '@vercel/blob'
import type { Project } from '../../src/types'

const PROJECTS_PATHNAME = 'data/projects.json'

export async function readProjects(): Promise<Project[]> {
  const { blobs } = await list({ prefix: PROJECTS_PATHNAME, limit: 1 })
  const blob = blobs.find((b) => b.pathname === PROJECTS_PATHNAME)
  if (!blob) return []

  const res = await fetch(blob.url, { cache: 'no-store' })
  if (!res.ok) return []
  return res.json()
}

export async function writeProjects(projects: Project[]): Promise<void> {
  await put(PROJECTS_PATHNAME, JSON.stringify(projects, null, 2), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  })
}
