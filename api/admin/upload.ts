import type { VercelRequest, VercelResponse } from '@vercel/node'
import { put } from '@vercel/blob'
import { isAuthorized } from '../_lib/auth'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isAuthorized(req)) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const { filename, dataUrl } = req.body ?? {}
  if (!filename || typeof dataUrl !== 'string') {
    res.status(400).json({ error: 'filename and dataUrl are required' })
    return
  }

  const match = dataUrl.match(/^data:(.+);base64,(.*)$/)
  if (!match) {
    res.status(400).json({ error: 'dataUrl must be a base64 data URL' })
    return
  }
  const [, contentType, base64] = match
  const buffer = Buffer.from(base64, 'base64')

  const blob = await put(`images/${filename}`, buffer, {
    access: 'public',
    contentType,
    addRandomSuffix: true,
  })

  res.status(200).json({ url: blob.url })
}
