'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useProvider } from '@/components/ui/ProviderContext'

const GENRES = [
  'Action','Adventure','Comedy','Drama','Fantasy',
  'Horror','Mystery','Romance','Sci-Fi','Slice of Life',
  'Sports','Supernatural','Thriller','Historical','Psychological',
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

function DrawerPortal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<Section>(null)
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const { provider, setProvider } = useProvider()

  useEffect(() => { onClose() }, [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  function toggle(s: Section) { setExpanded(v => v === s ? null : s) }

  function goRandom() {
    const ids = [
      'a1c7c817-4e59-43b7-9365-09675a149a6f',
      '32d76d19-8a05-4db0-9fc2-e0b0648fe9d0',
      'c0ee660b-f9f2-45c3-8068-5123ff53f84a',
      'f9c33607-9180-4ba6-b85c-e4b5faee7192',
      'e78a489b-6632-4d61-b00b-5206f0a2ed35',
    ]
    router.push(`/manga/${ids[Math.floor(Math.random() * ids.length)]}`)
  }

  return createPortal(
    <>
      <div 
        onClick={onClose} 
        className={`fixed inset-0 z-[998] bg-[#221e19]/40 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />

      <div className={`fixed top-0 right-0 bottom-0 w-[300px] z-[999] bg-background border-l border-border flex flex-col transition-transform duration-400 cubic-bezier(0.16, 1, 0.3, 1) ${open ? 'translate-x-0' : 'translate-x-full'}`}>

        <div className="flex items-center justify-between px-6 h-[64px] border-b border-border shrink-0">
          <span className="font-syne font-black text-lg tracking-tighter text-foreground">DIRECTORY</span>
          <button onClick={onClose} className="p-2 hover:bg-surface rounded-none transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 no-scrollbar">
          <div className="px-3 mb-6">
            {[
              { href: '/', label: 'Home', icon: <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/> },
              { href: '/browse', label: 'Browse', icon: <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/> },
              { href: '/library', label: 'Library', icon: <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/> },
            ].map(({ href, label, icon }) => (
              <Link key={href} href={href} className={`flex items-center gap-4 px-4 py-3 font-syne font-bold text-[10px] tracking-[0.2em] uppercase transition-all ${pathname === href ? 'text-accent bg-surface' : 'text-text-muted hover:text-foreground hover:bg-surface'}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">{icon}</svg>
                {label}
              </Link>
            ))}
            <button onClick={goRandom} className="w-full flex items-center gap-4 px-4 py-3 font-syne font-bold text-[10px] tracking-[0.2em] uppercase text-text-muted hover:text-foreground hover:bg-surface transition-all text-left">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 8h.01M8 8h.01M8 16h.01M16 16h.01M12 12h.01"/>
              </svg>
              Random
            </button>
          </div>

          <div className="h-px bg-border mx-6 mb-6" />

          <div className="px-3 space-y-1">
            <div>
              <button onClick={() => toggle('provider')} className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface transition-all">
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Source</span>
                <span className="text-[10px] font-bold text-foreground uppercase">{provider}</span>
              </button>
              {expanded === 'provider' && (
                <div className="p-2 space-y-1">
                  {([
                    { id: 'mangadex', label: 'MangaDex' },
                    { id: 'mangapill', label: 'Mangapill' },
                  ] as const).map(p => (
                    <button key={p.id} onClick={() => { setProvider(p.id); setExpanded(null) }}
                      className={`w-full text-left p-3 font-syne font-bold text-[10px] uppercase tracking-widest transition-all ${provider === p.id ? 'bg-accent text-background' : 'bg-surface/50 hover:bg-surface text-foreground'}`}>
                      {p.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <button onClick={() => toggle('genre')} className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface transition-all">
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Genres</span>
                <svg className={`transition-transform duration-200 ${expanded === 'genre' ? 'rotate-180' : ''}`} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m6 9 6 6 6-9"/></svg>
              </button>
              {expanded === 'genre' && (
                <div className="p-2 flex flex-wrap gap-2">
                  {GENRES.map(g => (
                    <button key={g} onClick={() => { router.push(`/browse?q=${encodeURIComponent(g)}`); onClose() }}
                      className="px-3 py-1.5 border border-border text-[9px] font-bold text-text-muted hover:border-accent hover:text-accent transition-all uppercase tracking-wider">
                      {g}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border bg-surface/20">
          {session ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-foreground uppercase tracking-widest">{session.user?.name}</p>
                <button onClick={() => signOut({ callbackUrl: '/' })} className="text-[9px] font-bold text-text-muted uppercase tracking-widest mt-2 hover:text-accent transition-colors">
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <Link href="/auth/signin" className="btn-primary w-full text-center py-3">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </>,
    document.body
  )
}

export function NavDrawer() {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  return (
    <>
      <button 
        onClick={() => setOpen(true)} 
        aria-label="Open menu"
        className="flex flex-col justify-center items-end gap-1.5 w-10 h-10 hover:bg-surface transition-all p-2.5 group"
      >
        <span className="block h-px w-5 bg-foreground" />
        <span className="block h-px w-3 bg-foreground" />
        <span className="block h-px w-4 bg-foreground" />
      </button>
      {mounted && <DrawerPortal open={open} onClose={() => setOpen(false)} />}
    </>
  )
}
