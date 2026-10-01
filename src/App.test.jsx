import { render, screen } from '@testing-library/react'
import App from './App'
import { profile } from './data/profile'

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
})
