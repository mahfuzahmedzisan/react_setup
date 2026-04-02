import * as React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '@/auth/useAuth'
import { request } from '@/api/request'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

type LoginResponse = {
  access_token?: string
  token?: string
}

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setToken } = useAuth()

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await request.post<LoginResponse>('/auth/login', { email, password })
      const token = res.data.access_token ?? res.data.token
      if (!token) throw new Error('Login did not return an access token.')
      setToken(token)
      const from = (location.state as { from?: { pathname?: string } } | null)
        ?.from?.pathname
      navigate(from || '/account', { replace: true })
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Login failed. Please try again.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-5xl items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Use your store account. (Endpoint assumed: <code>/auth/login</code>)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            {error ? (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            ) : null}
            <Button className="w-full" disabled={loading} type="submit">
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

