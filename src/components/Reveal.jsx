import { useEffect, useRef, useState } from 'react'

function shouldSkipAnimation() {
  const reduceMotion =
    typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  return reduceMotion || typeof window.IntersectionObserver !== 'function'
}

export default function Reveal({ children }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(shouldSkipAnimation)

  useEffect(() => {
    if (visible) return undefined
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      // threshold 0: a ratio would never be reached by sections taller than the screen.
      { threshold: 0, rootMargin: '0px 0px -10% 0px' },
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [visible])

  return (
    <div
      ref={ref}
      data-visible={visible}
      className={`transition-[opacity,translate] duration-700 ease-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      {children}
    </div>
  )
}
