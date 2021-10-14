import { createTransform as create } from 'redux-persist'

const stateCleaner = (state) => {
  const items = state.items;
  return {
    items,
  };
}

export const createTransform = (models) => create(
  //inbound
  stateCleaner,
  //outbound
  (state) => state,
  {
    whitelist: models
  }
)
