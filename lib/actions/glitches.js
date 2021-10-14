import GlitchesTypes from '../constants/glitches';

export function glitchesReset() {
  return {
    type: GlitchesTypes.GLITCHES_RESET
  }
}

export function glitchesFetch() {
  return {
    type: GlitchesTypes.GLITCHES_FETCH
  }
}

export function glitchesSuccess({ glitches }) {
  return {
    type: GlitchesTypes.GLITCHES_SUCCESS,
    glitches
  }
}

export function glitchesOptionsFetch() {
  return {
    type: GlitchesTypes.GLITCHES_OPTIONS_FETCH
  }
}

export function glitchesOptionsSuccess({ glitchOptions }) {
  return {
    type: GlitchesTypes.GLITCHES_OPTIONS_SUCCESS,
    glitchOptions
  }
}

export function glitchActivate(glitchId) {
  return {
    type: GlitchesTypes.GLITCH_ACTIVATE,
    glitchId
  }
}

export function glitchDeactivate() {
  return {
    type: GlitchesTypes.GLITCH_DEACTIVATE
  }
}

export function glitchSubmit(newGlitch) {
  return {
    type: GlitchesTypes.GLITCH_NEW,
    newGlitch
  }
}

export function glitchAcknowledge(glitchId) {
  return {
    type: GlitchesTypes.GLITCH_ACKNOWLEDGE,
    glitchId
  }
}

export function glitchAcknowledgeOptimistic(glitchId, userId) {
  return {
    type: GlitchesTypes.GLITCH_ACKNOWLEDGE_OPTIMISTIC,
    glitchId,
    userId
  }
}

export function glitchBatchAcknowledge(entries) {
  return {
    type: GlitchesTypes.GLITCH_BATCH_ACKNOWLEDGE,
    entries
  }
}

export function glitchBatchAcknowledgeOptimistic(entries, userId) {
  return {
    type: GlitchesTypes.GLITCH_BATCH_ACKNOWLEDGE_OPTIMISTIC,
    entries,
    userId
  }
}

export function glitchRecategorize({ glitchId, category, assignment }) {
  return {
    type: GlitchesTypes.GLITCH_RECATEGORIZE,
    glitchId,
    category,
    assignment
  }
}

export function glitchStart(glitchId) {
  return {
    type: GlitchesTypes.GLITCH_START,
    glitchId
  }
}

export function glitchUpdate({ glitchId, updatedGlitch }) {
  return {
    type: GlitchesTypes.GLITCH_UPDATE,
    glitchId,
    updatedGlitch
  }
}

export function glitchHandover({ glitchId, assignment }) {
  return {
    type: GlitchesTypes.GLITCH_HANDOVER,
    glitchId,
    assignment
  }
}

export function glitchEmail(emailGlitch) {
  return {
    type: GlitchesTypes.GLITCH_EMAIL,
    emailGlitch
  }
}

export function glitchTask({ glitchId, closedGlitch }) {
  return {
    type: GlitchesTypes.GLITCH_TASK,
    glitchId,
    closedGlitch
  }
}

export function glitchClose({ glitchId, closedGlitch }) {
  return {
    type: GlitchesTypes.GLITCH_CLOSE,
    glitchId,
    closedGlitch
  }
}

export default {
  glitchesReset,
  glitchesFetch,
  glitchesSuccess,
  glitchesOptionsFetch,
  glitchesOptionsSuccess,
  glitchActivate,
  glitchDeactivate,
  glitchSubmit,
  glitchUpdate,
  glitchAcknowledge,
  glitchAcknowledgeOptimistic,
  glitchBatchAcknowledge,
  glitchBatchAcknowledgeOptimistic,
  glitchRecategorize,
  glitchStart,
  glitchHandover,
  glitchEmail,
  glitchTask,
  glitchClose
}
