var mongoose = require('mongoose');

var openHouseSchema = new mongoose.Schema({
  title: { type: String, default: ''},
  abstract: { type: String, default: ''},
  location: { type: String, default: ''},
  org: { type: String, default: ''},
  link: { type: String, default: ''},
  date: { type: String, default: ''},
  // picture: { type: String, default: ''},
  // order: { type: Number, default: 0},
  // area: { type: String, default: ''},
  // timestamp: { type: String, default: ''},
  
});

module.exports = mongoose.model('OpenHouse', openHouseSchema);
