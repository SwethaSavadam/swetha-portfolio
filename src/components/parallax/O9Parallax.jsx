import ImpactBlock from '../shared/ImpactBlock'
import React, { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useBeep } from '../../utils/useBeep'
import {
  ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
  AreaChart, Area, BarChart, Bar, ReferenceLine
} from 'recharts'

/**
 * Exec dashboard scene (parallax overlay) for:
 * Unified C/VP analytics → KPI/KRA visibility + decisions + risks.
 * - Subtle parallax layers
 * - Theme-aware cards (light/dark)
 * - Charts via Recharts (GRR, NRR, Net ARR Δ, Win rate, Risk heat)
 */
export default function O9Parallax({ onClose }) {
  const scrollRef = useRef(null)
  const { scrollYProgress } = useScroll({ container: scrollRef })
  const prefersReduced = useReducedMotion()
  const { play } = useBeep()

  // ---- Controls ------------------------------------------------------------
  const [audience, setAudience] = useState('c')  // 'c' C-level, 'v' VP
  const [segment, setSegment]   = useState('All') // All | Enterprise | MM | SMB
  const [rangeKey, setRangeKey] = useState('QTD') // MTD | QTD

  // ---- Motion values -------------------------------------------------------
  const range = prefersReduced ? 0 : 1
  const ySlow   = useTransform(scrollYProgress, [0, 1], [0, -60  * range])
  const yMed    = useTransform(scrollYProgress, [0, 1], [0, -140 * range])
  const yFast   = useTransform(scrollYProgress, [0, 1], [0, -240 * range])
  const fadeIn  = { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-20% 0px' }, transition: { duration: 0.5 } }

  // ---- Example data (replace with your real metrics later) -----------------
  // KPI trend lines (weekly)
  const trend = [
    { w: 'W1', grr: 92.1, nrr: 107.2, arrDelta: 0.3, win: 26 },
    { w: 'W2', grr: 92.6, nrr: 108.0, arrDelta: 0.6, win: 24 },
    { w: 'W3', grr: 93.2, nrr: 108.7, arrDelta: 1.1, win: 27 },
    { w: 'W4', grr: 93.0, nrr: 109.4, arrDelta: 1.6, win: 28 },
    { w: 'W5', grr: 93.4, nrr: 110.1, arrDelta: 2.0, win: 29 },
  ]

  // KPI headline values by audience (MTD/QTD and by segment)
  const kpi = {
    All: {
      c: { GRR: 93.4, NRR: 110.1, NetARR: 2.4, Win: 28 },
      v: { GRR: 92.1, NRR: 108.3, NetARR: 0.6, Win: 31 },
    },
    Enterprise: {
      c: { GRR: 95.1, NRR: 112.4, NetARR: 1.7, Win: 32 },
      v: { GRR: 94.2, NRR: 111.2, NetARR: 0.5, Win: 34 },
    },
    MM: {
      c: { GRR: 91.2, NRR: 105.8, NetARR: 0.6, Win: 25 },
      v: { GRR: 90.6, NRR: 104.9, NetARR: 0.2, Win: 27 },
    },
    SMB: {
      c: { GRR: 88.4, NRR: 101.1, NetARR: 0.1, Win: 19 },
      v: { GRR: 87.8, NRR: 100.5, NetARR: 0.0, Win: 20 },
    },
  }

  // KRA table
  const kras = [
    { title: 'Improve GRR by 2pp', owner: 'VP CS', due: 'Q4', status: 'On track' },
    { title: 'Lift Win-rate +3pp', owner: 'VP Sales', due: 'Q4', status: 'At risk' },
    { title: 'Grow Net ARR +$3M', owner: 'CRO', due: 'Q4', status: 'On track' },
    { title: 'Reduce mid-market churn', owner: 'CS Ops', due: 'Q3', status: 'Behind' },
  ]

  // Risk heat (churn/renewal risk by segment)
  const risk = [
    { seg: 'Enterprise', risk: 9, trend: -1.2 },
    { seg: 'MM',         risk: 18, trend: +2.4 },
    { seg: 'SMB',        risk: 27, trend: +3.1 },
  ]

  // At-risk accounts (sample)
  const atRisk = [
    { acct: 'Arcadia Health', seg: 'MM',    reason: 'Low adoption in 2 modules',     owner: 'CS – Priya',  eta: 'Q3-W6' },
    { acct: 'RedPixel Labs',  seg: 'SMB',   reason: 'Champion left',                 owner: 'CS – Jordan', eta: 'Q3-W5' },
    { acct: 'BlueNexus',      seg: 'Enterp.', reason: 'Contract value downgrade ask', owner: 'CSE – Amit',  eta: 'Q3-W7' },
  ]

  const head = kpi[segment][audience]
  const headline = {
    grr: head.GRR.toFixed(1) + '%',
    nrr: head.NRR.toFixed(1) + '%',
    arr: (audience === 'c' ? `+$${head.NetARR.toFixed(1)}M` : `+$${head.NetARR.toFixed(1)}M`),
    win: head.Win + '%'
  }

  return (
    <div className="fixed inset-0 z-[60]">
      {/* background dimmer */}
      <div className="absolute inset-0 bg-black/50" onClick={() => { play(720,0.05); onClose() }} />
      {/* panel */}
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
        className="absolute inset-4 md:inset-6 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/10">
        {/* scrollable content */}
        <div ref={scrollRef} className="relative h-full w-full overflow-y-auto bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
          {/* slow background grid */}
          <motion.div style={{ y: ySlow }} className="pointer-events-none absolute inset-0 opacity-[0.07]">
            <div className="w-full h-full" style={{
              backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
              backgroundSize: '10px 10px',
              color: '#0f172a'
            }}/>
          </motion.div>

          {/* close */}
          <button onClick={() => { play(720,0.05); onClose() }}
            className="absolute top-4 right-4 z-10 rounded-full bg-slate-900 text-white px-3 py-1 text-xs shadow hover:shadow-md">
            Close
          </button>

          {/* sticky hero */}
          <section className="relative h-[64vh] md:h-[72vh]">
            <div className="sticky top-0 h-[56vh] flex items-center justify-center px-6">
              <div className="text-center max-w-3xl">
                <motion.h3  className="text-3xl md:text-4xl font-semibold tracking-tight text-strong" {...fadeIn}>
                  Unified KPI & KRA Command Center
                </motion.h3>
                <motion.p className="mt-3 text-slate-600 dark:text-slate-200" {...fadeIn} transition={{ duration: 0.6, delay: 0.1 }}>
                  One definition per metric. Weekly decision packs. C-level & VP views with drill-downs.
                </motion.p>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <Toggle label="C-Level" active={audience==='c'} onClick={() => { setAudience('c'); play(840,0.04) }} />
                  <Toggle label="VP"      active={audience==='v'} onClick={() => { setAudience('v'); play(840,0.04) }} />
                  <SegmentSelect value={segment} onChange={(v)=>{ setSegment(v); play(820,0.04) }} />
                  <RangeSelect value={rangeKey} onChange={(v)=>{ setRangeKey(v); play(820,0.04) }} />
                </div>
              </div>
            </div>

            {/* KPI strip (medium layer) */}
            <motion.div style={{ y: yMed }} className="absolute inset-x-0 bottom-[-8rem] grid grid-cols-1 md:grid-cols-4 gap-4 px-6">
              <KpiSpark title="GRR" value={headline.grr} seriesKey="grr" data={trend} />
              <KpiSpark title="NRR" value={headline.nrr} seriesKey="nrr" data={trend} />
              <KpiSpark title="Net ARR Δ" value={headline.arr} seriesKey="arrDelta" data={trend} fmt={(v)=>`$${v.toFixed(1)}M`} />
              <KpiSpark title="Win rate" value={headline.win} seriesKey="win" data={trend} />
            </motion.div>
            <motion.div style={{ y: yFast }} className="pointer-events-none absolute right-6 bottom-[-14rem] hidden md:block">
              <Badge>Auto-refreshed weekly</Badge>
            </motion.div>
          </section>

          {/* KRAs */}
          <section className="relative z-10 mt-[16rem] md:mt-[20rem] px-6">
            <motion.h4 className="text-2xl font-semibold text-strong" {...fadeIn}>
              KRAs & Owners
            </motion.h4>
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              {kras.map((k,i)=>(
                <motion.div key={i} {...fadeIn}
                  className="rounded-2xl p-5 bg-panel ring-soft shadow">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-strong">{k.title}</div>
                      <div className="text-xs text-muted mt-1">Owner: {k.owner} • Target: {k.due}</div>
                    </div>
                    <StatusChip status={k.status} />
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Decision Board + Risk visuals */}
          <section className="relative z-10 px-6 py-12">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Insights + Next actions */}
              <motion.div {...fadeIn} className="rounded-3xl p-6 bg-panel ring-soft shadow">
                <h5 className="text-lg font-semibold text-strong">Decision Board</h5>
                <ul className="mt-3 space-y-2 text-sm text-app">
                  <li>• <b>Mid-market churn risk +2.4pp.</b> Trigger save playbook: health checks + training vouchers.</li>
                  <li>• <b>Enterprise win-rate 32%.</b> Double down on 2 plays with highest close rate.</li>
                  <li>• <b>Net ARR +$2.4M QTD.</b> Focus on 3 late-stage deals to hit stretch goal +$0.6M.</li>
                </ul>
                <div className="mt-4 text-xs text-muted">Logged to Exec Weekly Pack • Owners auto-notified</div>
              </motion.div>

              {/* Risk heat by segment */}
              <motion.div {...fadeIn} className="rounded-3xl p-6 bg-panel ring-soft shadow">
                <h5 className="text-lg font-semibold text-strong mb-3">Renewal Risk by Segment</h5>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={risk} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.25)" />
                      <XAxis dataKey="seg" stroke="currentColor" />
                      <YAxis unit="%" stroke="currentColor" />
                      <Tooltip cursor={{ fill: 'rgba(148,163,184,.15)' }} />
                      <ReferenceLine y={15} stroke="#f59e0b" strokeDasharray="4 3" />
                      <Bar dataKey="risk" radius={[6,6,0,0]} fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 text-xs text-muted">Reference: 15% watch-list threshold</div>
              </motion.div>

              {/* At-risk accounts */}
              <motion.div {...fadeIn} className="rounded-3xl p-6 bg-panel ring-soft shadow">
                <h5 className="text-lg font-semibold text-strong mb-3">Top At-Risk Accounts</h5>
                <ul className="text-sm text-app space-y-2">
                  {atRisk.map((r,i)=>(
                    <li key={i} className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium">{r.acct} <span className="text-xs text-slate-500">({r.seg})</span></div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{r.reason}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs">{r.owner}</div>
                        <div className="text-[10px] text-slate-500">ETA {r.eta}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            {/* NEW: Business Impact block (added without altering existing lines above) */}
            <div className="mt-6">
              <ImpactBlock
                title="Business Impact"
                problem="Exec and VP teams were working off fragmented spreadsheets and slide decks with conflicting metric definitions, slow weekly prep, and risks surfaced late."
                solution="A single, theme-aware exec dashboard with one definition per metric, auto-refreshed weekly from the warehouse. Decision Board captures actions with owners and due dates; risk heat flags segments and accounts early."
                points={[
                  '“One source of truth” for GRR/NRR/Net ARR/Win rate across C- and VP-views',
                  'Faster decisions via auto-generated weekly packs and live drill-downs',
                  'Earlier detection of churn risk segments and at-risk accounts',
                  'Clear ownership on KRAs — status visibility drives follow-through'
                ]}
                // kpis={[
                //   { value: '−6h/wk', label: 'prep time' },
                //   { value: '≤24h',   label: 'risk surfacing' },
                //   { value: '↑',      label: 'exec alignment' },
                // ]}
              />
            </div>

            <div className="h-10" />
          </section>
        </div>
      </motion.div>
    </div>
  )
}

/* --------------------- UI bits --------------------- */

function Toggle({ label, active, onClick }){
  return (
    <button onClick={onClick}
      className={`px-3 py-1 text-xs rounded-full transition shadow-sm
        ${active ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white' :
                   'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
      {label}
    </button>
  )
}

function SegmentSelect({ value, onChange }){
  const opts = ['All','Enterprise','MM','SMB']
  return (
    <div className="inline-flex items-center gap-2 text-xs">
      <span className="text-muted">Segment</span>
      <select
        className="bg-card border border-slate-200 dark:border-slate-700 rounded-full px-2 py-1"
        value={value}
        onChange={(e)=> onChange(e.target.value)}
      >
        {opts.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  )
}

function RangeSelect({ value, onChange }){
  const opts = ['MTD','QTD']
  return (
    <div className="inline-flex items-center gap-2 text-xs">
      <span className="text-muted">Range</span>
      <select
        className="bg-card border border-slate-200 dark:border-slate-700 rounded-full px-2 py-1"
        value={value}
        onChange={(e)=> onChange(e.target.value)}
      >
        {opts.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  )
}

function Badge({ children }) {
  return <div className="rounded-full bg-slate-900 text-white text-xs px-3 py-1 shadow">{children}</div>
}

function StatusChip({ status }){
  const style = status === 'On track'
    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200'
    : status === 'At risk'
    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200'
    : 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200'
  return <span className={`text-xs px-2 py-0.5 rounded-full ${style}`}>{status}</span>
}

/** KPI tile with a small sparkline */
function KpiSpark({ title, value, data, seriesKey, fmt }){
  return (
    <div className="rounded-2xl p-4 bg-panel ring-soft shadow">
      <div className="flex items-baseline justify-between">
        <div className="text-xs uppercase tracking-wide text-muted">{title}</div>
        <div className="text-sm text-slate-500 dark:text-slate-400">last 5w</div>
      </div>
      <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">{value}</div>
      <div className="h-16 mt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad_${seriesKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.4}/>
                <stop offset="100%" stopColor="#94a3b8" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.25)" />
            <XAxis dataKey="w" stroke="currentColor" />
            <YAxis stroke="currentColor" hide />
            <Tooltip formatter={(v)=> fmt ? fmt(v) : v} cursor={{ fill: 'rgba(148,163,184,.15)' }} />
            <Area type="monotone" dataKey={seriesKey} stroke="#64748b" fill={`url(#grad_${seriesKey})`} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
