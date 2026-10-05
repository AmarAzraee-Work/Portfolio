import { useEffect, useRef } from 'react'
import { scrambleDuration, scrambleFrame } from '../lib/scramble'

/**
 * Text that "decodes" when its face comes into view. Screen readers read the hidden copy;
 * only the visible copy is scrambled, so they never hear random glyphs.
 */
export function Scramble({ text, style }) {
  return (
    <span data-scramble="" style={style}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{text}</span>
    </span>
  )
}

// Runs the scramble on every <Scramble> inside containerRef whenever `trigger` changes
// (the design waits 300ms after load for the first run).
export function useScramble(containerRef, trigger, enabled) {
  const firstRun = useRef(true)

  useEffect(() => {
    const container = containerRef.current
    if (!enabled || !container) return undefined

    const targets = [...container.querySelectorAll('[data-scramble] > [aria-hidden="true"]')]
    const rafs = new Map()

    const run = () => {
      targets.forEach((el) => {
        const original = el.parentElement.querySelector('.sr-only').textContent
        const start = performance.now()
        const duration = scrambleDuration(original.length)
        const step = (now) => {
          const k = Math.min(1, (now - start) / duration)
          el.textContent = scrambleFrame(original, k)
          if (k < 1) rafs.set(el, requestAnimationFrame(step))
          else rafs.delete(el)
        }
        rafs.set(el, requestAnimationFrame(step))
      })
    }

    const timer = setTimeout(run, firstRun.current ? 300 : 0)
    firstRun.current = false
    return () => {
      clearTimeout(timer)
      rafs.forEach((id) => cancelAnimationFrame(id))
      // Never leave half-scrambled text behind.
      targets.forEach((el) => {
        el.textContent = el.parentElement.querySelector('.sr-only').textContent
      })
    }
  }, [containerRef, trigger, enabled])
}
