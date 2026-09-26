import type { Project } from '../types'

async function parseError(res: Response): Promise<string> {
  const data = await res.json().catch(() => ({}))
  return data.error ?? `Request failed (${res.status})`
}

export async function fetchAdminProjects(): Promise<Project[]> {
  const res = await fetch('/api/admin/projects')
  if (!res.ok) throw new Error(await parseError(res))
  return res.json()
}

export async function saveAdminProjects(projects: Project[]): Promise<void> {
  const res = await fetch('/api/admin/projects', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(projects),
  })
  if (!res.ok) throw new Error(await parseError(res))
}

export async function uploadImage(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })

  const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '-')}`
  const res = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename, dataUrl }),
  })
  if (!res.ok) throw new Error(await parseError(res))
  const data = await res.json()
  return data.url
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
