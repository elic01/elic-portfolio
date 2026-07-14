import type { SkillGroup } from './types'

export const skillGroups: SkillGroup[] = [
  {
    category: 'Programming',
    accent: 'violet',
    skills: [
      { name: 'JavaScript / TypeScript', proficiency: 4, since: '2023' },
      { name: 'Python', proficiency: 4, since: '2022' },
      { name: 'Java', proficiency: 3, since: '2023' },
      { name: 'C#', proficiency: 3, since: '2023' },
      { name: 'HTML & CSS', proficiency: 4, since: '2022' },
    ],
  },
  {
    category: 'Databases',
    accent: 'info',
    skills: [
      { name: 'PostgreSQL', proficiency: 3, since: '2024' },
      { name: 'Firebase / Firestore', proficiency: 4, since: '2024' },
      { name: 'MySQL', proficiency: 3, since: '2023' },
      { name: 'Supabase', proficiency: 3, since: '2024' },
      { name: 'Redis', proficiency: 3, since: '2025' },
    ],
  },
  {
    category: 'DevOps & Infrastructure',
    accent: 'accent',
    skills: [
      { name: 'Proxmox VE', proficiency: 4, since: '2025' },
      { name: 'Docker & Docker Compose', proficiency: 4, since: '2024' },
      { name: 'Linux Administration', proficiency: 3, since: '2023' },
      { name: 'Bash / PowerShell', proficiency: 3, since: '2023' },
    ],
  },
  {
    category: 'Security & Identity',
    accent: 'terminal',
    skills: [
      { name: 'Authentik (SSO/IdP)', proficiency: 3, since: '2025' },
      { name: 'Networking Fundamentals', proficiency: 3, since: '2023' },
      { name: 'Linux Security Basics', proficiency: 3, since: '2024' },
      { name: 'IT Governance (ISACA)', proficiency: 2, since: '2024' },
    ],
  },
  {
    category: 'Tools & Platforms',
    accent: 'ember',
    skills: [
      { name: 'Git / GitHub / Gitea', proficiency: 4, since: '2023' },
      { name: 'Next.js', proficiency: 4, since: '2024' },
      { name: 'Gemini API / Claude', proficiency: 3, since: '2024' },
      { name: 'Vercel', proficiency: 3, since: '2024' },
    ],
  },
]

/** Flat pill list for the home page preview */
export const topSkills = [
  'TypeScript',
  'Next.js',
  'Python',
  'PostgreSQL',
  'Docker',
  'Proxmox VE',
  'Linux',
  'Firebase',
  'Authentik',
  'Git',
]

export const infraSkillGroups = skillGroups.filter((g) =>
  ['DevOps & Infrastructure', 'Security & Identity', 'Databases'].includes(g.category),
)
