import TtWeek from './TtWeek'
import TtStaff from './TtStaff'
import SalesLanding from './SalesLanding'
import SalesAdmin from './SalesAdmin'
import RestoLanding from './RestoLanding'
import RestoMenu from './RestoMenu'

export const SCREENS = {
  'tt-week': TtWeek,
  'tt-staff': TtStaff,
  'sales-landing': SalesLanding,
  'sales-admin': SalesAdmin,
  'resto-landing': RestoLanding,
  'resto-menu': RestoMenu,
}

export function ProjectScreen({ screen, device = 'desktop' }) {
  const Screen = SCREENS[screen]
  return Screen ? <Screen device={device} /> : null
}
