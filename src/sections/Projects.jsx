import { projects } from '../data/legacy/projects'
import { sortProjects } from '../lib/projects'
import Section from '../components/Section'
import ProjectCard from '../components/legacy/ProjectCard'

export default function Projects() {
  return (
    <Section id="projects">
      <div className="grid gap-6 md:grid-cols-2">
        {sortProjects(projects).map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </Section>
  )
}
