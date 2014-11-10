var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var Counter = require('../controllers/counter');

var GameSchema = Schema({
  _id: Number,
  company : {type:Number, ref: 'User'},//所属公司
  name : { type: String},
  gameFilePath : String,
  created : { type: Date, default: Date.now },
  updated : { type: Date, default: Date.now },
});
mongoose.model('Game', GameSchema);
GameSchema.pre('save', function (next) {
  self = this;
  if (self._id) {
    next();
  }else {
    Counter.getIdOf('game', function (err, id) {
      self._id = id;
      next(err);
    });
  }
});
