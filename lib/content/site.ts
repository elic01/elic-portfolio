import type { ChangelogEntry, NowItem } from './types'

/** The /now page: updated for August 2026. */
export const nowUpdated = 'August 2026'

export const nowCategories = [
  {
    category: 'Building',
    tag: 'Active Engineering',
    color: 'text-accent border-accent/30 bg-accent/10',
    entries: [
      'Proxmox VE 5-Node Cluster: expanding bare-metal virtualization with automated PBS snapshot retention and ZFS dataset tuning.',
      'Homelab Identity Layer: centralized Authentik SSO with wildcard Let’s Encrypt SSL (*.elic01.dev) across all containerized productivity tools.',
      'Full-Stack Portfolio: maintaining a type-safe Next.js 16 platform with automated Cloudflare Pages edge deployments.',
    ],
  },
  {
    category: 'Learning & Deepening',
    tag: 'Technical Growth',
    color: 'text-violet border-violet/30 bg-violet/10',
    entries: [
      'Advanced Linux Systems: systemd service management, kernel cgroups, and non-root container namespaces.',
      'Infrastructure Automation: Ansible playbooks for multi-site Cisco Meraki edge networking and declarative configuration.',
      'Zero-Trust Architecture: network segmentation, internal Technitium DNS split-horizon, and reverse proxy forward-auth.',
    ],
  },
  {
    category: 'Working On',
    tag: 'University & Projects',
    color: 'text-terminal border-terminal/30 bg-terminal/10',
    entries: [
      'Completing final-year coursework and capstone requirements for B.Tech Honours in Information Technology at Harare Institute of Technology.',
      'Documenting and publishing open-source engineering runbooks on GitHub.',
    ],
  },
  {
    category: 'Reading & Exploring',
    tag: 'Research & Labs',
    color: 'text-gold border-gold/30 bg-gold/10',
    entries: [
      'Site Reliability Engineering (SRE) discipline: failure domains, observability, and proactive monitoring metrics.',
      'Local AI Runners: experimenting with bare-metal Ollama models and workflow automation in homelab sandboxes.',
    ],
  },
  {
    category: 'Career & Opportunities',
    tag: 'Open to Roles',
    color: 'text-ember border-ember/30 bg-ember/10',
    entries: [
      'Actively open to full-time and graduate opportunities in Full-Stack Software Engineering, DevOps, and IT Systems Administration.',
      'Ready to contribute to engineering teams building reliable web applications and scalable cloud/on-premise infrastructure.',
    ],
  },
]

export const nowItems: NowItem[] = [
  {
    label: 'Status',
    detail:
      'Completed IT internship at Cimas Health Group; currently completing final year studies towards B.Tech Honours in Information Technology at Harare Institute of Technology.',
  },
  {
    label: 'Building',
    detail:
      'Extending my homelab: Proxmox VE virtualization cluster hosting Nextcloud, Paperless-ngx, and Gitea behind Authentik SSO, with PostgreSQL and Redis.',
  },
  {
    label: 'Learning',
    detail:
      'Deepening knowledge in enterprise networking, Ansible infrastructure automation, and zero-trust identity management.',
  },
  {
    label: 'Studying',
    detail:
      'Completing final B.Tech Honours in Information Technology degree capstone and coursework at Harare Institute of Technology.',
  },
]

/** Running log of career and site milestones. Newest first. */
export const changelog: ChangelogEntry[] = [
  {
    date: '2026-08',
    entry: 'Launched dedicated /homelab showcase, GitHub activity evidence layer, and ruthless interview-readiness skills architecture.',
  },
  {
    date: '2026-08',
    entry: 'Completed IT Internship at Cimas Health Group and transitioned to final degree completion phase at HIT.',
  },
  {
    date: '2026-07',
    entry: 'Rebuilt portfolio as a long-term engineering platform on a typed data architecture.',
  },
  {
    date: '2026-06',
    entry: 'Deployed multi-node Proxmox VE homelab cluster with containerized self-hosted services.',
  },
  {
    date: '2025-08',
    entry: 'Started IT Internship at Cimas Health Group.',
  },
  {
    date: '2025-05',
    entry: 'Shipped UniConnect student feedback platform for Harare Institute of Technology.',
  },
  {
    date: '2025-02',
    entry: 'Launched initial portfolio and homelab documentation on GitHub.',
  },
  {
    date: '2023-08',
    entry: 'Began B.Tech Honours in Information Technology at Harare Institute of Technology.',
  },
]
