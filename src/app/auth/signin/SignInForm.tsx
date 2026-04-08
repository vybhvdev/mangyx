'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await signIn('credentials', {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
    })

    setLoading(false)
    if (res?.error) {
      setError('The email or password you entered is incorrect.')
    } else {
      router.push(callbackUrl)
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-4">Email Address</label>
        <input
          type="email" required autoComplete="email"
          value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full bg-surface border border-border px-6 py-4 rounded-2xl
                     text-foreground outline-none transition-all duration-300
                     focus:border-accent/50 focus:bg-background placeholder:text-text-muted/50"
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted ml-4">Password</label>
        <input
          type="password" required autoComplete="current-password"
          value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
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
            <span>Authenticating...</span>
          </div>
        ) : 'Sign In'}
      </button>

      <div className="relative flex items-center justify-center my-4">
        <div className="absolute inset-x-0 h-px bg-white/5" />
        <span className="relative bg-[#121214] px-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">or</span>
      </div>

      <p className="text-center text-sm font-medium text-text-muted">
        New to Mangyx?{' '}
        <Link href="/auth/signup" className="text-accent hover:text-accent-hover font-bold transition-colors">Create account</Link>
      </p>
    </form>
  )
}
