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
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-5xl">
      <div className="rounded-full border border-white/10 bg-card/75 backdrop-blur-2xl shadow-2xl px-5 py-2.5 transition-all duration-300">
        <nav
          aria-label="Main navigation"
          className="flex items-center justify-between"
        >
          {/* Logo with live status indicator */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-mono text-sm font-semibold tracking-tight text-foreground transition-colors hover:text-accent"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
            </span>
            <span>
              <span className="text-accent">~/</span>
              {profile.handle}
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden items-center gap-1.5 md:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-full px-3.5 py-1.5 font-mono text-xs transition-all duration-200',
                    isActive
                      ? 'bg-accent/15 text-accent border border-accent/30 font-semibold shadow-[0_0_12px_rgba(0,201,167,0.15)]'
                      : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
                  )}
                >
                  {item.label}
                </Link>
              )
            })}

            <a
              href={profile.cvPath}
              download
              className="ml-2 inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 font-mono text-xs font-semibold text-accent-foreground shadow-[0_0_16px_rgba(0,201,167,0.3)] transition-all duration-200 hover:scale-[1.04] hover:shadow-[0_0_24px_rgba(0,201,167,0.5)] active:scale-[0.98]"
            >
              <Download className="size-3.5" aria-hidden="true" />
              CV
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="rounded-full p-2 text-foreground md:hidden hover:bg-secondary/60 transition-colors"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </nav>
      </div>

      {/* Mobile Popover Menu */}
      {open && (
        <div className="absolute top-14 left-0 right-0 rounded-3xl border border-white/10 bg-card/95 backdrop-blur-2xl p-4 shadow-2xl md:hidden">
          <div className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'rounded-2xl px-4 py-2.5 font-mono text-sm transition-all',
                    isActive
                      ? 'bg-accent/15 text-accent border border-accent/30 font-semibold'
                      : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground',
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
            <a
              href={profile.cvPath}
              download
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-2.5 font-mono text-sm font-semibold text-accent-foreground shadow-[0_0_20px_rgba(0,201,167,0.3)]"
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
