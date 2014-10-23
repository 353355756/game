

/**
  Module Dependencies

  @author: Fan JinChen
*/

var mongoose = require('mongoose');
var Counter = require('../models/counter').Counter;

exports.getIdOf = function (name, cb) {
  Counter.collection.findAndModify(
    { _id: name },
    [],
    { $inc: { value: 1 } },
    { upsert: true, new: true },
    function (err, doc) {
      if (err) {
        console.log(err);
        return cb(err, undefined);
      }
      return cb(err, doc.value);
    }
  );
};