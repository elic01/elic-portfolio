'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronUp,
  Copy,
  FileDown,
  ListOrdered,
  Printer,
  Search,
  Server,
  Terminal,
  X,
} from 'lucide-react'
import type { RunbookData } from '@/lib/runbook'

export function RunbookViewer({ data }: { data: RunbookData }) {
  const { rawMarkdown, htmlContent, tableOfContents, metadata } = data

  const [copiedAll, setCopiedAll] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeId, setActiveId] = useState<string>('')
  const [scrollProgress, setScrollProgress] = useState(0)
  const [mobileTocOpen, setMobileTocOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Copy all raw markdown
  async function handleCopyAll() {
    try {
      await navigator.clipboard.writeText(rawMarkdown)
      setCopiedAll(true)
      setTimeout(() => setCopiedAll(false), 2500)
    } catch (e) {
      console.error('Failed to copy markdown:', e)
    }
  }

  // Trigger browser print (PDF Export)
  function handlePrintPdf() {
    window.print()
  }

  // Handle scroll progress and active section spy
  useEffect(() => {
    function handleScroll() {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const currentScroll = window.scrollY
      if (totalHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (currentScroll / totalHeight) * 100)))
      }
      setShowScrollTop(currentScroll > 400)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // IntersectionObserver for active section highlighting
  useEffect(() => {
    const headings = Array.from(document.querySelectorAll('.runbook-heading'))
    if (!headings.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
            break
          }
        }
      },
      {
        rootMargin: '-10% 0px -75% 0px',
        threshold: 0.1,
      }
    )

    headings.forEach((h) => observer.observe(h))
    return () => observer.disconnect()
  }, [htmlContent])

  // Attach event listener for individual code block copy buttons
  useEffect(() => {
    const container = document.getElementById('runbook-rendered-content')
    if (!container) return

    function handleContainerClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest('.runbook-copy-btn') as HTMLButtonElement | null
      if (!target) return

      const base64Code = target.getAttribute('data-code')
      if (!base64Code) return

      try {
        const decoded = atob(base64Code)
        navigator.clipboard.writeText(decoded).then(() => {
          const copyIcon = target.querySelector('.copy-icon')
          const checkIcon = target.querySelector('.check-icon')
          const btnText = target.querySelector('.btn-text')

          if (copyIcon && checkIcon && btnText) {
            copyIcon.classList.add('hidden')
            checkIcon.classList.remove('hidden')
            btnText.textContent = 'Copied'
            target.classList.add('border-success/50', 'text-success')

            setTimeout(() => {
              copyIcon.classList.remove('hidden')
              checkIcon.classList.add('hidden')
              btnText.textContent = 'Copy'
              target.classList.remove('border-success/50', 'text-success')
            }, 2000)
          }
        })
      } catch (err) {
        console.error('Failed to decode/copy code snippet:', err)
      }
    }

    container.addEventListener('click', handleContainerClick)
    return () => container.removeEventListener('click', handleContainerClick)
  }, [htmlContent])

  // Filter TOC based on search query
  const filteredToc = useMemo(() => {
    if (!searchQuery.trim()) return tableOfContents
    const q = searchQuery.toLowerCase()
    return tableOfContents.filter((item) => item.title.toLowerCase().includes(q) || (item.phase && item.phase.toLowerCase().includes(q)))
  }, [tableOfContents, searchQuery])

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-accent/30 selection:text-accent">
      {/* Top Reading Progress Bar (Fixed) */}
      <div
        className="fixed top-0 left-0 z-50 h-1 bg-gradient-to-r from-terminal via-accent to-gold transition-all duration-150 print:hidden"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      {/* Main Header / Command Bar */}
      <div className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-xl print:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <Link
              href="/homelab"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/80 px-2.5 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              <span className="hidden sm:inline">Homelab</span>
            </Link>
            <div className="hidden h-4 w-px bg-border md:block" />
            <div>
              <h1 className="font-mono text-xs font-bold text-foreground md:text-sm flex items-center gap-2 truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                <Terminal className="size-4 text-terminal shrink-0" />
                <span className="truncate">{metadata.title}</span>
              </h1>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2">
            {/* Mobile TOC Button */}
            <button
              type="button"
              onClick={() => setMobileTocOpen(!mobileTocOpen)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-2.5 py-1.5 font-mono text-xs text-foreground md:hidden hover:border-accent/40"
              aria-label="Toggle Table of Contents"
            >
              <ListOrdered className="size-3.5 text-accent" />
              <span className="text-[11px]">TOC</span>
            </button>

            {/* Copy All Markdown */}
            <button
              type="button"
              onClick={handleCopyAll}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/80 px-2.5 py-1.5 font-mono text-xs text-muted-foreground transition-all hover:bg-secondary hover:text-foreground"
              title="Copy entire raw Markdown to clipboard"
            >
              {copiedAll ? (
                <>
                  <Check className="size-3.5 text-success" />
                  <span className="hidden sm:inline text-success">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span className="hidden sm:inline">Copy MD</span>
                </>
              )}
            </button>

            {/* Download Markdown */}
            <a
              href="/elic-homelab-guide-v2.md"
              download="elic-homelab-infrastructure-guide-v2.md"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/80 px-2.5 py-1.5 font-mono text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              title="Download raw Markdown file (.md)"
            >
              <FileDown className="size-3.5" />
              <span className="hidden md:inline">Download .MD</span>
            </a>

            {/* Export / Print PDF Button */}
            <button
              type="button"
              onClick={handlePrintPdf}
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 font-mono text-xs font-semibold text-accent-foreground shadow-[0_0_15px_rgba(0,201,167,0.3)] transition-transform hover:scale-105"
              title="Export as PDF or print document"
            >
              <Printer className="size-3.5" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container Layout */}
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 lg:py-12">
        {/* Document Hero / Meta Card */}
        <div className="mb-10 rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/10 via-card to-card p-6 md:p-8 backdrop-blur-xl shadow-2xl print:border-none print:p-0 print:bg-transparent">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6 print:border-black/20">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-terminal/30 bg-terminal/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-terminal">
                  PROXMOX VE 8.x
                </span>
                <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-accent">
                  5-NODE CLUSTER
                </span>
                <span className="rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold text-gold">
                  PRODUCTION RUNBOOK
                </span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-4xl print:text-black">
                {metadata.title}
              </h1>
              <p className="mt-2 font-mono text-xs md:text-sm text-muted-foreground print:text-gray-700">
                {metadata.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 font-mono text-xs text-muted-foreground print:hidden">
              <div className="rounded-xl border border-border bg-secondary/50 p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Document Scale</p>
                <p className="text-sm font-bold text-foreground">{metadata.lineCount.toLocaleString()} lines</p>
              </div>
              <div className="rounded-xl border border-border bg-secondary/50 p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Est. Execution</p>
                <p className="text-sm font-bold text-accent">~{metadata.readingTimeMinutes} min</p>
              </div>
              <div className="rounded-xl border border-border bg-secondary/50 p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Phases</p>
                <p className="text-sm font-bold text-gold">{metadata.totalPhases} total</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Server className="size-4 text-accent shrink-0" />
              <span>Target: {metadata.targetHardware}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-success animate-pulse" />
              <span>Validated &amp; Ready for Automated / Manual Deployment</span>
            </div>
          </div>
        </div>

        {/* 2-Column Grid: TOC Sidebar + Rendered Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Desktop Sticky Table of Contents (Columns 1-4) */}
          <aside className="hidden lg:col-span-4 lg:block print:hidden">
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl shadow-xl">
              <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="size-4 text-accent" />
                  <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
                    Table of Contents
                  </h2>
                </div>
                <span className="rounded-md bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                  {filteredToc.length} items
                </span>
              </div>

              {/* Filter / Search inside TOC */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Filter sections / phases..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-border bg-secondary/80 py-1.5 pl-8 pr-3 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/50"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-3" />
                  </button>
                )}
              </div>

              {/* TOC Navigation List */}
              <nav aria-label="Runbook sections">
                <ul className="space-y-1 text-xs">
                  {filteredToc.map((item) => {
                    const isActive = activeId === item.id
                    const isPhase = Boolean(item.phase)

                    return (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className={`group flex items-start gap-2 rounded-lg px-2.5 py-1.5 transition-all ${
                            isActive
                              ? 'bg-accent/15 font-semibold text-accent border-l-2 border-accent'
                              : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                          } ${item.depth === 3 ? 'ml-3 text-[11px]' : ''}`}
                        >
                          {isPhase && (
                            <span
                              className={`shrink-0 rounded px-1.5 py-0.2 font-mono text-[10px] ${
                                isActive ? 'bg-accent/30 text-accent' : 'bg-secondary text-muted-foreground group-hover:text-foreground'
                              }`}
                            >
                              {item.phase}
                            </span>
                          )}
                          <span className="leading-snug">{item.title.replace(/^Phase\s+[\dA-Z]+[—\-:\s]*/i, '')}</span>
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            </div>
          </aside>

          {/* Rendered Markdown Document (Columns 5-12) */}
          <main className="lg:col-span-8 print:col-span-12">
            <article
              id="runbook-rendered-content"
              className="runbook-article rounded-2xl border border-border bg-card/40 p-6 md:p-10 backdrop-blur-xl shadow-2xl print:border-none print:bg-transparent print:p-0"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </main>
        </div>
      </div>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 flex size-10 items-center justify-center rounded-full border border-border bg-secondary/90 text-foreground shadow-xl backdrop-blur-lg transition-transform hover:scale-110 hover:border-accent/50 focus:outline-none print:hidden"
          aria-label="Scroll back to top"
        >
          <ChevronUp className="size-5 text-accent" />
        </button>
      )}

      {/* Mobile Table of Contents Modal Drawer */}
      {mobileTocOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-2xl md:hidden print:hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div className="flex items-center gap-2">
              <BookOpen className="size-4 text-accent" />
              <h2 className="font-mono text-sm font-bold text-foreground">Table of Contents</h2>
            </div>
            <button
              type="button"
              onClick={() => setMobileTocOpen(false)}
              className="rounded-lg border border-border p-1.5 text-muted-foreground hover:text-foreground"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="p-4 border-b border-border">
            <input
              type="text"
              placeholder="Search phases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-secondary/80 py-2 pl-3 pr-3 font-mono text-xs text-foreground focus:border-accent/50 focus:outline-none"
            />
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1.5">
              {filteredToc.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={() => setMobileTocOpen(false)}
                    className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2 text-xs text-foreground hover:bg-accent/20"
                  >
                    <span>{item.title}</span>
                    {item.phase && (
                      <span className="font-mono text-[10px] text-accent font-semibold">{item.phase}</span>
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
