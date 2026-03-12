'use client'

import Link from 'next/link'
import { DJToggle } from '@/components/ui/DJMode'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const [q, setQ] = useState('')

  const isReader = pathname.startsWith('/reader')

  function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && q.trim()) {
      router.push(`/browse?q=${encodeURIComponent(q.trim())}`)
      setQ('')
    }
  }

  if (isReader) return null

  return (
    <nav className="sticky top-0 z-50 bg-paper/95 backdrop-blur-sm border-b border-ink-200 px-8">
      <div className="max-w-[1200px] mx-auto flex items-center gap-6 h-[60px]">

        <Link href="/" className="font-syne font-black text-[1.1rem] tracking-[0.05em] text-onyx shrink-0 wordmark">
          MANGYX
        </Link>

        <ul className="flex gap-6 list-none">
          {[['/', 'Home'], ['/browse', 'Browse'], ['/library', 'Library']].map(([href, label]) => (
            <li key={href}>
              <Link
                href={href}
                className={`font-syne text-[0.8rem] tracking-[0.05em] no-underline transition-colors duration-150
                  ${pathname === href ? 'text-onyx' : 'text-ink-500 hover:text-onyx'}`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Search */}
        <div className="ml-auto relative hidden sm:block">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none"
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search manga…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={handleSearch}
            className="pl-8 pr-4 py-2 font-cormorant text-[0.9rem] bg-ink-100 border border-transparent
                       outline-none text-ink-950 w-[220px] transition-all duration-200
                       focus:border-ink-300 focus:bg-paper placeholder:text-ink-400"
          />
        </div>

        {/* DJ Mode toggle */}
        <DJToggle />

        {/* Auth */}
        {session ? (
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="font-syne text-[0.75rem] tracking-[0.1em] uppercase text-ink-500 hover:text-onyx transition-colors shrink-0"
          >
            {session.user?.name ?? 'Sign out'}
          </button>
        ) : (
          <Link
            href="/auth/signin"
            className="font-syne text-[0.75rem] tracking-[0.1em] uppercase text-ink-500 hover:text-onyx transition-colors shrink-0 no-underline"
          >
            Sign in
          </Link>
        )}

      </div>
    </nav>
  )
}
