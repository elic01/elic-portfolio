import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Activity,
  ArrowRight,
  BookOpen,
  Cpu,
  FileDown,
  Fingerprint,
  HardDrive,
  Network,
  Server,
  Shield,
  Zap,
} from 'lucide-react'
import { Reveal } from '@/components/reveal'

export const metadata: Metadata = {
  title: 'Homelab Infrastructure',
  description:
    '5-Node Proxmox VE Homelab Cluster by Emmanuel Chinjekure: bare-metal virtualization, split-horizon DNS, Authentik SSO, ZFS storage, and 15+ containerized production workloads.',
}

const hardwareNodes = [
  {
    node: 'Node 1',
    hostname: 'ctrl-node1',
    role: 'Control Plane & Telemetry',
    ip: '192.168.10.101',
    cpu: 'AMD Ryzen 5 Pro 2400G (4C/8T)',
    ram: '32 GB DDR4',
    storage: '512GB NVMe + 1TB HDD',
    services: 'Traefik v3 (Wildcard SSL), Portainer, Prometheus, Grafana, Node Exporter',
  },
  {
    node: 'Node 2',
    hostname: 'cloud-node2 & apps-node2',
    role: 'Cloud & Core Productivity',
    ip: '192.168.10.102',
    cpu: 'AMD Ryzen 5 Pro 2400G (4C/8T)',
    ram: '32 GB DDR4',
    storage: '512GB NVMe + 1TB HDD',
    services: 'Nextcloud AIO, Immich, Gitea Git Server, Vaultwarden, Paperless-ngx, PostgreSQL, Redis',
  },
  {
    node: 'Node 3',
    hostname: 'net-node3',
    role: 'Network & Zero-Trust Security',
    ip: '192.168.10.103',
    cpu: 'AMD Ryzen 5 Pro 2400G (4C/8T)',
    ram: '16 GB DDR4',
    storage: '512GB NVMe + 1TB HDD',
    services: 'Technitium Authoritative DNS, WireGuard VPN Gateway, AdGuard Home, Authentik SSO / IdP',
  },
  {
    node: 'Node 4',
    hostname: 'ai-node4',
    role: 'AI & Development Automation',
    ip: '192.168.10.104',
    cpu: 'AMD Ryzen 5 Pro 2400G (4C/8T)',
    ram: '16 GB DDR4',
    storage: '512GB NVMe + 1TB HDD',
    services: 'Ollama Local LLM Runner, n8n Workflow Automation, VS Code Server, Developer Containers',
  },
  {
    node: 'Node 5',
    hostname: 'pbs-node5',
    role: 'Disaster Recovery (PBS Bare Metal)',
    ip: '192.168.10.105',
    cpu: 'AMD Ryzen 5 Pro 2400G (4C/8T)',
    ram: '16 GB DDR4',
    storage: '512GB NVMe + 1TB HDD (ZFS Pool)',
    services: 'Proxmox Backup Server (PBS), Deduplicated Chunk Storage, Encrypted Snapshot Verification',
  },
]

const architecturalPillars = [
  {
    icon: Network,
    title: 'Split-Horizon DNS & Ingress',
    accent: 'text-accent',
    border: 'border-accent/30',
    description:
      'Uses Technitium DNS locally and Cloudflare publicly under elic01.dev. Traefik holds one Let’s Encrypt wildcard certificate for *.elic01.dev. Internal apps resolve locally with valid green-padlock HTTPS and zero exposed ports.',
  },
  {
    icon: Fingerprint,
    title: 'Centralized Identity (Authentik)',
    accent: 'text-terminal',
    border: 'border-terminal/30',
    description:
      'Authentik serves as the single source of truth for identity across the cluster. Applications use OAuth2/OIDC where native, or Traefik forward-auth proxy middleware for legacy tools with multi-factor authentication enforced.',
  },
  {
    icon: HardDrive,
    title: 'ZFS Storage & Deduplicated PBS',
    accent: 'text-violet',
    border: 'border-violet/30',
    description:
      'ZFS storage pools with tuned record sizes (16k for PostgreSQL, 64k for media). Nightly incremental backups stream to a dedicated bare-metal Proxmox Backup Server with client-side deduplication saving over 80% disk space.',
  },
  {
    icon: Shield,
    title: 'Zero-Trust Hardening & Isolation',
    accent: 'text-gold',
    border: 'border-gold/30',
    description:
      'SSH key authentication with root login disabled. Strict UFW firewall rules enforce default-deny policies. Docker workloads run in unprivileged containers with read-only root filesystems where applicable.',
  },
]

