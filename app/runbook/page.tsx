import type { Metadata } from 'next'
import { getRunbookData } from '@/lib/runbook'
import { RunbookViewer } from '@/components/runbook/runbook-viewer'

export const metadata: Metadata = {
  title: 'Homelab Infrastructure Runbook | Elic Portfolio',
  description:
    'Full technical deployment runbook for a 5-node HP EliteDesk Proxmox VE 8.x cluster with PBS backup server, Docker Compose stacks, and split-horizon DNS.',
}

export default function StandaloneRunbookPage() {
  const runbookData = getRunbookData()

  return <RunbookViewer data={runbookData} />
}
