import camelCase from 'lodash/camelCase'
import { put, call, takeLatest, fork } from 'redux-saga/effects';

const createSagaPlaceholder = (schema, actionName) => function * (data) {
  console.warn(`
    Hey there! I'm saga for yours app "${schema.name}" "${actionName}" hooks.
    I've just received some data.
    Please make me do something meaningful with it:-)
  `, data)
}

export const buildSagas = (schema) => {
  return Object.keys(schema.types).reduce((acc, type) => {
    const handlerName = camelCase(`on ${type}`)
    const watcher = function * () {
      const flow = schema[handlerName] ? schema[handlerName] : createSagaPlaceholder(schema, handlerName)
      yield takeLatest(schema.types[type].tap, flow);
    }

    return [
      ...acc,
      watcher,
    ]
  }, [])
}
