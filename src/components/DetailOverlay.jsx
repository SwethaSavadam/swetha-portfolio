import React from 'react'
import { motion } from 'framer-motion'

export default function DetailOverlay({ visible, title, items, onClose }){
  if(!visible) return null
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-[8px] rounded-[8px] bg-panel text-slate-800 p-3 overflow-auto">
      <div className="text-[10px] uppercase tracking-[0.25em] text-slate-500 mb-2">{title}</div>
      <ul className="space-y-1 text-[12px] leading-snug">
        {items.map((t, i)=> <li key={i}>• {t}</li>)}
      </ul>
      <button onClick={onClose} className="absolute top-2 right-2 text-[10px] px-2 py-1 rounded bg-slate-900 text-white">Close</button>
    </motion.div>
  )
}
