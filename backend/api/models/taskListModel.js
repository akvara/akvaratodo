'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskListSchema = new Schema({
  userId: {
    type: Number
  },
  name: {
    type: String,
    Required: 'Missing task list name'
  },
  tasks: {
    type: String
  },
  done: {
    type: String
  },
  immutable: {
    type: Boolean,
    default: false
  },
  usageCount: {
    type: Number,
    default: 0
  },
  lastAction: {
    type: Date
  },
},
{
  timestamps: true
});

module.exports = mongoose.model('TaskList', TaskListSchema);
