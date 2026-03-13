'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export type Provider = 'mangadex' | 'mangapill'

const Ctx = createContext<{ provider: Provider; setProvider: (p: Provider) => void }>({
  provider: 'mangadex', setProvider: () => {}
})

export function ProviderProvider({ children }: { children: React.ReactNode }) {
  const [provider, setProviderState] = useState<Provider>('mangadex')
  const router = useRouter()

  useEffect(() => {
    const match = document.cookie.match(/provider=([^;]+)/)
    if (match?.[1]) setProviderState(match[1] as Provider)
  }, [])

  function setProvider(p: Provider) {
    setProviderState(p)
    document.cookie = `provider=${p}; path=/; max-age=31536000`
    router.refresh()
  }

  return <Ctx.Provider value={{ provider, setProvider }}>{children}</Ctx.Provider>
}

export function useProvider() { return useContext(Ctx) }
