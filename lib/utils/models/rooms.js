import { omit, map, chain } from 'lodash';

const OMITTED_FIELDS = [
  '__v',
  'roomMaintenance',
  'updateTapTs',
  'updateTs',
  'updateType',
  'updateUsername',
  'lastDate',
  'assets'    
];

export const cleanRooms = (rooms) => map(rooms, room => omit(room, OMITTED_FIELDS));