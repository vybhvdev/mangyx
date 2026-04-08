'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function SignUpForm() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true)

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.trim(), email: email.trim().toLowerCase(), password }),
    })

    if (!res.ok) {
      const { error: msg } = await res.json()
      setError(msg ?? 'Something went wrong.')
      setLoading(false)
      return
    }

    await signIn('credentials', { email: email.trim().toLowerCase(), password, redirect: false })
    router.push('/')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Username</label>
          <input
            type="text" required minLength={2} maxLength={24}
            value={username} onChange={(e) => setUsername(e.target.value)}
            placeholder="DISPLAY NAME"
            className="w-full bg-transparent border-b border-border py-4
                       text-foreground outline-none transition-all duration-300
                       focus:border-accent placeholder:text-text-muted/30 font-syne font-bold text-[11px] uppercase tracking-widest"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Email Address</label>
          <input
            type="email" required autoComplete="email"
            value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-transparent border-b border-border py-4
                       text-foreground outline-none transition-all duration-300
                       focus:border-accent placeholder:text-text-muted/30 font-syne font-bold text-[11px] uppercase tracking-widest"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Password</label>
          <input
            type="password" required minLength={8} autoComplete="new-password"
            value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 8 characters"
            className="w-full bg-transparent border-b border-border py-4
                       text-foreground outline-none transition-all duration-300
                       focus:border-accent placeholder:text-text-muted/30 font-syne font-bold text-[11px] uppercase tracking-widest"
          />
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 border border-accent/20 bg-accent/5">
          <p className="text-[10px] font-bold text-accent text-center uppercase tracking-widest">{error}</p>
        </div>
      )}

      <button
        type="submit" disabled={loading}
        className="btn-primary w-full py-5 disabled:opacity-50"
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  )
}
