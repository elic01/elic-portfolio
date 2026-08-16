import type { SkillGroup } from './types'

export interface TieredSkill {
  name: string
  tier: 'core' | 'specialized' | 'familiar'
  highlight?: boolean
  description?: string
  since: string
}

export const skillGroups: SkillGroup[] = [
  {
    category: 'Core Production Stack',
    accent: 'accent',
    skills: [
      { name: 'TypeScript & JavaScript', proficiency: 5, since: '2023' },
      { name: 'Next.js & React', proficiency: 5, since: '2024' },
      { name: 'Python', proficiency: 4, since: '2022' },
      { name: 'Docker & Docker Compose', proficiency: 4, since: '2024' },
      { name: 'Proxmox VE Virtualization', proficiency: 4, since: '2025' },
      { name: 'Linux Systems Administration', proficiency: 4, since: '2023' },
    ],
  },
  {
    category: 'Security & Identity',
    accent: 'terminal',
    skills: [
      { name: 'Authentik (SSO / OIDC / IdP)', proficiency: 4, since: '2025' },
      { name: 'Network Auditing & Nmap', proficiency: 4, since: '2024' },
      { name: 'Enterprise TCP/IP & VLANs', proficiency: 4, since: '2023' },
      { name: 'Linux Hardening & Firewalling', proficiency: 3, since: '2024' },
      { name: 'ISACA IT Governance Standards', proficiency: 3, since: '2024' },
    ],
  },
  {
    category: 'Infrastructure & DevOps',
    accent: 'violet',
    skills: [
      { name: 'Cisco Meraki Automation', proficiency: 4, since: '2026' },
      { name: 'Ansible Playbooks', proficiency: 3, since: '2026' },
      { name: 'Bash & PowerShell Scripting', proficiency: 4, since: '2023' },
      { name: 'Cloudflare Pages & DNS', proficiency: 4, since: '2024' },
      { name: 'CI/CD (GitHub Actions)', proficiency: 4, since: '2024' },
    ],
  },
  {
    category: 'Databases & Storage',
    accent: 'info',
    skills: [
      { name: 'PostgreSQL', proficiency: 4, since: '2024' },
      { name: 'Redis (Caching / Queues)', proficiency: 3, since: '2025' },
      { name: 'Firebase & Firestore', proficiency: 4, since: '2024' },
      { name: 'ZFS Storage & Backups', proficiency: 3, since: '2025' },
      { name: 'MySQL & Supabase', proficiency: 3, since: '2023' },
    ],
  },
]

/** Core Daily Drivers with prominent visual weighting for recruiters */
export const coreDailyDrivers = [
  { name: 'TypeScript', tag: 'Primary Language' },
  { name: 'Next.js', tag: 'Full-Stack Framework' },
  { name: 'Python', tag: 'Automation & Scripting' },
  { name: 'Docker', tag: 'Container Orchestration' },
  { name: 'Proxmox VE', tag: 'Virtualization Cluster' },
  { name: 'Linux (Debian/Ubuntu)', tag: 'Core OS & SysAdmin' },
]

/** Secondary skills preview */
export const topSkills = [
  'TypeScript',
  'Next.js',
  'Python',
  'Docker',
  'Proxmox VE',
  'Linux',
  'Authentik SSO',
  'Cisco Meraki',
  'PostgreSQL',
  'Ansible',
  'Redis',
  'Git / Gitea',
]

export const infraSkillGroups = skillGroups.filter((g) =>
  ['Core Production Stack', 'Infrastructure & DevOps', 'Security & Identity', 'Databases & Storage'].includes(g.category),
)
