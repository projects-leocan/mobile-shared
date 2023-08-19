import assets from './assets'
import auth from './auth'
import glitches from './glitches'
import overlay from './overlay'
import rooms from './rooms'
import routes from './routes'
import updates from './updates'
import users from './users'
import lostFound from './lost-found'
import socketRooms from './socketRooms'
import hotelsTask from './hotelsTask'
import inspectorFilters from './inspectorFilters'
import roomAudit from './roomAudit'
import datadog from 'rc-mobile-base/lib/actions/datadog'
import insertAudit from './insertAudit'

const actions = {
  ...assets,
  ...auth,
  ...glitches,
  ...overlay,
  ...rooms,
  ...routes,
  ...updates,
  ...users,
  ...lostFound,
  ...socketRooms,
  ...hotelsTask,
  ...inspectorFilters,
  ...roomAudit,
  ...datadog,
  ...insertAudit
}

export default actions
