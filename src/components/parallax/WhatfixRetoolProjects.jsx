import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useBeep } from '../../utils/useBeep'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar
} from 'recharts'

export default function WhatfixRetoolProjects({ onClose }) {
  const scrollRef = useRef(null)
  const { scrollYProgress } = useScroll({ container: scrollRef })
  const prefersReduced = useReducedMotion()
  const { play } = useBeep()

  const depth = prefersReduced ? 0 : 1
  const ySlow = useTransform(scrollYProgress, [0,1], [0, -40*depth])
  const yMed  = useTransform(scrollYProgress, [0,1], [0, -100*depth])
  const yFast = useTransform(scrollYProgress, [0,1], [0, -180*depth])

  // ---------- Inputs / calculators ----------
  // License/ROI assumptions (editable)
  const [seats, setSeats] = useState(100)
  const [sfSeat, setSfSeat] = useState(1500)         // $/year per Salesforce seat (example)
  const [cpqSeat, setCpqSeat] = useState(600)        // $/year CPQ add-on per user (example)
  const [retoolSeat, setRetoolSeat] = useState(600)  // $/year per Retool business seat (example)
  const [extraCosts, setExtraCosts] = useState(5000) // Other yearly costs (infra/support)
  const sfAnnual = useMemo(()=> seats * (sfSeat + cpqSeat), [seats, sfSeat, cpqSeat])
  const retoolAnnual = useMemo(()=> seats * retoolSeat + extraCosts, [seats, retoolSeat, extraCosts])
  const savings = useMemo(()=> Math.max(0, sfAnnual - retoolAnnual), [sfAnnual, retoolAnnual])
  const roiPct = useMemo(()=> retoolAnnual > 0 ? (savings / retoolAnnual * 100) : 0, [savings, retoolAnnual])

  // Quote-change portal savings
  const [reqPerMonth, setReqPerMonth] = useState(80)
  const [minsSaved, setMinsSaved] = useState(35) // minutes saved per request vs legacy back-and-forth
  const hoursSavedYear = useMemo(()=> (reqPerMonth * minsSaved * 12) / 60, [reqPerMonth, minsSaved])

  // KPI demo data (Exec dashboards)
  const grr = [
    { m:'Jan', v: 91 }, { m:'Feb', v: 92 }, { m:'Mar', v: 93 }, { m:'Apr', v: 92.5 },
    { m:'May', v: 94 }, { m:'Jun', v: 94.3 }, { m:'Jul', v: 95 }
  ]
  const arr = [
    { m:'Jan', v: 12.1 }, { m:'Feb', v: 12.4 }, { m:'Mar', v: 12.9 },
    { m:'Apr', v: 13.4 }, { m:'May', v: 13.9 }, { m:'Jun', v: 14.3 }, { m:'Jul', v: 14.9 }
  ]
  const p1 = [
    { m:'Mon', v: 7 }, { m:'Tue', v: 6 }, { m:'Wed', v: 5 }, { m:'Thu', v: 3 }, { m:'Fri', v: 4 }
  ]

  // Clean pipeline strip
  const steps = [
    { key:'dash',  icon:'📊', label:'Exec Dashboards', desc:'One-click GRR • ARR • P1 status' },
    { key:'quote', icon:'🧾', label:'Quote Change Portal', desc:'CSM submits → Ops collaborates → Quote generated' },
    { key:'roi',   icon:'💸', label:'License Optimization', desc:'Retool seats replace Salesforce+CPQ for CSMs' },
  ]
  const [cursor, setCursor] = useState(0)
  const [running, setRunning] = useState(false)

  useEffect(()=>{
    if (!running) return
    const id = setTimeout(()=>{
      setCursor(i => (i+1) % steps.length)
      play(860,0.04)
    }, 1300)
    return () => clearTimeout(id)
  },[running, play, steps.length])

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/60" onClick={()=>{ play(720,0.05); onClose() }} />
      <motion.div
        initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:24 }}
        className="absolute inset-4 md:inset-6 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/10"
      >
        {/* Solid base */}
        <div className="absolute inset-0 bg-app" />

        {/* Whatfix accent */}
        <style>{`
          .wf-accent { background: #ff6d2d; }  /* Whatfix orange */
          .wf-ring { box-shadow: 0 0 0 1px rgba(255,109,45,.35) inset; }
        `}</style>

        <div ref={scrollRef} className="relative z-10 h-full w-full overflow-y-auto">
          {/* background ornaments */}
          <motion.div style={{ y: ySlow }} className="pointer-events-none absolute inset-0 opacity-[0.05] -z-10">
            <div className="w-full h-full" style={{
              backgroundImage:'radial-gradient(currentColor 1px, transparent 1px)',
              backgroundSize:'10px 10px', color:'#0f172a'
            }}/>
          </motion.div>
          <motion.div style={{ y: yMed }} className="pointer-events-none absolute -top-24 -left-24 w-[32rem] h-[32rem] rounded-full wf-accent/25 blur-[140px] -z-10" />
          <motion.div style={{ y: yFast }} className="pointer-events-none absolute bottom-[-10rem] right-[-8rem] w-[32rem] h-[32rem] rounded-full bg-amber-400/25 blur-[140px] -z-10" />

          {/* Close */}
          <button onClick={()=>{ play(720,0.05); onClose() }}
            className="absolute top-4 right-4 z-10 rounded-full bg-slate-900 text-white px-3 py-1 text-xs shadow hover:shadow-md">
            Close
          </button>

          {/* Header */}
          <section className="relative h-[70vh] md:h-[78vh]">
            <div className="sticky top-0 h-[66vh] flex items-center justify-center px-6">
              <div className="text-center max-w-[1200px] w-full mx-auto">
                <motion.h3 className="text-3xl md:text-4xl font-semibold tracking-tight text-strong">
                  Whatfix Retool Projects
                </motion.h3>
                <p className="mt-3 text-app">
                  Three Retool initiatives that <b>accelerate decisions</b>, <b>remove friction</b>, and <b>save license cost</b>.
                </p>

                {/* Quick CTA / controls */}
                <div className="mt-5 flex items-center justify-center gap-3">
                  <button onClick={()=>{ setRunning(r=>!r); play(820,0.05) }}
                    className={`px-3 py-1 text-xs rounded-full ${running ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white'}`}>
                    {running ? 'Pause tour' : 'Auto tour'}
                  </button>
                  <button onClick={()=>{ setCursor((cursor+1)%steps.length); play(780,0.05) }}
                    className="px-3 py-1 text-xs rounded-full bg-card ring-soft text-slate-900 dark:text-white">
                    Next section
                  </button>
                </div>
              </div>
            </div>

            {/* pipeline strip */}
            <motion.div style={{ y: yMed }} className="absolute inset-x-0 bottom-[-9rem] px-6">
              <Pipeline steps={steps} cursor={cursor} />
            </motion.div>
          </section>

          {/* Sections */}
          <section className="relative z-10 mt-[18rem] md:mt-[22rem] px-6 pb-14">
            <div className="max-w-[1200px] mx-auto grid lg:grid-cols-3 gap-6">
              {/* Exec Dashboards */}
              <Card title="Exec Dashboards: one-click status" accent>
                <p className="text-sm text-app mb-3">
                  GRR, ARR, and P1 tickets in a single Retool view—no logins or spreadsheets.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <MiniChart title="GRR %" data={grr} dataKey="v" unit="%" />
                  <MiniChart title="ARR (M$)" data={arr} dataKey="v" />
                  <MiniBar   title="Open P1 tickets" data={p1} dataKey="v" />
                  <div className="rounded-2xl p-3 bg-card ring-soft">
                    <div className="text-xs text-muted mb-1">Highlights</div>
                    <ul className="text-sm text-slate-800 dark:text-slate-200 space-y-1">
                      <li>• GRR improving (+4pts since Jan)</li>
                      <li>• ARR trend +2.8M since Q1</li>
                      <li>• P1s reduced from 7 → 3 (Thu)</li>
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Quote portal */}
              <Card title="Quote Change Portal" accent>
                <p className="text-sm text-app mb-3">
                  CSM fills a guided form; Ops collaborates in Retool; approved quote is generated and shared.
                </p>
                <PipelineList
                  items={[
                    'CSM submits request (guardrails & validation)',
                    'Process/Contract Ops review & comment',
                    'Auto-calc discounts & legal terms',
                    'Generate quote (PDF) + Slack/Email notify',
                  ]}
                />
                <div className="mt-3 grid grid-cols-2 gap-2 items-end">
                  <Field label="Requests / month">
                    <input className="input" value={reqPerMonth} onChange={e=>setReqPerMonth(Number(e.target.value)||0)} />
                  </Field>
                  <Field label="Minutes saved / request">
                    <input className="input" value={minsSaved} onChange={e=>setMinsSaved(Number(e.target.value)||0)} />
                  </Field>
                </div>
                <div className="mt-2 text-sm">
                  ≈ <b>{Math.round(hoursSavedYear)}</b> hours saved / year
                </div>
                <p className="mt-2 text-xs text-muted">
                  Time savings from fewer emails, fewer approvals, and pre-validated forms.
                </p>
              </Card>

              {/* License optimization */}
              <Card title="License Optimization: ROI from Retool" accent>
                <p className="text-sm text-app mb-3">
                  Replace Salesforce+CPQ for CSM workflows with Retool seats; keep CRM only for roles that need it.
                </p>

                <div className="grid grid-cols-2 gap-2 items-end">
                  <Field label="CSM seats"><input className="input" value={seats} onChange={e=>setSeats(Number(e.target.value)||0)} /></Field>
                  <Field label="SF seat $/yr"><input className="input" value={sfSeat} onChange={e=>setSfSeat(Number(e.target.value)||0)} /></Field>
                  <Field label="CPQ add-on $/yr"><input className="input" value={cpqSeat} onChange={e=>setCpqSeat(Number(e.target.value)||0)} /></Field>
                  <Field label="Retool seat $/yr"><input className="input" value={retoolSeat} onChange={e=>setRetoolSeat(Number(e.target.value)||0)} /></Field>
                  <Field label="Other yearly costs"><input className="input" value={extraCosts} onChange={e=>setExtraCosts(Number(e.target.value)||0)} /></Field>
                </div>

                <div className="mt-3 rounded-2xl p-3 bg-card ring-soft">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>Salesforce+CPQ: <b>${sfAnnual.toLocaleString()}</b>/yr</div>
                    <div>Retool (incl. extras): <b>${retoolAnnual.toLocaleString()}</b>/yr</div>
                    <div className="col-span-2">Estimated savings: <b className="text-emerald-600">${savings.toLocaleString()}</b>/yr</div>
                    <div className="col-span-2">ROI: <b className="text-emerald-600">{roiPct.toFixed(1)}%</b></div>
                  </div>
                </div>

                <div className="h-40 mt-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { k:'SF+CPQ', v: sfAnnual },
                      { k:'Retool', v: retoolAnnual },
                      { k:'Savings', v: savings },
                    ]} margin={{ top: 6, right: 6, left: 0, bottom: 6 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.25)" />
                      <XAxis dataKey="k" stroke="currentColor" />
                      <YAxis stroke="currentColor" />
                      <Tooltip cursor={{ fill:'rgba(148,163,184,.15)' }} />
                      <Bar dataKey="v" radius={[8,8,0,0]} fill="#ff6d2d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <p className="mt-2 text-xs text-muted">
                  Enter your actual license prices to see precise numbers. This model is illustrative.
                </p>
              </Card>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  )
}

