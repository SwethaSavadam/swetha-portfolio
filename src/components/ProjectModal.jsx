import React from 'react'
import { motion } from 'framer-motion'
export default function ProjectModal({ project, onClose, onPrev, onNext }){
  return (
    <motion.div className="fixed inset-0 z-50" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div className="modal absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(920px,90vw)] max-h-[85vh] overflow-auto rounded-3xl bg-white shadow-2xl"
        initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} transition={{ type:'spring', stiffness: 160, damping: 18 }}>
        <div className="p-6 border-b border-slate-200 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl shrink-0" style={{background:project.badge}}></div>
          <div className="flex-1">
            <div className="text-xs text-slate-500 uppercase tracking-wide">{project.company}</div>
            <div className="text-xl font-semibold tracking-tight">{project.title}</div>
            <div className="text-slate-600">{project.oneLiner}</div>
          </div>
          <div className="flex gap-2">
            <button onClick={onPrev} className="px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50">← Prev</button>
            <button onClick={onNext} className="px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50">Next →</button>
            <button onClick={onClose} className="px-3 py-2 rounded-lg bg-slate-900 text-white">Close</button>
          </div>
        </div>
        <div className="p-6 grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <Section title="Problem">{project.problem}</Section>
            <Section title="Approach">
              <ul className="list-disc pl-6 space-y-1">{project.approach.map((x,i)=>(<li key={i}>{x}</li>))}</ul>
            </Section>
            <Section title="Collaboration">
              <ul className="list-disc pl-6 space-y-1">{project.collab.map((x,i)=>(<li key={i}>{x}</li>))}</ul>
            </Section>
          </div>
          <div className="space-y-4">
            {project.metrics?.hours && <KPICard label="Hours saved" value={project.metrics.hours} suffix="/yr" />}
            {project.metrics?.nps!==undefined && <KPICard label="NPS lift" value={`+${project.metrics.nps}`} suffix="pts" />}
            {project.metrics?.cycle && <KPICard label="Cycle time" value={`-${project.metrics.cycle}%`} />}
            {project.metrics?.license && <KPICard label="License saved" value={project.metrics.license} />}
            {project.metrics?.conversion && <KPICard label="Conversion" value={`+${project.metrics.conversion}%`} />}
            {project.stack && (
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="text-xs text-slate-500 mb-2">Stack</div>
                <div className="flex flex-wrap gap-2">{project.stack.map((s,i)=>(<span key={i} className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 text-xs">{s}</span>))}</div>
              </div>
            )}
          </div>
        </div>
        {project.impact && (
          <div className="px-6 pb-6">
            <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
              <div className="text-sm text-slate-600">{project.impact}</div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
function Section({title, children}){
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">{title}</div>
      <div className="rounded-2xl border border-slate-200 p-4 bg-white">{children}</div>
    </div>
  )
}
function KPICard({label, value, suffix}){
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <div className="text-xs text-slate-500 mb-1">{label}</div>
      <div className="text-xl font-semibold">{value}{suffix && <span className="text-slate-400 text-sm ml-1">{suffix}</span>}</div>
    </div>
  )
}
