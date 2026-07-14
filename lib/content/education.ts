import type { Education, Organization, Testimonial } from './types'

export const education: Education[] = [
  {
    degree: 'B.Tech Honours in Information Technology',
    institution: 'Harare Institute of Technology',
    startDate: '2023-08',
    endDate: null,
    note: 'Expected graduation: August 2027',
  },
]

/** Certifications accumulate independently of jobs — append here as earned. */
export const certifications: { name: string; issuer: string; year: string }[] = []

export const organizations: Organization[] = [
  {
    name: 'GDG on Campus HIT',
    role: 'Member',
    since: '2023',
    description:
      'Active participant in technical workshops and regional events including DevFest and Build with AI Harare.',
  },
  {
    name: 'Microsoft Learn Student Ambassadors',
    role: 'Member',
    since: '2023',
    description:
      'Engaging with Microsoft platforms and student community resources to promote technology literacy on campus.',
  },
  {
    name: 'HIT ISACA',
    role: 'Member',
    since: '2024',
    description:
      'Cybersecurity and IT governance — building foundations in information systems auditing and security protocols.',
  },
  {
    name: 'UNESCO O3 Plus',
    role: 'Peer Educator & Entertainment Director',
    since: '2024',
    description:
      'Leading student-focused events and health/wellness communication — logistics, planning, and crowd management.',
  },
]

/** Grow this as recommendations accumulate. Referee contact details stay private. */
export const testimonials: Testimonial[] = []
