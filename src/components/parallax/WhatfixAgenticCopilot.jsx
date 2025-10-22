import ImpactBlock from '../shared/ImpactBlock'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useBeep } from '../../utils/useBeep'

export default function WhatfixAgenticCopilot({ onClose }) {
  const scrollRef = useRef(null)
  const { scrollYProgress } = useScroll({ container: scrollRef })
  const prefersReduced = useReducedMotion()
  const { play } = useBeep()

  // Parallax depths
  const depth = prefersReduced ? 0 : 1
  const ySlow = useTransform(scrollYProgress, [0,1], [0, -40*depth])
  const yMed  = useTransform(scrollYProgress, [0,1], [0, -100*depth])
  const yFast = useTransform(scrollYProgress, [0,1], [0, -180*depth])

  // Intake: the user's question
  const [question, setQuestion] = useState('What is the renewal grace period for Enterprise plan?')
  const [running, setRunning] = useState(false)
  const [cursor, setCursor] = useState(0)
  const [kpis, setKpis] = useState({ docs:0, chunks:0, citations:0, confidence:78 })
  const [checklistOpen, setChecklistOpen] = useState(false)

  // Clean pipeline strip (equal-width cards)
  const steps = useMemo(()=>[
    { key:'plan',   icon:'🧭', label:'Planner (LangGraph)', desc:'make tiny plan: retrieve → read → answer → offer actions' },
    { key:'retrieve',icon:'🔎', label:'Retriever (RAG)', desc:'query pgvector by embeddings; fetch top-k=12; rerank' },
    { key:'read',   icon:'📖', label:'Reader + Judge', desc:'read top 3–4 chunks; check if they agree (consensus)' },
    { key:'answer', icon:'✍️', label:'Answerer', desc:'write concise answer w/ citations + confidence' },
    { key:'actions',icon:'🛠️', label:'Doer (n8n tools)', desc:'offer next steps: create task, draft email, update sheet' },
    { key:'logger', icon:'🧾', label:'Logger', desc:'write Q, citations, confidence, actions → analytics' },
  ],[])

  useEffect(()=>{
    if (!running) return
    const id = setTimeout(()=>{
      const s = steps[cursor]?.key
      setKpis(k => ({
        docs: k.docs + (s==='retrieve' ? 6 : 0),
        chunks: k.chunks + (s==='read' ? 12 : 0),
        citations: k.citations + (s==='answer' ? 3 : 0),
        confidence: Math.min(98, k.confidence + (s==='answer' ? 6 : 0)),
      }))
      setCursor(i => (i+1) % steps.length)
      play(860,0.04)
    }, 1100)
    return () => clearTimeout(id)
  },[running, cursor, steps, play])

  // answer demo (fake)
  const answerText =
`The renewal grace period for the Enterprise plan is **30 days** after term end. During this period, service continues without penalties. After 30 days, access may be suspended until the renewal PO is received.`
  const citations = [
    { title:'Renewals > Grace period policy', ref:'gdrive://Renewals/Policy#3.1' },
    { title:'Contract Ops > FAQ', ref:'confluence://CO/Renewals#Grace' },
    { title:'CSM Handbook > Renewals', ref:'gdrive://CSM/Handbook#Renewals' },
  ]

  return (
    <div className="fixed inset-0 z-[60]">
      {/* Dimmer */}
      <div className="absolute inset-0 bg-black/60" onClick={()=>{ play(720,0.05); onClose() }} />
      {/* Panel */}
      <motion.div
        initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:24 }}
        className="absolute inset-4 md:inset-6 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/10"
      >
        {/* Solid base */}
        <div className="absolute inset-0 bg-app" />

        {/* Decorative Whatfix theme */}
        <style>{`
          .wf-accent { background: #ff6d2d; }           /* Whatfix-esque orange */
          .wf-text   { color: #ff6d2d; }
        `}</style>

        <div ref={scrollRef} className="relative z-10 h-full w-full overflow-y-auto">
          {/* Background ornaments */}
          <motion.div style={{ y: ySlow }} className="pointer-events-none absolute inset-0 opacity-[0.05] -z-10">
            <div className="w-full h-full" style={{
              backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
              backgroundSize: '10px 10px', color: '#0f172a'
            }}/>
          </motion.div>
          <motion.div style={{ y: yMed }}  className="pointer-events-none absolute -top-24 -left-24 w-[32rem] h-[32rem] rounded-full wf-accent/25 blur-[140px] -z-10" />
          <motion.div style={{ y: yFast }} className="pointer-events-none absolute bottom-[-10rem] right-[-8rem] w-[32rem] h-[32rem] rounded-full bg-amber-400/25 blur-[140px] -z-10" />

          {/* Close */}
          <button onClick={()=>{ play(720,0.05); onClose() }}
            className="absolute top-4 right-4 z-10 rounded-full bg-slate-900 text-white px-3 py-1 text-xs shadow hover:shadow-md">
            Close
          </button>

          {/* HEADER + INTAKE */}
          <section className="relative h-[70vh] md:h-[78vh]">
            <div className="sticky top-0 h-[66vh] flex items-center justify-center px-6">
              <div className="text-center max-w-[1200px] w-full mx-auto">
                <motion.h3 className="text-3xl md:text-4xl font-semibold tracking-tight text-strong">
                  Agentic AI Copilot for CSMs
                </motion.h3>
                <p className="mt-3 text-app">
                  Ask a question. The agent plans, retrieves trusted answers from G-Drive/Confluence, and offers next steps via <b>n8n</b>.
                </p>

                {/* Intake card */}
                <div className="mt-6 text-left">
                  <div className="rounded-3xl bg-card ring-soft shadow max-w-[1200px] mx-auto p-4 md:p-5">
                    <div className="grid md:grid-cols-3 gap-4">
                      <label className="block">
                        <div className="text-xs text-muted">Question</div>
                        <input
                          className="mt-1 w-full rounded-xl bg-card border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm"
                          value={question}
                          onChange={(e)=>setQuestion(e.target.value)}
                          onFocus={()=>play(760,0.05)}
                          placeholder='e.g., What is the renewal grace period?'
                        />
                      </label>
                      <label className="block">
                        <div className="text-xs text-muted">Policy scope</div>
                        <select className="mt-1 w-full rounded-xl bg-card border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm">
                          <option>Renewals</option>
                          <option>Billing</option>
                          <option>Discounting</option>
                          <option>Support</option>
                        </select>
                      </label>
                      <div className="flex items-end gap-2">
                        <button onClick={()=>{ setRunning(r=>!r); play(820,0.05)}}
                                className="rounded-xl px-3 py-2 text-xs text-white shadow wf-accent" >
                          {running ? 'Pause demo' : 'Run demo'}
                        </button>
                        <button onClick={()=>{ setCursor((cursor+1)%steps.length); play(780,0.05)}}
                                className="rounded-xl px-3 py-2 text-xs ring-soft">
                          Next step
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
                      Docs <b>{kpis.docs}</b> • Chunks <b>{kpis.chunks}</b> • Citations <b>{kpis.citations}</b> • Confidence <b>{kpis.confidence}%</b>
                    </div>

                    {/* Tiny plan */}
                    <div className="mt-4 rounded-2xl bg-card p-3 font-mono text-[12px]">
{`Plan:
1) Search docs for "${question}"
2) Read top 3 chunks, check if they agree
3) Write answer with citations + give next steps`}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pipeline strip (clean) */}
            <motion.div style={{ y: yMed }} className="absolute inset-x-0 bottom-[-9rem] px-6">
              <Pipeline steps={steps} cursor={cursor} />
            </motion.div>

            <motion.div style={{ y: yFast }} className="pointer-events-none absolute right-10 bottom-[-12rem] hidden md:block">
              <Badge>n8n actions are always human-approved</Badge>
            </motion.div>
          </section>

          {/* ANSWER + ACTIONS + GUARDRAILS */}
          <section className="relative z-10 mt-[18rem] md:mt-[22rem] px-6 pb-14">
            <div className="max-w-[1200px] mx-auto grid lg:grid-cols-3 gap-6">
              {/* Answer card */}
              <Card title="Answer (with citations & confidence)">
                <p className="text-sm text-slate-800 dark:text-slate-200">{answerText}</p>
                <div className="mt-3 text-xs text-slate-600 dark:text-slate-300">
                  Citations:
                  <ul className="list-disc ml-5 mt-1">
                    {citations.map((c,i)=> <li key={i}><b>{c.title}</b> — <span className="text-slate-500">{c.ref}</span></li>)}
                  </ul>
                </div>
                <div className="mt-3 text-xs">
                  Confidence: <b>{kpis.confidence}%</b> • If &lt; 70%, show **sources only** (no actions).
                </div>
              </Card>

              {/* Actions via n8n */}
              <Card title="Offer next steps (n8n)">
                <p className="text-sm text-app">
                  Choose safe actions. These create human-reviewed tasks, not auto-sends.
                </p>
                <div className="mt-3 grid grid-cols-1 gap-2">
                  <ActionButton label="Create renewal checklist task" onClick={()=>{ play(820,0.05); setChecklistOpen(true) }} />
                  <ActionButton label="Draft customer email (Gmail draft)" onClick={()=>play(820,0.05)} />
                  <ActionButton label="Update renewal sheet row (Sheets)" onClick={()=>play(820,0.05)} />
                  <ActionButton label="Open CRM follow-up task" onClick={()=>play(820,0.05)} />
                </div>
                <p className="mt-3 text-xs text-muted">
                  n8n: scopes limited; allow-listed webhooks; every action logged with inputs/outputs.
                </p>
              </Card>

              {/* Guardrails */}
              <Card title="Guardrails (safety & compliance)">
                <ul className="text-sm text-slate-800 dark:text-slate-200 space-y-2">
                  <li>• <b>Read-only retrieval</b>: Drive/Confluence via service account; no edits.</li>
                  <li>• <b>DLP</b>: emails/IDs redacted before indexing; domain allow-list for egress.</li>
                  <li>• <b>Low-confidence = “cite-only mode”</b>; no actions offered.</li>
                  <li>• <b>Human-in-the-loop</b>: all n8n actions create drafts/tasks, not sends.</li>
                  <li>• <b>Rate limits</b>: QPS caps; per-user throttling; abuse protection.</li>
                  <li>• <b>Audit log</b>: Q, plan, citations, confidence, chosen action → analytics.</li>
                </ul>
              </Card>
            </div>

            {/* NEW: Business Impact block */}
            <div className="max-w-[1200px] mx-auto mt-6">
              <ImpactBlock
                title="Business Impact"
                problem="CSMs searched across Drive and Confluence for policy answers, giving inconsistent or outdated responses and no clear next steps—creating escalations and wasted time."
                solution="Agentic copilot plans the task, retrieves trusted chunks with citations, writes a concise answer with confidence, and offers safe, human-approved actions via n8n (create tasks, drafts, updates). Everything is logged for analytics."
                points={[
                  'Cuts time-to-answer with authoritative, cited responses',
                  'Consistent policy interpretation across teams and regions',
                  'Safe operationalization: actions are drafts with human approval',
                  'End-to-end audit trail (question → sources → action)'
                ]}
                // kpis={[
                //   { value: '−60%', label: 'time-to-answer' },
                //   { value: '↓',    label: 'policy escalations' },
                //   { value: '↑',    label: 'CSM productivity' },
                // ]}
              />
            </div>
          </section>

          {/* Checklist modal */}
          {checklistOpen && (
            <ChecklistModal
              onClose={()=>{ play(720,0.05); setChecklistOpen(false) }}
              question={question}
            />
          )}
        </div>
      </motion.div>
    </div>
  )
}

