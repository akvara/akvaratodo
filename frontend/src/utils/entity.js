let CONFIG = require('../config.js');

export function TaskEntity(name) {
    return {
        userId: CONFIG.default.user.id,
        name: name,
        tasks: "[]",
        done: "[]",
    }
}