import Types from './constants';

export const addBlock = (channel) => ({
  type: Types.ADD_BLOCK,
  channel,
  ts: moment().unix()
});

export const clearBlock = (channel) => ({
  type: Types.CLEAR_BLOCK,
  channel
});

export const reset = () => ({
  type: Types.RESET
})