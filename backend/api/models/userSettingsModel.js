'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSettingsSchema = new Schema({
  userId: {
    type: Number
  },
  loadListIfExists: {
    type: String
  },
  addNewAt: {
    type: Number,
    default: 3
  },
  postponeBy: {
    type: Number,
    default: 11
  },
  displayListLength: {
    type: Number,
    default: 18
  },
  displayLast: {
    type: Number,
    default: 3
  }
},
{
  timestamps: true
});

module.exports = mongoose.model('UserSettings', UserSettingsSchema);
