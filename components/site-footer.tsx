import Link from 'next/link'
import { Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '@/components/brand-icons'
import { profile } from '@/lib/content/profile'

export function SiteFooter() {
  return (
    <footer className="relative pt-12 pb-16">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="neu-card rounded-3xl border border-white/10 bg-card/40 backdrop-blur-xl p-8 shadow-2xl">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            {/* Left: Handle & Brand details */}
            <div className="flex flex-col gap-1.5">
              <Link
                href="/"
                className="font-mono text-base font-semibold tracking-tight text-foreground transition-colors hover:text-accent"
              >
                <span className="text-accent">~/</span>
                {profile.handle}
              </Link>
              <p className="text-xs text-muted-foreground">
                {profile.shortName} · {profile.location}
              </p>
              <p className="text-xs text-muted-foreground/80">
                Full-Stack Developer &amp; Systems Administrator
              </p>
            </div>

            {/* Middle: Quick navigation */}
            <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs">
              <Link href="/projects" className="text-muted-foreground transition-colors hover:text-accent">
                Projects
              </Link>
              <Link href="/cybersecurity" className="text-muted-foreground transition-colors hover:text-accent">
                Cybersecurity
              </Link>
              <Link href="/devops" className="text-muted-foreground transition-colors hover:text-accent">
                DevOps
              </Link>
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

            {/* Right: Social icons */}
            <div className="flex items-center gap-3">
              <a
                href={profile.links.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="rounded-full border border-white/10 bg-secondary/60 p-2.5 text-muted-foreground transition-all duration-200 hover:border-accent/40 hover:bg-secondary hover:text-accent hover:shadow-[0_0_16px_rgba(0,201,167,0.3)]"
              >
                <GithubIcon className="size-4" />
              </a>
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                className="rounded-full border border-white/10 bg-secondary/60 p-2.5 text-muted-foreground transition-all duration-200 hover:border-accent/40 hover:bg-secondary hover:text-accent hover:shadow-[0_0_16px_rgba(0,201,167,0.3)]"
              >
                <LinkedinIcon className="size-4" />
              </a>
              <a
                href={`mailto:${profile.email}`}
                aria-label="Email Emmanuel"
                className="rounded-full border border-white/10 bg-secondary/60 p-2.5 text-muted-foreground transition-all duration-200 hover:border-accent/40 hover:bg-secondary hover:text-accent hover:shadow-[0_0_16px_rgba(0,201,167,0.3)]"
              >
                <Mail className="size-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Tech badge */}
          <div className="mt-8 flex flex-col gap-3 border-t border-white/5 pt-6 text-xs text-muted-foreground/80 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono">
              &copy; {new Date().getFullYear()} Emmanuel Chinjekure. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-white/10 bg-secondary/50 px-3 py-1 font-mono text-[11px] text-muted-foreground">
                Next.js 16 + TypeScript
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
