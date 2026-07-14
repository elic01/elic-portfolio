export type ExperienceType = 'internship' | 'fulltime' | 'contract' | 'parttime'

export interface Experience {
  role: string
  company: string
  location: string
  startDate: string // "YYYY-MM"
  endDate: string | null // null = present
  description: string[]
  skills: string[]
  type: ExperienceType
}

export type ProjectCategory = 'dev' | 'security' | 'devops'

export interface Project {
  slug: string
  title: string
  summary: string
  problem: string
  solution: string
  impact: string
  techStack: string[]
  role: string
  links: { repo?: string; demo?: string }
  featured: boolean
  category: ProjectCategory
  dateRange: string
  status: 'active' | 'shipped' | 'archived'
}

export interface SkillGroup {
  category: string
  accent: 'accent' | 'gold' | 'violet' | 'ember' | 'terminal' | 'info'
  skills: { name: string; proficiency: 1 | 2 | 3 | 4 | 5; since: string }[]
}

export interface Education {
  degree: string
  institution: string
  startDate: string
  endDate: string | null
  note?: string
}

export interface Organization {
  name: string
  role: string
  since: string
  description: string
}

export interface Testimonial {
  quote: string
  author: string
  title: string
}

export interface ChangelogEntry {
  date: string
  entry: string
}

export interface NowItem {
  label: string
  detail: string
}
