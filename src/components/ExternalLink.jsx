export default function ExternalLink({ href, className = '', children }) {
  if (!href) return null
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  )
}
