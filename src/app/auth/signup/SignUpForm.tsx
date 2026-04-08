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

    // Auto-sign in after registration
    await signIn('credentials', { email: email.trim().toLowerCase(), password, redirect: false })
    router.push('/')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-4">Public Username</label>
        <input
          type="text" required minLength={2} maxLength={24}
          value={username} onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g. mangafan"
          className="w-full bg-surface border border-border px-6 py-4 rounded-2xl
                     text-foreground outline-none transition-all duration-300
                     focus:border-accent/50 focus:bg-background placeholder:text-text-muted/50"
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-4">Email Address</label>
        <input
          type="email" required autoComplete="email"
          value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full bg-surface border border-border px-6 py-4 rounded-2xl
                     text-foreground outline-none transition-all duration-300
                     focus:border-accent/50 focus:bg-background placeholder:text-text-muted/50"
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-4">Secure Password</label>
        <input
          type="password" required minLength={8} autoComplete="new-password"
          value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder="Min. 8 characters"
          className="w-full bg-surface border border-border px-6 py-4 rounded-2xl
                     text-foreground outline-none transition-all duration-300
                     focus:border-accent/50 focus:bg-background placeholder:text-text-muted/50"
        />
      </div>

      {error && (
        <div className="px-4 py-3 bg-accent/10 border border-accent/20 rounded-xl">
          <p className="text-xs font-bold text-accent text-center">{error}</p>
        </div>
      )}

      <button
        type="submit" disabled={loading}
        className="btn-primary w-full py-4 text-sm uppercase tracking-widest mt-2 disabled:opacity-50"
      >
        {loading ? (
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <span>Creating Account...</span>
          </div>
        ) : 'Create Account'}
      </button>
    </form>
  )
}
