import type { Metadata } from 'next'
import { Fingerprint, Network, ShieldCheck, Terminal } from 'lucide-react'
import { BootSequence } from '@/components/cybersecurity/boot-sequence'
import { InteractiveTerminal } from '@/components/cybersecurity/interactive-terminal'
import { ProjectDetailCard } from '@/components/projects/project-detail-card'
import { Reveal } from '@/components/reveal'
import { projects } from '@/lib/content/projects'

export const metadata: Metadata = {
  title: 'Cybersecurity',
  description:
    'Cybersecurity focus areas and tooling by Emmanuel Chinjekure: vulnerability assessment, networking fundamentals, Linux hardening, identity management with Authentik, and HIT ISACA.',
}

const focusAreas = [
  {
    icon: Network,
    title: 'Networking Fundamentals',
    body: 'TCP/IP, subnetting, and network troubleshooting, sharpened daily resolving enterprise network tickets at Cimas Health Group.',
  },
  {
    icon: Terminal,
    title: 'Linux & Hardening',
    body: 'Day-to-day Linux administration across homelab VMs and containers: permissions, services, SSH hygiene, and minimal attack surface principles.',
  },
  {
    icon: Fingerprint,
    title: 'Identity & Access Management',
    body: 'Running Authentik as a centralized identity provider with SSO, OAuth2/OIDC flows, and policy-based access across all self-hosted services.',
  },
  {
    icon: ShieldCheck,
    title: 'Governance & Auditing',
    body: 'Building strong foundations in information systems auditing and security protocols through HIT ISACA, backed by hands-on healthcare IT operations.',
  },
]

const securityProjects = projects.filter((p) => p.category === 'security')

export default function CybersecurityPage() {
  return (
    <main className="scanlines bg-black">
      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24 pt-24">
        <Reveal>
          <p className="mb-3 font-mono text-sm text-terminal">
            <span className="text-muted-foreground">$</span> cat /etc/motd
          </p>
          <h1 className="mb-4 text-balance font-mono text-4xl font-bold tracking-tight text-terminal md:text-5xl">
            Cybersecurity
          </h1>
          <p className="mb-10 max-w-2xl text-pretty font-mono text-sm leading-relaxed text-muted-foreground">
            Security is where my systems administration and developer backgrounds converge. All tool details
            and focus areas are structured clearly below.
          </p>
        </Reveal>

        <Reveal>
          <div className="mb-12">
            <BootSequence />
          </div>
        </Reveal>

        <section aria-labelledby="focus-heading" className="mb-16">
          <Reveal>
            <h2 id="focus-heading" className="mb-6 font-mono text-2xl font-bold text-foreground">
              <span className="text-terminal">##</span> Focus Areas
            </h2>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2">
            {focusAreas.map((area, i) => (
              <Reveal key={area.title} delay={i * 0.06}>
                <article className="group h-full rounded-xl border border-border bg-card/60 p-6 transition-colors duration-300 hover:border-terminal/60 hover:shadow-[0_0_20px_rgba(57,211,83,0.15)]">
                  <area.icon className="mb-4 size-6 text-terminal" aria-hidden="true" />
                  <h3 className="mb-2 font-mono text-base font-semibold text-foreground">
                    {area.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{area.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {securityProjects.length > 0 && (
          <section aria-labelledby="sec-projects-heading" className="mb-16">
            <Reveal>
              <h2 id="sec-projects-heading" className="mb-2 font-mono text-2xl font-bold text-foreground">
                <span className="text-terminal">##</span> Security Tools &amp; Projects
              </h2>
              <p className="mb-6 font-mono text-sm text-muted-foreground">
                Security tooling, automated vulnerability scanning, and attack surface reconnaissance software.
              </p>
            </Reveal>
            <div className="flex flex-col gap-8">
              {securityProjects.map((project, i) => (
                <ProjectDetailCard key={project.slug} project={project} index={i} />
              ))}
            </div>
          </section>
        )}

        <section aria-labelledby="terminal-heading" className="mb-16">
          <Reveal>
            <h2 id="terminal-heading" className="mb-2 font-mono text-2xl font-bold text-foreground">
              <span className="text-terminal">##</span> Interactive Shell
            </h2>
            <p className="mb-6 font-mono text-sm text-muted-foreground">
              An interactive terminal simulation for quick command-line exploration.
            </p>
          </Reveal>
          <Reveal>
            <InteractiveTerminal />
          </Reveal>
        </section>

        <section aria-labelledby="creds-heading">
          <Reveal>
            <h2 id="creds-heading" className="mb-6 font-mono text-2xl font-bold text-foreground">
              <span className="text-terminal">##</span> Credentials &amp; Involvement
            </h2>
            <div className="rounded-xl border border-border bg-card/60 p-6">
              <ul className="flex list-disc flex-col gap-3 pl-5">
                <li className="text-sm leading-relaxed text-muted-foreground">
                  <span className="text-foreground">HIT ISACA Member (2024–Present):</span> Information
                  systems auditing, IT governance, and security protocol fundamentals.
                </li>
                <li className="text-sm leading-relaxed text-muted-foreground">
                  <span className="text-foreground">Cimas Health Group IT Internship:</span> Hands-on
                  exposure to security-conscious operations in a high-compliance healthcare environment.
                </li>
                <li className="text-sm leading-relaxed text-muted-foreground">
                  <span className="text-foreground">Homelab Identity Architecture:</span> Authentik SSO
                  deployed in production-style conditions across self-hosted services.
                </li>
                <li className="text-sm leading-relaxed text-muted-foreground">
                  <span className="text-foreground">Professional Certifications:</span> Actively pursuing
                  ISACA and cloud security credentials.
                </li>
              </ul>
            </div>
          </Reveal>
        </section>
      </div>
    </main>
  )
}
