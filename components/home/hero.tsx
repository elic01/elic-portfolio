import Link from 'next/link'
import { ArrowRight, Download, MapPin } from 'lucide-react'
import { profile } from '@/lib/content/profile'
import { Reveal } from '@/components/reveal'

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-border bg-primary/20"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-20 md:px-6 md:py-28">
        <Reveal>
          <div className="flex flex-col gap-6">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm text-muted-foreground">
              <MapPin className="size-3.5 text-accent" aria-hidden="true" />
              {profile.location}
            </span>

            <h1
              id="hero-heading"
              className="max-w-3xl text-balance text-4xl font-bold leading-tight tracking-tight md:text-6xl"
            >
              {profile.shortName}
            </h1>

            <p className="max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
              {profile.title}
            </p>

            <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground">
              Currently <span className="text-foreground">{profile.currentRole}</span> and B.Tech
              Honours IT student at Harare Institute of Technology. {profile.availability}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 font-medium text-accent-foreground shadow-[0_0_24px_rgba(0,201,167,0.35)] transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
              >
                View My Work
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <a
                href={profile.cvPath}
                download
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-transparent px-6 py-3 font-medium text-foreground transition-colors duration-200 hover:bg-secondary"
              >
                <Download className="size-4" aria-hidden="true" />
                Download CV
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
