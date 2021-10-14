import assets from './assets'
import auth from './auth'
import glitches from './glitches'
import overlay from './overlay'
import rooms from './rooms'
import routes from './routes'
import updates from './updates'
import users from './users'
import lostFound from './lost-found'
import checklists from './checklists'

const constants = {
  ...assets,
  ...auth,
  ...glitches,
  ...overlay,
  ...rooms,
  ...routes,
  ...updates,
  ...users,
  ...lostFound,
  ...checklists
}

export default constants
