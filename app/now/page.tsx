import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Clock } from 'lucide-react'
import { nowCategories, nowUpdated } from '@/lib/content/site'
import { profile } from '@/lib/content/profile'
import { Reveal } from '@/components/reveal'

export const metadata: Metadata = {
  title: 'Now',
  description: `What Emmanuel Chinjekure is building, learning, and working on right now (updated ${nowUpdated}).`,
}

export default function NowPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-24 pt-24">
      <Reveal>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1 text-xs font-mono text-accent">
          <Clock className="size-3.5" aria-hidden="true" />
          Living Log · Updated {nowUpdated}
        </div>
        <p className="mb-2 font-mono text-sm text-accent">
          <span className="text-muted-foreground">$</span> cat /now
        </p>
        <h1 className="mb-3 text-balance text-4xl font-bold tracking-tight md:text-5xl">
          What I&apos;m Doing Now
        </h1>
        <p className="mb-10 text-sm leading-relaxed text-muted-foreground">
          A public snapshot of my active technical focus, projects under development, and current engineering goals.{' '}
          <a
            href="https://nownownow.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-border underline-offset-4 hover:text-foreground"
          >
            What is a &quot;Now&quot; page?
          </a>
        </p>
      </Reveal>

      {/* Living Categories Grid */}
      <div className="flex flex-col gap-6">
        {nowCategories.map((cat, i) => (
          <Reveal key={cat.category} delay={i * 0.06}>
            <section
              aria-label={cat.category}
              className="neu-card rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl shadow-lg"
            >
              <div className="mb-4 flex items-center justify-between gap-2 border-b border-white/5 pb-3">
                <h2 className="text-lg font-bold text-foreground">{cat.category}</h2>
                <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-medium ${cat.color}`}>
                  {cat.tag}
                </span>
              </div>

              <ul className="flex flex-col gap-2.5">
                {cat.entries.map((entry) => (
                  <li key={entry} className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    <CheckCircle2 className="size-4 shrink-0 text-accent mt-0.5" aria-hidden="true" />
                    <span>{entry}</span>
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>
        ))}
      </div>

      {/* Availability & Contact CTA */}
      <Reveal delay={0.15}>
        <div className="mt-12 rounded-2xl border border-accent/30 bg-secondary/40 p-6 backdrop-blur-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                Looking for Engineering Roles
              </p>
              <p className="mt-1 text-sm text-foreground">
                {profile.availability}
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 font-mono text-xs font-semibold text-accent-foreground shadow-[0_0_16px_rgba(0,201,167,0.3)] transition-transform hover:scale-105"
            >
              Get In Touch
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </Reveal>
    </main>
  )
}
