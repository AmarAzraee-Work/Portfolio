export default function Tag({ children }) {
  return (
    <span className="whitespace-nowrap font-mono text-xs text-muted">
      <span aria-hidden="true">[</span>
      {children}
      <span aria-hidden="true">]</span>
    </span>
  )
}
