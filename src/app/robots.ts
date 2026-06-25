import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/command-center/', '/dashboard/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/command-center/'],
      },
      {
        userAgent: 'Googlebot-Mobile',
        allow: '/',
        disallow: ['/api/', '/command-center/'],
      },
    ],
    sitemap: 'https://www.bohenix.africa/sitemap.xml',
    host: 'https://www.bohenix.africa',
  }
}
