var VolunForm = require('../models/VolunForm');
var OrgForm = require('../models/OrgForm');
var User = require('../models/User');
/**
 * GET /about
 * About page.
 */
exports.getLocal = function(req, res) {
  res.render('local', {
    title: '在地好資源'
  });
};
exports.getBevo = function(req, res) {
  if(req.hasOwnProperty("user")){
    VolunForm.findOne(req.user.id, function(err, thisForm) {
      if (err) {
        return next(err);
      }
      
      res.render('bevo', {
        title: '青年當志工',
        vForm: thisForm?thisForm:new VolunForm,
      });
    });
  }
  else{
    res.render('bevo', {
      title: '青年當志工',
      vForm: new VolunForm
    });
  }
  
};
exports.getFindvo = function(req, res) {
  res.render('findvo', {
    title: '機構找志工',
    oForm: new OrgForm,
  });
};
exports.getLaunchteam = function(req, res) {
  res.render('launchteam', {
    title: '揪團去服務'
  });
};
exports.getEmpower = function(req, res) {
  res.render('empower', {
    title: '青年培力'
  });
};