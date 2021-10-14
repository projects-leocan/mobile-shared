import get from 'lodash/get';
import { isString, isArray } from 'lodash/lang';
import moment from 'moment';

export default function (task, uuid, status, userId) {
  const optimistic = { ...task };
  let data = {};

  if (isString(status)) {
    data = {
      status,
      update_type: 'status',
      user_id: userId
    }
    optimistic[`is_${status}`] = 1;
    if (status === "claimed") {
      optimistic.responsible_id = userId;
    }
  }
  
  if (status.is_reschedule) {
    data = {
      ...status,
      user_id: userId
    }
    optimistic.due_date = status.due_date
  }
  
  if (status.isMessage) {
    const previousMessages = isArray(optimistic.messages) ?
      optimistic.messages :
      [];

    data = { ...data, update_type: "message", message: status.message, user_id: userId };
    optimistic.messages = [
      ...previousMessages,
      {
        date_ts: moment().unix(),
        user_id: userId,
        message: status.message
      }
    ]
  }
  
  // if (status.isReassign) {
  //   data = {
  //     user_id: userId,
  //     update_ts: moment().unix(),
  //     due_date: status.dueDate.format('YYYY-MM-DD'),
  //     is_move: true,
  //   }
    
  //   if (status.message) {
  //     data = { ...data, update_type: "message", message: status.message };
  //   }
    
  //   const assignee = status.user;
  //   const assigned = { label: assignee.fullName }

  //   if (assignee.isTeam) {
  //     assigned.user_ids = []
  //   } else {
  //     assigned.user_ids = [assignee._id]
  //     data = {
  //       ...data,
  //       responsible_id: assignee._id,
  //       responsible_first_name: assignee.first_name,
  //       responsible_last_name: assignee.last_name,
  //     }
  //   }
  //   data = { ...data, assigned };
  //   optimistic.assigned = assigned;
  // }

  if (status.isReassign) {
    data = {
      user_id: userId,
      update_ts: moment().unix(),
      due_date: task.due_date,
      is_move: true,
    }

    if (status.dueDate) {
      data.due_date = status.dueDate.format('YYYY-MM-DD');
    }
    
    if (status.message) {
      data = { ...data, update_type: "message", message: status.message };
    }

    if (status.user) {
      const assignee = status.user;
      const assigned = { label: assignee.fullName }
  
      if (assignee.isTeam) {
        assigned.user_ids = []
      } else {
        assigned.user_ids = [assignee._id]
        data = {
          ...data,
          responsible_id: assignee._id,
          responsible_first_name: assignee.first_name,
          responsible_last_name: assignee.last_name,
        }
      }
      
      data = { ...data, assigned };
      optimistic.assigned = assigned;
    }
  }

  return { data, optimistic };
}

// function * updateTask({ uuid, status, tapTs }) {
//   const userId = yield select(userIdSelector);

//   let data = {
//     status,
//     update_type: 'status',
//     user_id: userId
//   }
//   if (status.is_reschedule) {
//     data = {
//       ...status,
//       user_id: userId
//     }
//   }
//   if (status.isReassign) {
//     const assignee = status.user;
//     data = {
//       user_id: userId,
//       update_ts: moment().unix(),
//       due_date: status.dueDate.format('YYYY-MM-DD'),
//       is_move: true,
//     }

//     if (status.message) {
//       data = { ...data, update_type: "message", message: status.message };
//     }
//     const assigned = { label: assignee.fullName }

//     if (assignee.isTeam) {
//       assigned.user_ids = []
//     } else {
//       assigned.user_ids = [assignee._id]
//       data = {
//         ...data,
//         responsible_id: assignee._id,
//         responsible_first_name: assignee.first_name,
//         responsible_last_name: assignee.last_name,
//       }
//     }
//     data = { ...data, assigned };
//   }
//   if (status.isMessage) {
//     data = {
//       update_type: 'message',
//       message: status.message,
//       user_id: userId
//     }
//   }

//   return yield call(authRequest, `${TASK_API}/${uuid}`, {
//     method: 'PUT',
//     body: JSON.stringify({ ...data, tapTs }),
//   });
// }

// const buildTaskOptimisticUpdate = function * ({ uuid, status }) {
//   const userId = yield select(userIdSelector);
//   const tasks = yield select(tasksSelector)
//   const task = tasks.find(task => task.uuid === uuid)

//   if (!task) {
//     return;
//   }

//   let data;
//   if (status.is_reschedule) {
//     data = {
//       due_date: status.due_date
//     }
//   } else if (status.isMessage) {
//     data = {
//       messages: [
//         ...task.messages,
//         {
//           date_ts: moment().unix(),
//           user_id: userId,
//           message: status.message
//         }
//       ]
//     }
//   } else if (status.isReassign) {
//     const assignee = status.user;
//     data = {
//       user_id: userId,
//       update_ts: moment().unix(),
//       due_date: status.dueDate.format('YYYY-MM-DD'),
//       is_move: true,
//     }

//     if (status.message) {
//       data = { ...data, update_type: "message", message: status.message };
//     }
//     const assigned = { label: assignee.fullName }

//     if (assignee.isTeam) {
//       assigned.user_ids = []
//     } else {
//       assigned.user_ids = [assignee._id]
//       data = {
//         ...data,
//         responsible_id: assignee._id,
//         responsible_first_name: assignee.first_name,
//         responsible_last_name: assignee.last_name,
//       }
//     }
//     data = { ...data, assigned };
//   } else {
//     data = {
//       [`is_${status}`]: 1
//     }
//     if (status === "claimed") {
//       data.responsible_id = userId
//     }
//   }

//   return {
//     ...task,
//     ...data
//   };
// }