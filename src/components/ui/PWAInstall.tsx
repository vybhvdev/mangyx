'use client'

import { useState, useEffect } from 'react'

export function PWAInstall() {
  const [prompt, setPrompt] = useState<any>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault()
      setPrompt(e)
      if (!localStorage.getItem('pwa-dismissed')) {
        setShow(true)
      }
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!show) return null

  return (
    <div className="fixed bottom-6 left-4 right-4 z-[100] animate-fade-up">
      <div className="max-w-md mx-auto bg-surface/90 backdrop-blur-2xl border border-white/10 p-5 rounded-[2rem] shadow-2xl flex items-center justify-between gap-6">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center font-syne font-black text-white text-xl shadow-lg shadow-accent/20 shrink-0">
            M
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm text-white truncate">Install Mangyx</p>
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest truncate">Add to home screen</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={() => { localStorage.setItem('pwa-dismissed','1'); setShow(false) }} 
            className="p-3 text-text-muted hover:text-white transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          <button 
            onClick={async () => { await prompt?.prompt(); setShow(false) }} 
            className="bg-accent text-white px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-accent/20 hover:bg-accent-hover transition-all"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  )
}
