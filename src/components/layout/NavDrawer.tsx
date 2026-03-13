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

  const chevron = (expanded: boolean) => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#a89e8c" strokeWidth="2"
      style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
      <polyline points="6,9 12,15 18,9"/>
    </svg>
  )

  return createPortal(
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 998,
        background: 'rgba(17,16,16,0.45)', backdropFilter: 'blur(2px)',
        opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity 0.3s ease',
      }} />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: '300px', zIndex: 999,
        background: '#f5f2ec', borderLeft: '1px solid #ddd9ce',
        display: 'flex', flexDirection: 'column',
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.32,0.72,0,1)',
      }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.5rem', height: '60px', borderBottom: '1px solid #ddd9ce', flexShrink: 0 }}>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1rem', letterSpacing: '0.08em', color: '#111010' }}>MANGYX</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8f8270', padding: '0.25rem' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto' }}>

          {/* Nav links */}
          <div style={{ borderBottom: '1px solid #eeece6', padding: '0.5rem 0' }}>
            {[
              { href: '/', label: 'Home', icon: '⌂' },
              { href: '/browse', label: 'Browse', icon: '⊞' },
              { href: '/library', label: 'Library', icon: '◫' },
            ].map(({ href, label, icon }) => (
              <Link key={href} href={href} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.75rem 1.5rem', textDecoration: 'none',
                color: pathname === href ? '#111010' : '#756a5a',
                fontFamily: 'Syne, sans-serif', fontSize: '0.9rem', fontWeight: 600,
              }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: '#a89e8c', width: '1rem' }}>{icon}</span>
                {label}
                {pathname === href && <span style={{ marginLeft: 'auto', width: '5px', height: '5px', background: '#111010', borderRadius: '50%' }} />}
              </Link>
            ))}
            <button onClick={goRandom} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.75rem 1.5rem', background: 'none', border: 'none',
              cursor: 'pointer', color: '#756a5a', fontFamily: 'Syne, sans-serif',
              fontSize: '0.9rem', fontWeight: 600, textAlign: 'left',
            }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: '#a89e8c', width: '1rem' }}>⚄</span>
              Random
            </button>
          </div>

          {/* Provider */}
          <div style={{ borderBottom: '1px solid #eeece6' }}>
            <button onClick={() => toggle('provider')} style={{
              width: '100%', display: 'flex', alignItems: 'center',
              padding: '1rem 1.5rem', background: 'none', border: 'none', cursor: 'pointer',
            }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#a89e8c', flex: 1, textAlign: 'left' }}>Provider</span>
              <span style={{ fontFamily: 'Syne, sans-serif', fontSize: '0.75rem', color: '#5e5448', marginRight: '0.5rem' }}>{provider === 'mangadex' ? 'MangaDex' : 'Mangapill'}</span>
              {chevron(expanded === 'provider')}
            </button>
            {expanded === 'provider' && (
              <div style={{ padding: '0 1rem 0.75rem' }}>
                {([
                  { id: 'mangadex', label: 'MangaDex', desc: 'Official scanlations · English' },
                  { id: 'mangapill', label: 'Mangapill', desc: 'Wide selection · All languages' },
                ] as const).map(p => (
                  <button key={p.id} onClick={() => { setProvider(p.id); setExpanded(null) }}
                    style={{ width: '100%', textAlign: 'left', padding: '0.625rem 0.75rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem', background: provider === p.id ? '#111010' : 'transparent', color: provider === p.id ? '#f5f2ec' : '#5e5448', transition: 'all 0.15s' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: provider === p.id ? '#f5f2ec' : '#c5bfb0', flexShrink: 0 }} />
                    <div>
                      <p style={{ fontFamily: 'Syne, sans-serif', fontSize: '0.8rem', fontWeight: 600, margin: 0 }}>{p.label}</p>
                      <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', color: provider === p.id ? '#c5bfb0' : '#a89e8c', margin: 0 }}>{p.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Genre */}
          <div style={{ borderBottom: '1px solid #eeece6' }}>
            <button onClick={() => toggle('genre')} style={{
              width: '100%', display: 'flex', alignItems: 'center',
              padding: '1rem 1.5rem', background: 'none', border: 'none', cursor: 'pointer',
            }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#a89e8c', flex: 1, textAlign: 'left' }}>Genre</span>
              {chevron(expanded === 'genre')}
            </button>
            {expanded === 'genre' && (
              <div style={{ padding: '0 1rem 1rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {GENRES.map(g => (
                  <button key={g} onClick={() => { router.push(`/browse?q=${encodeURIComponent(g)}`); onClose() }}
                    style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', border: '1px solid #c5bfb0', color: '#756a5a', padding: '0.25rem 0.625rem', background: 'transparent', cursor: 'pointer', transition: 'all 0.15s' }}>
                    {g}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language */}
          <div style={{ borderBottom: '1px solid #eeece6' }}>
            <button onClick={() => toggle('language')} style={{
              width: '100%', display: 'flex', alignItems: 'center',
              padding: '1rem 1.5rem', background: 'none', border: 'none', cursor: 'pointer',
            }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#a89e8c', flex: 1, textAlign: 'left' }}>Language</span>
              {chevron(expanded === 'language')}
            </button>
            {expanded === 'language' && (
              <div style={{ paddingBottom: '0.5rem' }}>
                {LANGUAGES.map(l => (
                  <button key={l.code} onClick={() => { router.push(`/browse?lang=${l.code}`); onClose() }}
                    style={{ width: '100%', textAlign: 'left', padding: '0.625rem 1.5rem', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontSize: '0.82rem', color: '#5e5448', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {l.label}
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', color: '#a89e8c', textTransform: 'uppercase' }}>{l.code}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* International link */}
          <div style={{ borderBottom: '1px solid #eeece6' }}>
            <Link href="/browse?lang=international" onClick={onClose} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '1rem 1.5rem', textDecoration: 'none',
              color: '#756a5a', fontFamily: 'Syne, sans-serif', fontSize: '0.9rem', fontWeight: 600,
            }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: '#a89e8c', width: '1rem' }}>⊕</span>
              International
            </Link>
          </div>

        </div>

        {/* Footer */}
        <div style={{ flexShrink: 0, borderTop: '1px solid #ddd9ce', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {session ? (
            <div>
              <p style={{ fontFamily: 'Syne, sans-serif', fontSize: '0.8rem', fontWeight: 600, color: '#111010', margin: 0 }}>{session.user?.name}</p>
              <button onClick={() => signOut({ callbackUrl: '/' })} style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#a89e8c', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: '0.2rem' }}>
                Sign out
              </button>
            </div>
          ) : (
            <Link href="/auth/signin" style={{ fontFamily: 'Syne, sans-serif', fontSize: '0.82rem', color: '#756a5a', textDecoration: 'none' }}>
              Sign in
            </Link>
          )}
          <Link href="/info" style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#a89e8c', textDecoration: 'none' }}>
            Info
          </Link>
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
      <button onClick={() => setOpen(true)} aria-label="Open menu"
        style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', gap: '5px', width: '36px', height: '36px', background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px' }}>
        <span style={{ display: 'block', height: '1.5px', width: '20px', background: '#111010' }} />
        <span style={{ display: 'block', height: '1.5px', width: '14px', background: '#111010' }} />
        <span style={{ display: 'block', height: '1.5px', width: '17px', background: '#111010' }} />
      </button>
      {mounted && <DrawerPortal open={open} onClose={() => setOpen(false)} />}
    </>
  )
}
