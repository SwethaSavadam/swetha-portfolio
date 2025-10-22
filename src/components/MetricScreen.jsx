import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function MetricScreen({ slides, index }){
  const s = slides[index]
  return (
    <div className="absolute inset-[10px] rounded-[8px] overflow-hidden bg-[#cfe1ff]">
      <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_1px)] bg-[length:6px_6px]" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/30 via-transparent to-white/10" />
      <div className="h-full w-full flex items-center justify-center text-center px-3">
        <AnimatePresence mode="wait">
          <motion.div key={s.key}
            initial={{ y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -14, opacity: 0 }}
            transition={{ duration: 0.28 }} className="relative w-full">
            <div className="text-[9px] uppercase tracking-[0.3em] text-slate-700/80 mb-1">{s.label}</div>
            <div className="font-digital text-5xl md:text-6xl text-slate-900 leading-none break-words">{s.value}<span className="ml-1 text-xl align-super opacity-60">{s.suffix||''}</span></div>
            {s.caption && <div className="mt-2 text-[10px] text-slate-700/80">{s.caption}</div>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
