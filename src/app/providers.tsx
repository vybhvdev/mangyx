'use client'

import { SessionProvider } from 'next-auth/react'
import { DJProvider } from '@/components/ui/DJMode'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <DJProvider>
        {children}
      </DJProvider>
    </SessionProvider>
  )
}
