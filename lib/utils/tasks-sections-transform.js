import get from 'lodash/get';

export default transformIntoSections = (tasks, userId=null) => {
  const sections = [];
  
  if (userId) {
    const userTasks = tasks
      .filter(task => {
        if (get(task, 'is_completed') || get(task, 'is_cancelled')) {
          return false;
        }
        if (get(task, 'responsible_id')) {
          return get(task, 'responsible_id') === userId;
        } else {
          return get(task, 'user_ids') && get(task, 'user_ids', []).includes(userId);
        }
      })
      .map(task => ({ ...task, withOptions: true }));
    
    const otherTasks = tasks
      .filter(task => {
        if (get(task, 'is_completed') || get(task, 'is_cancelled')) {
          return false;
        }

        if (get(task, 'responsible_id')) {
          return get(task, 'responsible_id') !== userId;
        } else {
          return !(get(task, 'user_ids') || []).includes(userId);
        }
      });

    if (userTasks && userTasks.length) {
      sections.push({ data: userTasks, title: 'assigned', key: 'assigned' });
    }
    if (otherTasks && otherTasks.length) {
      sections.push({ data: otherTasks, title: 'other', key: 'other' });
    }
  } else {
    const openTasks = tasks
      .filter(task => {
        return !get(task, 'is_completed') && !get(task, 'is_cancelled');
      })

    if (openTasks && openTasks.length) {
      sections.push({ data: openTasks, title: 'open', key: 'open' });
    }
  }

  const closedTasks = tasks
    .filter(task => {
      return get(task, 'is_completed') || get(task, 'is_cancelled');
    })

  if (closedTasks && closedTasks.length) {
    sections.push({ data: closedTasks, title: 'closed', key: 'closed' });
  }

  return sections;
}