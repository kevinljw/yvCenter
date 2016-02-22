var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var mongoose = require('mongoose');

var orgSchema = new mongoose.Schema({
  uid: { type: String, default: ''},
  uname: { type: String, default: ''},
  timestamp: { type: String, default: ''},
  activity_name: { type: String, default: ''},
  activity_abstract: { type: String, default: ''},
  activity_website: { type: String, default: '' },
  service_date_since: { type: String, default: '' },
  service_date_until: { type: String, default: '' },
  service_time_since: { type: String, default: '' },
  service_time_until: { type: String, default: '' },
  service_location: { type: String, default: '' },
  service_hours: { type: Number, default: 1 },
  service_content: { type: String, default: '' },
  service_type: { type: Array, default: [] },
  volunNum: { type: Number, default: 1 },
  volunConditions: { type: Array, default: [] },
  hasFood: { type: String, default: '' },
  volunInsurance: { type: Array, default: [] },
  volunLisence: { type: String, default: '' },
  volunSubsidy: { type: String, default: '' },
  pre_train: { type: String, default: '' },
  pre_train_date_since: { type: String, default: '' },
  pre_train_date_until: { type: String, default: '' },
  pre_train_time_since: { type: String, default: '' },
  pre_train_time_until: { type: String, default: '' },
  pre_train_location: { type: String, default: '' },
  recruit_deadline: { type: String, default: '' },
  howToInform: { type: Array, default: [] },
  otherInfo: { type: String, default: '' },
  contact_person: { type: String, default: '' },
  contact_job_title: { type: String, default: '' },
  contact_phone: { type: String, default: '' },
  contact_email: { type: String, default: '' }
});

module.exports = mongoose.model('OrgForm', orgSchema);
