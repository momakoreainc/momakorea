import type { VercelRequest, VercelResponse } from '@vercel/node'
import { isAuthorized } from '../_lib/auth.js'
import { readProjects, writeProjects } from '../_lib/store.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthorized(req)) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  if (req.method === 'GET') {
    const projects = await readProjects()
    res.status(200).json(projects)
    return
  }

  if (req.method === 'PUT') {
    const projects = req.body
    if (!Array.isArray(projects)) {
      res.status(400).json({ error: 'Expected an array of projects' })
      return
    }
    await writeProjects(projects)
    res.status(200).json({ ok: true })
    return
  }

  res.status(405).json({ error: 'Method not allowed' })
}
