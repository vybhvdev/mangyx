'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { NavDrawer } from './NavDrawer'
import { DarkModeToggle } from '@/components/ui/DarkModeToggle'

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [q, setQ] = useState('')
  const [provider, setProvider] = useState('mangadex')

  useEffect(() => {
    const match = document.cookie.match(/provider=([^;]+)/)
    if (match?.[1]) setProvider(match[1])
    const interval = setInterval(() => {
      const m = document.cookie.match(/provider=([^;]+)/)
      if (m?.[1]) setProvider(m[1])
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const isReader = pathname.startsWith('/reader')
  if (isReader) return null

  function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && q.trim()) {
      router.push(`/browse?q=${encodeURIComponent(q.trim())}`)
      setQ('')
    }
  }

  return (
    <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-white/5 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center gap-4 h-[64px]">

        <Link href="/" className="font-syne font-black text-xl tracking-tighter text-accent flex items-center gap-1 no-underline">
          MAN<span>GYX</span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex gap-1 ml-4 list-none">
          {[['/', 'Home'], ['/browse', 'Browse'], ['/library', 'Library']].map(([href, label]) => (
            <li key={href}>
              <Link
                href={href}
                className={`px-4 py-2 rounded-full font-bold text-xs tracking-widest uppercase transition-all
                  ${pathname === href ? 'text-white bg-white/10' : 'text-text-muted hover:text-white hover:bg-white/5'}`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Search */}
        <div className="ml-auto relative group">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none group-focus-within:text-accent transition-colors"
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder={`Search ${provider === 'mangapill' ? 'Mangapill' : 'MangaDex'}…`}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={handleSearch}
            className="pl-10 pr-4 py-2 rounded-full bg-surface border border-border
                       outline-none text-foreground w-[140px] sm:w-[200px] md:w-[280px] transition-all duration-300
                       focus:border-accent/50 focus:bg-background focus:w-[180px] sm:focus:w-[240px] md:focus:w-[320px] 
                       placeholder:text-text-muted text-sm font-medium"
          />
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <DarkModeToggle />
          <NavDrawer />
        </div>

      </div>
    </nav>
  )
}
