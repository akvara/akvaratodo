import CONFIG from '../config.js';

export const BaseTaskEntity = () => {
  return {
    userId: CONFIG.user.id,
    lastAction: new Date().toISOString(),
  };
};

export const NewTaskEntity = (name) => {
  let task = BaseTaskEntity();
  task.name = name;
  task.tasks = '[]';
  task.done = '[]';

  return task;
};
