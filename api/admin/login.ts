import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createSessionToken, setSessionCookieHeader } from '../_lib/auth.js'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const expected = process.env.ADMIN_PASSWORD
  if (!expected) {
    res.status(500).json({ error: 'Admin password not configured' })
    return
  }

  const { password } = req.body ?? {}
  if (password !== expected) {
    res.status(401).json({ error: 'Invalid password' })
    return
  }

  const token = createSessionToken()
  res.setHeader('Set-Cookie', setSessionCookieHeader(token))
  res.status(200).json({ ok: true })
}
