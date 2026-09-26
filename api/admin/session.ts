import type { VercelRequest, VercelResponse } from '@vercel/node'
import { isAuthorized } from '../_lib/auth.js'

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ authorized: isAuthorized(req) })
}
