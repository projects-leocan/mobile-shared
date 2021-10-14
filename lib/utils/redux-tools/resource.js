import { buildReducer, prepareData } from './reducer';
import { buildSelectors } from './selectors';
import { buildTypes, buildOperations } from './actions';
import { buildSagas } from './sagas';

export class Resource {
  constructor(config = {}) {
    const idProp = config.id || 'id'
    this.id = idProp

    const name = config.name || this.constructor.name
    this.name = name

    const immutable = config.immutable || this.immutable

    const types = buildTypes(this.name)
    const actions = buildOperations(this.name)
    const selectors = buildSelectors(this.name)

    this.types = types
    this.actions = actions
    this.selectors = selectors

    const reducer = { [this.name]: buildReducer(this.types, this.id, { immutable }) }
    this.reducer = reducer

    const sagas = buildSagas(this)

    this.sagas = sagas

    Object.keys(actions).forEach(action => this[action] = actions[action])
    Object.keys(selectors).forEach(selector => this[selector] = selectors[selector])
  }

  normalize = (data) => {
    return prepareData(this.id, data)
  }
}
