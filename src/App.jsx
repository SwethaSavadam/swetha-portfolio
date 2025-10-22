import React, { useMemo, useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import GameBoyColor from './components/GameBoyColor'
import HeroCopy from './components/HeroCopy'
import WorkBlocks from './components/WorkBlocks'
import { profile, metrics } from './data/portfolio'
import { useBeep } from './utils/useBeep'

export default function App(){
  const [isDark, setIsDark] = useState(false)
  const [showWork, setShowWork] = useState(false)
  const workRef = useRef(null)
  const { play } = useBeep()
  const totals = useMemo(()=>metrics, [])
  useEffect(() => {
    const rootEl = document.documentElement;
    if (isDark) rootEl.classList.add('dark'); else rootEl.classList.remove('dark');
  }, [isDark]);


  // Global click beep: any <button>, [role=button], or <a> makes a sound.
  useEffect(() => {
    const handler = (e) => {
      const el = e.target.closest('button,[role="button"],a')
      if (!el) return
      play(720, 0.05) // useBeep handles browser resume + de-dupe
    }
    document.addEventListener('click', handler, true) // capture phase
    return () => document.removeEventListener('click', handler, true)
  }, [play])

  const onViewWork = () => {
    setShowWork(true); play(820)
    setTimeout(()=> workRef.current?.scrollIntoView({ behavior:'smooth', block:'start'}), 10)
  }

  return (
    <div className={`min-h-screen ${isDark ? 'dark-mode' : 'light-mode'}`}>
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-6">
        <main className="mt-10 grid md:grid-cols-2 gap-10 items-center">
          <section>
            <HeroCopy profile={profile} onViewWork={onViewWork} isDark={isDark} />
          </section>
          <section className="flex justify-center">
            <motion.div
              initial={{ rotate: -2, y: 20, opacity: 0 }}
              animate={{ rotate: 0, y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 120, damping: 14 }}
            >
              <GameBoyColor totals={totals} setDark={setIsDark} />
            </motion.div>
          </section>
        </main>

        {showWork && (
          <section ref={workRef} id="work" className="mt-16">
            <WorkBlocks />
          </section>
        )}
      </div>
    </div>
  )
}
