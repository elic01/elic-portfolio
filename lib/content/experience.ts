import type { Experience } from './types'

/**
 * Append-only career history. Newest first.
 */
export const experience: Experience[] = [
  {
    role: 'IT Intern',
    company: 'Cimas Health Group',
    location: 'Harare, Zimbabwe',
    startDate: '2025-08',
    endDate: '2026-07',
    description: [
      'Supported core enterprise IT infrastructure, Active Directory domain services, and end-user systems across a high-compliance healthcare network.',
      'Diagnosed and resolved complex network connectivity, hardware, and software incident tickets within defined SLA targets.',
      'Assisted system administrators with routine maintenance, backup verifications, and IT asset tracking across the organization.',
      'Maintained strict adherence to medical data privacy and IT governance compliance standards.',
    ],
    skills: [
      'Enterprise IT',
      'Network Troubleshooting',
      'Active Directory',
      'Windows Server',
      'Incident Resolution',
      'IT Compliance',
    ],
    type: 'internship',
  },
]
