var mongoose = require('mongoose');

var localSchema = new mongoose.Schema({
  org: { type: String, default: ''},
  district: { type: String, default: ''},
  phone: { type: String, default: ''},
  abstract: { type: String, default: ''},
  link: { type: String, default: ''},
  // timestamp: { type: String, default: ''},
  
});

module.exports = mongoose.model('LocalResources', localSchema);
