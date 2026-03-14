import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/reader/', '/api/'],
    },
    sitemap: 'https://mangyx.vercel.app/sitemap.xml',
  }
}
