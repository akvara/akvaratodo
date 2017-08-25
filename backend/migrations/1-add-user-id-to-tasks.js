'use strict';

module.exports.id = "add-user-id-to-tasks";

module.exports.up = function (done) {
  var coll = this.db.collection('tasklists');
  coll.update({ }, { $set: { userId: 1 } }, { multi: true }, done);
};

module.exports.down = function (done) {
  var coll = this.db.collection('tasklists');
  coll.update({ }, { $unset: { userId: "" } }, { multi: true }, done);
  done();
};