

/**
  Module Dependencies

  @author: FanJinChen
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CounterSchema =  new Schema({
  _id: String,
  value: { type: Number, default: 0 },
});

CounterSchema.static.getIdOf = function (name, cb) {
  this.Collection.findAndModify(
    { _id: name },
    [],
    { $inc: { value: 1 } },
    { upsert: true, new: true },
    cb
  );
};

var Counter =  mongoose.model('Counter', CounterSchema);
exports.Counter = Counter;