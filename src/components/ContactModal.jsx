import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function ContactModal({ open, onClose }) {
  const closeRef = useRef(null)
  const [copied, setCopied] = useState(false)
  const email = "swethasavadam@gmail.com"

  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    document.addEventListener('keydown', onKey)
    // prevent background scroll when open
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = original
    }
  }, [open, onClose])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (e) {
      // no-op
    }
  }

  const stop = (e) => e.stopPropagation()

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          {/* Card */}
          <motion.div
            onClick={stop}
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-200"
            initial={{ y: 24, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 12, scale: 0.98, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
          >
            <div className="absolute -top-3 -left-3 rotate-[-4deg]">
              <div className="rounded-xl bg-yellow-300 px-3 py-1 text-xs font-semibold shadow">
                🤖 automation says
              </div>
            </div>
            <div className="space-y-3">
              <h2 id="contact-title" className="text-xl font-bold tracking-tight">
                Beep boop! Route this to a human.
              </h2>
              <p className="text-slate-600 leading-relaxed">
                My tiny army of scripts voted unanimously:{" "}
                <span className="font-medium text-slate-900">send an email</span>.
                Deploy your message to:
              </p>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                <a
                  href={`mailto:${email}`}
                  className="break-all font-mono text-sm md:text-base underline decoration-dotted underline-offset-4 hover:decoration-solid"
                >
                  {email}
                </a>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={copyEmail}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50 active:translate-y-[1px] transition"
                >
                  {copied ? "Copied ✓" : "Copy email"}
                </button>
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow hover:shadow-md active:translate-y-[1px] transition"
                >
                  Open email app
                </a>
                <button
                  ref={closeRef}
                  onClick={onClose}
                  className="ml-auto inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-900"
                >
                  Close
                </button>
              </div>
              <p className="text-xs text-slate-500">
                P.S. If a robot replies first, don’t worry. I'll take it from there. 🧑‍💻
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}