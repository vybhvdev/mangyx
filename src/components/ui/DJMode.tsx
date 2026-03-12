'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const DJContext = createContext<{ dj: boolean; toggle: () => void }>({ dj: false, toggle: () => {} })

export function DJProvider({ children }: { children: React.ReactNode }) {
  const [dj, setDJ] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const saved = document.cookie.includes('dj-mode=1') || localStorage.getItem('dj-mode') === '1'
    if (saved) setDJ(true)
  }, [])

  useEffect(() => {
    if (dj) {
      document.documentElement.classList.add('dj')
      localStorage.setItem('dj-mode', '1')
      document.cookie = 'dj-mode=1; path=/; max-age=31536000'
    } else {
      document.documentElement.classList.remove('dj')
      localStorage.setItem('dj-mode', '0')
      document.cookie = 'dj-mode=0; path=/; max-age=31536000'
    }
    router.refresh() // re-fetch server components with new cookie
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
          ? 'bg-[#b44fff] text-white border-[#b44fff]'
          : 'border-ink-300 text-ink-500 bg-transparent hover:bg-ink-100'
      }`}
    >
      {dj ? '● DJ MODE' : '○ DJ MODE'}
    </button>
  )
}
