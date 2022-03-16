import { Activities } from '../../utils/tasks';

export const swipeoutButtons = ({ task, onSwipeoutPress }) => {
  const activities = Activities.get(task)
  return activities.map(activity => ({
    ...activity,
    onPress: () => onSwipeoutPress(task, activity)
  }))
}
