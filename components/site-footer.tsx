import Link from 'next/link'
import { Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '@/components/brand-icons'
import { profile } from '@/lib/content/profile'

export function SiteFooter() {
  return (
    <footer className="relative border-t border-white/5 bg-background/50 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="flex flex-col gap-1">
          <p className="font-mono text-sm text-foreground font-semibold">
            <span className="text-accent">~/</span>
            {profile.handle}
          </p>
          <p className="text-xs text-muted-foreground">
            {profile.shortName} · {profile.location}
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs">
          <Link href="/now" className="text-muted-foreground transition-colors hover:text-accent">
            Now
          </Link>
          <Link href="/changelog" className="text-muted-foreground transition-colors hover:text-accent">
            Changelog
          </Link>
          <a
            href={profile.cvPath}
            download
            className="text-muted-foreground transition-colors hover:text-accent"
          >
            Download CV
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="rounded-lg p-2 text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
          >
            <GithubIcon className="size-4" />
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="rounded-lg p-2 text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
          >
            <LinkedinIcon className="size-4" />
          </a>
          <a
            href={`mailto:${profile.email}`}
            aria-label="Email Emmanuel"
            className="rounded-lg p-2 text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
          >
            <Mail className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  )
}
