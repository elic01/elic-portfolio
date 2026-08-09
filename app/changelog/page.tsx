import type { Metadata } from 'next'
import { changelog } from '@/lib/content/site'
import { Reveal } from '@/components/reveal'

export const metadata: Metadata = {
  title: 'Changelog',
  description:
    'A running log of career and site milestones by Emmanuel Chinjekure — history is kept, never overwritten.',
}

function formatDate(iso: string) {
  const [year, month] = iso.split('-')
  const date = new Date(Number(year), Number(month) - 1)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export default function ChangelogPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-20">
      <Reveal>
        <p className="mb-3 font-mono text-sm text-violet">
          <span className="text-muted-foreground">$</span> git log --reverse --pretty
        </p>
        <h1 className="mb-2 text-balance text-4xl font-bold tracking-tight md:text-5xl">
          Changelog
        </h1>
        <p className="mb-12 max-w-xl text-pretty leading-relaxed text-muted-foreground">
          Career and site milestones, newest first. I keep the history instead of overwriting it —
          the trajectory matters more than any single snapshot.
        </p>
      </Reveal>

      <ol className="relative flex flex-col gap-8 border-l border-border pl-6">
        {changelog.map((item, i) => (
          <Reveal key={item.date + i} delay={i * 0.04}>
            <li className="relative">
              <span
                className="absolute -left-[1.9rem] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-accent"
                aria-hidden="true"
              />
              <time className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {formatDate(item.date)}
              </time>
              <p className="mt-1 text-pretty leading-relaxed text-foreground">{item.entry}</p>
            </li>
          </Reveal>
        ))}
      </ol>
    </main>
  )
}
