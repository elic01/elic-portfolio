import fs from 'fs'
import path from 'path'
import { Marked, type Tokens } from 'marked'

export interface TocItem {
  id: string
  title: string
  depth: number
  phase?: string
}

export interface RunbookMetadata {
  lineCount: number
  wordCount: number
  readingTimeMinutes: number
  totalPhases: number
  title: string
  subtitle: string
  targetHardware: string
}

export interface RunbookData {
  rawMarkdown: string
  htmlContent: string
  tableOfContents: TocItem[]
  metadata: RunbookMetadata
}

export function getRunbookData(): RunbookData {
  const filePath = path.join(process.cwd(), 'public', 'elic-homelab-guide-v2.md')
  const rawMarkdown = fs.readFileSync(filePath, 'utf-8')

  const lines = rawMarkdown.split('\n')
  const lineCount = lines.length
  const wordCount = rawMarkdown.trim().split(/\s+/).length
  const readingTimeMinutes = Math.ceil(wordCount / 200)

  const tableOfContents: TocItem[] = []

  const marked = new Marked()

  marked.use({
    renderer: {
      heading({ tokens, depth, raw }) {
        const text = this.parser.parseInline(tokens)
        const idMatch = raw.match(/\{#([^}]+)\}/)
        let id = ''
        let cleanText = text

        if (idMatch) {
          id = idMatch[1]
          cleanText = text.replace(/\s*\{#[^}]+\}/, '').trim()
        } else {
          id = raw
            .toLowerCase()
            .replace(/\{#[^}]+\}/, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
          cleanText = text.trim()
        }

        const phaseMatch = cleanText.match(/Phase\s+(\d+|[A-Z]+)/i)
        const phase = phaseMatch ? phaseMatch[0] : cleanText.toLowerCase().includes('appendix') ? 'Appendix' : undefined

        if (depth === 2 || (depth === 3 && (cleanText.toLowerCase().includes('phase') || cleanText.toLowerCase().includes('node') || cleanText.toLowerCase().includes('step')))) {
          if (id !== 'table-of-contents') {
            tableOfContents.push({
              id,
              title: cleanText,
              depth,
              phase,
            })
          }
        }

        const isMajorPhase = depth === 2 && (cleanText.toLowerCase().includes('phase') || cleanText.toLowerCase().includes('appendix'))
        const phaseClass = isMajorPhase ? 'runbook-phase-heading' : ''

        return `<h${depth} id="${id}" class="runbook-heading runbook-h${depth} ${phaseClass} scroll-mt-24 group">
          <span class="heading-text">${cleanText}</span>
          <a href="#${id}" class="heading-anchor opacity-0 group-hover:opacity-100 transition-opacity ml-2 text-accent" aria-label="Link to section ${cleanText}">#</a>
        </h${depth}>\n`
      },

      code({ text, lang }) {
        const cleanLang = (lang || 'bash').trim().toLowerCase()
        const isDiagram = cleanLang === '' && (text.includes('──►') || text.includes('┌─') || text.includes('|') || text.includes('+--'))
        const displayBadge = isDiagram ? 'diagram' : cleanLang

        const escapedDisplay = text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;')

        const encodedForCopy = Buffer.from(text).toString('base64')

        return `<div class="runbook-code-block my-6 overflow-hidden rounded-xl border border-white/10 bg-[#0d1117] shadow-xl not-prose">
          <div class="flex items-center justify-between border-b border-white/10 bg-[#161b22] px-4 py-2.5">
            <div class="flex items-center gap-2">
              <span class="flex gap-1.5" aria-hidden="true">
                <span class="size-2.5 rounded-full bg-destructive/70"></span>
                <span class="size-2.5 rounded-full bg-gold/70"></span>
                <span class="size-2.5 rounded-full bg-success/70"></span>
              </span>
              <span class="font-mono text-xs uppercase tracking-wider text-muted-foreground">${displayBadge}</span>
            </div>
            <button 
              type="button" 
              class="runbook-copy-btn inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-muted-foreground transition-all hover:bg-accent/10 hover:text-accent hover:border-accent/30 focus:outline-none"
              data-code="${encodedForCopy}"
              title="Copy code snippet"
            >
              <svg class="copy-icon size-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              <svg class="check-icon size-3.5 text-success hidden" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              <span class="btn-text">Copy</span>
            </button>
          </div>
          <pre class="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#e6edf3]"><code>${escapedDisplay}</code></pre>
        </div>\n`
      },

      blockquote({ tokens }) {
        const body = this.parser.parse(tokens)

        let type = 'note'
        let title = 'NOTE'
        let borderColor = 'border-accent/40 bg-accent/5 text-accent'

        if (body.includes('CRITICAL') || body.includes('WARNING') || body.includes('Never skip')) {
          type = 'critical'
          title = 'CRITICAL / WARNING'
          borderColor = 'border-destructive/50 bg-destructive/10 text-destructive'
        } else if (body.includes('CLAUDE CODE') || body.includes('QUORUM') || body.includes('Hardware note')) {
          type = 'instruction'
          title = 'SYSTEM INSTRUCTION'
          borderColor = 'border-gold/50 bg-gold/10 text-gold'
        } else if (body.includes('Why create') || body.includes('Domain:')) {
          type = 'info'
          title = 'ARCHITECTURE CONTEXT'
          borderColor = 'border-info/50 bg-info/10 text-info'
        }

        return `<aside class="runbook-callout my-6 rounded-xl border-l-4 p-4 md:p-5 backdrop-blur-md shadow-lg ${borderColor}" data-callout-type="${type}">
          <div class="mb-1.5 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider">
            <span>// ${title}</span>
          </div>
          <div class="text-xs md:text-sm leading-relaxed text-foreground/90 runbook-callout-body">
            ${body}
          </div>
        </aside>\n`
      },

      table(token: Tokens.Table) {
        let headerRow = ''
        for (const cell of token.header) {
          const content = this.parser.parseInline(cell.tokens)
          const align = cell.align ? ` align="${cell.align}"` : ''
          headerRow += `<th${align}>${content}</th>`
        }

        let bodyRows = ''
        for (const row of token.rows) {
          let rowCells = ''
          for (const cell of row) {
            const content = this.parser.parseInline(cell.tokens)
            const align = cell.align ? ` align="${cell.align}"` : ''
            rowCells += `<td${align}>${content}</td>`
          }
          bodyRows += `<tr>${rowCells}</tr>`
        }

        const thead = headerRow ? `<thead class="bg-secondary/90 border-b border-white/10 text-foreground font-mono text-xs uppercase tracking-wider"><tr>${headerRow}</tr></thead>` : ''
        const tbody = bodyRows ? `<tbody class="divide-y divide-white/5 text-xs text-muted-foreground">${bodyRows}</tbody>` : ''

        return `<div class="runbook-table-container my-6 overflow-hidden rounded-xl border border-white/10 bg-card/60 shadow-xl backdrop-blur-xl">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse min-w-[500px]">
              ${thead}
              ${tbody}
            </table>
          </div>
        </div>\n`
      },

      hr() {
        return `<div class="runbook-divider my-10 border-t border-white/10"></div>\n`
      },

      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens)
        const isAnchor = href.startsWith('#')
        const target = isAnchor ? '' : ' target="_blank" rel="noopener noreferrer"'
        const icon = isAnchor
          ? ''
          : `<svg class="inline-block ml-1 size-3 text-muted-foreground group-hover:text-accent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`

        return `<a href="${href}"${title ? ` title="${title}"` : ''}${target} class="runbook-link text-accent hover:underline inline-flex items-center font-medium">${text}${icon}</a>`
      },
    },
  })

  const htmlContent = marked.parse(rawMarkdown) as string

  return {
    rawMarkdown,
    htmlContent,
    tableOfContents,
    metadata: {
      lineCount,
      wordCount,
      readingTimeMinutes,
      totalPhases: tableOfContents.filter((t) => t.phase).length,
      title: 'Elic Homelab Infrastructure Guide',
      subtitle: '5× HP EliteDesk 705 G4 — Full Proxmox Build From Scratch',
      targetHardware: '5x HP EliteDesk 705 G4 (Ryzen 5 PRO 2400G / 32GB RAM)',
    },
  }
}
