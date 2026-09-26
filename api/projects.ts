import type { VercelRequest, VercelResponse } from '@vercel/node'
import { readProjects } from './_lib/store.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const projects = await readProjects()
  res.setHeader('Cache-Control', 'no-store')
  res.status(200).json(projects)
}
