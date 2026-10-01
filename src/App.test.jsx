import { render, screen } from '@testing-library/react'
import App from './App'
import { profile } from './data/profile'
import { stack } from './data/stack'
import { projects } from './data/projects'
import { experience } from './data/experience'
import { certs } from './data/certs'

describe('App', () => {
  it('renders the hero with the name as the only h1', () => {
    render(<App />)
    const h1s = screen.getAllByRole('heading', { level: 1 })
    expect(h1s).toHaveLength(1)
    expect(h1s[0]).toHaveTextContent(profile.name)
  })

  it('has a skip link to the main content', () => {
    render(<App />)
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main')
  })

  it('renders the about and stack sections from data', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 2, name: '~/about' })).toBeInTheDocument()
    expect(screen.getByText(profile.about[0])).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: '~/stack' })).toBeInTheDocument()
    for (const group of stack) {
      expect(screen.getByRole('heading', { level: 3, name: group.category })).toBeInTheDocument()
    }
  })

  it('renders every project card', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 2, name: '~/projects' })).toBeInTheDocument()
    for (const project of projects) {
      expect(screen.getByRole('heading', { level: 3, name: project.title })).toBeInTheDocument()
    }
  })

  it('renders experience and certs from data', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 2, name: '~/experience' })).toBeInTheDocument()
    for (const job of experience) {
      expect(screen.getByText(job.points[0])).toBeInTheDocument()
    }
    expect(screen.getByRole('heading', { level: 2, name: '~/certs' })).toBeInTheDocument()
    for (const cert of certs) {
      expect(screen.getByText(cert.name)).toBeInTheDocument()
    }
    const verifyLinks = screen.queryAllByRole('link', { name: /verify/ })
    expect(verifyLinks).toHaveLength(certs.filter((c) => c.verifyUrl).length)
  })
})
