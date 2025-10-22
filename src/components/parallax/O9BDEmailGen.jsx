import ImpactBlock from '../shared/ImpactBlock'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useBeep } from '../../utils/useBeep'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts'

/** BD GenAI Emails  Prospect-first version (primary input = company, e.g., "Kraft Heinz") */
export default function O9BDEmailGen({ onClose }) {
  const scrollRef = useRef(null)
  const { scrollYProgress } = useScroll({ container: scrollRef })
  const prefersReduced = useReducedMotion()
  const { play } = useBeep()

  // Parallax depths
  const depth = prefersReduced ? 0 : 1
  const ySlow = useTransform(scrollYProgress, [0,1], [0, -50*depth])
  const yMed  = useTransform(scrollYProgress, [0,1], [0, -120*depth])
  const yFast = useTransform(scrollYProgress, [0,1], [0, -220*depth])

  // -------- Prospect-first intake --------
  const [prospect, setProspect]   = useState('Kraft Heinz') // PRIMARY INPUT
  // Derived (you can wire these from Prospect Research later)
  const [region, setRegion]       = useState('North America')
  const [industry, setIndustry]   = useState('CPG / Food & Bev')
  const [size, setSize]           = useState('1,000–10,000')
  const [titles, setTitles]       = useState('C-suite, VP, Head of Supply Chain')
  const [sourceOrder, setSourceOrder] = useState('ZoomInfo → Lusha → Fallback')
  const [nvb, setNvb]             = useState(0.90) // NeverBounce accept threshold
  const [caps, setCaps]           = useState({ perDay: 50, throttleSec: 60 })
  const [windows, setWindows]     = useState('Tue–Thu 9:00–11:30 & 14:00–16:30 local')

  const deriveFromProspect = () => {
    // Stub: pretend we fetched these from your Prospect Research bot.
    // Keep editable so you can tweak during demos.
    setRegion('North America')
    setIndustry('CPG / Food & Bev')
    setSize('10,000+')
    setTitles('Chief Supply Chain Officer, VP Supply Chain, Head of Logistics')
    play(800, 0.06)
  }

  // -------- Pipeline (clean scroll-strip) --------
  const steps = useMemo(()=>[
    { key:'phantom',  icon:'👤', label:`Find decision-makers at ${prospect}`,
      desc:`PhantomBuster LinkedIn filters → ${region}, ${industry}, ${size}, ${titles}` },
    { key:'enrich',   icon:'📧', label:'Enrich emails',
      desc:`Priority: ${sourceOrder}` },
    { key:'verify',   icon:'🛡️', label:'NeverBounce verify',
      desc:`Accept ≥ ${Math.round(nvb*100)}% (valid only; catch-all review)` },
    { key:'pains',    icon:'🗞️', label:`Mine bottlenecks for ${prospect}`,
      desc:'Company pains & risks from intel/news pipeline' },
    { key:'cases',    icon:'📚', label:'Match case studies (G-Drive)',
      desc:'Industry • use-case • region mapping' },
    { key:'draft',    icon:'✍️', label:'Generate draft (LLM)',
      desc:'120–150w, 3 subjects, 2 CTAs, opt-out' },
    { key:'outreach', icon:'📤', label:'Create Outreach draft',
      desc:'Owner as sender; review required' },
    { key:'schedule', icon:'⏱️', label:'Schedule windows & caps',
      desc:`${caps.perDay}/day, ${caps.throttleSec}s throttle, ${windows}` },
    { key:'send',     icon:'✅', label:'Send & follow-ups',
      desc:'Sequence day 1/3/7; stop on positive reply' },
    { key:'measure',  icon:'📊', label:'Measure lift → dashboard',
      desc:'Replies/meetings → 27% conversion lift' },
  ],[prospect,region,industry,size,titles,sourceOrder,nvb,caps,windows])

  const [cursor, setCursor] = useState(0)
  const [running, setRunning] = useState(false)
  const [kpis, setKpis] = useState({ found:0, verified:0, drafts:0, approved:0, sent:0, replies:0 })

  useEffect(()=>{
    if (!running) return
    const id = setTimeout(()=>{
      const s = steps[cursor]?.key
      setKpis(k => ({
        found:    k.found    + (s==='phantom'  ? 40 : 0),
        verified: k.verified + (s==='verify'   ? 32 : 0),
        drafts:   k.drafts   + (s==='draft'    ? 28 : 0),
        approved: k.approved + (s==='outreach' ? 22 : 0),
        sent:     k.sent     + (s==='send'     ? 22 : 0),
        replies:  k.replies  + (s==='measure'  ? 6  : 0),
      }))
      setCursor(i => (i+1) % steps.length)
      play(860,0.04)
    }, 1100)
    return () => clearTimeout(id)
  },[running, cursor, steps, play])

  // Conversion lift chart
  const chart = [
    { k:'Baseline', v: 11.0 },   // old reply/meeting %
    { k:'GenAI',    v: 14.0 },   // ~27% relative lift
  ]

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/60" onClick={()=>{ play(720,0.05); onClose() }} />
      <motion.div
        initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:24 }}
        className="absolute inset-4 md:inset-6 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/10"
      >
        {/* Solid base to avoid see-through */}
        <div className="absolute inset-0 bg-app" />

        <div ref={scrollRef} className="relative z-10 h-full w-full overflow-y-auto">
          {/* soft pixel background */}
          <motion.div style={{ y: ySlow }} className="pointer-events-none absolute inset-0 opacity-[0.06] -z-10">
            <div className="w-full h-full" style={{
              backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
              backgroundSize: '10px 10px', color: '#0f172a'
            }}/>
          </motion.div>
          <motion.div style={{ y: yMed }}  className="pointer-events-none absolute -top-24 -left-24 w-[32rem] h-[32rem] rounded-full bg-pink-400/25 blur-[140px] -z-10" />
          <motion.div style={{ y: yFast }} className="pointer-events-none absolute bottom-[-10rem] right-[-8rem] w-[32rem] h-[32rem] rounded-full bg-sky-400/25 blur-[140px] -z-10" />

          {/* Close */}
          <button onClick={()=>{ play(720,0.05); onClose() }}
                  className="absolute top-4 right-4 z-10 rounded-full bg-slate-900 text-white px-3 py-1 text-xs shadow hover:shadow-md">
            Close
          </button>

          {/* Header + Intake */}
          <section className="relative h-[70vh] md:h-[78vh]">
            <div className="sticky top-0 h-[66vh] flex items-center justify-center px-6 pt-8 md:pt-12">
              <div className="text-center max-w-[1200px] w-full mx-auto">
                <motion.h3 className="text-3xl md:text-4xl font-semibold tracking-tight text-strong">
                  BD GenAI Emails: {prospect}
                </motion.h3>
                <p className="mt-3 text-app">
                  Enter a prospect company, find senior supply-chain buyers, enrich & verify emails, personalize with pains + case studies,
                  create Outreach drafts (owner as sender), schedule safely, and measure lift.
                </p>

                {/* Intake card */}
                <div className="mt-6 text-left">
                  <div className="rounded-3xl bg-card ring-soft shadow max-w-[1200px] mx-auto p-4 md:p-5">
                    {/* Primary: Prospect */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <Field label="Prospect (company)">
                        <input
                          className="input"
                          value={prospect}
                          onChange={e=>setProspect(e.target.value)}
                          onFocus={()=>play(760,0.05)}
                          placeholder="e.g., Kraft Heinz"
                        />
                      </Field>
                      <div className="md:col-span-2 flex items-end">
                        <button onClick={deriveFromProspect}
                          className="w-full md:w-auto rounded-xl bg-fuchsia-600 text-white text-xs px-3 py-2 shadow hover:shadow-md">
                          Derive filters from Prospect Research
                        </button>
                      </div>
                    </div>

                    {/* Derived (editable) */}
                    <div className="mt-4 grid md:grid-cols-4 gap-3">
                      <Field label="Region"><input className="input" value={region} onChange={e=>setRegion(e.target.value)} /></Field>
                      <Field label="Industry"><input className="input" value={industry} onChange={e=>setIndustry(e.target.value)} /></Field>
                      <Field label="Company size"><input className="input" value={size} onChange={e=>setSize(e.target.value)} /></Field>
                      <Field label="Target titles"><input className="input" value={titles} onChange={e=>setTitles(e.target.value)} /></Field>
                    </div>

                    {/* Sources / verification / guardrails */}
                    <div className="mt-4 grid md:grid-cols-3 gap-4">
                      <Field label="Email sources (priority)">
                        <select className="input" value={sourceOrder} onChange={e=>setSourceOrder(e.target.value)}>
                          <option>ZoomInfo → Lusha → Fallback</option>
                          <option>Lusha → ZoomInfo → Fallback</option>
                        </select>
                      </Field>
                      <Field label={`NeverBounce accept ≥ ${Math.round(nvb*100)}%`}>
                        <input type="range" min={0.6} max={0.98} step={0.01} value={nvb}
                               onChange={e=>setNvb(parseFloat(e.target.value))} className="w-full" />
                      </Field>
                      <Field label="Send windows">
                        <input className="input" value={windows} onChange={e=>setWindows(e.target.value)} />
                      </Field>
                    </div>

                    <div className="mt-3 grid md:grid-cols-2 gap-3">
                      <Field label="Caps & throttle">
                        <div className="flex gap-2">
                          <input className="input" style={{maxWidth:120}} value={caps.perDay}
                                 onChange={e=>setCaps(c=>({...c, perDay: Number(e.target.value)||0}))}/>
                          <input className="input" style={{maxWidth:180}} value={caps.throttleSec}
                                 onChange={e=>setCaps(c=>({...c, throttleSec: Number(e.target.value)||0}))}/>
                        </div>
                        <div className="text-[11px] text-muted mt-1">
                          {caps.perDay}/day • {caps.throttleSec}s between sends
                        </div>
                      </Field>
                    </div>
                  </div>
                </div>

                {/* KPIs + controls */}
                <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                  Found <b>{kpis.found}</b> • Verified <b>{kpis.verified}</b> • Drafts <b>{kpis.drafts}</b> •
                  Approved <b>{kpis.approved}</b> • Sent <b>{kpis.sent}</b> • Replies/meetings <b>{kpis.replies}</b>
                </div>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button onClick={()=>{ setRunning(r=>!r); play(820,0.05) }}
                          className={`px-3 py-1 text-xs rounded-full ${running ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white'}`}>
                    {running ? 'Pause' : 'Run demo'}
                  </button>
                  <button onClick={()=>{ setCursor((cursor+1)%steps.length); play(780,0.05) }}
                          className="px-3 py-1 text-xs rounded-full bg-card ring-soft text-slate-900 dark:text-white">
                    Next step
                  </button>
                </div>
              </div>
            </div>

            {/* Pipeline strip */}
            <motion.div style={{ y: yMed }} className="absolute inset-x-0 bottom-[-9rem] px-6">
              <Pipeline steps={steps} cursor={cursor} />
            </motion.div>

            {/* badge */}
            <motion.div style={{ y: yFast }} className="pointer-events-none absolute right-10 bottom-[-12rem] hidden md:block">
              <Badge>NeverBounce ≥ {Math.round(nvb*100)}% • DNC & GDPR enforced</Badge>
            </motion.div>
          </section>

          {/* Preview + Metrics */}
          <section className="relative z-10 mt-[18rem] md:mt-[22rem] px-6 pb-12">
            <div className="max-w-[1200px] mx-auto grid lg:grid-cols-3 gap-6">
              <Card title="Email preview (owner will review in Outreach)">
                <EmailPreview prospect={prospect} />
              </Card>

              <Card title="Compliance & guardrails">
                <ul className="text-sm text-slate-800 dark:text-slate-200 space-y-2">
                  <li>• DNC lists checked before drafting/sending.</li>
                  <li>• <b>NeverBounce</b>: accept only <i>valid</i>; “catch-all” flagged for manual review.</li>
                  <li>• Respect <b>GDPR/CCPA</b>; include clear opt-out link + physical address.</li>
                  <li>• Throttle: {caps.throttleSec}s; cap: {caps.perDay}/day; send windows: {windows}.</li>
                  <li>• Outreach drafts created “as owner”; owner must approve before send.</li>
                </ul>
              </Card>

              <Card title="Conversion lift (reply/meeting %)">
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chart} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.25)" />
                      <XAxis dataKey="k" stroke="currentColor" />
                      <YAxis stroke="currentColor" />
                      <Tooltip cursor={{ fill:'rgba(148,163,184,.15)' }} />
                      <Bar dataKey="v" radius={[8,8,0,0]} fill="#64748b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                  Example: 11.0% → 14.0% (≈ <b>27%</b> relative lift). Logged to your dashboard.
                </p>
              </Card>
            </div>

            {/* NEW: Business Impact block */}
            <div className="max-w-[1200px] mx-auto mt-6">
              <Card title="Business Impact">
                <ImpactBlock
                  problem="BD reps manually curated contacts and sent generic first-touch emails, leading to high bounce rates, low reply rates, and inconsistent compliance."
                  solution="Automated a prospect-first workflow: find the right senior buyers, enrich and verify emails (NeverBounce threshold), generate contextual LLM drafts using company pains + relevant case studies, create Outreach drafts for owner approval, and schedule with safe windows, caps, and throttling."
                  points={[
                    'Fewer bounces via verified emails (NeverBounce threshold & catch-all review)',
                    'Higher reply/meeting rate from contextual drafts (+≈27% relative lift vs baseline)',
                    'Time saved for reps by automating enrichment, verification, and drafting',
                    'Lower risk through DNC/GDPR guardrails, owner-approval gating, and throttling'
                  ]}
                  // kpis={[ { value: '↓', label: 'bounce rate' }, { value: '+27%', label: 'reply/meeting lift' }, { value: 'mins', label: 'time saved / lead' } ]}
                />
              </Card>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  )
}

