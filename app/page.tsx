import { Hero } from '@/components/home/hero'
import { AboutSection } from '@/components/home/about-section'
import { FeaturedProjects } from '@/components/home/featured-projects'
import { SkillsPreview } from '@/components/home/skills-preview'
import { ExperienceTimeline } from '@/components/home/experience-timeline'
import { ContactSection } from '@/components/contact-section'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <AboutSection />
      <FeaturedProjects />
      <SkillsPreview />
      <ExperienceTimeline />
      <ContactSection />
    </main>
  )
}
