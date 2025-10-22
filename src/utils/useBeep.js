import { useRef } from 'react'

export function useBeep(){
  const ctxRef = useRef(null)

  function ensureCtx(){
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    return ctxRef.current
  }

  // Plays a short square-wave beep.
  // Handles: user-gesture resume, tiny fade to avoid clicks, and de-dupe.
  async function play(freq = 660, dur = 0.06){
    const ctx = ensureCtx()
    try {
      if (ctx.state === 'suspended') await ctx.resume()
    } catch (e) {}

    const now = Date.now()
    if (window.__lastBeepTs && now - window.__lastBeepTs < 80) return
    window.__lastBeepTs = now

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const t0 = ctx.currentTime
    const vol = 0.04

    osc.type = 'square'
    osc.frequency.setValueAtTime(freq, t0)

    // small attack/decay to avoid audible click; keep short
    gain.gain.setValueAtTime(0, t0)
    gain.gain.linearRampToValueAtTime(vol, t0 + 0.005)
    gain.gain.linearRampToValueAtTime(0.0001, t0 + Math.max(0.015, dur))

    osc.connect(gain); gain.connect(ctx.destination)
    osc.start(t0)
    osc.stop(t0 + dur + 0.02)
  }

  return { play }
}
