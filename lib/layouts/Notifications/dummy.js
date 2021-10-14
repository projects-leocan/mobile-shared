import { times } from 'lodash/util';
import moment from 'moment';

const task = () => ({
  date_ts: moment().unix(),
  dueDateDisplay: moment().format("DD MMM. YYYY"),
  task: 'Come to the room',
  roomName: '102',
  is_priority: 1,
  is_completed: 1,
  assigned: {
  },
  meta: {
    isMaintenance: true,
    image: 'https://placekitten.com/g/200/300',
  },
  room: {
    name: '1022'
  },
})

export const tasks = times(3, () => task())
