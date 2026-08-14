'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Download, Menu, X } from 'lucide-react'
import { profile } from '@/lib/content/profile'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/cybersecurity', label: 'Cybersecurity' },
  { href: '/devops', label: 'DevOps' },
  { href: '/now', label: 'Now' },
  { href: '/contact', label: 'Contact' },
]

export function SiteNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-background/70 backdrop-blur-xl transition-all duration-300">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6"
      >
        <Link
          href="/"
          className="font-mono text-sm font-semibold tracking-tight text-foreground transition-colors hover:text-accent"
        >
          <span className="text-accent">~/</span>
          {profile.handle}
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-lg px-3.5 py-2 font-mono text-xs transition-all duration-200',
                pathname === item.href
                  ? 'bg-secondary/90 text-foreground font-semibold shadow-sm'
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground',
              )}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={profile.cvPath}
            download
            className="ml-3 inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 font-mono text-xs font-semibold text-accent-foreground transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
          >
            <Download className="size-3.5" aria-hidden="true" />
            Download CV
          </a>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-foreground md:hidden hover:bg-secondary/60"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/5 bg-background/95 px-4 pb-4 md:hidden backdrop-blur-xl">
          <div className="flex flex-col gap-1 pt-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'rounded-lg px-3.5 py-2.5 font-mono text-sm transition-colors',
                  pathname === item.href
                    ? 'bg-secondary text-foreground font-semibold'
                    : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
                )}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={profile.cvPath}
              download
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 font-mono text-sm font-semibold text-accent-foreground"
            >
              <Download className="size-4" aria-hidden="true" />
              Download CV
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
