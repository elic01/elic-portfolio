import type { Project } from './types'

/**
 * Project portfolio. Newest / most important first.
 * Archive old work with `featured: false` and `status: 'archived'` — never delete.
 */
export const projects: Project[] = [
  {
    slug: 'homelab',
    title: 'Homelab Infrastructure & Self-Hosting',
    summary:
      'A production-style self-hosted environment (homelab.elic) running on a Proxmox VE cluster with centralized identity management.',
    problem:
      'Cloud services are opaque. I wanted hands-on ownership of the full stack — hypervisor, containers, databases, identity — the way a real ops team runs it.',
    solution:
      'Built a Proxmox VE cluster hosting Nextcloud, Paperless-ngx, and Gitea via Docker Compose, backed by PostgreSQL and Redis, with Authentik providing centralized SSO/identity across every service.',
    impact:
      'A living lab for infrastructure skills: virtualization, container orchestration, backup strategy, and identity management — all self-maintained and continuously extended.',
    techStack: ['Proxmox VE', 'Docker', 'Docker Compose', 'PostgreSQL', 'Redis', 'Authentik', 'Linux'],
    role: 'Architect & sole operator',
    links: {},
    featured: true,
    category: 'devops',
    dateRange: 'Jun 2026 – Present',
    status: 'active',
  },
  {
    slug: 'uniconnect',
    title: 'UniConnect',
    summary:
      'A full-stack student feedback platform built as the HIT 200 group project — role-based auth, real-time data, responsive UI.',
    problem:
      'Student feedback at the university flowed through slow, paper-based channels with no accountability or visibility.',
    solution:
      'Developed a Next.js + TypeScript platform with Firebase Auth for role-based access, Firestore for real-time data handling, and a responsive Tailwind CSS interface. Coordinated multi-contributor work through Git.',
    impact:
      'Streamlined the feedback loop between students and staff and shipped a working product as a coordinated team — auth, database, and UI built end to end.',
    techStack: ['Next.js', 'TypeScript', 'Firebase', 'Firestore', 'Tailwind CSS', 'Git'],
    role: 'Full-stack developer (group project)',
    links: {},
    featured: true,
    category: 'dev',
    dateRange: 'Aug 2024 – May 2025',
    status: 'shipped',
  },
  {
    slug: 'portfolio',
    title: 'Portfolio Website',
    summary:
      'This site — a long-term career platform built on a typed content layer so it grows without rewrites.',
    problem:
      'A portfolio hardcoded to one moment in a career goes stale immediately and reads as abandoned within a year.',
    solution:
      'Built on Next.js with a typed data layer: experience, projects, and skills live as structured data, not JSX. Adding a job or project is a one-entry edit. Supersedes the earlier static HTML/CSS/JS version deployed on GitHub Pages.',
    impact:
      'A recruiter-safe landing page, themed deep-dive pages, and a content architecture designed to hold 3 projects today and 30 in 2031.',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vercel'],
    role: 'Designer & developer',
    links: { repo: 'https://github.com/elic01' },
    featured: true,
    category: 'dev',
    dateRange: 'Feb 2025 – Present',
    status: 'active',
  },
]

export const featuredProjects = projects.filter((p) => p.featured)
