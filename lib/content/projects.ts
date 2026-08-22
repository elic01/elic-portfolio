import type { Project } from './types'

/**
 * Project portfolio populated from GitHub repositories (github.com/elic01).
 * High-impact technical projects ordered by architectural depth with full case study evidence.
 */
export const projects: Project[] = [
  {
    slug: 'homelab',
    title: 'Homelab Infrastructure & Self-Hosting',
    summary:
      'A production-grade self-hosted infrastructure cluster hosting 15+ containerized services, split-horizon DNS, and automated backups on Proxmox VE.',
    problem:
      'Public cloud environments abstract away underlying hypervisors, storage, and networking layers. I needed bare-metal control to master enterprise virtualization, container orchestration, and failover mechanics.',
    solution:
      'Engineered a multi-node Proxmox VE cluster hosting Nextcloud, Gitea, Paperless-ngx, and Vaultwarden via Docker Compose. Implemented PostgreSQL and Redis data backends, split-horizon DNS routing, and Authentik for centralized SSO/OIDC identity management.',
    impact:
      'Maintains 15+ containerized daily productivity services with automated ZFS snapshot backups, split-horizon DNS routing, and centralized Authentik SSO authentication, eliminating reliance on third-party cloud tools.',
    techStack: ['Proxmox VE', 'Docker', 'Docker Compose', 'PostgreSQL', 'Redis', 'Authentik', 'Linux', 'ZFS'],
    role: 'Infrastructure Architect & Sole Operator',
    links: { repo: 'https://github.com/elic01', guide: '/elic-homelab-guide-v2.md' },
    featured: true,
    category: 'devops',
    dateRange: 'Jun 2026 – Present',
    status: 'active',
    architectureDiagram: `                Public Internet / Local Network
                               │
                     Cloudflare DNS / Proxy
                               │
               Traefik Reverse Proxy (*.elic01.dev)
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
        Authentik SSO (IdP)          Containerized Services
      (OAuth2 / OIDC / LDAP)       (Nextcloud, Gitea, Immich)
               │                               │
               └───────────────┬───────────────┘
                               ▼
                      Proxmox VE Cluster
                    (5x EliteDesk Nodes)
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
       PostgreSQL / Redis              ZFS / PBS Backups`,
    highlights: [
      '5-Node Bare-metal Proxmox VE cluster running on AMD Ryzen hardware.',
      'Split-horizon DNS architecture resolving *.elic01.dev with wildcard Let’s Encrypt certificates.',
      'Centralized Authentik identity provider protecting Nextcloud, Paperless-ngx, and Gitea.',
      'Automated Proxmox Backup Server (PBS) scheduled snapshots and deduplicated storage retention.',
    ],
  },
  {
    slug: 'cisco-meraki-ansible',
    title: 'Cisco Meraki Ansible Automation',
    summary:
      'Infrastructure-as-Code (IaC) playbooks that automate multi-site VLAN provisioning, firewall policy rollout, and configuration compliance checks across Cisco Meraki hardware.',
    problem:
      'Configuring enterprise network appliances manually via GUI dashboards introduces human error, configuration drift across branch sites, and slow rollback times during network incidents.',
    solution:
      'Engineered modular Ansible playbooks that interface directly with the Cisco Meraki REST API to push declarative firewall rules, manage SSID profiles, and enforce VLAN policies from Git repositories.',
    impact:
      'Automated multi-site network configuration via declarative playbooks, reducing manual dashboard provisioning steps to a single executable script with complete Git-based change tracking.',
    techStack: ['Python', 'Ansible', 'Cisco Meraki API', 'YAML', 'DevOps', 'Network Automation'],
    role: 'Infrastructure Automation Developer',
    links: { repo: 'https://github.com/elic01/cisco-meraki-ansible' },
    featured: true,
    category: 'devops',
    dateRange: 'Aug 2026',
    status: 'shipped',
    architectureDiagram: `Git Repository (IaC) ──► Ansible Engine ──► Meraki REST API ──► Enterprise Edge Hardware
 (declarative YAML)        (playbook tasks)   (HTTPS / Token)       (VLANs, SSIDs, Firewall)`,
    highlights: [
      'Declarative Infrastructure-as-Code eliminates manual configuration drift across branch sites.',
      'Automated VLAN allocation, guest isolation, and egress filtering rules.',
      'Full Git revision history enabling instant rollback during network configuration incidents.',
    ],
  },
  {
    slug: 'vulnerability-assessment-toolkit',
    title: 'Vulnerability Assessment Toolkit',
    summary:
      'An automated security auditing shell suite designed for rapid reconnaissance, port scanning analysis, and system attack surface evaluation.',
    problem:
      'System administrators need fast, repeatable security checks to identify exposed ports, weak permissions, and outdated network services without relying on heavy proprietary scanners.',
    solution:
      'Developed a modular Bash and Python auditing suite integrating Nmap scripting engine (NSE), firewall rule audits, and permission scanners with structured markdown and JSON log output.',
    impact:
      'Automated repetitive port scanning, service versioning, and attack surface enumeration, replacing manual CLI triage with structured JSON and Markdown audit reports.',
    techStack: ['Shell', 'Linux', 'Nmap', 'Security Auditing', 'Bash', 'Python'],
    role: 'Security Tooling Developer',
    links: { repo: 'https://github.com/elic01/vulnerability-assessment-toolkit' },
    featured: true,
    category: 'security',
    dateRange: 'Aug 2026',
    status: 'shipped',
    architectureDiagram: `Target Network / IP ──► Host & Port Recon ──► NSE Vulnerability Audits ──► Structured Report
 (CIDR Input Range)        (Nmap Engine)          (CVE & Service Probes)       (Markdown & JSON)`,
    highlights: [
      'Automates multi-phase network reconnaissance and service fingerprinting.',
      'Integrates Nmap Scripting Engine (NSE) for common vulnerability and misconfiguration detection.',
      'Generates machine-parsable JSON output and clean Markdown audit summaries.',
    ],
  },
  {
    slug: 'healthcare-portal',
    title: 'Healthcare Management Portal',
    summary:
      'A comprehensive web portal designed for clinical workflow management, patient records, and appointment tracking in high-compliance healthcare environments.',
    problem:
      'Healthcare facilities require structured digital interfaces to handle patient intake, clinician scheduling, and sensitive medical records safely and efficiently.',
    solution:
      'Built a responsive TypeScript web application featuring role-separated portals for doctors, receptionists, and patients, complete with appointment workflows, prescription logs, and role-based access control.',
    impact:
      'Implemented role-separated clinical workflows with strict role-based access control (RBAC), structured appointment scheduling, and audit-ready patient records.',
    techStack: ['TypeScript', 'Next.js', 'React', 'Tailwind CSS', 'Healthcare IT'],
    role: 'Full-Stack Developer',
    links: { repo: 'https://github.com/elic01/healthcare-portal' },
    featured: true,
    category: 'dev',
    dateRange: 'Feb 2026',
    status: 'shipped',
    images: [
      { url: '/healthcare-portal-home.png', caption: 'Clinical Dashboard & Patient Management Overview' },
      { url: '/healthcare-portal-features.png', caption: 'Feature Breakdown & Appointment Scheduling System' },
    ],
    architectureDiagram: `Next.js Web App ──► RBAC Auth Middleware ──► Clinical Controllers ──► Encrypted Health DB
(Doctor/Patient UI)  (Session Verification)  (Intake, Prescriptions) (Audit Trail Logs)`,
    highlights: [
      'Role-separated interfaces for doctors, receptionists, and patients.',
      'Digital patient intake, scheduling workflows, and prescription tracking.',
      'Designed with strict data boundaries mirroring enterprise health compliance standards.',
    ],
  },
  {
    slug: 'uniconnect',
    title: 'UniConnect Student Feedback Platform',
    summary:
      'A full-stack student feedback platform built for Harare Institute of Technology with role-based auth, real-time analytics, and responsive UI.',
    problem:
      'Student feedback at the university flowed through slow, paper-based channels with no visibility, tracking, or accountability.',
    solution:
      'Developed a Next.js and TypeScript platform with Firebase Auth for role-based access, Firestore for real-time data handling, and a responsive Tailwind CSS interface. Coordinated multi-contributor development through Git.',
    impact:
      'Built and deployed an end-to-end feedback platform connecting students with departmental academic staff, replacing paper-based complaints with real-time status tracking.',
    techStack: ['Next.js', 'TypeScript', 'Firebase', 'Firestore', 'Tailwind CSS', 'Git'],
    role: 'Full-Stack Developer (Group Project Lead)',
    links: { repo: 'https://github.com/elic01/uniconnect' },
    featured: true,
    category: 'dev',
    dateRange: 'Aug 2024 – May 2025',
    status: 'shipped',
    images: [
      { url: '/uniconnect-landing.png', caption: 'UniConnect Platform Landing Page & Navigation' },
      { url: '/uniconnect-student-dashboard.png', caption: 'Student Dashboard & Feedback Submission Portal' },
      { url: '/uniconnect-login.png', caption: 'Role-Based Authentication & Institutional Login' },
      { url: '/uniconnect-about.png', caption: 'System Architecture & Platform Overview' },
    ],
    architectureDiagram: `Next.js Frontend ──► Firebase Auth (RBAC) ──► Firestore Realtime DB ──► Staff Triage Dashboard
(Student Portal)      (Institutional Login)    (Live Ticket Updates)       (Resolution Workflow)`,
    highlights: [
      'Led group engineering and Git collaboration for HIT campus platform.',
      'Real-time status updates and department-level issue routing.',
      'Responsive interface optimized for mobile and desktop campus devices.',
    ],
  },
  {
    slug: 'fleettrack',
    title: 'FleetTrack Vehicle Management',
    summary:
      'A web application for commercial vehicle fleet tracking, route logging, and maintenance scheduling.',
    problem:
      'Organizations managing transportation assets need centralized visibility into vehicle logs, service intervals, and driver assignments.',
    solution:
      'Architected a modern TypeScript application providing real-time fleet dashboards, maintenance alert systems, and structured vehicle utilization reporting.',
    impact:
      'Delivered a centralized vehicle tracking dashboard providing service interval alerts and driver activity logging.',
    techStack: ['TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js'],
    role: 'Full-Stack Developer',
    links: { repo: 'https://github.com/elic01/fleettrack' },
    featured: false,
    category: 'dev',
    dateRange: 'Aug 2026',
    status: 'active',
    images: [
      { url: '/fleettrack-dashboard.png', caption: 'FleetTrack Commercial Vehicle Telematics Dashboard' },
    ],
    highlights: [
      'Centralized fleet dashboard with real-time vehicle telematics and status logs.',
      'Automated maintenance scheduling alerts based on mileage and service intervals.',
    ],
  },
  {
    slug: 'ladyonyxweb',
    title: 'Lady Onyx Transport Ecosystem',
    summary:
      'Multi-tier transport and logistics platform comprising client and driver apps backed by a web administration portal.',
    problem:
      'Dispatch and transport management requires synchronized real-time coordination across web controllers and mobile end-users.',
    solution:
      'Developed full-stack web interfaces in TypeScript alongside Flutter mobile clients for seamless multi-platform interaction.',
    impact:
      'Delivered a unified cross-platform product suite connecting administrative dispatch oversight with mobile customer bookings.',
    techStack: ['TypeScript', 'Dart', 'Flutter', 'React', 'REST API'],
    role: 'Full-Stack & Mobile Developer',
    links: { repo: 'https://github.com/elic01/ladyonyxweb' },
    featured: false,
    category: 'dev',
    dateRange: 'Aug 2026',
    status: 'active',
    images: [
      { url: '/lady-onyx-web.png', caption: 'Lady Onyx Transport Web Administration Portal' },
    ],
    highlights: [
      'Multi-tier dispatch ecosystem connecting administrators, drivers, and clients.',
      'Cross-platform synchronization between web admin console and mobile client apps.',
    ],
  },
  {
    slug: 'portfolio',
    title: 'Portfolio & Infrastructure Showcase',
    summary:
      'This site: a long-term career platform built with Next.js 16, TypeScript, and Cloudflare Pages with automated CI/CD.',
    problem:
      'Hardcoded portfolio websites go stale quickly, lack type safety, and require manual FTP/build steps that discourage regular updates.',
    solution:
      'Architected a Next.js App Router application on a typed data layer with GitHub Actions automated deployment to Cloudflare Pages edge network.',
    impact:
      'Production platform featuring strict TypeScript validation, global security headers, and automated Git-based edge deployments.',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Cloudflare Pages', 'GitHub Actions'],
    role: 'Designer & Developer',
    links: { repo: 'https://github.com/elic01/elic-portfolio' },
    featured: false,
    category: 'dev',
    dateRange: 'Feb 2025 – Present',
    status: 'active',
    architectureDiagram: `GitHub Repository ──► GitHub Actions (CI/CD) ──► Cloudflare Edge Pages ──► Global CDN (HTTPS)
 (main branch)          (lint, typecheck, build)   (Static Export / Headers)   (elic01.dev)`,
    highlights: [
      'Typed data architecture allowing instant updates without editing page JSX.',
      'Integrated security headers (CSP, HSTS, Permissions-Policy, RFC 9116 security.txt).',
      'Automated CI/CD pipeline deploying static exports to Cloudflare edge network.',
    ],
  },
]

export const featuredProjects = projects.filter((p) => p.featured)
