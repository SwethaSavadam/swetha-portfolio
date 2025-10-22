import React from 'react'
import { motion } from 'framer-motion'
function Card({p, i, onOpen}){
  return (
    <motion.button onClick={()=>onOpen(i)} whileHover={{ y:-4 }} whileTap={{ scale:0.98 }}
      className="card w-full text-left rounded-2xl bg-white border border-slate-200 shadow-sm p-5 flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl" style={{background:p.badge}}></div>
      <div className="flex-1">
        <div className="text-xs text-slate-500 uppercase tracking-wide">{p.company}</div>
        <div className="text-lg font-semibold tracking-tight">{p.title}</div>
        <div className="text-slate-600 text-sm mt-1">{p.oneLiner}</div>
      </div>
      <div className="text-slate-400">↗</div>
    </motion.button>
  )
}
export default function ProjectsGrid({ projects, onOpen }){
  return (
    <section id="projects" className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight mb-2">Projects</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {projects.map((p,i)=> <Card key={p.id} p={p} i={i} onOpen={onOpen} />)}
      </div>
    </section>
  )
}
