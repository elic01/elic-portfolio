import type { Metadata } from 'next'
import { nowItems, nowUpdated } from '@/lib/content/site'
import { profile } from '@/lib/content/profile'
import { Reveal } from '@/components/reveal'

export const metadata: Metadata = {
  title: 'Now',
  description: `What Emmanuel Chinjekure is working on, building, and learning right now (updated ${nowUpdated}).`,
}

export default function NowPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-20 pt-24">
      <Reveal>
        <p className="mb-3 font-mono text-sm text-accent">
          <span className="text-muted-foreground">$</span> cat /now
        </p>
        <h1 className="mb-2 text-balance text-4xl font-bold tracking-tight md:text-5xl">Now</h1>
        <p className="mb-10 text-sm text-muted-foreground">
          A snapshot of what has my attention. Last updated{' '}
          <span className="text-foreground">{nowUpdated}</span>.{' '}
          <a
            href="https://nownownow.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-border underline-offset-4 hover:text-foreground"
          >
            What is a now page?
          </a>
        </p>
      </Reveal>

      <div className="flex flex-col gap-4">
        {nowItems.map((item, i) => (
          <Reveal key={item.label} delay={i * 0.05}>
            <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-5 sm:flex-row sm:gap-6">
              <span className="w-24 shrink-0 font-mono text-sm uppercase tracking-wider text-accent">
                {item.label}
              </span>
              <p className="text-pretty leading-relaxed text-muted-foreground">{item.detail}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <p className="mt-10 text-sm text-muted-foreground">
          {profile.availability}{' '}
          <a
            href="/contact"
            className="text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
          >
            Get in touch
          </a>
          .
        </p>
      </Reveal>
    </main>
  )
}
