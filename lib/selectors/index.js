import * as assets from './assets'
import * as glitches from './glitches'
import * as rooms from './rooms'
import * as updates from './updates'
import * as users from './users'
import * as overlay from './overlay'
import * as attendant from './attendant'
import * as maintenance from './maintenance'
import * as hotelsTask from './hotelsTask'

const selectors = {
  ...assets,
  ...glitches,
  ...rooms,
  ...updates,
  ...users,
  ...overlay,
  ...attendant,
  ...hotelsTask
}

export default selectors
