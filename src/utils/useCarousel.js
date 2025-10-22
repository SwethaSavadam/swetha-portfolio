import { useEffect, useState, useCallback } from 'react'
export function useCarousel(length, { interval=4000, auto=true }={}){
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(!auto)
  useEffect(()=>{
    if (paused || length<=1) return
    const id = setInterval(()=> setIndex(i => (i+1)%length), interval)
    return () => clearInterval(id)
  }, [paused, interval, length])
  const next = useCallback(()=> setIndex(i => (i+1)%length), [length])
  const prev = useCallback(()=> setIndex(i => (i-1+length)%length), [length])
  return { index, setIndex, next, prev, paused, setPaused }
}
