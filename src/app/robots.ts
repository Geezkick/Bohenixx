import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/command-center', '/api/'],
    },
    sitemap: 'https://bohenixx.vercel.app/sitemap.xml',
  }
}
