'use strict';

var mongoose = require('mongoose'),
    UserSettings = mongoose.model('UserSettings'),
    config = require('../../config/main');

exports.read_user_settings = function(req, res) {
  UserSettings.findOne({ userId: req.params.userId }, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.save_user_settings = function(req, res) {
  UserSettings.findOneAndUpdate(
    {
      userId: req.params.userId
    }, 
    req.body, 
    { 
      upsert: true,
      returnNewDocument: true
    }, function(err, task) {
      if (err) {
        console.log(err);
        res.send(err);
      }
      res.json(task);
  });
};
