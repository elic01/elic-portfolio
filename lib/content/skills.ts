import type { SkillGroup } from './types'

export interface TieredGroup {
  tier: 'Primary' | 'Secondary' | 'Supporting Specialization'
  title: string
  badge: string
  badgeColor: string
  accent: 'accent' | 'violet' | 'terminal' | 'gold' | 'info' | 'ember'
  description: string
  skills: { name: string; proficiency: 1 | 2 | 3 | 4 | 5; since: string }[]
}

export const skillHierarchy: TieredGroup[] = [
  {
    tier: 'Primary',
    title: 'Software Engineering & Full-Stack Development',
    badge: 'Core Focus',
    badgeColor: 'border-accent/40 bg-accent/10 text-accent',
    accent: 'accent',
    description:
      'Engineering scalable web applications, robust APIs, and interactive user interfaces with modern TypeScript, Next.js, and clean architecture.',
    skills: [
      { name: 'TypeScript & JavaScript', proficiency: 5, since: '2023' },
      { name: 'Next.js & React 19', proficiency: 5, since: '2024' },
      { name: 'Python', proficiency: 4, since: '2022' },
      { name: 'PostgreSQL & Relational DBs', proficiency: 4, since: '2024' },
      { name: 'REST APIs & Backend Services', proficiency: 4, since: '2023' },
      { name: 'Tailwind CSS & Responsive UI', proficiency: 5, since: '2023' },
    ],
  },
  {
    tier: 'Secondary',
    title: 'DevOps & Cloud Infrastructure',
    badge: 'Operational Depth',
    badgeColor: 'border-violet/40 bg-violet/10 text-violet',
    accent: 'violet',
    description:
      'Bare-metal virtualization, Docker container orchestration, Infrastructure-as-Code, and automated CI/CD deployment pipelines.',
    skills: [
      { name: 'Docker & Container Workloads', proficiency: 4, since: '2024' },
      { name: 'Proxmox VE Virtualization Cluster', proficiency: 4, since: '2025' },
      { name: 'CI/CD (GitHub Actions / Cloudflare)', proficiency: 4, since: '2024' },
      { name: 'Cisco Meraki & Ansible Automation', proficiency: 4, since: '2026' },
      { name: 'Linux Systems Administration', proficiency: 4, since: '2023' },
      { name: 'Redis (Caching & Queue Engines)', proficiency: 3, since: '2025' },
    ],
  },
  {
    tier: 'Supporting Specialization',
    title: 'Systems Administration & Security Architecture',
    badge: 'Security Focus',
    badgeColor: 'border-terminal/40 bg-terminal/10 text-terminal',
    accent: 'terminal',
    description:
      'Enterprise identity management with Authentik SSO, attack surface auditing with Nmap, and compliance-driven healthcare IT operations.',
    skills: [
      { name: 'Authentik (SSO / OIDC / IdP)', proficiency: 4, since: '2025' },
      { name: 'Network Auditing & Nmap Recon', proficiency: 4, since: '2024' },
      { name: 'Enterprise TCP/IP & VLAN Routing', proficiency: 4, since: '2023' },
      { name: 'Active Directory & Windows Server', proficiency: 4, since: '2025' },
      { name: 'Linux Hardening & Security Policies', proficiency: 3, since: '2024' },
      { name: 'ISACA IT Governance Standards', proficiency: 3, since: '2024' },
    ],
  },
]

export const skillGroups: SkillGroup[] = skillHierarchy.map((group) => ({
  category: group.title,
  accent: group.accent,
  skills: group.skills,
}))

/** Core Daily Drivers with prominent visual weighting for recruiters */
export const coreDailyDrivers = [
  { name: 'TypeScript', tag: 'Primary Language' },
  { name: 'Next.js / React', tag: 'Full-Stack Web' },
  { name: 'Python', tag: 'Automation & Backend' },
  { name: 'Docker', tag: 'Containerization' },
  { name: 'Proxmox VE', tag: 'Virtualization' },
  { name: 'Linux', tag: 'Core OS & SysAdmin' },
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

export const infraSkillGroups = skillGroups.filter((g) =>
  ['DevOps & Cloud Infrastructure', 'Systems Administration & Security Architecture'].includes(g.category),
)
