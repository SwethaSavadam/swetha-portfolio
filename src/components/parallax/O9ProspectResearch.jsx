import ImpactBlock from '../shared/ImpactBlock'
import React, { useMemo, useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useBeep } from '../../utils/useBeep'
import {
  ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip
} from 'recharts'

/**
 * Prospect Research Bot (Scrapy) — WORKFLOW VIEW (with Intake)
 * Opaque overlay fix: solid base background inside the panel + opaque cards.
 */
export default function O9ProspectResearch({ onClose }) {
  const scrollRef = useRef(null)
  const { scrollYProgress } = useScroll({ container: scrollRef })
  const prefersReduced = useReducedMotion()
  const { play } = useBeep()

  // Parallax layers
  const depth = prefersReduced ? 0 : 1
  const ySlow = useTransform(scrollYProgress, [0,1], [0, -50*depth])
  const yMed  = useTransform(scrollYProgress, [0,1], [0, -120*depth])
  const yFast = useTransform(scrollYProgress, [0,1], [0, -220*depth])

  // ---------- Intake state ----------
  const [prospect, setProspect] = useState('Kraft Heinz')
  const [kwInput, setKwInput] = useState('')
  const [keywords, setKeywords] = useState([
    'supply bottlenecks','lead times','inventory optimization','supplier risk',
    'warehouse automation','transportation delays','cold chain','demand forecasting',
  ])

  const loadTemplate = () => {
    setKeywords([
      'supply bottlenecks','lead times','inventory optimization','supplier risk',
      'warehouse automation','transportation delays','cold chain','demand forecasting',
      'S&OP','capacity planning','ERP','SAP IBP','Blue Yonder','Kinaxis'
    ])
    play(820,0.05)
  }

  const addKeyword = () => {
    const t = kwInput.trim()
    if (!t) return
    if (!keywords.includes(t)) setKeywords(k => [...k, t])
    setKwInput('')
    play(780,0.05)
  }

  const removeKeyword = (k) => {
    setKeywords(x => x.filter(i => i !== k))
    play(740,0.05)
  }

  // ---------- Pipeline steps ----------
  const steps = useMemo(() => [
    { key:'intake',   icon:'🗂️', label:'Intake targets & keywords',
      desc:`Prospect: ${prospect} • ${keywords.length} keywords` },
    { key:'seed',     icon:'🔎', label:'Seed search queries',
      desc:'SERP seeds + company site + news domains' },
    { key:'crawl',    icon:'🕷️', label:'Scrapy crawl',
      desc:'Respect robots.txt, concurrency, cache' },
    { key:'parse',    icon:'🧩', label:'Parse & normalize',
      desc:'HTML → text; author/date; canonical URL' },
    { key:'enrich',   icon:'🧠', label:'LLM extract & classify',
      desc:'Bottlenecks, pain points, tech, sentiment' },
    { key:'finance',  icon:'💹', label:'Financials & KPIs',
      desc:'Rev/EBITDA, 3-yr trend (API/filings)' },
    { key:'news',     icon:'🗞️', label:'Recent & competitor news',
      desc:'Dedup, cluster, highlight risk/opps' },
    { key:'compose',  icon:'🧾', label:'Compose deck',
      desc:'10-card deck: summary → plan' },
    { key:'export',   icon:'📤', label:'Export',
      desc:'Slides/PDF link + share to Slack' },
    { key:'index',    icon:'🔎', label:'Index for Q&A (RAG)',
      desc:'Embeddings + pgvector; chat on the deck' },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [prospect, keywords.length])

  const [cursor, setCursor] = useState(0)
  const [running, setRunning] = useState(false)
  const [counts, setCounts] = useState({ pages:0, sections:0, facts:0, slides:0, chunks:0 })

  // Demo auto-advance
  useEffect(() => {
    if (!running) return
    const id = setTimeout(() => {
      const s = steps[cursor]?.key
      setCounts(c => ({
        pages:   c.pages   + (s==='crawl'  ? 16 : 0),
        sections:c.sections+ (s==='parse'  ? 48 : 0),
        facts:   c.facts   + (s==='enrich' ? 22 : 0),
        slides:  c.slides  + (s==='compose'? 10 : 0),
        chunks:  c.chunks  + (s==='index'  ? 64 : 0),
      }))
      setCursor(i => (i+1) % steps.length)
      play(860,0.04)
    }, 1100)
    return () => clearTimeout(id)
  }, [running, cursor, steps, play])

  // Tiny 3-yr performance line (placeholder)
  const perf = [
    { y: 'Y-3', rev: 3.2 }, { y:'Y-2', rev: 3.6 }, { y:'Y-1', rev: 4.1 }, { y:'Now', rev: 4.7 }
  ]

  return (
    <div className="fixed inset-0 z-[60]">
      {/* dimmer */}
      <div className="absolute inset-0 bg-black/60" onClick={() => { play(720,0.05); onClose() }} />
      {/* panel */}
      <motion.div
        initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:24 }}
        className="absolute inset-4 md:inset-6 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/10"
      >
        {/* SOLID base background layer to prevent see-through */}
        <div className="absolute inset-0 bg-app" />

        {/* scrollable content on top of the solid base */}
        <div ref={scrollRef} className="relative z-10 h-full w-full overflow-y-auto">
          {/* Background ornaments (behind content) */}
          <motion.div style={{ y: ySlow }} className="pointer-events-none absolute inset-0 opacity-[0.06] -z-10">
            <div className="w-full h-full" style={{
              backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
              backgroundSize: '10px 10px',
              color: '#0f172a'
            }}/>
          </motion.div>
          <motion.div style={{ y: yMed }}  className="pointer-events-none absolute -top-24 -left-24 w-[32rem] h-[32rem] rounded-full bg-violet-400/25 blur-[140px] -z-10" />
          <motion.div style={{ y: yFast }} className="pointer-events-none absolute bottom-[-10rem] right-[-8rem] w-[32rem] h-[32rem] rounded-full bg-cyan-400/25 blur-[140px] -z-10" />

          {/* Close */}
          <button onClick={() => { play(720,0.05); onClose() }}
            className="absolute top-4 right-4 z-10 rounded-full bg-slate-900 text-white px-3 py-1 text-xs shadow hover:shadow-md">
            Close
          </button>

          {/* ---------- STICKY HERO + INTAKE ---------- */}
          <section className="relative h-[70vh] md:h-[78vh]">
            <div className="sticky top-0 h-[66vh] flex items-center justify-center px-6">
              <div className="text-center max-w-[1200px] w-full mx-auto">
                <motion.h3 className="text-3xl md:text-4xl font-semibold tracking-tight text-strong">
                  Prospect Research Bot: Scrapy → Deck → Q&A
                </motion.h3>
                <p className="mt-3 text-app">
                  Crawl with <b>Scrapy</b>, extract supply-chain intel, enrich with LLMs, build a 10-card market deck, and enable Q&A over the deck.
                </p>

                {/* INTAKE (opaque card) */}
                <div className="mt-6 text-left">
                  <div className="rounded-3xl bg-card ring-soft shadow max-w-[1200px] mx-auto p-4 md:p-5">
                    <div className="grid md:grid-cols-3 gap-4">
                      {/* Prospect input */}
                      <div>
                        <label className="text-xs text-muted">Prospect</label>
                        <input
                          value={prospect}
                          onChange={e => setProspect(e.target.value)}
                          onFocus={()=>play(760,0.05)}
                          className="mt-1 w-full rounded-xl bg-card border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-white"
                          placeholder="e.g., Kraft Heinz"
                        />
                      </div>

                      {/* Keyword adder */}
                      <div>
                        <label className="text-xs text-muted">Add keyword</label>
                        <div className="mt-1 flex gap-2">
                          <input
                            value={kwInput}
                            onChange={e => setKwInput(e.target.value)}
                            onKeyDown={(e)=>{ if(e.key==='Enter'){ e.preventDefault(); addKeyword() }}}
                            className="flex-1 rounded-xl bg-card border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-white"
                            placeholder="e.g., supplier consolidation"
                          />
                          <button onClick={addKeyword} className="rounded-xl bg-slate-900 text-white text-xs px-3">Add</button>
                        </div>
                      </div>

                      {/* Template loader */}
                      <div className="flex items-end">
                        <button onClick={loadTemplate}
                          className="w-full rounded-xl bg-fuchsia-600 text-white text-xs px-3 py-2 shadow hover:shadow-md">
                          Load supply-chain template
                        </button>
                      </div>
                    </div>

                    {/* Keyword chips */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {keywords.map(k => (
                        <button key={k} onClick={()=>removeKeyword(k)}
                          className="text-xs rounded-full px-2 py-1 bg-slate-100 dark:bg-slate-800 text-app border border-slate-200 dark:border-slate-700">
                          {k} <span className="opacity-60 ml-1">×</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Counters + Controls */}
                <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                  Pages <b>{counts.pages}</b> • Sections <b>{counts.sections}</b> • Facts <b>{counts.facts}</b> • Slides <b>{counts.slides}</b> • Chunks <b>{counts.chunks}</b>
                </div>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button onClick={() => { setRunning(r => !r); play(820,0.05) }}
                          className={`px-3 py-1 text-xs rounded-full ${running ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white'}`}>
                    {running ? 'Pause' : 'Run demo'}
                  </button>
                  <button onClick={() => { setCursor((cursor+1)%steps.length); play(780,0.05) }}
                          className="px-3 py-1 text-xs rounded-full bg-card ring-soft text-slate-900 dark:text-white">
                    Next step
                  </button>
                </div>
              </div>
            </div>

            {/* Pipeline (medium layer) — wide & clean */}
            <motion.div style={{ y: yMed }} className="absolute inset-x-0 bottom-[-9rem] px-6">
              <Pipeline steps={steps} cursor={cursor} />
            </motion.div>

            {/* Fast badge */}
            <motion.div style={{ y: yFast }} className="pointer-events-none absolute right-10 bottom-[-12rem] hidden md:block">
              <Badge>Exports Slides/PDF • Indexed for chat</Badge>
            </motion.div>
          </section>

          {/* Deck outline + performance chart (expanded width) */}
          <section className="relative z-10 mt-[18rem] md:mt-[22rem] px-6 pb-12">
            <div className="max-w-[1200px] mx-auto grid lg:grid-cols-3 gap-6">
              <Card title="Deck outline (auto-generated)">
                <DeckOutline />
              </Card>

              <Card title="3-year performance (example)">
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={perf} margin={{ top: 6, right: 8, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gperf" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%"  stopColor="#94a3b8" stopOpacity={0.4}/>
                          <stop offset="100%" stopColor="#94a3b8" stopOpacity={0.05}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.25)" />
                      <XAxis dataKey="y" stroke="currentColor" />
                      <YAxis stroke="currentColor" />
                      <Tooltip cursor={{ fill:'rgba(148,163,184,.15)' }} />
                      <Area type="monotone" dataKey="rev" stroke="#64748b" fill="url(#gperf)" strokeWidth={2}/>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
                  Pull from a financials API or filings; normalize currency; show CAGR and YoY deltas.
                </p>
              </Card>

              <Card title="Q&A over the deck (RAG)">
                <ul className="text-sm text-slate-800 dark:text-slate-200 space-y-2">
                  <li>• Deck JSON + citations → embeddings → <b>pgvector</b></li>
                  <li>• Ask: “What are {prospect}’s supply bottlenecks?” → slide refs & quotes</li>
                  <li>• Ask: “Build a 30-day plan for {prospect}” → returns next steps + owners</li>
                </ul>
              </Card>
            </div>

            {/* NEW: Business Impact block */}
            <div className="max-w-[1200px] mx-auto mt-6">
              <ImpactBlock
                title="Business Impact"
                problem="Manual prospect research lived across dozens of tabs (Google, filings, blogs), with unstructured notes and inconsistent decks. Prep took hours per account, insights went stale, and handoff to outreach lacked a single source of truth."
                solution="An automated pipeline: Intake keywords → Scrapy crawl → parse/dedupe → LLM extraction/classification → financial normalization → news clustering → auto-compose a 10-card deck → share to Slack → index to pgvector for Q&A. Everything lives in one consistent artifact."
                points={[
                  'Cuts research & deck-prep time from hours to minutes per account',
                  'Standardized 10-card deck improves quality and repeatability',
                  'Always-fresh insights; easy Slack sharing for fast collaboration',
                  'Indexed for Q&A so sellers can answer deep questions on the fly',
                ]}
                // kpis={[
                //   { value: '−70%', label: 'prep time' },
                //   { value: '↑',    label: 'deck quality consistency' },
                //   { value: '≤24h', label: 'intel freshness' },
                // ]}
              />
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  )
}

/* ---------- Presentational bits ---------- */

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


const CARD_W = 220;   // card width used for progress bar calc
const GAP_PX = 16;    // horizontal gap between cards

function Pipeline({ steps, cursor }) {
  return (
    <div className="relative mx-auto max-w-[1200px]">
      {/* Scrollable, single-row strip of equal-width cards */}
      <div className="relative overflow-x-auto no-scrollbar pb-5 pt-1">
        <div
          className="grid grid-flow-col auto-cols-[220px] gap-4"
          // keeps equal width cards; no wrapping
        >
          {steps.map((s, i) => (
            <StepNode
              key={s.key}
              active={i === cursor}
              icon={s.icon}
              label={s.label}
              desc={s.desc}
            />
          ))}
        </div>

        {/* Bottom progress pill aligned to the active card */}
        <motion.div
          initial={false}
          animate={{ x: cursor * (CARD_W + GAP_PX) }}
          transition={{ type: 'spring', stiffness: 160, damping: 18 }}
          style={{ width: CARD_W }}
          className="absolute left-0 bottom-0 h-1.5 rounded-full bg-accent shadow"
        />
      </div>
    </div>
  );
}

function StepNode({ icon, label, desc, active }) {
  return (
    <div
      className={`rounded-2xl ring-1 shadow-sm px-4 py-4 text-center
        ${active
          ? 'ring-accent bg-card'
          : 'ring-soft bg-card'
        }`}
    >
      {/* icon */}
      <div
        className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl text-lg
          ${active ? 'bg-accent text-white' : 'bg-slate-900 text-white'}`}
      >
        {icon}
      </div>

      {/* title (max 2 lines, clamped) */}
      <div
        className="mx-auto mb-1 max-w-[180px] text-[13px] font-semibold leading-snug text-slate-900 dark:text-white"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}
      >
        {label}
      </div>

      {/* description (max 3 lines, softer color) */}
      <div
        className="mx-auto max-w-[180px] text-[12px] leading-snug text-slate-600 dark:text-slate-300"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}
      >
        {desc}
      </div>

      {active && (
        <div className="mt-2 text-[10px] text-emerald-600 dark:text-emerald-300">
          running…
        </div>
      )}
    </div>
  );
}


function DeckOutline(){
  const cards = [
    '1) Summary',
    '2) Financials',
    '3) 3-year Performance',
    "4) Prospect's Supply bottlenecks",
    '5) Other business pain points',
    '6) Recent News',
    "7) Prospect’s competition News",
    '8) Talking Points',
    '9) Tech Landscape',
    '10) Customised project plan',
  ]
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {cards.map((c,i)=>(
        <div key={i} className="rounded-2xl px-3 py-2 ring-soft bg-card">
          <div className="text-sm text-slate-900 dark:text-white">{c}</div>
        </div>
      ))}
      <p className="sm:col-span-2 text-xs text-slate-600 dark:text-slate-300 mt-1">
        Slides are composed from extracted facts & charts; links & citations preserved.
      </p>
    </div>
  )
}