/* ---------- Atoms ---------- */

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

function Card({ title, children }){
  return (
    <div className="rounded-3xl p-6 bg-card ring-soft shadow">
      <h5 className="text-lg font-semibold text-strong mb-3">{title}</h5>
      {children}
    </div>
  )
}

function Badge({ children }) {
  return <div className="rounded-full bg-slate-900 text-white text-xs px-3 py-1 shadow">{children}</div>
}

/* ---- Clean, scrollable pipeline strip ---- */
const CARD_W = 220
const GAP_PX = 16

function Pipeline({ steps, cursor }) {
  return (
    <div className="relative mx-auto max-w-[1200px]">
      <div className="relative overflow-x-auto no-scrollbar pb-5 pt-1">
        <div className="grid grid-flow-col auto-cols-[220px] gap-4">
          {steps.map((s, i) => (
            <StepNode key={s.key} active={i === cursor} icon={s.icon} label={s.label} desc={s.desc} />
          ))}
        </div>
        <motion.div
          initial={false}
          animate={{ x: cursor * (CARD_W + GAP_PX) }}
          transition={{ type: 'spring', stiffness: 160, damping: 18 }}
          style={{ width: CARD_W }}
          className="absolute left-0 bottom-0 h-1.5 rounded-full bg-accent shadow"
        />
      </div>
    </div>
  )
}

