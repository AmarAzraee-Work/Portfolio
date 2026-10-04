import { render, screen, fireEvent } from '@testing-library/react'
import ProjectCard from './ProjectCard'

const full = {
  title: 'Shop App',
  description: 'Online shop for a local business.',
  image: '/projects/shop.png',
  tech: ['react', 'laravel'],
  liveUrl: 'https://shop.example.com',
  githubUrl: 'https://github.com/amar/shop',
  status: 'in production',
  featured: true,
}

describe('ProjectCard', () => {
  it('renders title, description, tags, status and both links', () => {
    render(<ProjectCard project={full} />)
    expect(screen.getByRole('heading', { level: 3, name: 'Shop App' })).toBeInTheDocument()
    expect(screen.getByText('Online shop for a local business.')).toBeInTheDocument()
    expect(screen.getByText('in production')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /live/ })).toHaveAttribute('href', full.liveUrl)
    expect(screen.getByRole('link', { name: /github/ })).toHaveAttribute('href', full.githubUrl)
    expect(screen.getByRole('img', { name: 'Screenshot of Shop App' })).toHaveAttribute('loading', 'lazy')
  })

  it('hides links that are missing', () => {
    render(<ProjectCard project={{ ...full, liveUrl: undefined }} />)
    expect(screen.queryByRole('link', { name: /live/ })).toBeNull()
    expect(screen.getByRole('link', { name: /github/ })).toBeInTheDocument()
  })

  it('shows a placeholder when there is no image', () => {
    render(<ProjectCard project={{ ...full, image: undefined }} />)
    expect(screen.queryByRole('img')).toBeNull()
    expect(screen.getByTestId('image-placeholder')).toHaveTextContent('Shop App')
  })

  it('swaps to the placeholder when the image fails to load', () => {
    render(<ProjectCard project={full} />)
    fireEvent.error(screen.getByRole('img'))
    expect(screen.queryByRole('img')).toBeNull()
    expect(screen.getByTestId('image-placeholder')).toBeInTheDocument()
  })
})
