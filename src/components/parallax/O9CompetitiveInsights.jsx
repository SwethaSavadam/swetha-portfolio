import React, { useMemo, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useBeep } from '../../utils/useBeep'
import {
  ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar
} from 'recharts'

/** O9 Competitive Insights — realtime alerts (Make pipeline walkthrough) */
export default function O9CompetitiveInsights({ onClose }) {
  const scrollRef = useRef(null)
  const { scrollYProgress } = useScroll({ container: scrollRef })
  const prefersReduced = useReducedMotion()
  const { play } = useBeep()

  // Parallax depths
  const depth = prefersReduced ? 0 : 1
  const ySlow = useTransform(scrollYProgress, [0,1], [0, -50*depth])
  const yMed  = useTransform(scrollYProgress, [0,1], [0, -120*depth])
  const yFast = useTransform(scrollYProgress, [0,1], [0, -200*depth])

  // Demo state
  const steps = useMemo(()=>[
    { key:'sheet',  label:'Load sources from Google Sheets', icon:'📄', desc:'Feeds + competitors + tags' },
    { key:'rss',    label:'Fetch new items via RSS',         icon:'🛰️', desc:'Pull per-source last 24h' },
    { key:'dedupe', label:'De-duplicate URLs',               icon:'♻️', desc:'Skip anything already logged' },
    { key:'scrape', label:'Scrape article with ScrapingBee', icon:'🐝', desc:'Full text, author, date, canonical' },
    { key:'gpt',    label:'Classify with GPT-4',              icon:'🤖', desc:'Competitor, topic, sentiment, action' },
    { key:'log',    label:'Write results to Sheets',         icon:'📈', desc:'Append to “intel_log” with status' },
    { key:'route',  label:'Route by audience',               icon:'🧭', desc:'Templates for Execs, PMM, SE, AE' },
    { key:'slack',  label:'Push alerts to Slack',            icon:'💬', desc:'Post to channels & DM owners' },
  ],[])
  const [cursor, setCursor] = useState(0)
  const [running, setRunning] = useState(false)

  // Counters just for the demo feel
  const [counts, setCounts] = useState({ fetched: 0, deduped: 0, scraped: 0, classified: 0, posted: 0 })

  // Auto-run
  React.useEffect(()=>{
    if (!running) return
    let id = setTimeout(() => {
      const s = steps[cursor]?.key
      setCounts(c => ({
        fetched:    c.fetched    + (s==='rss' ? 5 : 0),
        deduped:    c.deduped    + (s==='dedupe' ? 2 : 0),
        scraped:    c.scraped    + (s==='scrape' ? 5 : 0),
        classified: c.classified + (s==='gpt' ? 5 : 0),
        posted:     c.posted     + (s==='slack' ? 4 : 0),
      }))
      setCursor(i => (i + 1) % steps.length)
      play(860,0.04)
    }, 1200)
    return () => clearTimeout(id)
  }, [running, cursor, steps, play])

  // Tiny trend for “articles/day”
  const series = [
    { d:'Mon', val: 8 }, { d:'Tue', val: 11 }, { d:'Wed', val: 7 },
    { d:'Thu', val: 13 }, { d:'Fri', val: 9 }, { d:'Sat', val: 5 }, { d:'Sun', val: 6 },
  ]

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/50" onClick={() => { play(720,0.05); onClose() }} />
      <motion.div
        initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:24 }}
        className="absolute inset-4 md:inset-6 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/10"
      >
        <div
          ref={scrollRef}
          className="relative h-full w-full overflow-y-auto bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950"
        >
          {/* --- WOW background: soft gradient blobs + pixel grid (parallax) --- */}
          {/* Pixel grid */}
          <motion.div style={{ y: ySlow }} className="pointer-events-none absolute inset-0 opacity-[0.06]">
            <div className="w-full h-full" style={{
              backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
              backgroundSize: '10px 10px',
              color: '#0f172a'
            }}/>
          </motion.div>
          {/* Blobs */}
          <motion.div
            style={{ y: yMed }}
            className="pointer-events-none absolute -top-24 -left-24 w-[28rem] h-[28rem] rounded-full bg-fuchsia-400/25 blur-[120px] mix-blend-normal"
          />
          <motion.div
            style={{ y: yFast }}
            className="pointer-events-none absolute bottom-[-8rem] right-[-6rem] w-[28rem] h-[28rem] rounded-full bg-sky-400/25 blur-[120px] mix-blend-normal"
          />

          {/* optional Make screenshots as faint plates */}
          <motion.img src="/images/competitive-intel-1.png" alt="" style={{ y: ySlow }}
            className="pointer-events-none absolute opacity-[0.07] top-8 left-6 w-[60%] hidden md:block" />
          <motion.img src="/images/competitive-intel-slack.png" alt="" style={{ y: ySlow }}
            className="pointer-events-none absolute opacity-[0.07] bottom-8 right-6 w-[55%] hidden md:block" />

          {/* Close */}
          <button onClick={() => { play(720,0.05); onClose() }}
            className="absolute top-4 right-4 z-10 rounded-full bg-slate-900 text-white px-3 py-1 text-xs shadow hover:shadow-md">
            Close
          </button>

          {/* Sticky header with controls */}
          <section className="relative h-[64vh] md:h-[72vh]">
            <div className="sticky top-0 h-[56vh] flex items-center justify-center px-6">
              <div className="text-center max-w-4xl">
                <motion.h3 className="text-3xl md:text-4xl font-semibold tracking-tight text-strong">
                  Competitive Insights with realtime alerts
                </motion.h3>
                <p className="mt-3 text-slate-600 dark:text-slate-200">
                  Pull sources → de-dupe → scrape with <b>ScrapingBee</b> → classify with <b>GPT-4</b> → log → route → Slack.
                </p>

                {/* Controls */}
                <div className="mt-5 flex items-center justify-center gap-3">
                  <button
                    onClick={() => { setRunning(r => !r); play(820,0.05) }}
                    className={`px-3 py-1 text-xs rounded-full ${running ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white'}`}
                  >
                    {running ? 'Pause' : 'Run demo'}
                  </button>
                  <button
                    onClick={() => { setCursor((cursor+1)%steps.length); play(780,0.05) }}
                    className="px-3 py-1 text-xs rounded-full bg-card ring-soft"
                  >
                    Next step
                  </button>
                  <div className="text-xs text-muted">
                    Fetched <b>{counts.fetched}</b> • Classified <b>{counts.classified}</b> • Posted <b>{counts.posted}</b>
                  </div>
                </div>
              </div>
            </div>

            {/* Animated pipeline (medium layer) */}
            <motion.div style={{ y: yMed }} className="absolute inset-x-0 bottom-[-8rem] px-6">
              <Pipeline steps={steps} cursor={cursor} />
            </motion.div>

            {/* Badge (fast layer) */}
            <motion.div style={{ y: yFast }} className="pointer-events-none absolute right-6 bottom-[-12rem] hidden md:block">
              <Badge>Personalized Slack templates • per audience</Badge>
            </motion.div>
          </section>

          {/* Charts + explainer + templates */}
          <section className="relative z-10 mt-[16rem] md:mt-[20rem] px-6 pb-10">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card title="Articles / day (last 7)">
                <div className="h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={series} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.4}/>
                          <stop offset="100%" stopColor="#94a3b8" stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.25)" />
                      <XAxis dataKey="d" stroke="currentColor" />
                      <YAxis stroke="currentColor" allowDecimals={false}/>
                      <Tooltip cursor={{ fill: 'rgba(148,163,184,.15)' }} />
                      <Area type="monotone" dataKey="val" stroke="#64748b" fill="url(#g1)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <p className="mt-2 text-xs text-muted">Auto de-duped by canonical URL; stale posts skipped.</p>
              </Card>

              <Card title="Classification mix (last 50)">
                <div className="h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { k:'Launches', v:12 }, { k:'Partnerships', v:8 }, { k:'PMM intel', v:16 }, { k:'GTM plays', v:14 }
                    ]} margin={{ top: 8, right: 8, bottom: 8, left: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.25)" />
                      <XAxis dataKey="k" stroke="currentColor" />
                      <YAxis stroke="currentColor" allowDecimals={false}/>
                      <Tooltip cursor={{ fill: 'rgba(148,163,184,.15)' }} />
                      <Bar dataKey="v" radius={[6,6,0,0]} fill="#64748b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="mt-2 text-xs text-muted">GPT-4 labels + confidence; low-confidence flagged to review queue.</p>
              </Card>

              {/* NEW: Slack templates with Blue Yonder example */}
              <Card title="Slack templates (example: Blue Yonder)">
                <Templates />
              </Card>
            </div>
            <div className="h-10" />
          </section>
        </div>
      </motion.div>
    </div>
  )
}