function StepNode({ icon, label, desc, active }) {
  return (
    <div className={`rounded-2xl ring-1 shadow-sm px-4 py-4 text-center
      ${active ? 'ring-accent bg-card'
               : 'ring-soft bg-card'}`}>
      <div className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-lg
        ${active ? 'bg-accent text-white' : 'bg-slate-900 text-white'}`}>
        {icon}
      </div>
      <div className="mx-auto mb-1 max-w-[180px] text-[13px] font-semibold leading-snug text-slate-900 dark:text-white"
           style={{ display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
        {label}
      </div>
      <div className="mx-auto max-w-[180px] text-[12px] leading-snug text-slate-600 dark:text-slate-300"
           style={{ display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
        {desc}
      </div>
      {active && <div className="mt-2 text-[10px] text-emerald-600 dark:text-emerald-300">running…</div>}
    </div>
  )
}

/* ---------- Email preview ---------- */

function EmailPreview({ prospect }){
  const { play } = useBeep()
  const subjects = [
    `Idea to stabilize forecast variance at ${prospect}`,
    `Quick thought on cutting stockouts at ${prospect}`,
    `A 30-day plan to de-risk ${prospect}'s bottlenecks`,
  ]

  const body =
`Hi {{firstName}},

Noticed a few supply-chain headwinds at ${prospect} (lead-time volatility and cold-chain constraints from recent news). We’ve helped peers in CPG lift forecast accuracy and reduce stockouts using o9’s digital brain—combining causal drivers with external signals rather than prompt-based heuristics.

Two ways we can help in the next 30 days:
1) A quick “sanity” model on your last 12 months to pressure-test promotions/seasonality.
2) A pilot playbook focused on your top SKUs and lanes to remove bottlenecks.

Would a 20-minute working session next week be useful, or should I send a 2-slide brief first?

— {{ownerName}}, {{ownerTitle}}
o9 Solutions • {{ownerEmail}}
Unsubscribe anytime: {{optoutLink}}`

  return (
    <div>
      <div className="mb-2 text-xs text-muted">Subject ideas</div>
      <div className="flex flex-wrap gap-2 mb-3">
        {subjects.map((s,i)=>(
          <button key={i} onClick={()=>play(780,0.04)}
            className="rounded-full bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white px-3 py-1 text-xs">
            {s}
          </button>
        ))}
      </div>
      <div className="rounded-2xl bg-slate-900 text-white p-4 font-mono text-[12px] leading-relaxed whitespace-pre-wrap">
        {body}
      </div>
      <p className="mt-2 text-xs text-muted">
        Personalization pulls pains from your news/bottleneck pipeline and matches industry case studies from G-Drive.
        Drafts are created in Outreach for the account owner to approve.
      </p>
    </div>
  )
}
