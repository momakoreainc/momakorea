import { createHmac, timingSafeEqual } from 'node:crypto'
import type { VercelRequest } from '@vercel/node'

const COOKIE_NAME = 'admin_session'
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

function base64url(input: Buffer | string) {
  return Buffer.from(input).toString('base64url')
}

function sign(payload: string, secret: string) {
  return createHmac('sha256', secret).update(payload).digest('base64url')
}

export function createSessionToken(): string {
  const secret = requireSecret()
  const payload = base64url(JSON.stringify({ exp: Date.now() + SESSION_TTL_MS }))
  const signature = sign(payload, secret)
  return `${payload}.${signature}`
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false
  const secret = requireSecret()
  const [payload, signature] = token.split('.')
  if (!payload || !signature) return false

  const expected = sign(payload, secret)
  const a = Buffer.from(signature)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false

  try {
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'))
    return typeof exp === 'number' && exp > Date.now()
  } catch {
    return false
  }
}

export function getSessionCookie(req: VercelRequest): string | undefined {
  const raw = req.headers.cookie
  if (!raw) return undefined
  const match = raw.split(';').map((c) => c.trim()).find((c) => c.startsWith(`${COOKIE_NAME}=`))
  return match?.slice(COOKIE_NAME.length + 1)
}

export function setSessionCookieHeader(token: string): string {
  return `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`
}

export function clearSessionCookieHeader(): string {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`
}

export function isAuthorized(req: VercelRequest): boolean {
  return verifySessionToken(getSessionCookie(req))
}

function requireSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is not set')
  return secret
}
