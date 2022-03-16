import { times } from 'lodash/util';
import moment from 'moment';

import { taskActivities } from '../../utils/tasks/activities';

// Yves
const USER_ID = '55d06bb599295b3a5a000076'

const _task = (due_date, category, activities) => ({
  activities,
  category,
  creator_id: USER_ID,
  date_ts: moment(due_date).unix(),
  due_date,
  dueDateDisplay: due_date ? moment(due_date).format("DD MMM. YYYY") : "Backlog",
  task: 'Sink: Unclog',
  lastMessage: 'Matress neddd to be flippped',
  messages: [
    {
      message: 'Matress neddd to be flippped',
      user_id: '55d06bb599295b3a5a000076',
      date_ts: 1483140127
    }
  ],
  roomName: '101',
  is_priority: 1,
  is_completed: 1,
  assigned: {
  },
  meta: {
    isMaintenance: true,
    image: 'https://placekitten.com/g/300/300',
  },
  room: {
    name: '1022',
    roomCalendar: {
      guest_name: 'Jonathan Weizman',
      check_out_date: moment()
    },
    guests: [{
      name: 'Jonathan Weizman',
      checkOutDate: moment()
    }],
    roomStatus: {
      label: 'Occupaied',
      code: 'OCC',
      color: 'ff0000'
    }
  },
  timeAgo: '2 weeks ago',
  creator: {
    fullName: 'Aaron Marz'
  }
})

export const tasks = times(5, () => _task(moment(), 'priority', taskActivities['action']['claimed']));
