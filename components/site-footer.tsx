import Link from 'next/link'
import { Github, Linkedin, Mail } from 'lucide-react'
import { profile } from '@/lib/content/profile'

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="flex flex-col gap-1">
          <p className="font-mono text-sm text-foreground">
            <span className="text-accent">~/</span>
            {profile.handle}
          </p>
          <p className="text-sm text-muted-foreground">
            {profile.shortName} · {profile.location}
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <Link href="/now" className="text-muted-foreground transition-colors hover:text-foreground">
            Now
          </Link>
          <Link href="/changelog" className="text-muted-foreground transition-colors hover:text-foreground">
            Changelog
          </Link>
          <a
            href={profile.cvPath}
            download
            className="text-muted-foreground transition-colors hover:text-foreground"
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
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Github className="size-5" aria-hidden="true" />
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Linkedin className="size-5" aria-hidden="true" />
          </a>
          <a
            href={`mailto:${profile.email}`}
            aria-label="Email Emmanuel"
            className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Mail className="size-5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  )
}
