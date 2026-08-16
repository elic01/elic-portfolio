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
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: 'Emmanuel Leon Isheanesu Chinjekure (elic01) — Full-Stack Software Engineer',
    template: '%s — Emmanuel Leon Isheanesu Chinjekure',
  },
  description:
    'Emmanuel Leon Isheanesu Chinjekure (elic / elic01): Full-Stack Software Engineer with DevOps and Systems Security depth. Based in Harare, Zimbabwe. Completing B.Tech IT at Harare Institute of Technology (former IT Intern at Cimas Health Group).',
  keywords: [
    'elic',
    'elic01',
    'Emmanuel Chinjekure',
    'Emmanuel Leon Isheanesu Chinjekure',
    'Emmanuel Chinjekure Zimbabwe',
    'Emmanuel Chinjekure HIT',
    'Full-Stack Software Engineer Harare',
    'DevOps Engineer Zimbabwe',
    'Harare Institute of Technology',
    'Cimas Health Group',
    'Systems Administrator Zimbabwe',
    'Vulnerability Assessment Toolkit',
  ],
  authors: [{ name: profile.fullName, url: profile.siteUrl }],
  creator: profile.fullName,
  publisher: profile.fullName,
  alternates: {
    canonical: profile.siteUrl,
  },
  openGraph: {
    title: 'Emmanuel Leon Isheanesu Chinjekure (elic01) — Full-Stack Software Engineer',
    description:
      'Official portfolio of Emmanuel Leon Isheanesu Chinjekure (elic / elic01): Full-Stack Software Engineering, Homelab DevOps, and Security Architecture.',
    url: profile.siteUrl,
    siteName: 'elic01.dev',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Emmanuel Leon Isheanesu Chinjekure (elic01) — Full-Stack Software Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emmanuel Leon Isheanesu Chinjekure (elic01) — Full-Stack Software Engineer',
    description:
      'Full-Stack Software Engineer with DevOps and Systems Security depth in Harare, Zimbabwe.',
    creator: '@elic01',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'google347e7378449325d9',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#090d12',
}

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.fullName,
  alternateName: ['elic', 'elic01', 'Emmanuel Chinjekure', 'Emmanuel L. I. Chinjekure'],
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
  alumniOf: {
    '@type': 'EducationalOrganization',
    name: 'Harare Institute of Technology',
  },
  worksFor: {
    '@type': 'Organization',
    name: 'Cimas Health Group',
  },
  knowsAbout: [
    'Software Engineering',
    'Full-Stack Development',
    'Next.js',
    'TypeScript',
    'Python',
    'DevOps',
    'Docker',
    'Proxmox VE Virtualization',
    'Systems Administration',
    'Cybersecurity',
    'Authentik SSO',
  ],
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'elic01.dev',
  alternateName: 'Emmanuel Chinjekure Portfolio',
  url: profile.siteUrl,
  author: {
    '@type': 'Person',
    name: profile.fullName,
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <SiteNav />
        {children}
        <SiteFooter />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
