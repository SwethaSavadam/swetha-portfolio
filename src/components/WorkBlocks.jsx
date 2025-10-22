import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useBeep } from '../utils/useBeep'
import O9Parallax from './parallax/O9Parallax'
import O9CompetitiveInsights from './parallax/O9CompetitiveInsights'
import O9ProspectResearch from './parallax/O9ProspectResearch'
import O9BDEmailGen from './parallax/O9BDEmailGen'
import WhatfixAgenticCopilot from './parallax/WhatfixAgenticCopilot'
import WhatfixRetoolProjects from './parallax/WhatfixRetoolProjects'

const blocks = [
  {
    id: 'o9',
    title: 'o9 Solutions',
    color: '#93c5fd',
    bullets: [
      'Unified C/VP analytics',
      'Competitive Insights with realtime alerts',
      'Prospect research bot (Scrapy)',
      'BD Gen-AI emails',
    ],
  },
  {
    id: 'whatfix',
    title: 'Whatfix',
    color: '#f0abfc',
    bullets: [
      'Agentic AI copilot',
      'Retool Projects (Dashboards • Quotes • ROI)',
    ],
  },
]

function Cartridge({ item, onClick }){
  const { play } = useBeep()
  return (
    <motion.button
      whileHover={{ y:-6, rotate:-1 }}
      whileTap={{ scale:0.98 }}
      onClick={() => { play(780); onClick?.(item.id) }}
      // className="group relative card w-full rounded-3xl border border-slate-200 bg-white p-5 shadow-sm overflow-hidden
      //            dark:border-slate-700 dark:bg-[#0f172a]"
      className="group relative card w-full rounded-3xl bg-card ring-soft p-5 shadow-sm overflow-hidden"
    >
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-44 h-8 rounded-b-2xl" style={{ background: item.color }} />
      <div className="absolute inset-0 pixel pointer-events-none" />
      <div className="relative flex items-start gap-4 pt-6">
        <div className="w-12 h-12 rounded-2xl shrink-0" style={{ background: item.color }} />
        <div className="flex-1">
          <div className="text-xs uppercase tracking-wide text-muted mb-1">
            {item.id.toUpperCase()}
          </div>
          <div className="text-xl font-semibold tracking-tight mb-2 text-strong">
            {item.title}
          </div>
          <ul className="space-y-1 text-sm text-app">
            {item.bullets.map((b, i) => <li key={i}>• {b}</li>)}
          </ul>
        </div>
        <div className="text-slate-400 dark:text-slate-200 group-hover:translate-x-1 transition">↗</div>
      </div>
    </motion.button>
  )
}

function O9ProjectPicker({ onChoose, onClose }) {
  const { play } = useBeep()
  const items = [
    { key: 'unified', label: 'Unified C/VP analytics' },
    { key: 'ci',      label: 'Competitive Insights with realtime alerts' },
    { key: 'prospect',label: 'Prospect research bot (Scrapy)' },
    { key: 'bd',      label: 'BD Gen-AI emails' },
  ]
  return (
    <div className="fixed inset-0 z-[55]">
      <div className="absolute inset-0 bg-black/50" onClick={() => { play(720,0.05); onClose() }} />
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
        className="absolute inset-x-6 md:inset-x-20 top-[15vh] rounded-3xl bg-card ring-soft shadow-2xl p-6"
      >
        <h3 className="text-xl font-semibold text-strong">o9 projects</h3>
        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          {items.map(it => (
            <button key={it.key}
              onClick={() => { play(820,0.05); onChoose(it.key) }}
              className="text-left rounded-2xl px-4 py-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700
                         ring-soft shadow-sm">
              <div className="text-sm font-medium text-strong">{it.label}</div>
              <div className="text-xs text-muted">Open interactive walkthrough</div>
            </button>
          ))}
        </div>
        <div className="mt-4 text-right">
          <button onClick={() => { play(720,0.05); onClose() }} className="absolute top-4 right-4 z-10 rounded-full bg-slate-900 text-white px-3 py-1 text-xs shadow hover:shadow-md">Close</button>
        </div>
      </motion.div>
    </div>
  )
}

function WhatfixProjectPicker({ onChoose, onClose }) {
  const { play } = useBeep()
  const items = [
    { key: 'agent',  label: 'Agentic AI copilot' },
    { key: 'retool', label: 'Retool Projects (Dashboards • Quotes • ROI)' },
  ]
  return (
    <div className="fixed inset-0 z-[55]">
      <div className="absolute inset-0 bg-black/50" onClick={() => { play(720,0.05); onClose() }} />
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
        className="absolute inset-x-6 md:inset-x-20 top-[15vh] rounded-3xl bg-card ring-soft shadow-2xl p-6"
      >
        <h3 className="text-xl font-semibold text-strong">Whatfix projects</h3>
        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          {items.map(it => (
            <button key={it.key}
              onClick={() => { play(820,0.05); onChoose(it.key) }}
              className="text-left rounded-2xl px-4 py-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700
                         ring-soft shadow-sm">
              <div className="text-sm font-medium text-strong">{it.label}</div>
              <div className="text-xs text-muted">Open interactive walkthrough</div>
            </button>
          ))}
        </div>
        <div className="mt-4 text-right">
          <button onClick={() => { play(720,0.05); onClose() }} className="absolute top-4 right-4 z-10 rounded-full bg-slate-900 text-white px-3 py-1 text-xs shadow hover:shadow-md">Close</button>
        </div>
      </motion.div>
    </div>
  )
}

export default function WorkBlocks(){
  const [openId, setOpenId] = useState(null)
  const [o9Project, setO9Project] = useState(null)
  const [whatfixProject, setWhatfixProject] = useState(null)

  const handleOpen = (id) => {
    if (id === 'o9') setOpenId('o9')
    if (id === 'whatfix') setOpenId('whatfix')
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold tracking-tight mb-2 text-strong">Work</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {blocks.map(b => <Cartridge key={b.id} item={b} onClick={handleOpen} />)}
      </div>

      {/* o9 project picker */}
      {openId === 'o9' && (
        <O9ProjectPicker
          onClose={() => setOpenId(null)}
          onChoose={(key) => { setOpenId(null); setO9Project(key) }}
        />
      )}

      {/* Whatfix project picker */}
      {openId === 'whatfix' && (
        <WhatfixProjectPicker
          onClose={() => setOpenId(null)}
          onChoose={(key) => { setOpenId(null); setWhatfixProject(key) }}
        />
      )}

      {/* o9 Scenes */}
      {o9Project === 'unified' && <O9Parallax onClose={() => setO9Project(null)} />}
      {o9Project === 'ci'      && <O9CompetitiveInsights onClose={() => setO9Project(null)} />}
      {o9Project === 'prospect'&& <O9ProspectResearch onClose={() => setO9Project(null)} />}
      {o9Project === 'bd'      && <O9BDEmailGen onClose={() => setO9Project(null)} /> }

      {/* Whatfix Scenes */}
      {whatfixProject === 'agent'  && <WhatfixAgenticCopilot onClose={() => setWhatfixProject(null)} />}
      {whatfixProject === 'retool' && <WhatfixRetoolProjects onClose={() => setWhatfixProject(null)} />}
    </div>
  )
}
