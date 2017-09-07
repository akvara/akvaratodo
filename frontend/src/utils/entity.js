let CONFIG = require('../config.js');

export function BaseTaskEntity() {
    return {
        userId: CONFIG.default.user.id,
        lastAction: new Date().toISOString()
    }
}

export function NewTaskEntity(name) {
    let task = BaseTaskEntity();
    task.name = name;
    task.tasks = "[]";
    task.done = "[]";
    return task;
}