const lessonsLearned = [
  {
    title: 'Split-Horizon DNS vs Hairpin NAT Fragility',
    lesson:
      'Relying on router NAT loopback causes latency spikes and breaks when upstream WAN changes. Implementing Technitium as local authoritative DNS ensures internal traffic never leaves the LAN switch while maintaining valid public SSL certificates.',
  },
  {
    title: 'ZFS Recordsize Tuning for Relational Databases',
    lesson:
      'Default 128KB ZFS record sizes cause severe write amplification for PostgreSQL and Redis (which write in 8KB/16KB pages). Creating dedicated ZFS datasets tuned to 16KB reduced disk IOPS wear and cut query latencies significantly.',
  },
  {
    title: 'Chunk-Based Deduplication Economics',
    lesson:
      'Traditional full-VM snapshots quickly exhaust storage. Deploying Proxmox Backup Server (PBS) with chunk-level deduplication allowed retaining 30 daily snapshots across 10+ VMs using less than 20% of the total disk space.',
  },
  {
    title: 'Forward-Auth Middleware for Legacy Workloads',
    lesson:
      'Not all self-hosted software supports modern OIDC authentication out of the box. Using Traefik forward-auth with Authentik enables modern MFA and role-based access control in front of legacy services without altering upstream container images.',
  },
]

