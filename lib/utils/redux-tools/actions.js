import snakeCase from 'lodash/snakeCase';
import camelCase from 'lodash/camelCase';

const actions = ['tap', 'success', 'failure']
export const operations = ['load', 'update', 'updateAll', 'delete', 'deleteAll', 'insert', 'insertAll', 'updateOptimistic', 'insertOptimistic']

const actionType = (operation, action, schema) =>
  `${snakeCase(schema)}/${snakeCase(operation)}/${snakeCase(action)}`.toUpperCase();

const build = (typeBuilder) => (schema) => {
  return operations.reduce((acc, operation) => {
    return {
      ...acc,
      [operation]: actions.reduce((acc1, action) => {
        return {
          ...acc1,
          [action]: typeBuilder(actionType(operation, action, schema)),
        }
      }, {})
    }
  }, {})
}

const buildForEvents = (func) => (events) => events.reduce((acc, event) => {
  return {
    ...acc,
    [camelCase(event)]: func(event)
  }
}, {})

const buildTypeEvent = (event) => `${event.split(':').map(snakeCase).join('/')}`.toUpperCase();
const buildActionEvent = (event) => (payload) => ({
  type: buildTypeEvent(event),
  payload
})

export const buildTypes = build(type => type)
export const buildOperations = build(type => (payload) => ({ type, payload }))

export const buildEventTypes = buildForEvents(buildTypeEvent)
export const buildEventActions = buildForEvents(buildActionEvent)
