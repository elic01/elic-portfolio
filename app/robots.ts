import type { MetadataRoute } from 'next'
import { profile } from '@/lib/content/profile'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = profile.siteUrl || 'https://elic.dev'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
