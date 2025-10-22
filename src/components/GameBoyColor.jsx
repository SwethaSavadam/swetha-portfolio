import React, { useEffect, useRef, useState, useMemo } from 'react'
import MetricScreen from './MetricScreen'
import DetailOverlay from './DetailOverlay'
import { useCarousel } from '../utils/useCarousel'
import { useBeep } from '../utils/useBeep'
import { formatMoneyShort } from '../utils/format'


export default function GameBoyColor({ totals, setDark }){
  const slides = [
    { key:'hours', label:'Hours Saved', value: totals.hoursSaved.toLocaleString('en-IN'), caption:'Cumulative across programs' },
    { key:'nps', label:'Internal NPS Lift', value:`+${totals.npsLift}`, suffix:'pts', caption:'Stakeholder pulse' },
    { key:'license', label:'License Savings', value:`${formatMoneyShort(totals.licenseSavingsUSD)}`, caption:'Annualized at current seats' },
    { key:'roi', label:'Year-1 ROI', value:`${totals.roiPercent}`, suffix:'%', caption:'After build cost' },
  ]

  const detailByKey = useMemo(()=>{
    const benefit = totals.licenseSavingsUSD || 0
    const cost = Math.round((benefit/2.64)/500)*500
    return {
      hours: [
        `Example calc: 8 analysts × 10 hrs/week × 40 weeks ≈ ${totals.hoursSaved.toLocaleString('en-IN')} hrs`,
        'Sources: agentic answers, quote portal, dashboards replacing manual pulls',
        'Impact: more time for renewals & high-value work'
      ],
      nps: [
        'Quarterly pulse example: 48 → 55 = +7 pts',
        'Drivers: faster answers, clear next steps, single source of truth',
        'Measured via internal survey (CSMs, Ops, Leadership)'
      ],
      license: [
        `Seats × price × months: 100 × $155 × 12 = $${benefit.toLocaleString('en-IN')}`,
        'Assumption: replacing CPQ/extra seats with Retool workflows',
        'Range varies by seat count & vendor pricing'
      ],
      roi: [
        `Benefit: ~$${benefit.toLocaleString('en-IN')}  |  Estimated cost: ~$${cost.toLocaleString('en-IN')}`,
        `ROI = (Benefit − Cost)/Cost = ${((benefit - cost)/cost*100).toFixed(0)}% (~${totals.roiPercent}%)`,
        'Includes build + first-year ops; excludes soft benefits'
      ]
    }
  }, [totals])

  const { index, next, prev, paused, setPaused } = useCarousel(slides.length, { interval: 4000, auto: true })
  const { play } = useBeep()

  const [detailOn, setDetailOn] = useState(false)
  const [fast, setFast] = useState(false)
  const holdTimer = useRef(null)
  const fastTimer = useRef(null)
  const keysDown = useRef(new Set())

  // useEffect(()=>{ play(900, 0.04) }, [index])

  useEffect(()=>{
    const onDown = (e) => {
      const k = e.key
      if (keysDown.current.has(k)) return
      keysDown.current.add(k)
      if (k === 'ArrowLeft') { prev(); play(740,0.04) }
      if (k === 'ArrowRight') { next(); play(740,0.04) }
      if (k === 'ArrowUp' || k === 'ArrowDown') { setPaused(p=>!p); play(520,0.04) }
      if (k.toLowerCase() === 'a' || k === 'Enter') startFast()
      if (k.toLowerCase() === 'b') { setDark(true); play(660,0.05) } // full-site dark
      if (k.toLowerCase() === 'x') { toggleDetail() } // Select
    }
    const onUp = (e) => {
      const k = e.key
      keysDown.current.delete(k)
      if (k.toLowerCase() === 'a' || k === 'Enter') stopFast(true)
    }
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => { window.removeEventListener('keydown', onDown); window.removeEventListener('keyup', onUp) }
  }, [])

  function toggleDetail(){ setDetailOn(v=>!v); play(600,0.05) }

  function startFast(){
    if (holdTimer.current) return
    setDark(false) // A retains light theme
    holdTimer.current = setTimeout(()=>{
      setPaused(true)
      setFast(true)
      fastTimer.current = setInterval(()=> next(), 180)
      play(1100,0.04)
    }, 400)
  }
  function stopFast(triggerShort){
    if (holdTimer.current) { clearTimeout(holdTimer.current); holdTimer.current = null }
    if (fastTimer.current) { clearInterval(fastTimer.current); fastTimer.current = null; setFast(false) }
    if (triggerShort && !fast){ next(); play(880,0.04) }
  }

  return (
    <div className={`relative w-[320px] h-[520px] rounded-[28px] bg-[#ff6b9a] shadow-[0_30px_60px_rgba(0,0,0,0.15)]`}>
      <div className="absolute inset-0 rounded-[28px] shadow-innerSoft" />
      {/* Screen */}
      <div className="absolute left-1/2 -translate-x-1/2 top-8 w-[250px] h-[170px] bg-black rounded-[14px] shadow-card overflow-hidden">
        <MetricScreen slides={slides} index={index} />
        <DetailOverlay visible={detailOn} title={slides[index].label} items={detailByKey[slides[index].key]||[]} onClose={()=> setDetailOn(false)} />
        <div className="absolute bottom-[-18px] left-1/2 -translate-x-1/2 text-[10px] tracking-[0.2em] text-white/80">GAME BOY COLOR</div>
      </div>

      {/* D-Pad */}
      <div className="absolute left-8 top-[250px] w-20 h-20">
        <div className="absolute inset-0 bg-slate-900 rounded-lg" />
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-6 h-20 bg-slate-900 rounded" />
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-20 h-6 bg-slate-900 rounded" />
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-white text-xs pointer-events-none">▲</div>
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-white text-xs pointer-events-none">▼</div>
        <div className="absolute left-[-10px] top-1/2 -translate-y-1/2 text-white text-xs pointer-events-none">◀</div>
        <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 text-white text-xs pointer-events-none">▶</div>
        {/* Hit areas */}
        <button aria-label="Up" onClick={()=>{ setPaused(p=>!p); play(520,0.04) }} className="absolute left-1/2 -translate-x-1/2 top-[-14px] w-10 h-10 opacity-0">up</button>
        <button aria-label="Down" onClick={()=>{ setPaused(p=>!p); play(520,0.04) }} className="absolute left-1/2 -translate-x-1/2 bottom-[-14px] w-10 h-10 opacity-0">down</button>
        <button aria-label="Left" onClick={()=>{ prev(); play(740,0.04) }} className="absolute left-[-14px] top-1/2 -translate-y-1/2 w-10 h-10 opacity-0">left</button>
        <button aria-label="Right" onClick={()=>{ next(); play(740,0.04) }} className="absolute right-[-14px] top-1/2 -translate-y-1/2 w-10 h-10 opacity-0">right</button>
      </div>

      {/* A/B */}
      <button
        onMouseDown={startFast} onMouseUp={()=> stopFast(true)} onMouseLeave={()=> stopFast(false)}
        onTouchStart={(e)=>{ e.preventDefault(); startFast() }} onTouchEnd={(e)=>{ e.preventDefault(); stopFast(true) }}
        className="absolute right-16 top-[280px] w-10 h-10 bg-slate-900 rounded-full" aria-label="A button"></button>
      <button onClick={()=>{ setDark(true); play(660,0.05) }} className="absolute right-6 top-[310px] w-10 h-10 bg-slate-900 rounded-full" aria-label="B button"></button>
      <div className="absolute right-[30px] top-[270px] text-[10px] text-slate-900/70">A</div>
      <div className="absolute right-1 top-[300px] text-[10px] text-slate-900/70">B</div>

      {/* Select/Start (details) */}
      <button onClick={()=> toggleDetail()} className="absolute left-[64px] bottom-[120px] w-16 h-4 bg-slate-900/80 rounded-full shadow-innerSoft"></button>
      <button onClick={()=> toggleDetail()} className="absolute left-[160px] bottom-[120px] w-16 h-4 bg-slate-900/80 rounded-full shadow-innerSoft"></button>
      <div className="absolute left-1/2 -translate-x-1/2 bottom-[95px] flex gap-10 text-[10px] text-slate-900/70">
        <span> SELECT</span><span> START</span>
      </div>

      {/* Speaker */}
      <div className="absolute right-6 bottom-8 grid grid-cols-3 gap-1">
        {Array.from({length:9}).map((_,i)=>(<div key={i} className="w-2 h-2 rounded-full bg-slate-900/80" />))}
      </div>
    </div>
  )
}
