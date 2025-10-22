import React, { useEffect, useMemo, useRef, useState } from 'react'
import ImpactBlock from '../shared/ImpactBlock'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useBeep } from '../../utils/useBeep'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, PieChart, Pie
} from 'recharts'

/**
 * Whatfix Retool Projects — Flow-first, inline sections (no sub-modals)
 * Clicking a node renders its section AT THE BOTTOM of the scene.
 * Solid surfaces use bg-app (scene base) + bg-card (panels) for consistent light/dark.
 */
export default function WhatfixRetoolProjects({ onClose }) {
  const scrollRef = useRef(null)
  const { scrollYProgress } = useScroll({ container: scrollRef })
  const prefersReduced = useReducedMotion()
  const { play } = useBeep()

  const depth = prefersReduced ? 0 : 1
  const ySlow = useTransform(scrollYProgress, [0,1], [0, -40*depth])
  const yMed  = useTransform(scrollYProgress, [0,1], [0, -100*depth])
  const yFast = useTransform(scrollYProgress, [0,1], [0, -200*depth])

  const [active, setActive] = useState('exec') // 'exec' | 'renewals' | 'cpq' | 'tools'

  // soft background graph (for header only)
  const ebrUpcoming = useMemo(()=>[
    { date:'W1', ebr: 6 }, { date:'W2', ebr: 8 }, { date:'W3', ebr: 4 }, { date:'W4', ebr: 9 }
  ],[])

  return (
    <div className="fixed inset-0 z-[60]">
      {/* dim backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={()=>{ play(720,0.05); onClose() }} />

      {/* window */}
      <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:24 }}
        className="absolute inset-4 md:inset-6 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/10">

        {/* Solid base */}
        <div className="absolute inset-0 bg-app" />

        {/* Decorative accents */}
        <motion.div style={{ y: ySlow }} className="pointer-events-none absolute -left-20 -top-20 w-[28rem] h-[28rem] rounded-full bg-pink-400/20 blur-[140px] -z-10" />
        <motion.div style={{ y: yMed }}  className="pointer-events-none absolute -right-24 top-24 w-[28rem] h-[28rem] rounded-full bg-sky-400/20 blur-[140px] -z-10" />
        <motion.div style={{ y: yFast }} className="pointer-events-none absolute left-1/4 bottom-0 w-[28rem] h-[28rem] rounded-full bg-amber-400/15 blur-[140px] -z-10" />

        {/* scrollable content */}
        <div ref={scrollRef} className="relative z-10 h-full w-full overflow-y-auto">
          {/* close */}
          <button onClick={()=>{ play(720,0.05); onClose() }}
            className="absolute top-4 right-4 z-20 rounded-full bg-[var(--accent-2)] text-white px-3 py-1 text-xs shadow">
            Close
          </button>

          {/* header + flow map */}
          <section className="relative h-[58vh] md:h-[64vh]">
            <div className="sticky top-0 h-[56vh] flex items-center justify-center px-6 pt-8 md:pt-12">
              <div className="text-center max-w-[1200px] w-full mx-auto">
                <motion.h3 className="text-3xl md:text-4xl font-semibold tracking-tight text-strong">
                  Whatfix Retool Projects
                </motion.h3>
                <p className="mt-3 text-app">
                  Four purpose-built Retool apps streamline renewal forecasting, exec visibility, approvals, and tool governance.
                </p>

                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <FlowNode label="1. Exec Dashboard" desc="Pulse, renewals, EBRs, tickets" active={active==='exec'} onClick={()=>{ play(800,0.05); setActive('exec'); jumpDown() }} />
                  <FlowNode label="2. Renewal Meetings" desc="ARR/NPS/CSAT + strategy" active={active==='renewals'} onClick={()=>{ play(820,0.05); setActive('renewals'); jumpDown() }} />
                  <FlowNode label="3. Metrics & CPQ" desc="Approvals → Generate CV" active={active==='cpq'} onClick={()=>{ play(780,0.05); setActive('cpq'); jumpDown() }} />
                  <FlowNode label="4. Tool Evaluation" desc="Suggest approved alternatives" active={active==='tools'} onClick={()=>{ play(760,0.05); setActive('tools'); jumpDown() }} />
                </div>

                <div className="mt-4 hidden md:flex items-center justify-center gap-8 text-xs text-muted">
                  <span>Visibility</span> <span>→</span>
                  <span>Forecasting</span> <span>→</span>
                  <span>Approvals</span> <span>→</span>
                  <span>Optimization</span>
                </div>

                {/* Removed soft area chart per request; keep a little breathing room */}
                <div className="mt-6" />
              </div>
            </div>
          </section>

          {/* inline content mount */}
          <section id="flow-content" className="relative z-10 mt=[14rem] mt-[14rem] md:mt-[18rem] px-6 pb-16">
            {active === 'exec' && <ExecDashboardSection />}
            {active === 'renewals' && <RenewalMeetingsSection />}
            {active === 'cpq' && <CPQSection />}
            {active === 'tools' && <ToolEvaluationSection />}

            {/* Business Impact (shown under whichever section is active) */}
            <div className="max-w-[1200px] mx-auto mt-6">
              <ImpactBlock
                title="Business Impact"
                problem="Leads tracked renewals and risks in siloed sheets, execs had limited visibility, approvals lived in email threads, and tool requests created duplicate spend."
                solution="Four Retool apps unify the flow: Exec Dashboard highlights risk/pulse/EBRs and ticket hot-spots; Renewal Meetings provide forecasting views with ARR/NPS/CSAT and mitigation capture; a CPQ-like portal routes approvals through Legal/Finance/Head of CS and generates CV; Tool Evaluation suggests approved alternates to curb SaaS sprawl."
                points={[
                  'Faster renewal forecasting with consistent definitions & filters',
                  'Lower churn risk via early visibility (pulse, tickets, EBRs)',
                  'Shorter approval cycles; CV generated post multi-step approvals',
                  'Reduced tool spend by steering to infosec-approved alternatives'
                ]}
              />
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  )

  function jumpDown(){
    // allow header to settle before scrolling
    setTimeout(()=>{
      document.getElementById('flow-content')?.scrollIntoView({ behavior:'smooth', block:'start' })
    }, 30)
  }
}

