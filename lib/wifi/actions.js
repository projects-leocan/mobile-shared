import Types from './types';
import { Platform } from 'react-native';

export const power = (on) => {
  if (Platform.OS === 'ios') {
    return {
      type: Types.NOT_SUPPORTED,
    }
  }

  return {
    type: Types.POWER,
    payload: {
      on
    }
  }
}

export const powerSuccess = (on) => {
  if (Platform.OS === 'ios') {
    return {
      type: Types.NOT_SUPPORTED,
    }
  }

  return {
    type: Types.POWER_SUCCESS,
    payload: {
      on
    }
  }
}

export const powerFailure = () => {
  if (Platform.OS === 'ios') {
    return {
      type: Types.NOT_SUPPORTED,
    }
  }

  return {
    type: Types.POWER_SUCCESS,
  }
}

export const powerToggle = () => {
  return {
    type: Types.TOGGLE_POWER
  }
}

export const powerToggleRunning = () => {
  return {
    type: Types.TOGGLE_POWER_RUNNING
  }
}

export const powerToggleFinished = () => {
  return {
    type: Types.TOGGLE_POWER_FINISHED
  }
}

export default {
  power,
  powerSuccess,
  powerFailure,
  powerToggle,
  powerToggleRunning,
  powerToggleFinished
}
