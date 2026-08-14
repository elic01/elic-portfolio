import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { profile } from '@/lib/content/profile'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl || 'https://elic.dev'),
  title: {
    default: 'Emmanuel Chinjekure — Full-Stack Developer & Systems Administrator',
    template: '%s — Emmanuel Chinjekure',
  },
  description:
    'Full-stack developer, systems administrator, and cybersecurity enthusiast based in Harare, Zimbabwe. Completing B.Tech IT studies at Harare Institute of Technology (former IT Intern at Cimas Health Group).',
  generator: 'v0.app',
  openGraph: {
    title: 'Emmanuel Chinjekure — Full-Stack Developer & Systems Administrator',
    description:
      'Full-stack development, homelab infrastructure, and cybersecurity. Based in Harare, Zimbabwe.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0d1117',
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.fullName,
  jobTitle: profile.title,
  email: `mailto:${profile.email}`,
  telephone: profile.phone,
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Harare',
    addressCountry: 'ZW',
  },
  url: profile.siteUrl,
  sameAs: [profile.links.github, profile.links.linkedin],
  alumniOf: 'Harare Institute of Technology',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`dark bg-background ${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <SiteNav />
        {children}
        <SiteFooter />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
