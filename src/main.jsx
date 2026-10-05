import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

const root = createRoot(document.getElementById('root'))

if (import.meta.env.DEV && location.hash.startsWith('#screens')) {
  // Dev-only screen mock-up preview; tree-shaken out of production builds.
  import('./screens/Preview').then(({ default: Preview }) => root.render(<Preview />))
} else {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
