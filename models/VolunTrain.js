var mongoose = require('mongoose');

var volunTrainSchema = new mongoose.Schema({
  title: { type: String, default: ''},
  abstract: { type: String, default: ''},
  location: { type: String, default: ''},
  org: { type: String, default: ''},
  link: { type: String, default: ''},
  date: { type: String, default: ''},
  order: { type: Number, default: 0},
});

module.exports = mongoose.model('VolunTrain', volunTrainSchema);
