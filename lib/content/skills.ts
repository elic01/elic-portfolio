import type { SkillGroup } from './types'

export interface RuthlessSkill {
  name: string
  context: string
  since: string
}

export interface RuthlessTier {
  level: 'Strong' | 'Working Knowledge' | 'Familiar'
  badge: string
  badgeColor: string
  accent: 'accent' | 'violet' | 'terminal'
  description: string
  skills: RuthlessSkill[]
}

export const ruthlessSkillTiers: RuthlessTier[] = [
  {
    level: 'Strong',
    badge: 'Interview-Ready · Daily Drivers',
    badgeColor: 'border-accent/40 bg-accent/10 text-accent',
    accent: 'accent',
    description:
      'Technologies I use daily, understand from underlying mechanics to production debugging, and am 100% prepared to be grilled on in technical interviews.',
    skills: [
      { name: 'TypeScript & JavaScript', context: 'Strict types, async execution, full-stack Next.js', since: '2023' },
      { name: 'Next.js & React 19', context: 'App Router, Server Components, SSR/SSG caching', since: '2024' },
      { name: 'Python', context: 'Automation scripts, backend APIs, data tooling', since: '2022' },
      { name: 'Docker & Docker Compose', context: 'Multi-stage builds, container networks, volumes', since: '2024' },
      { name: 'Proxmox VE & Linux', context: 'Bare-metal virtualization, systemd, SSH, storage', since: '2023' },
      { name: 'PostgreSQL', context: 'Schema design, indexing, relational constraints', since: '2024' },
      { name: 'Git & GitHub Actions', context: 'Branching strategies, CI/CD pipelines, releases', since: '2023' },
    ],
  },
  {
    level: 'Working Knowledge',
    badge: 'Applied in Production & Labs',
    badgeColor: 'border-violet/40 bg-violet/10 text-violet',
    accent: 'violet',
    description:
      'Technologies I have actively deployed, configured, or integrated into working systems and understand operationally.',
    skills: [
      { name: 'Authentik (SSO / IdP)', context: 'OIDC/OAuth2 flows, LDAP proxying, MFA policies', since: '2025' },
      { name: 'Nmap & Recon Tooling', context: 'Host discovery, NSE vulnerability scripts, audits', since: '2024' },
      { name: 'TCP/IP & VLAN Routing', context: 'Subnetting, firewall rules, enterprise IT support', since: '2023' },
      { name: 'Ansible & Meraki API', context: 'Declarative playbooks, network automation tasks', since: '2026' },
      { name: 'Active Directory & Windows Server', context: 'User policies, domain endpoints at Cimas', since: '2025' },
      { name: 'Redis', context: 'Key-value caching, session state, message queues', since: '2025' },
      { name: 'Tailwind CSS', context: 'Design tokens, dark mode, fluid responsive UI', since: '2023' },
    ],
  },
  {
    level: 'Familiar',
    badge: 'Explored & Evaluated',
    badgeColor: 'border-terminal/40 bg-terminal/10 text-terminal',
    accent: 'terminal',
    description:
      'Technologies I have built projects with, read documentation on, or evaluated for specific use cases.',
    skills: [
      { name: 'Firebase & Firestore', context: 'NoSQL document stores, client authentication', since: '2024' },
      { name: 'Dart & Flutter', context: 'Cross-platform mobile client architecture', since: '2024' },
      { name: 'ZFS Storage Pools', context: 'Dataset recordsize tuning, snapshot rotation', since: '2025' },
      { name: 'Traefik & Nginx', context: 'Reverse proxy routing, wildcard Let’s Encrypt SSL', since: '2025' },
      { name: 'ISACA IT Governance', context: 'Information systems auditing principles', since: '2024' },
      { name: 'Bash & PowerShell', context: 'CLI automation and administrative scripting', since: '2023' },
    ],
  },
]

export const skillGroups: SkillGroup[] = ruthlessSkillTiers.map((tier) => ({
  category: `${tier.level} (${tier.badge})`,
  accent: tier.accent,
  skills: tier.skills.map((s) => ({
    name: s.name,
    proficiency: tier.level === 'Strong' ? 5 : tier.level === 'Working Knowledge' ? 4 : 3,
    since: s.since,
  })),
}))

/** Core Daily Drivers with prominent visual weighting for recruiters */
export const coreDailyDrivers = [
  { name: 'TypeScript', tag: 'Strong · Daily Driver' },
  { name: 'Next.js / React', tag: 'Strong · Full-Stack Web' },
  { name: 'Python', tag: 'Strong · Automation & Backend' },
  { name: 'Docker', tag: 'Strong · Containerization' },
  { name: 'Proxmox VE', tag: 'Strong · Virtualization' },
  { name: 'Linux', tag: 'Strong · OS & SysAdmin' },
]

export const topSkills = [
  'TypeScript',
  'Next.js',
  'Python',
  'Docker',
  'Proxmox VE',
  'Linux',
  'Authentik SSO',
  'PostgreSQL',
  'Ansible',
  'Redis',
  'Git / GitHub',
]

export const infraSkillGroups = skillGroups
