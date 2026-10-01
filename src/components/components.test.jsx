import { render, screen } from '@testing-library/react'
import Tag from './Tag'
import SectionHeading from './SectionHeading'
import Section from './Section'
import ExternalLink from './ExternalLink'

describe('Tag', () => {
  it('wraps the label in square brackets', () => {
    const { container } = render(<Tag>react</Tag>)
    expect(container).toHaveTextContent('[react]')
  })
})

describe('SectionHeading', () => {
  it('renders the path as ~/path with an id for aria-labelledby', () => {
    render(<SectionHeading path="projects" />)
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toHaveTextContent('~/projects')
    expect(heading).toHaveAttribute('id', 'projects-heading')
  })
})

describe('Section', () => {
  it('renders a labelled section with its heading and children', () => {
    render(<Section id="about"><p>hello</p></Section>)
    const section = screen.getByRole('region', { name: '~/about' })
    expect(section).toHaveAttribute('id', 'about')
    expect(section).toHaveTextContent('hello')
  })
})

describe('ExternalLink', () => {
  it('renders nothing when href is missing', () => {
    const { container } = render(<ExternalLink href={undefined}>live</ExternalLink>)
    expect(container).toBeEmptyDOMElement()
  })

  it('opens in a new tab safely', () => {
    render(<ExternalLink href="https://example.com">live</ExternalLink>)
    const link = screen.getByRole('link', { name: 'live' })
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
