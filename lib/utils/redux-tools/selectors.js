import { createSelector, createSelectorCreator } from 'reselect';
import sortBy from 'lodash/sortBy';
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import last from 'lodash/last';

const singleTruthMemoize = (func) => {
  let lastTruth = null;
  let lastArgs = null;
  let lastResults = null;

  return function() {
    const truth = last(arguments);
    if (truth !== lastTruth) {
      lastResults = func.apply(null, arguments);
    }

    lastTruth = truth;
    lastArgs = arguments;
    return lastResults;
  }
}

export const createSingleTruthSelector = createSelectorCreator(singleTruthMemoize);

export const buildSelectors = (schema) => {
  const schemaSelector = state => state[schema]

  const itemsSelector = createSelector(
    [schemaSelector],
    (state) => state.items
  )

  const itemsArraySelector = createSelector(
    [itemsSelector],
    (items) => Object.values(items)
  )

  const allSelector = (query) => createSelector(
    [itemsArraySelector],
    (items) => {
      try {
        if (!query) {
          return items
        }
        let results = items
        const where = query.where
        const orderBy = query.orderBy
        const fields = query.fields
        if (where) {
          results = items.filter(where)
        }
        if (orderBy) {
          results = sortBy(results, orderBy[0])
          if (orderBy[1] === 'desc') {
            results.reverse()
          }
        }
        if (fields) {
          results = results.map(item => {
            const result = fields.reduce((acc, field) => {
              let part
              if (field === '*') {
                part = item
              } else if (isArray(field)) {
                part = {
                  [field[0]]: field[1](item)
                }
              } else if (isString(part)) {
                part = { [field]: item[field] }
              } else {
                part = {}
              }
              return {
                ...acc,
                ...part
              }
            }, {})
            return result
          })
        }
        return results
      } catch(err) {
        console.log(`${schema} all exeception`, err)
        return items
      }
    }
  )

  const countSelector = createSelector(
    [itemsArraySelector],
    (items) => items.length
  )

  const getByIdSelector = (id) => createSelector(
    [itemsSelector],
    (items) => items[id]
  )

  const statusSelector = createSelector(
    [schemaSelector],
    (state) => ({
      inserting: state.inserting,
      deleting: state.deleting,
      loading: state.loading,
      updating: state.updating,
    })
  )

  return {
    all: allSelector,
    index: () => itemsSelector,
    count: () => countSelector,
    getById: getByIdSelector,
    status: () => statusSelector
  }
}
