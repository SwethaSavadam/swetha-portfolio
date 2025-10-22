import React from 'react'
import { motion } from 'framer-motion'

export default function HeroCopy({ profile, onViewWork, isDark }){
  const subClass = isDark ? profile.subStyle.dark : profile.subStyle.light

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
        <a
          href="swethasavadam@gmail.com"
          className="inline-flex items-center gap-2 bg-white text-slate-900 border border-slate-200 rounded-full px-4 py-2 text-sm shadow-sm hover:bg-slate-50"
        >
          Contact
        </a>
      </div>
    </div>
  )
}
