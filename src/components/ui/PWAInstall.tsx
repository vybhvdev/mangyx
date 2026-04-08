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
    <div className="fixed bottom-0 left-0 right-0 z-[100] animate-fade-up">
      <div className="bg-background border-t border-border p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-6 text-center md:text-left">
          <div className="w-14 h-14 bg-accent text-background flex items-center justify-center font-syne font-black text-2xl shrink-0">
            M
          </div>
          <div>
            <p className="font-syne font-bold text-sm uppercase tracking-widest text-foreground">Add to Collection</p>
            <p className="font-cormorant text-base text-text-muted italic">Install Mangyx on your home screen for an immersive reading experience.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            onClick={() => { localStorage.setItem('pwa-dismissed','1'); setShow(false) }} 
            className="flex-1 md:flex-none px-8 py-4 font-syne font-bold text-[10px] uppercase tracking-widest text-text-muted hover:text-foreground transition-colors"
          >
            Later
          </button>
          <button 
            onClick={async () => { await prompt?.prompt(); setShow(false) }} 
            className="flex-1 md:flex-none btn-primary"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  )
}
