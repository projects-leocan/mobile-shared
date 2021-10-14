import RoutesTypes from '../constants/routes';

export function routeWillBack(nav) {
  return {
    type: RoutesTypes.WILL_MOVE_BACK,
    nav
  }
}

export default {
  routeWillBack
}
