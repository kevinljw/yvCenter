var mongoose = require('mongoose');

var localSchema = new mongoose.Schema({
  org: { type: String, default: ''},
  district: { type: String, default: ''},
  abstract: { type: String, default: ''},
  contact: { type: String, default: ''},
  people:  { type: Number},
  // link: { type: String, default: ''},
  // timestamp: { type: String, default: ''},
  
});

module.exports = mongoose.model('LocalResources', localSchema);
