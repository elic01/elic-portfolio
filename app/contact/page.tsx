import type { Metadata } from 'next'
import { ContactSection } from '@/components/contact-section'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Emmanuel Chinjekure, full-stack developer and systems administrator based in Harare, Zimbabwe. Open to software, DevOps, and IT engineering roles.',
}

export default function ContactPage() {
  return (
    <main className="pt-16">
      <ContactSection headingId="contact-page-heading" />
    </main>
  )
}
