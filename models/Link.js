var mongoose = require('mongoose');

var linkSchema = new mongoose.Schema({
  name: { type: String, default: ''},
  link: { type: String, default: ''},
  picture: { type: String, default: ''},
  order: { type: Number, default: 0},
  area: { type: String, default: ''},
  // timestamp: { type: String, default: ''},
  
});

module.exports = mongoose.model('Link', linkSchema);
