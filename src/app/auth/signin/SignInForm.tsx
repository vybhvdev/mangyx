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
      setError('The credentials you entered are incorrect.')
    } else {
      router.push(callbackUrl)
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Email Address</label>
          <input
            type="email" required autoComplete="email"
            value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="ENTER YOUR EMAIL"
            className="w-full bg-transparent border-b border-border py-4
                       text-foreground outline-none transition-all duration-300
                       focus:border-accent placeholder:text-text-muted/30 font-syne font-bold text-[11px] uppercase tracking-widest"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">Password</label>
          <input
            type="password" required autoComplete="current-password"
            value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
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
        {loading ? 'Authenticating...' : 'Sign In'}
      </button>

      <p className="text-center font-cormorant text-base text-text-muted italic">
        New to the platform?{' '}
        <Link href="/auth/signup" className="text-foreground hover:text-accent font-bold not-italic transition-colors underline underline-offset-4">Create an account</Link>
      </p>
    </form>
  )
}
