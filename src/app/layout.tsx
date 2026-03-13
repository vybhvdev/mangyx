import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
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
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <Script id="monetag-meta" strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: `
            var m = document.createElement('meta');
            m.name = 'monetag';
            m.content = 'adf67951f96db00eabd57f16ef142335';
            document.head.appendChild(m);
          `}}
        />
        <Providers>
          <Navbar />
          <main>{children}</main>
          <PWAInstall />
          <ServiceWorkerRegister />
        </Providers>
      </body>
    </html>
  )
}
