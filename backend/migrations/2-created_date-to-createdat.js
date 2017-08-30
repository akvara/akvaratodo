'use strict';

module.exports.id = "created_date-to-createdAt";

module.exports.up = function (done) {
  var coll = this.db.collection('tasklists');
	coll.update({},{ $rename: {'created_date':'createdAt'} }, {multi:true}, done);  // done();
};

module.exports.down = function (done) {
  // use this.db for MongoDB communication, and this.log() for logging
  done();
};