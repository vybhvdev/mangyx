'use client'
import { useEffect, useState } from 'react'

export function DarkModeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
      setDark(true)
    }
  }, [])

  function toggle() {
    const isDark = document.documentElement.classList.toggle('dark')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
    setDark(isDark)
  }

  return (
    <button
      onClick={toggle}
      className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-ink-400 hover:text-onyx transition-colors bg-transparent border-none cursor-pointer px-2"
      aria-label="Toggle dark mode"
    >
      {dark ? '☀' : '☾'}
    </button>
  )
}
