import { useMemo, useRef, useState } from 'react'
import Header from './components/Header'
import SectionIndicator from './components/SectionIndicator'
import SectionCounter from './components/SectionCounter'
import ProjectModal from './components/ProjectModal'
import Home from './sections/Home'
import Work from './sections/Work'
import About from './sections/About'
import Experience from './sections/Experience'
import Contact from './sections/Contact'
import { useCubeScroll } from './hooks/useCubeScroll'
import { useScramble } from './hooks/useScramble'
import { profile } from './data/profile'
import { sections } from './data/sections'

const { labels } = sections

export default function App() {
  const stageRef = useRef(null)
  const cubeRef = useRef(null)
  const spacerRef = useRef(null)
  const [open, setOpen] = useState(null) // { project, opener } while a project modal is open

  const { active, goTo, mode, wide } = useCubeScroll({ stageRef, cubeRef, spacerRef, count: labels.length, paused: open !== null })
  const reducedMotion = mode === 'flat'

  // Scramble the headings of whichever face just came to the front.
  const activeFace = useMemo(() => ({ get current() { return cubeRef.current?.querySelector(`[data-face="${active}"]`) } }), [active])
  useScramble(activeFace, active, !reducedMotion)

  return (
    <div style={{ position: 'relative' }}>
      <div
        ref={stageRef}
        style={{
          position: 'fixed',
          inset: 0,
          overflow: 'hidden',
          perspective: '1600px',
          background: 'radial-gradient(ellipse at 50% 45%, var(--color-accent-900), var(--color-bg) 70%)',
        }}
      >
        <main ref={cubeRef} style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}>
          <Home wide={wide} reducedMotion={reducedMotion} goTo={goTo} />
          <Work onOpen={(project, opener) => setOpen({ project, opener })} />
          <About />
          <Experience />
          <Contact goTo={goTo} reducedMotion={reducedMotion} />
        </main>
      </div>

      {/* The scroll track that turns the cube: one viewport-tall, snap-aligned block per face. */}
      <div ref={spacerRef} aria-hidden="true">
        {labels.map((label) => (
          <div key={label} style={{ height: '100vh', scrollSnapAlign: 'start' }} />
        ))}
      </div>

      <Header name={profile.name} labels={labels} active={active} wide={wide} onNavigate={goTo} onContact={() => goTo(4)} />
      <SectionIndicator labels={labels} active={active} onNavigate={goTo} />
      <SectionCounter active={active} total={labels.length} label={labels[active]} />

      {open && <ProjectModal project={open.project} onClose={() => setOpen(null)} returnFocusTo={open.opener} />}
    </div>
  )
}
