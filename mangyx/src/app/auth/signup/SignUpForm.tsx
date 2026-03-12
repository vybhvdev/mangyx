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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="label-mono block mb-1.5">Username</label>
        <input
          type="text" required minLength={2} maxLength={24}
          value={username} onChange={(e) => setUsername(e.target.value)}
          placeholder="mangareader"
          className="w-full border border-ink-300 px-4 py-3 font-cormorant text-base outline-none
                     bg-paper text-ink-950 transition-colors focus:border-onyx placeholder:text-ink-400"
        />
      </div>
      <div>
        <label className="label-mono block mb-1.5">Email</label>
        <input
          type="email" required autoComplete="email"
          value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full border border-ink-300 px-4 py-3 font-cormorant text-base outline-none
                     bg-paper text-ink-950 transition-colors focus:border-onyx placeholder:text-ink-400"
        />
      </div>
      <div>
        <label className="label-mono block mb-1.5">Password</label>
        <input
          type="password" required minLength={8} autoComplete="new-password"
          value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder="Min. 8 characters"
          className="w-full border border-ink-300 px-4 py-3 font-cormorant text-base outline-none
                     bg-paper text-ink-950 transition-colors focus:border-onyx placeholder:text-ink-400"
        />
      </div>

      {error && (
        <p className="font-mono text-[0.65rem] tracking-[0.1em] text-red-700">{error}</p>
      )}

      <button
        type="submit" disabled={loading}
        className="btn-primary text-center w-full mt-1 disabled:opacity-60"
      >
        {loading ? 'Creating account…' : 'Create Account'}
      </button>
    </form>
  )
}