/* ---------- UI atoms ---------- */

function Card({ title, children, accent }){
  return (
    <div className={`rounded-3xl p-6 bg-card ring-soft shadow ${accent ? 'wf-ring' : ''}`}>
      <h5 className="text-lg font-semibold text-strong mb-3">{title}</h5>
      {children}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="text-xs text-muted">{label}</div>
      <div className="mt-1">{children}</div>
      <style>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid var(--tw-ring-offset-color, rgba(226,232,240,1));
          background: var(--tw-bg, white);
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          color: inherit;
        }
        .dark .input { background: rgb(30,41,59); border-color: rgb(51,65,85); }
      `}</style>
    </label>
  )
}

function PipelineList({ items }){
  return (
    <ol className="list-decimal ml-5 text-sm text-slate-800 dark:text-slate-200 space-y-1">
      {items.map((t,i)=><li key={i}>{t}</li>)}
    </ol>
  )
}

/* ---- Clean, scrollable pipeline strip ---- */
const CARD_W = 260
const GAP_PX = 16

function Pipeline({ steps, cursor }) {
  return (
    <div className="relative mx-auto max-w-[1200px]">
      <div className="relative overflow-x-auto no-scrollbar pb-5 pt-1">
        <div className="grid grid-flow-col auto-cols-[260px] gap-4">
          {steps.map((s, i) => (
            <StepNode key={s.key} active={i === cursor} icon={s.icon} label={s.label} desc={s.desc} />
          ))}
        </div>
        <motion.div
          initial={false}
          animate={{ x: cursor * (CARD_W + GAP_PX) }}
          transition={{ type: 'spring', stiffness: 160, damping: 18 }}
          style={{ width: CARD_W }}
          className="absolute left-0 bottom-0 h-1.5 rounded-full wf-accent shadow"
        />
      </div>
    </div>
  )
}

function StepNode({ icon, label, desc, active }) {
  return (
    <div className={`rounded-2xl ring-1 shadow-sm px-4 py-4 text-center
      ${active ? 'ring-orange-400 bg-card'
               : 'ring-soft bg-card'}`}>
      <div className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-lg
        ${active ? 'bg-orange-500 text-white' : 'bg-slate-900 text-white'}`}>
        {icon}
      </div>
      <div className="mx-auto mb-1 max-w-[220px] text-[13px] font-semibold leading-snug text-slate-900 dark:text-white"
           style={{ display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
        {label}
      </div>
      <div className="mx-auto max-w-[220px] text-[12px] leading-snug text-slate-600 dark:text-slate-300"
           style={{ display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
        {desc}
      </div>
    </div>
  )
}

/* ---- Small charts ---- */

function MiniChart({ title, data, dataKey, unit }) {
  return (
    <div className="rounded-2xl p-3 bg-card ring-soft">
      <div className="text-xs text-muted mb-1">{title}</div>
      <div className="h-28">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 6, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff6d2d" stopOpacity={0.35}/>
                <stop offset="100%" stopColor="#ff6d2d" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.25)" />
            <XAxis dataKey="m" stroke="currentColor" hide />
            <YAxis stroke="currentColor" hide />
            <Tooltip formatter={(v)=> unit ? `${v}${unit}` : v} cursor={{ fill:'rgba(148,163,184,.15)' }} />
            <Area type="monotone" dataKey={dataKey} stroke="#ff6d2d" fill={`url(#grad-${title})`} strokeWidth={2}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function MiniBar({ title, data, dataKey }) {
  return (
    <div className="rounded-2xl p-3 bg-card ring-soft">
      <div className="text-xs text-muted mb-1">{title}</div>
      <div className="h-28">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 6, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.25)" />
            <XAxis dataKey="m" stroke="currentColor" hide />
            <YAxis stroke="currentColor" hide />
            <Tooltip cursor={{ fill:'rgba(148,163,184,.15)' }} />
            <Bar dataKey={dataKey} radius={[6,6,0,0]} fill="#ff6d2d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
