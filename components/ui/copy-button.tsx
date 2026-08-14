'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'

export function CopyButton({
  text,
  label = 'Copy',
}: {
  text: string
  label?: string
}) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback if clipboard API fails
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy ${label} to clipboard`}
      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/80 px-3 py-1.5 font-mono text-xs font-medium text-foreground transition-all hover:bg-secondary hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent/50"
    >
      {copied ? (
        <>
          <Check className="size-3.5 text-success" aria-hidden="true" />
          <span className="text-success">Copied!</span>
        </>
      ) : (
        <>
          <Copy className="size-3.5 text-muted-foreground" aria-hidden="true" />
          <span>{label}</span>
        </>
      )}
    </button>
  )
}
