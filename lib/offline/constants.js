import { createTypes } from 'reduxsauce';

export default createTypes(`
  ENQUEUE
  DEQUEUE
  START
  STOP
  NEXT_ATTEMPT
  CURRENT_RUNNING
  CLEAR
  CLEAR_FOR_TODAY
`);
