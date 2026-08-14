import { Mail, MapPin, Phone } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '@/components/brand-icons'
import { profile } from '@/lib/content/profile'
import { ContactForm } from '@/components/contact-form'
import { CopyButton } from '@/components/ui/copy-button'
import { Reveal } from '@/components/reveal'

export function ContactSection({ headingId = 'contact-heading' }: { headingId?: string }) {
  return (
    <section aria-labelledby={headingId} className="mx-auto max-w-6xl px-4 py-20 md:px-6">
      <Reveal>
        <p className="mb-2 text-sm font-medium uppercase tracking-wide text-accent">
          Get In Touch
        </p>
        <h2 id={headingId} className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
          Contact
        </h2>
        <p className="mb-10 max-w-xl text-pretty leading-relaxed text-muted-foreground">
          Hiring, collaborating, or just want to talk infrastructure? My inbox is open — and if
          the form doesn&apos;t work on your network, the direct links below always will.
        </p>
      </Reveal>

      <div className="flex flex-col gap-10 lg:flex-row">
        <Reveal className="flex-1">
          <div className="neu-card rounded-2xl p-6 md:p-8">
            <ContactForm />
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:w-80">
          <ul className="flex flex-col gap-3">
            <li className="glass-panel flex items-center justify-between gap-3 rounded-2xl p-4">
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-3 overflow-hidden transition-colors duration-200 hover:text-accent"
              >
                <Mail className="size-5 shrink-0 text-accent" aria-hidden="true" />
                <span className="truncate text-sm text-foreground">{profile.email}</span>
              </a>
              <CopyButton text={profile.email} label="Copy" />
            </li>
            <li className="glass-panel flex items-center justify-between gap-3 rounded-2xl p-4">
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
                className="glass-panel flex items-center gap-3 rounded-2xl p-4 transition-colors duration-200 hover:border-accent"
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
                className="glass-panel flex items-center gap-3 rounded-2xl p-4 transition-colors duration-200 hover:border-accent"
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
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            References available on request.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
