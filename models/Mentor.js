var mongoose = require('mongoose');

var mentorSchema = new mongoose.Schema({
  name: { type: String, default: ''},
  job: { type: String, default: ''},
  abstract: { type: String, default: ''},
  link: { type: String, default: ''},
  picture: { type: String, default: ''},
  order: { type: Number, default: 0},
  
  
});

module.exports = mongoose.model('Mentor', mentorSchema);