/* ---------- Atoms ---------- */

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
const CARD_W = 240
const GAP_PX = 16

function Pipeline({ steps, cursor }) {
  return (
    <div className="relative mx-auto max-w-[1200px]">
      <div className="relative overflow-x-auto no-scrollbar pb-5 pt-1">
        <div className="grid grid-flow-col auto-cols-[240px] gap-4">
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
      <div className="mx-auto mb-1 max-w-[200px] text-[13px] font-semibold leading-snug text-slate-900 dark:text-white"
           style={{ display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
        {label}
      </div>
      <div className="mx-auto max-w-[200px] text-[12px] leading-snug text-slate-600 dark:text-slate-300"
           style={{ display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
        {desc}
      </div>
    </div>
  )
}

function ActionButton({ label, onClick }){
  return (
    <button onClick={onClick}
      className="rounded-xl px-3 py-2 text-sm bg-card ring-soft hover:ring-orange-400 text-slate-900 dark:text-white text-left">
      {label}
    </button>
  )
}

/* ---------- Checklist Modal ---------- */

function ChecklistModal({ onClose, question }){
  const { play } = useBeep()
  const [items, setItems] = useState([
    { k:'Check plan & SKU', done:false },
    { k:'Confirm contract end date', done:false },
    { k:'Verify grace policy applies', done:false },
    { k:'Draft customer email', done:false },
    { k:'Update renewal tracker', done:false },
  ])
  const toggle = (i) => setItems(prev => prev.map((x,idx)=> idx===i ? ({...x, done:!x.done}) : x))

  const md = `### Renewal checklist
Q: ${question}
${items.map(i=>`- [${i.done?'x':' '}] ${i.k}`).join('\n')}`

  const copy = async () => {
    try { await navigator.clipboard.writeText(md); play(820,0.05) } catch {}
  }

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/40" onClick={()=>{ play(720,0.05); onClose() }} />
      <motion.div
        initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:16 }}
        className="absolute inset-x-6 md:inset-x-40 top-[18vh] rounded-3xl bg-card ring-soft shadow-2xl p-5"
      >
        <div className="flex items-start justify-between">
          <h4 className="text-lg font-semibold text-strong">Renewal checklist task</h4>
          <button onClick={()=>{ play(720,0.05); onClose() }} className="absolute top-4 right-4 z-10 rounded-full bg-slate-900 text-white px-3 py-1 text-xs shadow hover:shadow-md">Close</button>
        </div>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Tick the items and copy to your task system.</p>
        <div className="mt-4 space-y-2">
          {items.map((i, idx)=>(
            <label key={idx} className="flex items-center gap-3 text-sm text-slate-800 dark:text-slate-200">
              <input type="checkbox" checked={i.done} onChange={()=>{ play(780,0.05); toggle(idx) }} />
              {i.k}
            </label>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={copy} className="rounded-xl px-3 py-2 text-xs text-white bg-slate-900">Copy as Markdown</button>
          <button onClick={()=>{ play(820,0.05); alert('Pretend: sent to n8n to create a checklist task for review.') }}
                  className="rounded-xl px-3 py-2 text-xs ring-soft">
            Send to n8n (draft)
          </button>
        </div>
        <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
          Safety: this only creates a draft task; owners must approve before any outreach or system updates.
        </div>
      </motion.div>
    </div>
  )
}
