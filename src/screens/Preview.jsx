import { ProjectScreen } from './index'

// Development-only page: open /#screens/<screen-id>/<desktop|phone> to see one mock-up at full
// size and compare it with docs/design-handoff-v2/ProjectScreen.dc.html.
export default function Preview() {
  const [, screen = 'tt-week', device = 'desktop'] = location.hash.slice(1).split('/')
  return <ProjectScreen screen={screen} device={device} />
}