/* ------------------------- Building blocks ------------------------- */

function Card({ title, accent=false, children }){
  return (
    <div className={`rounded-3xl p-6 bg-card ring-soft shadow ${accent ? 'wf-ring' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium">{title}</h4>
      </div>
      {children}
    </div>
  )
}

function FlowNode({ label, desc, active, onClick }){
  return (
    <button onClick={onClick} className={`group rounded-2xl ring-1 ${active? 'ring-orange-400' : 'ring-transparent'} hover:ring-orange-400 bg-card p-4 text-left transition`}>
      <div className="text-sm font-semibold">{label}</div>
      <div className="text-xs text-muted mt-1">{desc}</div>
      <div className="mt-3 text-[10px] uppercase tracking-wide text-muted">{active ? 'Active' : 'Open'}</div>
    </button>
  )
}

/* ----------------------- Exec Dashboard Section ----------------------- */
function ExecDashboardSection(){
  // dataset (sample)
  const rows = useMemo(()=>[
    { acct:'Kraft Heinz',     region:'NA',  csm:'Priya',  leadForecast:'At Risk', pulse:'High',   renewal:'2025-12-10', status:'Pending',      tickets7d:1, ebr:'2025-11-02', engagement:'Low' },
    { acct:'Acme Retail',     region:'EU',  csm:'Maya',   leadForecast:'Watch',   pulse:'Medium', renewal:'2025-11-28', status:'Confirm Yes',  tickets7d:3, ebr:'2025-11-06', engagement:'Low' },
    { acct:'BlueNexus',       region:'NA',  csm:'Amit',   leadForecast:'At Risk', pulse:'High',   renewal:'2025-12-01', status:'Confirm No',   tickets7d:2, ebr:'2025-11-12', engagement:'Med' },
    { acct:'Arcadia Health',  region:'APAC',csm:'Lea',    leadForecast:'Healthy', pulse:'Low',    renewal:'2026-01-06', status:'Renewed',      tickets7d:0, ebr:'2025-11-20', engagement:'High' },
  ],[])

  const regions = ['NA','EU','APAC']
  const leads = ['Priya','Maya','Amit','Lea']
  const forecasts = ['At Risk','Watch','Healthy']

  const [f, setF] = useState({ csm:'', region:'', forecast:'', account:'' })

  const filtered = useMemo(()=> rows.filter(r => (
    (!f.csm || r.csm===f.csm) &&
    (!f.region || r.region===f.region) &&
    (!f.forecast || r.leadForecast===f.forecast) &&
    (!f.account || r.acct.toLowerCase().includes(f.account.toLowerCase()))
  )), [rows, f])

  // --- NEW: extra highlights (upcoming EBRs & low engagement owners) ---
  const daysUntil = (iso) => {
    const d = new Date(iso)
    const now = new Date()
    return Math.floor((d - now) / (1000*60*60*24))
  }
  const upcomingEbrCount = filtered.filter(r => daysUntil(r.ebr) >= 0 && daysUntil(r.ebr) <= 14).length
  const lowEngCsms = Array.from(new Set(
    filtered.filter(r => (r.engagement||'').toLowerCase()==='low').map(r => r.csm)
  ))

  return (
    <div className="max-w-[1200px] mx-auto grid md:grid-cols-4 gap-4">
      <div className="md:col-span-1 grid gap-3">
        <Card title="Filters">
          <FilterSelect label="CSM lead" value={f.csm} onChange={v=>setF(s=>({...s, csm:v}))} options={['',...leads]} />
          <FilterSelect label="Region" value={f.region} onChange={v=>setF(s=>({...s, region:v}))} options={['',...regions]} />
          <FilterSelect label="Lead forecast" value={f.forecast} onChange={v=>setF(s=>({...s, forecast:v}))} options={['',...forecasts]} />
          <FilterInput  label="Account" placeholder="search account…" value={f.account} onChange={v=>setF(s=>({...s, account:v}))} />
        </Card>
        <Card title="Highlights">
          <ul className="text-sm space-y-1">
            <li>• {filtered.filter(r=>r.pulse==='High').length} high-risk accounts</li>
            <li>• {filtered.filter(r=>r.tickets7d>0).length} with 7d+ open tickets</li>
            <li>• {filtered.filter(r=>r.status==='Pending').length} pending renewal decisions</li>
            <li>• {upcomingEbrCount} upcoming EBRs (next 14 days)</li>
            <li>• CSMs with low engagement: {lowEngCsms.length ? lowEngCsms.join(', ') : '—'}</li>
          </ul>
        </Card>
      </div>

      <div className="md:col-span-3">
        <Card title="Exec Dashboard">
          <div className="rounded-2xl bg-card ring-soft p-3 overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted">
                <tr className="text-left">
                  <th className="py-2 pr-3">Account</th>
                  <th className="py-2 pr-3">Region</th>
                  <th className="py-2 pr-3">CSM</th>
                  <th className="py-2 pr-3">Lead Forecast</th>
                  <th className="py-2 pr-3">Pulse</th>
                  <th className="py-2 pr-3">Renewal</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3">Tickets (7d+)</th>
                  <th className="py-2 pr-3">Upcoming EBR</th>
                  <th className="py-2">Engagement</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r,i)=>(
                  <tr key={i} className="border-t border-slate-200 dark:border-slate-700">
                    <td className="py-2 pr-3">{r.acct}</td>
                    <td className="py-2 pr-3">{r.region}</td>
                    <td className="py-2 pr-3">{r.csm}</td>
                    <td className="py-2 pr-3">{r.leadForecast}</td>
                    <td className="py-2 pr-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${r.pulse==='High'?'bg-rose-600 text-white': r.pulse==='Medium'?'bg-amber-500 text-white':'bg-emerald-600 text-white'}`}>{r.pulse}</span>
                    </td>
                    <td className="py-2 pr-3">{r.renewal}</td>
                    <td className="py-2 pr-3">{r.status}</td>
                    <td className="py-2 pr-3">{r.tickets7d}</td>
                    <td className="py-2 pr-3">{r.ebr}</td>
                    <td className="py-2">{r.engagement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}

/* ----------------------- Renewal Meetings Section ----------------------- */
function RenewalMeetingsSection(){
  const rows = useMemo(()=>[
    { acct:'Kraft Heinz', region:'NA', csm:'Priya',  leadForecast:'At Risk', nps:4,  csat:6,  arr:300000, renewal:'2025-12-10' },
    { acct:'Acme Retail', region:'EU', csm:'Maya',   leadForecast:'Watch',   nps:7,  csat:8,  arr:120000, renewal:'2025-11-28' },
    { acct:'BlueNexus',   region:'NA', csm:'Amit',   leadForecast:'At Risk', nps:5,  csat:7,  arr:450000, renewal:'2025-12-01' },
    { acct:'Arcadia',     region:'APAC', csm:'Lea',  leadForecast:'Healthy', nps:9,  csat:9,  arr:80000,  renewal:'2026-01-06' },
  ],[])
  const regions = ['NA','EU','APAC']
  const leads = ['Priya','Maya','Amit','Lea']
  const forecasts = ['At Risk','Watch','Healthy']

  const [f, setF] = useState({ csm:'', region:'', forecast:'', account:'' })
  const [strategies, setStrategies] = useState({}) // acct -> text
  const filtered = useMemo(()=> rows.filter(r => (
    (!f.csm || r.csm===f.csm) &&
    (!f.region || r.region===f.region) &&
    (!f.forecast || r.leadForecast===f.forecast) &&
    (!f.account || r.acct.toLowerCase().includes(f.account.toLowerCase()))
  )), [rows, f])

  const risky = (r) => r.leadForecast==='At Risk' || r.nps<7 || r.csat<7

  // --- NEW: forecasting visuals data (ARR by forecast & ARR by region) ---
  const arrByForecast = useMemo(()=>{
    const out = { 'At Risk':0, 'Watch':0, 'Healthy':0 }
    filtered.forEach(r => { out[r.leadForecast] = (out[r.leadForecast]||0) + r.arr })
    return Object.entries(out).map(([k,v])=>({ k, v }))
  },[filtered])

  const arrByRegion = useMemo(()=>{
    const out = {}
    filtered.forEach(r => { out[r.region] = (out[r.region]||0) + r.arr })
    return Object.entries(out).map(([k,v])=>({ k, v }))
  },[filtered])

  return (
    <div className="max-w-[1200px] mx-auto grid md:grid-cols-4 gap-4">
      <div className="md:col-span-1 grid gap-3">
        <Card title="Filters">
          <FilterSelect label="CSM lead" value={f.csm} onChange={v=>setF(s=>({...s, csm:v}))} options={['',...leads]} />
          <FilterSelect label="Region" value={f.region} onChange={v=>setF(s=>({...s, region:v}))} options={['',...regions]} />
          <FilterSelect label="Lead forecast" value={f.forecast} onChange={v=>setF(s=>({...s, forecast:v}))} options={['',...forecasts]} />
          <FilterInput  label="Account" placeholder="search account…" value={f.account} onChange={v=>setF(s=>({...s, account:v}))} />
        </Card>
        <Card title="Guidance">
          <ul className="text-sm space-y-1">
            <li>• Use ARR/NPS/CSAT to prioritize prep.</li>
            <li>• Add <b>Mitigation Strategy</b> for risky accounts.</li>
            <li>• Convert proven mitigations into plays.</li>
          </ul>
        </Card>
      </div>

      <div className="md:col-span-3 grid gap-4">
        <Card title="Renewal Meetings">
          <div className="rounded-2xl bg-card ring-soft p-3 overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted">
                <tr className="text-left">
                  <th className="py-2 pr-3">Account</th>
                  <th className="py-2 pr-3">Region</th>
                  <th className="py-2 pr-3">CSM</th>
                  <th className="py-2 pr-3">ARR</th>
                  <th className="py-2 pr-3">NPS</th>
                  <th className="py-2 pr-3">CSAT</th>
                  <th className="py-2 pr-3">Lead Forecast</th>
                  <th className="py-2 pr-3">Renewal</th>
                  <th className="py-2">Mitigation Strategy</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r,i)=>{
                  const key = r.acct
                  return (
                    <tr key={i} className="border-t border-slate-200 dark:border-slate-700 align-top">
                      <td className="py-2 pr-3">{r.acct}</td>
                      <td className="py-2 pr-3">{r.region}</td>
                      <td className="py-2 pr-3">{r.csm}</td>
                      <td className="py-2 pr-3">${r.arr.toLocaleString()}</td>
                      <td className="py-2 pr-3">{r.nps}</td>
                      <td className="py-2 pr-3">{r.csat}</td>
                      <td className="py-2 pr-3">{r.leadForecast}</td>
                      <td className="py-2 pr-3">{r.renewal}</td>
                      <td className="py-2">
                        <textarea rows={risky(r)?2:1} placeholder={risky(r)?'Add mitigation…':'—'}
                          className={`w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm bg-card text-slate-900 dark:text-white ${!risky(r) && 'opacity-60'}`}
                          disabled={!risky(r)}
                          value={strategies[key]||''}
                          onChange={e=>setStrategies(s=>({...s,[key]:e.target.value}))}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* NEW: Forecasting visuals */}
        <Card title="Forecasting visuals">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={arrByForecast} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.25)" />
                  <XAxis dataKey="k" stroke="currentColor" />
                  <YAxis stroke="currentColor" />
                  <Tooltip cursor={{ fill:'rgba(148,163,184,.12)' }} />
                  <Bar dataKey="v" radius={[8,8,0,0]} fill="#64748b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={arrByRegion} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.25)" />
                  <XAxis dataKey="k" stroke="currentColor" />
                  <YAxis stroke="currentColor" />
                  <Tooltip cursor={{ fill:'rgba(148,163,184,.12)' }} />
                  <Bar dataKey="v" radius={[8,8,0,0]} fill="#94a3b8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted">
            Use these to focus prep on high-ARR at-risk cohorts by forecast and region.
          </p>
        </Card>
      </div>
    </div>
  )
}

/* ----------------------- Metrics & Quote Portal (CPQ) ----------------------- */
function CPQSection(){
  // Simple CPQ-like flow: Configure → Price → Approvals (Legal/Finance/Head of CS) → Generate CV
  const [items, setItems] = useState([
    { sku:'WF-PLATFORM', name:'Whatfix Platform', qty: 1, unit: 24000, disc: 0 },
    { sku:'WF-ANALYTICS', name:'Analytics Add-on', qty: 1, unit: 6000, disc: 10 },
  ])
  const [approvals, setApprovals] = useState({ legal:false, finance:false, cs:false })
  const [cvId, setCvId] = useState(null)

  const subtotal = useMemo(()=> items.reduce((sum, it)=> sum + it.qty*it.unit*(1 - it.disc/100), 0), [items])
  const tax = Math.round(subtotal * 0.1)
  const total = subtotal + tax

  const setIt = (idx, patch) => setItems(list => list.map((it,i)=> i===idx ? { ...it, ...patch } : it))
  const addIt = () => setItems(list => [...list, { sku:'NEW-SKU', name:'New Line', qty:1, unit:1000, disc:0 }])
  const delIt = (idx) => setItems(list => list.filter((_,i)=> i!==idx))

  const allApproved = approvals.legal && approvals.finance && approvals.cs

  const generateCV = () => {
    if (!allApproved) return
    const id = 'CV-' + Math.floor(100000 + Math.random()*899999)
    setCvId(id)
  }

  return (
    <div className="max-w-[1200px] mx-auto grid md:grid-cols-3 gap-4">
      <div className="md:col-span-2 grid gap-4">
        <Card title="Configure & Price (CPQ)">
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-muted">
                <tr className="text-left">
                  <th className="py-2 pr-2">SKU</th>
                  <th className="py-2 pr-2">Product</th>
                  <th className="py-2 pr-2">Qty</th>
                  <th className="py-2 pr-2">Unit ($)</th>
                  <th className="py-2 pr-2">Disc %</th>
                  <th className="py-2 pr-2">Line Total</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it,idx)=>{
                  const line = Math.round(it.qty*it.unit*(1 - it.disc/100))
                  return (
                    <tr key={idx} className="border-t border-slate-200 dark:border-slate-700">
                      <td className="py-2 pr-2">
                        <input className="w-36 rounded-xl border border-slate-200 dark:border-slate-700 px-2 py-1 bg-card text-slate-900 dark:text-white" value={it.sku} onChange={e=>setIt(idx,{sku:e.target.value})} />
                      </td>
                      <td className="py-2 pr-2">
                        <input className="w-60 rounded-xl border border-slate-200 dark:border-slate-700 px-2 py-1 bg-card text-slate-900 dark:text-white" value={it.name} onChange={e=>setIt(idx,{name:e.target.value})} />
                      </td>
                      <td className="py-2 pr-2">
                        <input type="number" className="w-20 rounded-xl border border-slate-200 dark:border-slate-700 px-2 py-1 bg-card text-slate-900 dark:text-white" value={it.qty} onChange={e=>setIt(idx,{qty:Number(e.target.value)||0})} />
                      </td>
                      <td className="py-2 pr-2">
                        <input type="number" className="w-28 rounded-xl border border-slate-200 dark:border-slate-700 px-2 py-1 bg-card text-slate-900 dark:text-white" value={it.unit} onChange={e=>setIt(idx,{unit:Number(e.target.value)||0})} />
                      </td>
                      <td className="py-2 pr-2">
                        <input type="number" className="w-24 rounded-xl border border-slate-200 dark:border-slate-700 px-2 py-1 bg-card text-slate-900 dark:text-white" value={it.disc} onChange={e=>setIt(idx,{disc:Number(e.target.value)||0})} />
                      </td>
                      <td className="py-2 pr-2">${line.toLocaleString()}</td>
                      <td className="py-2">
                        <button onClick={()=>delIt(idx)} className="rounded-full bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white px-3 py-1 text-xs">Delete</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div className="mt-3">
              <button onClick={addIt} className="rounded-full bg-slate-900 text-white px-3 py-1 text-xs">Add line</button>
            </div>
          </div>
        </Card>

        <Card title="Approvals">
          <div className="grid sm:grid-cols-3 gap-3">
            <ApprovalTile label="Legal" checked={approvals.legal} onToggle={()=>setApprovals(s=>({...s, legal:!s.legal}))} />
            <ApprovalTile label="Finance" checked={approvals.finance} onToggle={()=>setApprovals(s=>({...s, finance:!s.finance}))} />
            <ApprovalTile label="Head of CS" checked={approvals.cs} onToggle={()=>setApprovals(s=>({...s, cs:!s.cs}))} />
          </div>
          <p className="mt-2 text-xs text-muted">All three approvals are required before generating the CV.</p>
        </Card>
      </div>

      <div className="md:col-span-1 grid gap-4">
        <Card title="Summary">
          <div className="rounded-2xl bg-card ring-soft p-3 space-y-2">
            <Row label="Subtotal" value={`$${subtotal.toLocaleString()}`} />
            <Row label="Tax (10%)" value={`$${tax.toLocaleString()}`} />
            <Row label={<b>Total</b>} value={<b>{`$${total.toLocaleString()}`}</b>} />
          </div>
          <div className="mt-3 flex gap-2">
            <button disabled={!allApproved} onClick={generateCV}
              className={`rounded-full px-3 py-1 text-xs ${allApproved? 'bg-[var(--accent-2)] text-white' : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
              Generate CV
            </button>
            {cvId && <span className="text-xs text-muted">Created: {cvId}</span>}
          </div>
        </Card>

        <Card title="Totals chart">
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{k:'Total', v: total}]}> 
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.25)" />
                <XAxis dataKey="k" stroke="currentColor" />
                <YAxis stroke="currentColor" />
                <Tooltip />
                <Bar dataKey="v" radius={[8,8,0,0]} fill="#ff6d2d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}

/* ----------------------- Tool Evaluation Section ----------------------- */
function ToolEvaluationSection(){
  // Simulated GSheet: approved tools used org-wide
  const APPROVED = [
    { name:'Kahoot', category:'Engagement', tags:['polling','quizzes','live'] },
    { name:'Google Forms', category:'Surveys', tags:['forms','survey','free'] },
    { name:'Typeform', category:'Surveys', tags:['forms','survey','ui'] },
    { name:'Confluence', category:'Docs', tags:['wiki','kb'] },
    { name:'Miro', category:'Whiteboard', tags:['collab','diagram'] },
  ]

  const [q, setQ] = useState('')

  const results = useMemo(()=>{
    const ql = q.trim().toLowerCase()
    if (!ql) return []
    const exact = APPROVED.filter(t => t.name.toLowerCase().includes(ql) || t.tags.some(x=>x.includes(ql)))
    if (exact.length) return exact
    // Fallback: similarity suggestion (very lightweight token match)
    return APPROVED
      .map(t=>({ t, score: similarity(ql, t.name.toLowerCase() + ' ' + t.tags.join(' ')) }))
      .sort((a,b)=>b.score-a.score)
      .slice(0,3)
      .map(x=>x.t)
  },[q])

  const suggestNote = useMemo(()=>{
    const ql = q.trim().toLowerCase()
    if (!ql) return 'Search an approved tool…'
    if (results.length === 0) return 'No close matches found.'
    // Special-case example: Mentimeter → Kahoot (similar & approved)
    if (ql.includes('mentimeter')) return '“Mentimeter” isn’t approved, consider using “Kahoot” (similar & infosec approved).'
    return 'Showing the closest approved options.'
  },[q, results])

  return (
    <div className="max-w-[1200px] mx-auto grid md:grid-cols-3 gap-4">
      <div className="md:col-span-1">
        <Card title="Tool search (Approved)">
          <label className="text-xs text-muted">Find a tool
            <input className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm bg-card text-slate-900 dark:text-white" placeholder="e.g., Mentimeter" value={q} onChange={e=>setQ(e.target.value)} />
          </label>
          <p className="mt-2 text-xs text-muted">{suggestNote}</p>
        </Card>
      </div>
      <div className="md:col-span-2 grid gap-3">
        <Card title={q? `Results for “${q}”` : 'Results'}>
          <div className="grid sm:grid-cols-2 gap-3">
            {results.map((r,i)=> (
              <div key={i} className="rounded-2xl px-3 py-2 ring-soft bg-card">
                <div className="text-sm font-medium">{r.name}</div>
                <div className="text-xs text-muted">{r.category} • {r.tags.join(', ')}</div>
                <div className="mt-2">
                  <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-xs text-slate-800 dark:text-white">Infosec: Approved</span>
                </div>
              </div>
            ))}
            {!q && <p className="text-sm text-muted">Try searching for “Mentimeter”.</p>}
          </div>
          <p className="mt-2 text-xs text-muted">Avoid duplicate-purpose purchases by leveraging approved, similar tools.</p>
        </Card>
      </div>
    </div>
  )
}

/* ----------------------- small atoms ----------------------- */
function FilterSelect({ label, value, onChange, options }){
  return (
    <label className="block text-xs text-muted">
      {label}
      <select className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm bg-card text-slate-900 dark:text-white" value={value} onChange={e=>onChange(e.target.value)}>
        {options.map((o,i)=> <option key={i} value={o}>{o||'All'}</option>)}
      </select>
    </label>
  )
}

function FilterInput({ label, value, onChange, placeholder }){
  return (
    <label className="block text-xs text-muted">
      {label}
      <input className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm bg-card text-slate-900 dark:text-white" value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} />
    </label>
  )
}

function ApprovalTile({ label, checked, onToggle }){
  return (
    <button onClick={onToggle} className={`rounded-2xl p-3 text-left ring-soft bg-card ${checked? 'ring-orange-400' : ''}`}>
      <div className="text-sm font-medium">{label}</div>
      <div className="text-xs text-muted mt-1">Status: {checked? 'Approved' : 'Pending'}</div>
    </button>
  )
}

function Row({ label, value }){
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="text-muted">{label}</div>
      <div>{value}</div>
    </div>
  )
}

function similarity(a, b){
  // very small token overlap scorer
  const at = a.split(/\W+/).filter(Boolean)
  const bt = b.split(/\W+/).filter(Boolean)
  const aset = new Set(at)
  const bset = new Set(bt)
  let inter = 0
  aset.forEach(x=>{ if (bset.has(x)) inter++ })
  return inter / Math.max(1, new Set([...at, ...bt]).size)
}