/* -------- Presentational bits -------- */

function Card({ title, children }){
  return (
    <div className="rounded-3xl p-6 bg-panel ring-soft shadow">
      <h5 className="text-lg font-semibold text-strong mb-3">{title}</h5>
      {children}
    </div>
  )
}

function Badge({ children }) {
  return <div className="rounded-full bg-slate-900 text-white text-xs px-3 py-1 shadow">{children}</div>
}

/** Moved the pink progress bar to the BOTTOM (no overlap with content) */
function Pipeline({ steps, cursor }){
  return (
    <div className="relative mx-auto max-w-5xl pb-6">
      <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
        {steps.map((s, i) => (
          <StepNode key={s.key} active={i===cursor} icon={s.icon} label={s.label} desc={s.desc}/>
        ))}
      </div>
      {/* progress bar now hugs the bottom */}
      <motion.div
        key={cursor}
        initial={{ x: 0, opacity: 0.85 }}
        animate={{ x: '100%', opacity: 1 }}
        transition={{ duration: 1.0, ease: 'easeInOut' }}
        className="absolute left-0 bottom-1 h-1.5 w-10 rounded-full bg-accent shadow"
      />
    </div>
  )
}

function StepNode({ icon, label, desc, active }){
  return (
    <div className={`col-span-2 md:col-span-1 rounded-2xl p-3 ring-1 shadow-sm
                     ${active ? 'ring-accent bg-card' : 'ring-soft bg-panel'}`}>
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg
                         ${active ? 'bg-accent text-white' : 'bg-slate-900 text-white'}`}>
          {icon}
        </div>
        <div className="text-xs font-medium text-slate-900 dark:text-white">{label}</div>
      </div>
      <div className="mt-1 text-[11px] text-muted">{desc}</div>
      {active && <div className="mt-2 text-[10px] text-emerald-600 dark:text-emerald-300">running…</div>}
    </div>
  )
}

/* ---------- Templates: Blue Yonder example ---------- */

function Templates(){
  const [tab, setTab] = useState('exec')
  const owner = 'Anita Patel' // example owner – you can map from CRM later

  const texts = {
    exec:
`• **Blue Yonder** announced a *GenAI planning copilot* targeting retail demand sensing.
• Likely impact: **PMM narrative shift** in Q4; overlaps our Value Track #2 (forecast accuracy).
• Recommendation: Approve **PMM counter-position** draft for the board deck.
Link: https://example.com/by-announce
Logged to weekly pack.`,

    pmm:
`Heads-up: **Blue Yonder** launch – *GenAI planning copilot*.
What’s new:
• Claiming **3–5% forecast accuracy lift** via LLM synthesis of demand signals.
• Targeting enterprise retail; early design partners: Contoso Retail, Fabrikam.

**Action for @${owner}:**
1) Draft 3-slide counter-position (why our time-series + causal beats prompt-engineering).
2) Update **battlecard** with talk-track + proof points.
3) Schedule 15-min enablement for AEs/SEs.
Permalink: https://example.com/by-announce`,

    ae:
`Quick value talk-track for **Blue Yonder** news:
• They use prompts to blend signals; *we* use causal + exogenous drivers → more stable accuracy.
• Ask: "How do you validate LLM-generated insights versus seasonality and promotions?"
• Offer a 30-min **forecast sanity demo** with your data.
Ping me if you need the slide: @${owner}.`
  }

  return (
    <div>
      <div className="mb-3 inline-flex rounded-full bg-slate-100 dark:bg-slate-800 p-1">
        {['exec','pmm','ae'].map(k => (
          <button key={k}
            onClick={()=>setTab(k)}
            className={`px-3 py-1 text-xs rounded-full ${tab===k ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow' : 'text-slate-600 dark:text-slate-300'}`}
          >
            {k === 'exec' ? 'Exec brief' : k === 'pmm' ? 'PMM channel' : 'AE DM'}
          </button>
        ))}
      </div>

      <div className="rounded-2xl p-4 bg-slate-900 text-white font-mono text-[12px] leading-relaxed whitespace-pre-wrap">
        {texts[tab]}
      </div>

      <p className="mt-2 text-xs text-muted">
        Messages are generated per audience; owners are tagged automatically from CRM/Sheets.
      </p>
    </div>
  )
}
