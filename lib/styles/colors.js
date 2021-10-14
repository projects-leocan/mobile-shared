/* COLORS */
import { range } from 'lodash/util';
import { flatMap } from 'lodash/collection';

const _opacityStep = 10;
const steps = range(1, 11).map(i => i / _opacityStep)

const buildColor = (color) => ({
  color,
  text: {
    color
  },
  bg: {
    backgroundColor: color
  },
  bc: {
    borderColor: color,
    borderWidth: 1
  }
})

const _opacity = (color, opacity) => `rgba(${color}, ${opacity})`
const buildOpacity = (color) =>
  flatMap(steps, step => ({ [`p${step * 100}`]: buildColor(_opacity(color, step)) }))
  .reduce((acc, n) => ({ ...acc, ...n }), {})

export const eitherColor = (left, right) => (condition) => condition ? right : left

export const opacityWhite = buildOpacity('255, 255, 255')
export const opacityBlack = buildOpacity('0, 0, 0')

export const transparent = buildColor('transparent')

export const white = buildColor('#FFF')
export const black = buildColor('#000')
export const slate = buildColor('#4A4A4A')

export const redLt = buildColor('#D8013A')
export const red = buildColor('#C93C46')

export const green = buildColor('#3CC86B')

export const blueLt = buildColor('#5AAAFB')
export const blue = buildColor('#1A8CFF')
export const blueDk = buildColor('#3F5872')

export const blue100 = buildColor('#BEE5FD')
export const blue200 = buildColor('#83CEFB')
export const blue300 = buildColor('#5EB9F5')
export const blue500 = buildColor('#35A6F2')

export const greyLt = buildColor('#F7F7F7')
export const grey = buildColor('#F0F0F0')
export const greyDk = buildColor('#9B9B9B')
export const grey100 = buildColor('#F2F2F2')
export const grey200 = buildColor('#FAFAFA')
export const grey400 = buildColor('#E0E0E0')
export const eitherGrey_100_200 = eitherColor(grey100, grey200)
export const eitherGreyRed = eitherColor(grey, red)

export const blueGrey = buildColor('#6382A0')

export const orange = buildColor('#FFA300')

// export const taskCompleted = buildColor("#40B346");
// export const taskStarted = buildColor("#369400");
// export const taskAccepted = buildColor("#8FC456");
// export const taskWaiting = buildColor("#F5A623");
// export const taskPending = buildColor("#E64545");
// export const taskCancelled = buildColor("#CC2929");
// export const taskUnclaimed = buildColor("#FF7E14");

export const taskCompleted = buildColor("#18AD18");
export const taskStarted = buildColor("#369400");
export const taskAccepted = buildColor("#8FC456");
export const taskWaiting = buildColor("#F5A623");
export const taskPending = buildColor("#E64545");
export const taskCancelled = buildColor("#d3d3d3");
export const taskUnclaimed = buildColor("#E64545");
export const taskPaused = buildColor("#d3d3d3");

export const notificationSuccess = buildColor("#5CB85C")
export const notificationInfo = buildColor("#31B0D5")
export const notificationWarning = buildColor("#F0AD4E")
export const notificationDanger = buildColor("#D9544F")

export const taskActionColors = {
  pause: buildColor("#F0C800"),
  finish: buildColor("#18AD18"),
  accept: buildColor("#18AD18"),
  reject: buildColor("#F03040"),
  start: buildColor("#8ED48E"),
  delay: buildColor("#F0C800"),
  convert: buildColor("#F0C800"),
  later: buildColor("#F0C800"), //same as delay
  resume: buildColor("#8ED48E"),
  update: buildColor("#FFA300"),
  close: buildColor("#18AD18"),
  acknowledge: buildColor("#18AD18"),
  start_today: buildColor("#8ED48E"),
}