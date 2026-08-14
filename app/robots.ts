import type { MetadataRoute } from 'next'
import { profile } from '@/lib/content/profile'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = profile.siteUrl || 'https://elic01.dev'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
