import { get, has } from 'lodash/object';
import digestAssignment from './digest-assignment';
import moment from 'moment';

export default function (data, userId, image, users, groups) {
  let asset = get(data, 'asset', null);
  let action = get(data, 'action', null);
  
  const taskAssignment = digestAssignment(data.assignments, users, groups);
  const dueDate = get(data, 'dueDate', null) || moment();
  
  const task = {
    creator_id: userId,
    task: null,
    type: 'quick',
    meta: {
      image,
      isBlocking: get(data, 'isBlocking', false),
      ...taskAssignment.meta,
    },
    guest_info: {
      guest_name: null,
    },
    assigned: {
      is_mandatory: get(data, 'isMandatory', false),
      ...taskAssignment.assigned
    },
    start_date: moment().format('YYYY-MM-DD'),
    due_date: dueDate.format('YYYY-MM-DD'),
    is_required: 1,
    is_optional: 0,
    is_priority: get(data, 'isPriority', false),
    is_group: 0,
  }
  
  if (get(data, 'room._id')) {
    task.meta.room_id = get(data, 'room._id', null);
    task.meta.location = get(data, 'room.name', null);
  } else if (has(data, 'locations')) {
    task.locations = get(data, 'locations', []).map(location => ({ _id: location._id, name: location.name }))
    if (!task.locations.length) {
      task.locations = [{ _id: '', name: '' }];
    }
  }
  
  if (get(data, 'createdAsset')) {
    task.task = get(data, 'createdAsset')
    task.isCreateAsset = true;
  } else if (asset) {
    task.task = get(asset, 'name');
    if (has(asset, 'isStayPlanner')) {
      task.meta.virtual_asset_id = get(asset, '_id');
    } else if (has(asset, 'contractors')) {
      task.meta.durable_asset_id = get(asset, '_id');
    } else {
      task.meta.asset_id = get(asset, '_id');
    }
  } else {
    task.task = get(data, 'desc') || 'Issue';
    task.type = 'lite';
  }
  
  if (asset && action) {
    task.meta.action = action;
    task.task = `${task.task}: ${action.label}`;
    if (get(action, 'body.task_type')) { task.type = get(action, 'body.task_type') }
    if (get(action, 'body.estimated_time')) { task.meta.estimatedTime = get(action, 'body.estimated_time') }
    // if (get(action, 'body.is_mandatory')) { task.assigned.is_mandatory = true };
    if (get(data, 'useDefault') && get(action, 'body.default_assignment')) {
      let defaultAssignment = get(action, 'body.default_assignment');
      let defaultAssignmentLabel = defaultAssignment.split(':')[0];
  
      task.assigned.label = defaultAssignmentLabel;
      task.assigned.isDefaultAssignment = true;
    }
  }

  if (task.meta.durable_asset_id) {
    if (get(data, 'model')) {
      task.meta.model_name = get(data, 'model.name', "");
      task.meta.model_id = get(data, 'model._id', null);
    }

    if (get(data, 'sublocation')) {
      task.meta.sublocation_label = get(data, 'sublocation.sublocation', "");
      task.meta.sublocation_id = get(data, 'sublocation.id', null);
    }
  }
  
  if (asset && get(data, 'desc')) {
    task.messages = [{
      userId: userId,
      message: get(data, 'desc'),
      date_ts: moment().unix()
    }];
  }

  return task;
}


  // const createTaskFlow = offlineable('createTaskFlow', function * createTaskFlow({ data, tapTs }) {
  //   yield put(UpdatesActions.taskSending());
    
  //   let image = get(data, 'asset.image', null);

  //   try {
  //     if (get(data, 'photoId') && get(photos, [get(data, 'photoId'), 'url'])) {
  //       // console.log('url for photo', get(photos, [get(data, 'photoId'), 'url']));
  //       image = get(photos, [get(data, 'photoId'), 'url']);
  //     } else if (get(data, 'photoId')) {
  //       const photoId = get(data, 'photoId');
  //       // console.log(photoId);
  //       const path = get(photos, [photoId, 'path']);
  //       // console.log(path);

  //       if (path) {
  //         image = yield call(uploadPhoto, path);
  //       }
  //     }
  //   } catch (e) {
  //     console.log('PHOTO for task failed', e);
  //   }

  //   let asset = get(data, 'asset', null);
  //   let action = get(data, 'action', null);

  //   const taskAssignment = digestAssignment(data.assignments, users, hotelGroups);
  //   const dueDate = get(data, 'dueDate', null) || moment();

  //   const task = {
  //     creator_id: userId,
  //     task: null,
  //     type: 'quick',
  //     meta: {
  //       room_id: get(data, 'room._id', null),
  //       location: get(data, 'room.name', null),
  //       image,
  //       isBlocking: get(data, 'isBlocking', false),
  //       ...taskAssignment.meta,
  //     },
  //     guest_info: {
  //       guest_name: null,
  //     },
  //     assigned: {
  //       is_mandatory: get(data, 'isMandatory', false),
  //       ...taskAssignment.assigned
  //     },
  //     start_date: moment().format('YYYY-MM-DD'),
  //     due_date: dueDate.format('YYYY-MM-DD'),
  //     is_required: 1,
  //     is_optional: 0,
  //     is_priority: get(data, 'isPriority', false),
  //     is_group: 0,
  //   }

  //   if (get(data, 'createdAsset')) {
  //     const newAsset = yield call(createVirtualAsset, {
  //       name: get(data, 'createdAsset'),
  //       image
  //     });
  //     asset = get(newAsset, 'virtualAsset');
  //   }

  //   if (asset) {
  //     task.task = get(asset, 'name');
  //     if (has(asset, 'isStayPlanner')) {
  //       task.meta.virtual_asset_id = get(asset, '_id');
  //     } else if (has(asset, 'contractors')) {
  //       task.meta.durable_asset_id = get(asset, '_id');
  //     } else {
  //       task.meta.asset_id = get(asset, '_id');
  //     }
  //   } else {
  //     task.task = get(data, 'desc') || 'Issue';
  //     task.type = 'lite';
  //   }

  //   if (asset && action) {
  //     task.meta.action = action;
  //     task.task = `${task.task}: ${action.label}`;
  //     if (get(action, 'body.task_type')) { task.type = get(action, 'body.task_type') }
  //     if (get(action, 'body.estimated_time')) { task.meta.estimatedTime = get(action, 'body.estimated_time') }
  //     // if (get(action, 'body.is_mandatory')) { task.assigned.is_mandatory = true };
  //     if (get(data, 'useDefault') && get(action, 'body.default_assignment')) {
  //       let defaultAssignment = get(action, 'body.default_assignment');
  //       let defaultAssignmentLabel = defaultAssignment.split(':')[0];

  //       task.assigned.label = defaultAssignmentLabel;
  //       task.assigned.isDefaultAssignment = true;
  //     }
  //   }

  //   if (asset && get(data, 'desc')) {
  //     task.messages = [{
  //       userId: userId,
  //       message: get(data, 'desc'),
  //       date_ts: moment().unix()
  //     }];
  //   }

  //   const locations = data.locations;
  //   if (locations && locations.length) {
  //     task.locations = locations.map(location => ({ _id: location._id, name: location.name }))
  //   }
    
  //   if (data.activeGlitch) {
  //     // yield call(updateGlitch, { task_id: response.task.uuid, users_id: userId, glitchId: data.activeGlitch })
  //     task.meta.isGlitch = true;
  //     task.meta.glitchId = activeGlitch;
  //   }

  //   const response = yield call(createTask, task, tapTs);


  //   yield put(UpdatesActions.taskSendingSuccess());
  //   return yield put(RoomsActions.tasksFetch());
  // })