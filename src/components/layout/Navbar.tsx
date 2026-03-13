'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { NavDrawer } from './NavDrawer'

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [q, setQ] = useState('')

  const isReader = pathname.startsWith('/reader')
  if (isReader) return null

  function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && q.trim()) {
      router.push(`/browse?q=${encodeURIComponent(q.trim())}`)
      setQ('')
    }
  }

  return (
    <nav className="sticky top-0 z-40 bg-paper/95 backdrop-blur-sm border-b border-ink-200 px-5 md:px-8">
      <div className="max-w-[1200px] mx-auto flex items-center gap-4 h-[60px]">

        <Link href="/" className="wordmark font-syne font-black text-[1.1rem] tracking-[0.08em] text-onyx shrink-0 no-underline">
          MANGYX
        </Link>

        {/* Desktop nav links — hidden on mobile */}
        <ul className="hidden md:flex gap-6 list-none">
          {[['/', 'Home'], ['/browse', 'Browse'], ['/library', 'Library']].map(([href, label]) => (
            <li key={href}>
              <Link
                href={href}
                className={`font-syne text-[0.8rem] tracking-[0.05em] no-underline transition-colors
                  ${pathname === href ? 'text-onyx' : 'text-ink-500 hover:text-onyx'}`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Search — pushes hamburger to far right */}
        <div className="ml-auto relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none"
            width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={handleSearch}
            className="pl-7 pr-3 py-1.5 font-cormorant text-[0.9rem] bg-ink-100 border border-transparent
                       outline-none text-ink-950 w-[130px] md:w-[200px] transition-all duration-200
                       focus:border-ink-300 focus:bg-paper placeholder:text-ink-400"
          />
        </div>

        {/* Hamburger — always rightmost */}
        <NavDrawer />

      </div>
    </nav>
  )
}
