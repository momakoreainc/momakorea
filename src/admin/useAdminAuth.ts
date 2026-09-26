import { useCallback, useEffect, useState } from 'react'

export function useAdminAuth() {
  const [authorized, setAuthorized] = useState<boolean | null>(null)

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/session')
      const data = await res.json()
      setAuthorized(Boolean(data.authorized))
    } catch {
      setAuthorized(false)
    }
  }, [])

  useEffect(() => {
    checkSession()
  }, [checkSession])

  const login = useCallback(async (password: string) => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data.error ?? 'Login failed')
    }
    setAuthorized(true)
  }, [])

  const logout = useCallback(async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    setAuthorized(false)
  }, [])

  return { authorized, login, logout }
}
