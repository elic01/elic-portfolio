'use client'

import { motion, useReducedMotion } from 'framer-motion'

const bootLines = [
  'ELIC-BIOS v2.6 — initializing...',
  'CPU: curiosity @ 3.9GHz ............ OK',
  'MEM: hands-on experience .......... OK',
  'NET: HIT ISACA / GDG uplink ....... OK',
  'IDP: authentik.homelab.elic ....... OK',
  'Loading /security profile ......... DONE',
]

export function BootSequence() {
  const reduceMotion = useReducedMotion()

  return (
    <div
      className="rounded-xl border border-terminal/30 bg-black/60 p-5 font-mono text-sm"
      aria-hidden="true"
    >
      {bootLines.map((line, i) => (
        <motion.p
          key={line}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduceMotion ? 0 : 0.35 * i, duration: 0.1 }}
          className="leading-relaxed text-terminal"
        >
          {line}
        </motion.p>
      ))}
      <motion.p
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: reduceMotion ? 0 : 0.35 * bootLines.length, duration: 0.1 }}
        className="mt-2 leading-relaxed text-foreground"
      >
        <span className="text-terminal">elic@security</span>
        <span className="text-muted-foreground">:~$</span>{' '}
        <span className="animate-pulse">▊</span>
      </motion.p>
    </div>
  )
}
