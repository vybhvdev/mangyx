'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const DJContext = createContext<{ dj: boolean; toggle: () => void }>({ dj: false, toggle: () => {} })

export function DJProvider({ children }: { children: React.ReactNode }) {
  const [dj, setDJ] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('dj-mode')
    if (saved === '1') setDJ(true)
  }, [])

  useEffect(() => {
    if (dj) {
      document.documentElement.classList.add('dj')
      localStorage.setItem('dj-mode', '1')
    } else {
      document.documentElement.classList.remove('dj')
      localStorage.setItem('dj-mode', '0')
    }
  }, [dj])

  function toggle() { setDJ((v) => !v) }

  return <DJContext.Provider value={{ dj, toggle }}>{children}</DJContext.Provider>
}

export function useDJ() { return useContext(DJContext) }

export function DJToggle() {
  const { dj, toggle } = useDJ()
  return (
    <button
      onClick={toggle}
      className={`font-mono text-[0.65rem] tracking-[0.2em] uppercase border px-3 py-1.5 transition-all cursor-pointer ${
        dj
          ? 'bg-dj-accent text-dj-bg border-dj-accent'
          : 'border-ink-300 text-ink-500 bg-transparent hover:bg-ink-100'
      }`}
    >
      {dj ? '● DJ MODE' : '○ DJ MODE'}
    </button>
  )
}
