import { ArrowRight, Mail, MapPin, Phone, Sparkles } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '@/components/brand-icons'
import { profile } from '@/lib/content/profile'
import { ContactForm } from '@/components/contact-form'
import { CopyButton } from '@/components/ui/copy-button'
import { Reveal } from '@/components/reveal'

export function ContactSection({ headingId = 'contact-heading' }: { headingId?: string }) {
  return (
    <section aria-labelledby={headingId} className="relative mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      {/* Background glow */}
      <div
        className="absolute bottom-0 right-1/4 size-96 rounded-full bg-accent/5 blur-3xl -z-10"
        aria-hidden="true"
      />

      <Reveal>
        <div className="mb-10 flex flex-col gap-2">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">Start a Conversation</p>
          <h2 id={headingId} className="text-3xl font-bold tracking-tight md:text-4xl">
            Let&apos;s Build Together
          </h2>
          <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground text-base">
            Looking for an engineer who works fluidly across modern application code and bare-metal infrastructure?
            Whether you are hiring for full-stack software development, DevOps automation, or technical systems roles, my inbox is open.
          </p>
        </div>
      </Reveal>

      <div className="flex flex-col gap-10 lg:flex-row">
        <Reveal className="flex-1">
          <div className="neu-card rounded-2xl p-6 md:p-8 backdrop-blur-xl border border-white/10 shadow-2xl">
            {/* Value Proposition Callout Banner */}
            <div className="mb-6 rounded-xl border border-accent/30 bg-accent/10 p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-accent" aria-hidden="true" />
                <p className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
                  Available for Immediate Hire
                </p>
              </div>
              <p className="mt-1 text-sm font-semibold text-foreground">
                Looking for an engineer who bridges full-stack code and production infrastructure?
              </p>
              <p className="mt-1 font-mono text-xs text-accent/90 inline-flex items-center gap-1">
                <span>Send a message below</span>
                <ArrowRight className="size-3" />
              </p>
            </div>

            <ContactForm />
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:w-80">
          <ul className="flex flex-col gap-3">
            <li className="glass-panel flex items-center justify-between gap-3 rounded-2xl p-4 transition-all duration-200 hover:border-accent/40">
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-3 overflow-hidden transition-colors duration-200 hover:text-accent"
              >
                <Mail className="size-5 shrink-0 text-accent" aria-hidden="true" />
                <span className="truncate text-sm text-foreground">{profile.email}</span>
              </a>
              <CopyButton text={profile.email} label="Copy" />
            </li>
            <li className="glass-panel flex items-center justify-between gap-3 rounded-2xl p-4 transition-all duration-200 hover:border-accent/40">
              <a
                href={`tel:${profile.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-3 transition-colors duration-200 hover:text-accent"
              >
                <Phone className="size-5 shrink-0 text-accent" aria-hidden="true" />
                <span className="text-sm text-foreground">{profile.phone}</span>
              </a>
              <CopyButton text={profile.phone} label="Copy" />
            </li>
            <li>
              <a
                href={profile.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-panel flex items-center gap-3 rounded-2xl p-4 transition-colors duration-200 hover:border-accent/40"
              >
                <GithubIcon className="size-5 shrink-0 text-accent" />
                <span className="text-sm text-foreground">github.com/{profile.handle}</span>
              </a>
            </li>
            <li>
              <a
                href={profile.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="glass-panel flex items-center gap-3 rounded-2xl p-4 transition-colors duration-200 hover:border-accent/40"
              >
                <LinkedinIcon className="size-5 shrink-0 text-accent" />
                <span className="text-sm text-foreground">LinkedIn</span>
              </a>
            </li>
            <li className="glass-panel flex items-center gap-3 rounded-2xl p-4">
              <MapPin className="size-5 shrink-0 text-accent" aria-hidden="true" />
              <span className="text-sm text-foreground">{profile.location}</span>
            </li>
          </ul>
          <p className="mt-4 font-mono text-xs leading-relaxed text-muted-foreground">
            Professional references available upon request.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
