import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Download, MapPin } from 'lucide-react'
import { profile } from '@/lib/content/profile'
import { Reveal } from '@/components/reveal'

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden border-b border-border bg-primary/20"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 py-16 md:flex-row md:justify-between md:px-6 md:py-24">
        {/* Text Details Column */}
        <Reveal className="flex-1">
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

            <p className="max-w-xl text-pretty text-lg text-muted-foreground md:text-xl">
              {profile.title}
            </p>

            <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
              <span className="text-foreground font-medium">{profile.currentRole}</span>.{' '}
              {profile.availability}
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

        {/* Profile Photo Column */}
        <Reveal delay={0.15} className="shrink-0">
          <div className="relative mx-auto w-64 md:w-80 lg:w-96">
            {/* Glowing gradient aura */}
            <div
              className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-accent via-violet to-gold opacity-50 blur-xl"
              aria-hidden="true"
            />

            <div className="neu-card relative overflow-hidden rounded-3xl border border-border/80 bg-card/90 p-2 shadow-2xl">
              <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl">
                <Image
                  src="/IMG_0702.PNG"
                  alt="Emmanuel Chinjekure portrait"
                  fill
                  priority
                  className="object-cover object-center transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 768px) 256px, (max-width: 1024px) 320px, 384px"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
