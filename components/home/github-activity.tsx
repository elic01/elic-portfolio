import { ExternalLink, GitBranch, GitCommit, GitFork, GitPullRequest, Star } from 'lucide-react'
import { GithubIcon } from '@/components/brand-icons'
import { Reveal } from '@/components/reveal'
import { profile } from '@/lib/content/profile'

const featuredRepos = [
  {
    name: 'cisco-meraki-ansible',
    description: 'Infrastructure-as-Code playbooks automating multi-site VLANs, SSIDs, and firewall rules via Cisco Meraki REST API.',
    language: 'Python',
    languageColor: 'bg-[#3572A5]',
    stars: 'Public',
    forks: 'IaC',
    url: 'https://github.com/elic01/cisco-meraki-ansible',
  },
  {
    name: 'vulnerability-assessment-toolkit',
    description: 'Automated network reconnaissance and vulnerability auditing shell suite integrating Nmap scripting engine.',
    language: 'Shell / Python',
    languageColor: 'bg-[#89e051]',
    stars: 'Public',
    forks: 'Security',
    url: 'https://github.com/elic01/vulnerability-assessment-toolkit',
  },
  {
    name: 'uniconnect',
    description: 'Full-stack university student feedback platform with role-based auth, real-time Firestore analytics, and Tailwind CSS.',
    language: 'TypeScript',
    languageColor: 'bg-[#3178c6]',
    stars: 'Public',
    forks: 'Full-Stack',
    url: 'https://github.com/elic01/uniconnect',
  },
  {
    name: 'healthcare-portal',
    description: 'Clinical workflow management application with role-separated portals for doctors, receptionists, and patients.',
    language: 'TypeScript',
    languageColor: 'bg-[#3178c6]',
    stars: 'Public',
    forks: 'Next.js',
    url: 'https://github.com/elic01/healthcare-portal',
  },
  {
    name: 'fleettrack',
    description: 'Commercial vehicle fleet tracking, route logging, and preventive maintenance alert dashboard.',
    language: 'TypeScript',
    languageColor: 'bg-[#3178c6]',
    stars: 'Public',
    forks: 'Full-Stack',
    url: 'https://github.com/elic01/fleettrack',
  },
  {
    name: 'elic-portfolio',
    description: 'Modern Next.js 16 developer platform on typed content layer with automated Cloudflare Pages edge deployments.',
    language: 'TypeScript',
    languageColor: 'bg-[#3178c6]',
    stars: 'Live',
    forks: 'Portfolio',
    url: 'https://github.com/elic01/elic-portfolio',
  },
]

const languages = [
  { name: 'TypeScript', percent: '48%', color: 'bg-[#3178c6]' },
  { name: 'Python', percent: '24%', color: 'bg-[#3572A5]' },
  { name: 'Shell / Bash', percent: '14%', color: 'bg-[#89e051]' },
  { name: 'Dart / Flutter', percent: '9%', color: 'bg-[#00B4AB]' },
  { name: 'Other', percent: '5%', color: 'bg-muted-foreground' },
]

export function GithubActivity() {
  return (
    <section aria-labelledby="github-heading" className="relative mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      {/* Background soft glow accent */}
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 size-96 rounded-full bg-accent/5 blur-3xl -z-10"
        aria-hidden="true"
      />

      <Reveal>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <GithubIcon className="size-4 text-accent" />
              <p className="font-mono text-xs uppercase tracking-widest text-accent">Open Source &amp; Code Evidence</p>
            </div>
            <h2 id="github-heading" className="text-3xl font-bold tracking-tight md:text-4xl">
              GitHub Activity &amp; Repositories
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              20+ repositories across full-stack applications, infrastructure-as-code automation, and security tooling.
            </p>
          </div>

          <a
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-secondary/40 backdrop-blur-md px-4 py-2 font-mono text-xs font-semibold text-foreground transition-all duration-200 hover:border-accent/40 hover:bg-secondary hover:text-accent"
          >
            <span>github.com/{profile.handle}</span>
            <ExternalLink className="size-3.5" />
          </a>
        </div>
      </Reveal>

      {/* GitHub Summary & Language Bar Box */}
      <Reveal>
        <div className="mb-8 rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl">
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-secondary/30 p-4">
              <GitCommit className="size-5 text-accent" />
              <div>
                <p className="font-mono text-xs uppercase text-muted-foreground">Public Repositories</p>
                <p className="text-xl font-bold text-foreground">20+ Projects</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-secondary/30 p-4">
              <GitBranch className="size-5 text-violet" />
              <div>
                <p className="font-mono text-xs uppercase text-muted-foreground">Active Focus</p>
                <p className="text-xl font-bold text-foreground">Full-Stack &amp; DevOps</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-secondary/30 p-4">
              <GitPullRequest className="size-5 text-terminal" />
              <div>
                <p className="font-mono text-xs uppercase text-muted-foreground">Collaboration</p>
                <p className="text-xl font-bold text-foreground">Open Source &amp; CI/CD</p>
              </div>
            </div>
          </div>

          {/* Language Breakdown */}
          <div>
            <p className="mb-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Primary Language Distribution
            </p>
            <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-secondary">
              {languages.map((lang) => (
                <div
                  key={lang.name}
                  className={lang.color}
                  style={{ width: lang.percent }}
                  title={`${lang.name}: ${lang.percent}`}
                />
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-xs font-mono text-muted-foreground">
              {languages.map((lang) => (
                <span key={lang.name} className="inline-flex items-center gap-1.5">
                  <span className={`size-2 rounded-full ${lang.color}`} />
                  <span className="text-foreground">{lang.name}</span>
                  <span>{lang.percent}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>

      {/* Featured Repositories Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {featuredRepos.map((repo, i) => (
          <Reveal key={repo.name} delay={i * 0.06}>
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="neu-card neu-card-hover group flex h-full flex-col justify-between rounded-2xl border border-white/10 p-5 backdrop-blur-xl transition-all duration-300 hover:border-accent/40"
            >
              <div>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="font-mono text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
                    {repo.name}
                  </span>
                  <ExternalLink className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {repo.description}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 font-mono text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <span className={`size-2 rounded-full ${repo.languageColor}`} />
                  <span className="text-foreground/90">{repo.language}</span>
                </span>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Star className="size-3 text-gold/70" />
                    <span>{repo.stars}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <GitFork className="size-3" />
                    <span>{repo.forks}</span>
                  </span>
                </div>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
