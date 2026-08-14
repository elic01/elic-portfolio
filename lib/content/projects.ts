import type { Project } from './types'

/**
 * Project portfolio populated from GitHub repositories (github.com/elic01).
 * Newest / most important first.
 */
export const projects: Project[] = [
  {
    slug: 'cisco-meraki-ansible',
    title: 'Cisco Meraki Ansible Automation',
    summary:
      'Infrastructure-as-Code (IaC) playbooks for automated provisioning, policy enforcement, and audit management of Cisco Meraki networks.',
    problem:
      'Manual network configuration across distributed enterprise environments is error-prone, slow to audit, and hard to standardize.',
    solution:
      'Engineered automated Ansible playbooks leveraging the Cisco Meraki REST API to manage network SSIDs, firewall rules, and VLAN configurations as code.',
    impact:
      'Standardized network deployment workflows, reduced configuration drift, and streamlined infrastructure auditing.',
    techStack: ['Python', 'Ansible', 'Cisco Meraki API', 'YAML', 'DevOps'],
    role: 'Infrastructure Automation Developer',
    links: { repo: 'https://github.com/elic01/cisco-meraki-ansible' },
    featured: true,
    category: 'devops',
    dateRange: 'Aug 2026',
    status: 'shipped',
  },
  {
    slug: 'vulnerability-assessment-toolkit',
    title: 'Vulnerability Assessment Toolkit',
    summary:
      'An automated security auditing shell toolkit designed for rapid reconnaissance, port scanning analysis, and system vulnerability assessment.',
    problem:
      'System administrators need fast, repeatable security checks to identify exposed ports, weak permissions, and outdated network services.',
    solution:
      'Developed a modular shell toolkit integrating Nmap, security audit scripts, and automated log reporting to evaluate system attack surfaces.',
    impact:
      'Accelerated security assessment workflows and established reusable baseline auditing scripts for lab and test environments.',
    techStack: ['Shell', 'Linux', 'Nmap', 'Security Auditing', 'Bash'],
    role: 'Security Tooling Developer',
    links: { repo: 'https://github.com/elic01/vulnerability-assessment-toolkit' },
    featured: true,
    category: 'security',
    dateRange: 'Aug 2026',
    status: 'shipped',
  },
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
    links: { repo: 'https://github.com/elic01' },
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
    links: { repo: 'https://github.com/elic01/uniconnect' },
    featured: true,
    category: 'dev',
    dateRange: 'Aug 2024 – May 2025',
    status: 'shipped',
  },
  {
    slug: 'healthcare-portal',
    title: 'Healthcare Management Portal',
    summary:
      'A comprehensive web portal designed for healthcare workflow management, patient interaction, and clinical record tracking.',
    problem:
      'Healthcare facilities require structured digital interfaces to handle patient data safely and efficiently.',
    solution:
      'Built a responsive healthcare management application with structured patient dashboard interfaces, appointment workflows, and role-based view controls.',
    impact:
      'Demonstrated web application development tailored specifically to health IT environments and enterprise medical workflows.',
    techStack: ['TypeScript', 'HTML5', 'JavaScript', 'CSS3', 'Healthcare IT'],
    role: 'Frontend Developer',
    links: { repo: 'https://github.com/elic01/healthcare-portal' },
    featured: true,
    category: 'dev',
    dateRange: 'Feb 2026',
    status: 'shipped',
  },
  {
    slug: 'fleettrack',
    title: 'FleetTrack Vehicle Management',
    summary:
      'A web application for vehicle fleet tracking, route logging, and maintenance scheduling.',
    problem:
      'Organizations managing transportation assets need centralized visibility into vehicle logs, service intervals, and driver assignments.',
    solution:
      'Architected a modern TypeScript application providing real-time fleet dashboards, service alert systems, and structured vehicle reporting.',
    impact:
      'Improved asset management efficiency and created a scalable web architecture for fleet telematics.',
    techStack: ['TypeScript', 'Next.js', 'Tailwind CSS', 'Node.js'],
    role: 'Full-Stack Developer',
    links: { repo: 'https://github.com/elic01/fleettrack' },
    featured: false,
    category: 'dev',
    dateRange: 'Aug 2026',
    status: 'active',
  },
  {
    slug: 'ladyonyxweb',
    title: 'Lady Onyx Transport Ecosystem',
    summary:
      'Multi-tier transport and logistics system comprising client and driver apps backed by a web administration portal.',
    problem:
      'Dispatch and transport management requires synchronized real-time coordination across web controllers and mobile end-users.',
    solution:
      'Developed full-stack web interfaces in TypeScript alongside Flutter mobile clients for seamless multi-platform interaction.',
    impact:
      'Delivered a unified cross-platform product suite connecting administrative oversight with mobile operations.',
    techStack: ['TypeScript', 'Dart', 'Flutter', 'React', 'REST API'],
    role: 'Full-Stack & Mobile Developer',
    links: { repo: 'https://github.com/elic01/ladyonyxweb' },
    featured: false,
    category: 'dev',
    dateRange: 'Aug 2026',
    status: 'active',
  },
  {
    slug: 'portfolio',
    title: 'Portfolio Website',
    summary:
      'This site — a long-term career platform built on a typed content layer so it grows without rewrites.',
    problem:
      'A portfolio hardcoded to one moment in a career goes stale immediately and reads as abandoned within a year.',
    solution:
      'Built on Next.js with a typed data layer: experience, projects, and skills live as structured data, not JSX. Adding a job or project is a one-entry edit.',
    impact:
      'A recruiter-safe landing page, themed deep-dive pages, and a content architecture designed to scale seamlessly.',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vercel'],
    role: 'Designer & developer',
    links: { repo: 'https://github.com/elic01/elic-portfolio' },
    featured: true,
    category: 'dev',
    dateRange: 'Feb 2025 – Present',
    status: 'active',
  },
]

export const featuredProjects = projects.filter((p) => p.featured)
