'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2, Send } from 'lucide-react'
import { profile } from '@/lib/content/profile'

const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(3, 'Please enter a subject'),
  message: z.string().min(10, 'Please write at least a short message'),
  // Honeypot field (must stay empty)
  company: z.string().max(0).optional(),
})

type ContactValues = z.infer<typeof contactSchema>

export function ContactForm() {
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactValues>({ resolver: zodResolver(contactSchema) })

  function onSubmit(values: ContactValues) {
    if (values.company) return // honeypot triggered
    const body = `${values.message}\n\nFrom: ${values.name} (${values.email})`
    const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(values.subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailto
    setSent(true)
  }

  if (sent) {
    return (
      <div className="glass-panel flex flex-col items-center gap-3 rounded-2xl p-10 text-center">
        <CheckCircle2 className="size-10 text-success" aria-hidden="true" />
        <p className="text-lg font-medium text-foreground">Your email client should now be open.</p>
        <p className="text-sm text-muted-foreground">
          If nothing happened, email me directly at{' '}
          <a href={`mailto:${profile.email}`} className="text-accent underline underline-offset-4">
            {profile.email}
          </a>
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-name" className="text-sm font-medium text-foreground">
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            aria-invalid={!!errors.name}
            className="rounded-lg border border-border bg-input px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-2 focus:outline-accent"
            placeholder="Your name"
            {...register('name')}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="contact-email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            className="rounded-lg border border-border bg-input px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-2 focus:outline-accent"
            placeholder="you@company.com"
            {...register('email')}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-subject" className="text-sm font-medium text-foreground">
          Subject
        </label>
        <input
          id="contact-subject"
          type="text"
          aria-invalid={!!errors.subject}
          className="rounded-lg border border-border bg-input px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-2 focus:outline-accent"
          placeholder="What's this about?"
          {...register('subject')}
        />
        {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-message" className="text-sm font-medium text-foreground">
          Message
        </label>
        <textarea
          id="contact-message"
          rows={5}
          aria-invalid={!!errors.message}
          className="resize-y rounded-lg border border-border bg-input px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-2 focus:outline-accent"
          placeholder="Tell me about the role or project..."
          {...register('message')}
        />
        {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
      </div>

      {/* Honeypot field (hidden from real users) */}
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" type="text" tabIndex={-1} autoComplete="off" {...register('company')} />
      </div>

      <button
        type="submit"
        className="inline-flex w-fit items-center gap-2 rounded-xl bg-accent px-6 py-3 font-medium text-accent-foreground transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
      >
        <Send className="size-4" aria-hidden="true" />
        Send Message
      </button>
    </form>
  )
}
