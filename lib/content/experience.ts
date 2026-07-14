import type { Experience } from './types'

/**
 * Append-only career history. Newest first.
 * To add a job: copy an entry, edit the fields, done.
 */
export const experience: Experience[] = [
  {
    role: 'IT Intern',
    company: 'Cimas Health Group',
    location: 'Harare, Zimbabwe',
    startDate: '2025-08',
    endDate: '2026-07',
    description: [
      'Supported enterprise IT infrastructure and resolved network and system tickets within a high-compliance health group environment.',
      'Assisted in managing daily operational workflows across the group\u2019s IT estate.',
      'Worked in a structured, professional team environment with a high standard of accountability and attention to detail.',
    ],
    skills: ['Enterprise IT', 'Networking', 'Ticket Resolution', 'Windows Server', 'Compliance'],
    type: 'internship',
  },
  {
    role: 'Fuel Attendant',
    company: 'City Fuels',
    location: 'Harare, Zimbabwe',
    startDate: '2024-12',
    endDate: '2025-02',
    description: [
      'Delivered fast, accurate service handling fuel transactions in a high-pressure environment.',
      'Strengthened communication, problem-solving, and customer service skills.',
    ],
    skills: ['Customer Service', 'Reliability', 'Problem Solving'],
    type: 'contract',
  },
]
