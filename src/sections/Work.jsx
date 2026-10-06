import Face from './Face'
import Eyebrow from '../components/Eyebrow'
import ProjectCard from '../components/ProjectCard'
import { Scramble } from '../hooks/useScramble'
import { projects } from '../data/projects'
import { sections } from '../data/sections'

const headingStyle = { fontSize: 'clamp(34px,4.6vw,60px)', letterSpacing: '-.03em', margin: 0 }

export default function Work({ onOpen }) {
  const { eyebrow, heading, intro } = sections.work
  return (
    <Face index={1} label="Work" labelledBy="work-title" inner={{ gap: 'clamp(20px,4vh,36px)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '16px 40px' }}>
        <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 id="work-title" style={headingStyle}>
            <Scramble text={heading} />
          </h2>
        </div>
        <p style={{ flex: '0 1 380px', margin: 0, color: 'var(--color-neutral-400)', textWrap: 'pretty' }}>{intro}</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,290px),1fr))', gap: '16px' }}>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} onOpen={onOpen} />
        ))}
      </div>
    </Face>
  )
}
