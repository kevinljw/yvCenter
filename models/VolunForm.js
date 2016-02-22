
var mongoose = require('mongoose');

var volunSchema = new mongoose.Schema({
  uid: { type: String, default: ''},
  name: { type: String, default: ''},
  gender: { type: String, default: ''},
  location: { type: String, default: '' },
  email: { type: String, default: '' },
  idcode: { type: String, default: '' },
  birth: { type: String, default: '' },
  role: { type: String, default: '' },
  role_text: { type: String, default: '' },
  callnumber: { type: String, default: '' },
  phonenumber: { type: String, default: '' },
  speak: { type: Array, default: [] },
  hasTrain: { type: String, default: 'f' },
  needProof: { type: String, default: 'f' },
  ability_computer: { type: Array, default: [] },
  ability_activity: { type: Array, default: [] },
  ability_photo: { type: Array, default: [] },
  ability_teach: { type: Array, default: [] },
  ability_design: { type: Array, default: [] },
  ability_skill: { type: Array, default: [] },
  ability_license: { type: Array, default: [] },
  ability_other: { type: String, default: '' },
  service_type: { type: Array, default: [] },
  time: { type: Array, default: [] },
});

module.exports = mongoose.model('VolunForm', volunSchema);
