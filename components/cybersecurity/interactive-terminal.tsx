'use client'

import { useRef, useState } from 'react'
import { profile } from '@/lib/content/profile'
import { skillGroups } from '@/lib/content/skills'
import { projects } from '@/lib/content/projects'

interface TerminalLine {
  type: 'input' | 'output'
  text: string
}

const helpText = [
  'Available commands:',
  '  whoami          — who is this guy?',
  '  skills          — list technical skills',
  '  tools           — list security & automation tools',
  '  vuln-toolkit    — view Vulnerability Assessment Toolkit info',
  '  certifications  — list certifications',
  '  contact         — how to reach me',
  '  clear           — clear the terminal',
  '  help            — show this message',
]

function runCommand(cmd: string): string[] {
  const normalized = cmd.trim().toLowerCase()
  switch (normalized) {
    case 'whoami':
      return [
        profile.fullName,
        profile.title,
        `Currently: ${profile.currentRole} · ${profile.location}`,
        'HIT ISACA member · homelab operator · ethical hacking enthusiast.',
      ]
    case 'skills':
      return skillGroups.map(
        (g) => `${g.category}: ${g.skills.map((s) => s.name).join(', ')}`,
      )
    case 'tools':
    case 'projects': {
      const secTools = projects.filter((p) => p.category === 'security' || p.category === 'devops')
      return [
        'Security & Infrastructure Tooling:',
        ...secTools.map((t) => `  - ${t.slug}: ${t.title} [${t.techStack.join(', ')}]`),
        "Type 'vuln-toolkit' for direct toolkit details.",
      ]
    }
    case 'vuln-toolkit': {
      const toolkit = projects.find((p) => p.slug === 'vulnerability-assessment-toolkit')
      if (!toolkit) return ['Toolkit project details not found.']
      return [
        `[${toolkit.title}]`,
        `Summary: ${toolkit.summary}`,
        `Tech: ${toolkit.techStack.join(', ')}`,
        `Repo: ${toolkit.links.repo || 'N/A'}`,
      ]
    }
    case 'certifications':
      return [
        'No formal certifications yet — currently pursuing:',
        '  - B.Tech Honours in Information Technology (HIT, 2027)',
        '  - Building foundations via HIT ISACA & Microsoft Learn.',
      ]
    case 'contact':
      return [`email: ${profile.email}`, `phone: ${profile.phone}`, `github: ${profile.links.github}`]
    case 'sudo hire me':
      return [
        '[sudo] password for recruiter: ********',
        'Access granted. Opening secure channel...',
        `--> mailto:${profile.email}`,
        "Nice try — and yes, I'm available. Email me.",
      ]
    case 'help':
      return helpText
    case '':
      return []
    default:
      return [`command not found: ${normalized}. Type 'help' for options.`]
  }
}

export function InteractiveTerminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'output', text: "Type 'help' to see available commands. Try 'tools' or 'sudo hire me'." },
  ])
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  function handleSubmit() {
    const cmd = input.trim()
    setInput('')
    if (cmd.toLowerCase() === 'clear') {
      setLines([])
      return
    }
    const output = runCommand(cmd)
    setLines((prev) => [
      ...prev,
      { type: 'input', text: cmd },
      ...output.map((text): TerminalLine => ({ type: 'output', text })),
    ])
    if (cmd.toLowerCase() === 'sudo hire me') {
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent('Opportunity for Emmanuel')}`
    }
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
    })
  }

  return (
    <div className="overflow-hidden rounded-xl border border-terminal/30 bg-black/70">
      <div className="flex items-center gap-2 border-b border-terminal/20 px-4 py-2.5">
        <span className="size-2 rounded-full bg-terminal" aria-hidden="true" />
        <p className="font-mono text-xs text-terminal/80">elic@security: interactive shell</p>
      </div>
      <div
        ref={scrollRef}
        className="h-64 overflow-y-auto p-4 font-mono text-sm"
        role="log"
        aria-label="Terminal output"
      >
        {lines.map((line, i) => (
          <p key={`${i}-${line.text.slice(0, 16)}`} className="leading-relaxed">
            {line.type === 'input' ? (
              <>
                <span className="text-terminal">elic@security</span>
                <span className="text-muted-foreground">:~$ </span>
                <span className="text-foreground">{line.text}</span>
              </>
            ) : (
              <span className="whitespace-pre-wrap text-muted-foreground">{line.text}</span>
            )}
          </p>
        ))}
      </div>
      <div className="flex items-center gap-2 border-t border-terminal/20 px-4 py-3 font-mono text-sm">
        <label htmlFor="terminal-input" className="shrink-0">
          <span className="text-terminal">elic@security</span>
          <span className="text-muted-foreground">:~$</span>
          <span className="sr-only">Terminal command input</span>
        </label>
        <input
          id="terminal-input"
          type="text"
          value={input}
          autoComplete="off"
          spellCheck={false}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) {
              handleSubmit()
            }
          }}
          className="w-full bg-transparent text-foreground caret-terminal outline-none placeholder:text-muted-foreground/50"
          placeholder="try: tools"
        />
      </div>
    </div>
  )
}
