import type { MetadataRoute } from 'next'
import { profile } from '@/lib/content/profile'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = profile.siteUrl || 'https://elic.dev'

  const routes = ['', '/projects', '/cybersecurity', '/devops', '/now', '/contact', '/changelog']

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '/now' || route === '/projects' ? 'weekly' : 'monthly',
    priority: route === '' ? 1.0 : 0.8,
  }))
}