export default function HomelabPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24 pt-24">
      {/* Hero Section */}
      <Reveal>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet/30 bg-violet/10 px-3.5 py-1 text-xs font-mono text-violet">
          <Server className="size-3.5" aria-hidden="true" />
          5-Node Bare-Metal Cluster
        </div>
        <p className="mb-2 font-mono text-sm text-ember">
          <span className="text-muted-foreground">$</span> pvecm status
        </p>
        <h1 className="mb-4 text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          Homelab Infrastructure
        </h1>
        <p className="mb-8 max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          A production-style private cloud built from bare metal on five HP EliteDesk nodes.
          Designed to model enterprise infrastructure: hypervisor clustering, declarative container workloads,
          split-horizon DNS, zero-trust identity management, and automated disaster recovery.
        </p>
      </Reveal>

      {/* Cluster Quick Metric Bar */}
      <Reveal delay={0.05}>
        <div className="mb-14 grid gap-4 grid-cols-2 md:grid-cols-4">
          <div className="neu-card rounded-2xl p-5 border border-white/5 bg-card/60">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Cluster Nodes</p>
            <p className="mt-2 text-2xl font-bold text-foreground">5 Nodes</p>
            <p className="font-mono text-xs text-accent">Proxmox VE 8.x</p>
          </div>
          <div className="neu-card rounded-2xl p-5 border border-white/5 bg-card/60">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Total Memory</p>
            <p className="mt-2 text-2xl font-bold text-foreground">112 GB</p>
            <p className="font-mono text-xs text-violet">DDR4 ECC &amp; Non-ECC</p>
          </div>
          <div className="neu-card rounded-2xl p-5 border border-white/5 bg-card/60">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Live Workloads</p>
            <p className="mt-2 text-2xl font-bold text-foreground">15+ Services</p>
            <p className="font-mono text-xs text-terminal">Docker Compose &amp; VMs</p>
          </div>
          <div className="neu-card rounded-2xl p-5 border border-white/5 bg-card/60">
            <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Identity &amp; SSL</p>
            <p className="mt-2 text-2xl font-bold text-foreground">Authentik SSO</p>
            <p className="font-mono text-xs text-gold">Wildcard *.elic01.dev</p>
          </div>
        </div>
      </Reveal>

      {/* Visual System Architecture Diagram */}
      <Reveal delay={0.08}>
        <section aria-labelledby="arch-heading" className="mb-16">
          <h2 id="arch-heading" className="mb-6 font-mono text-xl font-bold text-foreground flex items-center gap-2">
            <Network className="size-5 text-accent" aria-hidden="true" />
            <span>End-to-End System Architecture</span>
          </h2>
          <div className="rounded-2xl border border-accent/20 bg-black/90 p-6 shadow-2xl overflow-hidden">
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3 font-mono text-xs text-muted-foreground">
              <span className="text-accent">Cluster Ingress &amp; Identity Topology</span>
              <span>elic-homelab.internal</span>
            </div>
            <pre className="overflow-x-auto font-mono text-xs text-muted-foreground leading-relaxed">
              <code>{`                      Public Internet                            Local LAN Devices (192.168.10.0/24)
                             │                                                   │
                   Cloudflare Edge / Proxy                                Technitium Local DNS (Node 3)
                   (External DNS & WAF)                                   (Resolves *.elic01.dev to LAN IPs)
                             │                                                   │
                             └─────────────────────────┬─────────────────────────┘
                                                       ▼
                                     Traefik Reverse Proxy (Node 1)
                                   (Wildcard Let's Encrypt *.elic01.dev)
                                                       │
                           ┌───────────────────────────┴───────────────────────────┐
                           ▼                                                       ▼
                Authentik Identity Provider (Node 3)                      Internal Routing Middleware
                (SSO / OIDC / Forward-Auth & MFA)                         (IP Whitelist & Rate Limiting)
                           │                                                       │
                           └───────────────────────────┬───────────────────────────┘
                                                       ▼
                                            Docker Workload Host VMs
        ┌──────────────────────────────┬──────────────────────────────┬──────────────────────────────┐
        ▼                              ▼                              ▼                              ▼
Node 1 (Control Plane)        Node 2 (Productivity)          Node 3 (Net & Sec)             Node 4 (AI & Dev)
• Portainer Management        • Nextcloud Collaboration      • Technitium DNS               • Ollama Local LLMs
• Prometheus Telemetry        • Immich Photo Backup          • WireGuard VPN                • n8n Automation
• Grafana Dashboards          • Gitea Source Control         • AdGuard Home DNS             • VS Code Server
• PostgreSQL & Redis          • Paperless-ngx & Vault        • Authentik Server             • Dev Sandboxes
        └──────────────────────────────┴──────────────────────────────┴──────────────────────────────┘
                                                       │
                                          Automated Scheduled Snapshots
                                                       ▼
                                   Node 5: Proxmox Backup Server (PBS)
                              (Deduplicated ZFS Storage Pool & Verification)`}</code>
            </pre>
          </div>
        </section>
      </Reveal>

      {/* Hardware Breakdown Table */}
      <Reveal delay={0.1}>
        <section aria-labelledby="hardware-heading" className="mb-16">
          <h2 id="hardware-heading" className="mb-6 font-mono text-xl font-bold text-foreground flex items-center gap-2">
            <Cpu className="size-5 text-violet" aria-hidden="true" />
            <span>Hardware &amp; Node Allocation</span>
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-card/60 backdrop-blur-xl">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 bg-secondary/50 font-mono uppercase text-muted-foreground">
                <tr>
                  <th className="p-4">Node</th>
                  <th className="p-4">Role &amp; Hostname</th>
                  <th className="p-4">CPU &amp; RAM</th>
                  <th className="p-4">Storage</th>
                  <th className="p-4">Workloads Hosted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {hardwareNodes.map((item) => (
                  <tr key={item.node} className="transition-colors hover:bg-secondary/30">
                    <td className="p-4 font-mono font-bold text-foreground whitespace-nowrap">{item.node}</td>
                    <td className="p-4 whitespace-nowrap">
                      <p className="font-semibold text-foreground">{item.role}</p>
                      <p className="font-mono text-[11px] text-muted-foreground">{item.hostname} · {item.ip}</p>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <p className="text-foreground">{item.cpu}</p>
                      <p className="font-mono text-[11px] text-accent">{item.ram}</p>
                    </td>
                    <td className="p-4 font-mono text-muted-foreground whitespace-nowrap">{item.storage}</td>
                    <td className="p-4 text-muted-foreground leading-relaxed">{item.services}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </Reveal>

      {/* Key Architectural Pillars */}
      <Reveal delay={0.12}>
        <section aria-labelledby="pillars-heading" className="mb-16">
          <h2 id="pillars-heading" className="mb-6 font-mono text-xl font-bold text-foreground flex items-center gap-2">
            <Zap className="size-5 text-gold" aria-hidden="true" />
            <span>Core Architectural Pillars</span>
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {architecturalPillars.map((pillar) => (
              <article
                key={pillar.title}
                className={`neu-card neu-card-hover flex flex-col justify-between rounded-2xl border p-6 backdrop-blur-xl ${pillar.border}`}
              >
                <div>
                  <div className="mb-4 flex items-center gap-2.5">
                    <pillar.icon className={`size-5 ${pillar.accent}`} aria-hidden="true" />
                    <h3 className="font-bold text-base text-foreground">{pillar.title}</h3>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">{pillar.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Lessons Learned Section */}
      <Reveal delay={0.14}>
        <section aria-labelledby="lessons-heading" className="mb-16">
          <h2 id="lessons-heading" className="mb-6 font-mono text-xl font-bold text-foreground flex items-center gap-2">
            <Activity className="size-5 text-terminal" aria-hidden="true" />
            <span>Engineering Decisions &amp; Lessons Learned</span>
          </h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {lessonsLearned.map((item, idx) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-card/60 p-6 backdrop-blur-xl">
                <div className="mb-2 flex items-center gap-2">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-accent/10 font-mono text-xs font-bold text-accent">
                    {idx + 1}
                  </span>
                  <h3 className="font-semibold text-sm text-foreground">{item.title}</h3>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground mt-2">{item.lesson}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Guide CTA Callout */}
      <Reveal delay={0.16}>
        <div className="neu-card rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/10 via-card to-card p-8 backdrop-blur-2xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
                Full Step-By-Step Runbook
              </p>
              <h2 className="mt-1 text-2xl font-bold text-foreground">
                Read the Complete Homelab Build Guide
              </h2>
              <p className="mt-2 max-w-xl text-xs leading-relaxed text-muted-foreground">
                Explore the complete technical runbook covering physical hardware prep, Proxmox clustering commands,
                Docker Compose stacks, split-horizon DNS configurations, and PBS backup verification.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/homelab/runbook"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 font-mono text-xs font-semibold text-accent-foreground shadow-[0_0_20px_rgba(0,201,167,0.3)] transition-transform hover:scale-105"
              >
                <BookOpen className="size-4" />
                Open Interactive Runbook
              </Link>
              <a
                href="/elic-homelab-guide-v2.md"
                download="elic-homelab-infrastructure-guide-v2.md"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-secondary/80 px-4 py-2.5 font-mono text-xs font-medium text-foreground transition-colors hover:bg-secondary hover:text-accent"
                title="Download raw Markdown guide"
              >
                <FileDown className="size-4" />
                Download .MD
              </a>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 font-mono text-xs font-medium text-foreground transition-colors hover:bg-secondary"
              >
                All Projects
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </main>
  )
}
