import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Providers } from './providers'
import { PWAInstall } from '@/components/ui/PWAInstall'
import { ServiceWorkerRegister } from '@/components/ui/ServiceWorkerRegister'

export const metadata: Metadata = {
  title: 'Mangyx — Read Manga',
  description: 'A minimal, editorial manga reading experience.',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Mangyx' },

}

export const viewport: Viewport = {
  themeColor: '#111010',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="monetag" content="adf67951f96db00eabd57f16ef142335" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <PWAInstall />
          <ServiceWorkerRegister />
        </Providers>
        <script src="https://pl28912884.effectivegatecpm.com/bf/d9/c1/bfd9c169e62016f4b496225e23f16aaf.js"></script>
      </body>
    </html>
  )
}
