import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function HeroCopy({ profile, onViewWork, isDark }){
  const subClass = isDark ? profile.subStyle.dark : profile.subStyle.light
  const [showContact, setShowContact] = useState(false)
  const email = "swethasavadam@gmail.com"

  useEffect(() => {
    if (!showContact) return
    const onKey = (e) => { if (e.key === 'Escape') setShowContact(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [showContact])

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-semibold leading-tight tracking-tight"
        >
          Hi, I’m <span className="text-accent">{profile.name}</span><br/>
          {profile.heroLine1}<br/>
          {profile.heroLine2}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className={`relative z-10 opacity-100 max-w-xl ${subClass}`}
        >
          {profile.sub}
        </motion.p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onViewWork}
          className="inline-flex items-center gap-2 bg-slate-900 text-white rounded-full px-4 py-2 text-sm shadow hover:shadow-md transition-shadow"
        >
          View Work
        </button>
        <button
          onClick={() => setShowContact(true)}
          className="inline-flex items-center gap-2 bg-white text-slate-900 border border-slate-200 rounded-full px-4 py-2 text-sm shadow-sm hover:bg-slate-50"
        >
          Contact
        </button>
      </div>

      {showContact && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowContact(false)}
        >
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-200"
            initial={{ y: 24, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
          >
            <div className="absolute -top-3 -left-3 -rotate-3">
              <div className="rounded-xl bg-yellow-300 px-3 py-1 text-xs font-semibold shadow">
                🤖 automation says
              </div>
            </div>
            <div className="space-y-3">
              <h2 id="contact-title" className="text-xl font-bold tracking-tight">
                Beep boop! Route this to a human.
              </h2>
              <p className="text-slate-600 leading-relaxed">
                My tiny army of scripts voted unanimously: <span className="font-medium text-slate-900">send an email</span>.
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
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow hover:shadow-md active:translate-y-px transition"
                >
                  Open email app
                </a>
                <button
                  onClick={() => setShowContact(false)}
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
    </div>
  )
}
