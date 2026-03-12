'use client'
import { useEffect, useState } from 'react'
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}
export function PWAInstall() {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [show, setShow] = useState(false)
  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) return
    if (localStorage.getItem('pwa-dismissed')) return
    const handler = (e: Event) => {
      e.preventDefault()
      setPrompt(e as BeforeInstallPromptEvent)
      setTimeout(() => setShow(true), 3000)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])
  if (!show) return null
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-onyx text-paper p-4 flex items-center justify-between gap-4">
      <div>
        <p className="font-syne font-bold text-sm">Install Mangyx</p>
        <p className="font-mono text-[0.6rem] tracking-[0.1em] text-ink-300 mt-0.5">Add to home screen for the best experience</p>
      </div>
      <div className="flex gap-3 shrink-0">
        <button onClick={() => { localStorage.setItem('pwa-dismissed','1'); setShow(false) }} className="font-mono text-[0.6rem] uppercase text-ink-400 bg-transparent border-none cursor-pointer">Later</button>
        <button onClick={async () => { await prompt?.prompt(); setShow(false) }} className="font-syne text-[0.7rem] uppercase bg-paper text-onyx px-3 py-1.5 border-none cursor-pointer">Install</button>
      </div>
    </div>
  )
}
