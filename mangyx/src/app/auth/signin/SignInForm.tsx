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
      setError('Invalid email or password.')
    } else {
      router.push(callbackUrl)
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          type="password" required autoComplete="current-password"
          value={password} onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
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
        {loading ? 'Signing in…' : 'Sign In'}
      </button>

      <div className="relative text-center my-2">
        <div className="absolute inset-x-0 top-1/2 h-px bg-ink-200" />
        <span className="relative bg-paper px-3 label-mono">or</span>
      </div>

      <p className="text-center font-cormorant text-[0.9rem] text-ink-500">
        Don&apos;t have an account?{' '}
        <Link href="/auth/signup" className="text-onyx underline underline-offset-2">Sign up</Link>
      </p>
    </form>
  )
}
