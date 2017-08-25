'use strict';

module.exports.id = "fill-updatedAt-createdAt.js";

module.exports.up = function (done) {
  var coll = this.db.collection('tasklists');
  var isodate = new Date("2017-03-01T00:00:00Z").toISOString();
  coll.update({"updatedAt": null}, { $set : { "updatedAt" : isodate } }, true, true);
  coll.update({"createdAt": null}, { $set : { "createdAt" : isodate } }, true, true);
  done();
  // this.log( isodate);
};

module.exports.down = function (done) {
  done();
};