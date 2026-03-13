'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export type Provider = 'mangadex' | 'mangapill'

interface AppContext {
  dj: boolean
  toggleDJ: () => void
  provider: Provider
  setProvider: (p: Provider) => void
}

const Ctx = createContext<AppContext>({
  dj: false, toggleDJ: () => {},
  provider: 'mangadex', setProvider: () => {},
})

export function DJProvider({ children }: { children: React.ReactNode }) {
  const [dj, setDJ] = useState(false)
  const [provider, setProviderState] = useState<Provider>('mangadex')
  const router = useRouter()

  useEffect(() => {
    const savedDJ = document.cookie.includes('dj-mode=1')
    const savedProvider = document.cookie.match(/provider=([^;]+)/)?.[1] as Provider
    if (savedDJ) setDJ(true)
    if (savedProvider) setProviderState(savedProvider)
  }, [])

  useEffect(() => {
    if (dj) {
      document.documentElement.classList.add('dj')
      document.cookie = 'dj-mode=1; path=/; max-age=31536000'
    } else {
      document.documentElement.classList.remove('dj')
      document.cookie = 'dj-mode=0; path=/; max-age=31536000'
    }
    router.refresh()
  }, [dj])

  function toggleDJ() { setDJ((v) => !v) }

  function setProvider(p: Provider) {
    setProviderState(p)
    document.cookie = `provider=${p}; path=/; max-age=31536000`
    router.refresh()
  }

  return (
    <Ctx.Provider value={{ dj, toggleDJ, provider, setProvider }}>
      {children}
    </Ctx.Provider>
  )
}

export function useApp() { return useContext(Ctx) }

// Keep useDJ for backwards compat
export function useDJ() {
  const { dj, toggleDJ } = useContext(Ctx)
  return { dj, toggle: toggleDJ }
}

export function DJToggle() {
  const { dj, toggleDJ } = useApp()
  return (
    <button
      onClick={toggleDJ}
      className={`font-mono text-[0.65rem] tracking-[0.2em] uppercase border px-3 py-1.5 transition-all cursor-pointer ${
        dj
          ? 'bg-[#b44fff] text-white border-[#b44fff]'
          : 'border-ink-300 text-ink-500 bg-transparent hover:bg-ink-100'
      }`}
    >
      {dj ? '● DJ' : '○ DJ'}
    </button>
  )
}

export function ProviderSelector() {
  const { provider, setProvider } = useApp()
  const [open, setOpen] = useState(false)

  const providers: { id: Provider; label: string; desc: string }[] = [
    { id: 'mangadex', label: 'MangaDex', desc: 'Official scanlations, English only' },
    { id: 'mangapill', label: 'Mangapill', desc: 'Wide selection including doujinshi' },
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="font-mono text-[0.65rem] tracking-[0.15em] uppercase border border-ink-300 text-ink-500 bg-transparent hover:bg-ink-100 px-3 py-1.5 transition-all cursor-pointer flex items-center gap-2"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
        {providers.find((p) => p.id === provider)?.label}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="6,9 12,15 18,9"/>
        </svg>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          {/* Dropdown */}
          <div className="absolute right-0 top-full mt-2 z-50 bg-paper border border-ink-200 min-w-[200px] shadow-sm">
            <p className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-ink-400 px-4 pt-3 pb-2 border-b border-ink-100">
              Data Source
            </p>
            {providers.map((p) => (
              <button
                key={p.id}
                onClick={() => { setProvider(p.id); setOpen(false) }}
                className={`w-full text-left px-4 py-3 transition-colors cursor-pointer border-none bg-transparent border-b border-ink-100 last:border-0 ${
                  provider === p.id ? 'bg-ink-100' : 'hover:bg-ink-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  {provider === p.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  )}
                  <span className="font-syne text-[0.8rem] font-semibold text-onyx">{p.label}</span>
                </div>
                <p className="font-mono text-[0.6rem] text-ink-400 ml-3.5">{p.desc}</p>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
