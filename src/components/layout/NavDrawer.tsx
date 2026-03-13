'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useApp, DJToggle } from '@/components/ui/DJMode'

const GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy',
  'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life',
  'Sports', 'Supernatural', 'Thriller', 'Historical', 'Psychological',
]

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ja', label: 'Japanese' },
  { code: 'ko', label: 'Korean' },
  { code: 'zh', label: 'Chinese' },
  { code: 'fr', label: 'French' },
  { code: 'es', label: 'Spanish' },
]

type Section = 'provider' | 'genre' | 'language' | null

export function NavDrawer() {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<Section>(null)
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const { provider, setProvider } = useApp()

  // Close on route change
  useEffect(() => { setOpen(false) }, [pathname])

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  function toggle(s: Section) {
    setExpanded((v) => (v === s ? null : s))
  }

  function goRandom() {
    const ids = [
      'a1c7c817-4e59-43b7-9365-09675a149a6f', // Berserk
      '32d76d19-8a05-4db0-9fc2-e0b0648fe9d0', // Solo Leveling
      'c0ee660b-f9f2-45c3-8068-5123ff53f84a', // Chainsaw Man
      'f9c33607-9180-4ba6-b85c-e4b5faee7192', // Jujutsu Kaisen
      'e78a489b-6632-4d61-b00b-5206f0a2ed35', // One Punch Man
    ]
    const id = ids[Math.floor(Math.random() * ids.length)]
    router.push(`/manga/${id}`)
    setOpen(false)
  }

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="flex flex-col justify-center items-center gap-[5px] w-9 h-9 bg-transparent border-none cursor-pointer group"
      >
        <span className={`block h-[1.5px] bg-onyx transition-all duration-300 ${open ? 'w-5' : 'w-5'} group-hover:bg-ink-600`} />
        <span className={`block h-[1.5px] bg-onyx transition-all duration-300 w-3.5 group-hover:bg-ink-600`} />
        <span className={`block h-[1.5px] bg-onyx transition-all duration-300 ${open ? 'w-5' : 'w-4'} group-hover:bg-ink-600`} />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-onyx/40 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
          style={{ animation: 'fadeIn 0.2s ease' }}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-[300px] bg-paper border-l border-ink-200 flex flex-col
          transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 h-[60px] border-b border-ink-200 shrink-0">
          <span className="font-syne font-black text-[1rem] tracking-[0.08em] text-onyx">MANGYX</span>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 flex items-center justify-center bg-transparent border-none cursor-pointer text-ink-500 hover:text-onyx transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto py-2">

          {/* Nav links */}
          <div className="px-2 py-2 border-b border-ink-100">
            {[
              { href: '/', label: 'Home', icon: '⌂' },
              { href: '/library', label: 'Library', icon: '◫' },
              { href: '/info', label: 'Info', icon: '◎' },
            ].map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 no-underline transition-colors
                  ${pathname === href ? 'text-onyx' : 'text-ink-600 hover:text-onyx hover:bg-ink-50'}`}
              >
                <span className="font-mono text-[0.8rem] text-ink-400 w-4">{icon}</span>
                <span className="font-syne text-[0.9rem] font-600">{label}</span>
                {pathname === href && (
                  <span className="ml-auto w-1 h-1 bg-onyx rounded-full" />
                )}
              </Link>
            ))}

            {/* Random */}
            <button
              onClick={goRandom}
              className="w-full flex items-center gap-3 px-4 py-3 bg-transparent border-none cursor-pointer text-ink-600 hover:text-onyx hover:bg-ink-50 transition-colors text-left"
            >
              <span className="font-mono text-[0.8rem] text-ink-400 w-4">⚄</span>
              <span className="font-syne text-[0.9rem]">Random</span>
            </button>
          </div>

          {/* Provider */}
          <div className="border-b border-ink-100">
            <button
              onClick={() => toggle('provider')}
              className="w-full flex items-center gap-3 px-6 py-4 bg-transparent border-none cursor-pointer hover:bg-ink-50 transition-colors"
            >
              <span className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-ink-400 flex-1 text-left">Provider</span>
              <span className="font-syne text-[0.8rem] text-ink-600 mr-2">
                {provider === 'mangadex' ? 'MangaDex' : 'Mangapill'}
              </span>
              <svg
                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                className={`text-ink-400 transition-transform duration-200 ${expanded === 'provider' ? 'rotate-180' : ''}`}
              >
                <polyline points="6,9 12,15 18,9"/>
              </svg>
            </button>
            {expanded === 'provider' && (
              <div className="pb-2 px-4">
                {[
                  { id: 'mangadex' as const, label: 'MangaDex', desc: 'Official scanlations' },
                  { id: 'mangapill' as const, label: 'Mangapill', desc: 'Wide selection + doujinshi' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { setProvider(p.id); setExpanded(null) }}
                    className={`w-full text-left px-3 py-2.5 border-none cursor-pointer transition-colors flex items-center gap-3
                      ${provider === p.id ? 'bg-onyx text-paper' : 'bg-transparent text-ink-700 hover:bg-ink-100'}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${provider === p.id ? 'bg-paper' : 'bg-ink-300'}`} />
                    <div>
                      <p className="font-syne text-[0.8rem] font-semibold">{p.label}</p>
                      <p className={`font-mono text-[0.6rem] ${provider === p.id ? 'text-ink-300' : 'text-ink-400'}`}>{p.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Genre */}
          <div className="border-b border-ink-100">
            <button
              onClick={() => toggle('genre')}
              className="w-full flex items-center gap-3 px-6 py-4 bg-transparent border-none cursor-pointer hover:bg-ink-50 transition-colors"
            >
              <span className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-ink-400 flex-1 text-left">Genre</span>
              <svg
                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                className={`text-ink-400 transition-transform duration-200 ${expanded === 'genre' ? 'rotate-180' : ''}`}
              >
                <polyline points="6,9 12,15 18,9"/>
              </svg>
            </button>
            {expanded === 'genre' && (
              <div className="pb-3 px-4 flex flex-wrap gap-2">
                {GENRES.map((g) => (
                  <button
                    key={g}
                    onClick={() => {
                      router.push(`/browse?q=${encodeURIComponent(g)}`)
                      setOpen(false)
                    }}
                    className="font-mono text-[0.6rem] tracking-[0.1em] uppercase border border-ink-300 text-ink-600
                               px-2.5 py-1 bg-transparent cursor-pointer hover:bg-onyx hover:text-paper hover:border-onyx transition-colors"
                  >
                    {g}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language */}
          <div className="border-b border-ink-100">
            <button
              onClick={() => toggle('language')}
              className="w-full flex items-center gap-3 px-6 py-4 bg-transparent border-none cursor-pointer hover:bg-ink-50 transition-colors"
            >
              <span className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-ink-400 flex-1 text-left">Language</span>
              <svg
                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                className={`text-ink-400 transition-transform duration-200 ${expanded === 'language' ? 'rotate-180' : ''}`}
              >
                <polyline points="6,9 12,15 18,9"/>
              </svg>
            </button>
            {expanded === 'language' && (
              <div className="pb-2 px-4">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      router.push(`/browse?lang=${l.code}`)
                      setOpen(false)
                    }}
                    className="w-full text-left px-3 py-2.5 border-none bg-transparent cursor-pointer text-ink-700
                               hover:bg-ink-100 transition-colors font-syne text-[0.82rem]"
                  >
                    {l.label}
                    <span className="font-mono text-[0.6rem] text-ink-400 ml-2 uppercase">{l.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DJ Mode */}
          <div className="px-6 py-4 border-b border-ink-100 flex items-center justify-between">
            <div>
              <p className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-ink-400">DJ Mode</p>
              <p className="font-cormorant text-[0.85rem] text-ink-500 mt-0.5">Doujinshi content</p>
            </div>
            <DJToggle />
          </div>

        </div>

        {/* Drawer footer - Auth + Info */}
        <div className="shrink-0 border-t border-ink-200 px-6 py-4 flex items-center justify-between">
          {session ? (
            <div>
              <p className="font-syne text-[0.8rem] text-onyx font-semibold">{session.user?.name}</p>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="font-mono text-[0.6rem] tracking-[0.1em] uppercase text-ink-400 hover:text-onyx bg-transparent border-none cursor-pointer p-0 mt-0.5 transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="font-syne text-[0.8rem] text-ink-600 hover:text-onyx no-underline transition-colors"
            >
              Sign in
            </Link>
          )}
          <Link
            href="/info"
            className="font-mono text-[0.6rem] tracking-[0.15em] uppercase text-ink-400 hover:text-onyx no-underline transition-colors"
          >
            v1.0
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
      `}</style>
    </>
  )
}
