var VolunForm = require('../models/VolunForm');
var OrgForm = require('../models/OrgForm');
var User = require('../models/User');
var LocalResources = require('../models/LocalResources');
var Mentor = require('../models/Mentor');
var Speech = require('../models/Speech');
var TalentTrain  = require('../models/TalentTrain');
var VolunTrain  = require('../models/VolunTrain');
/**
 * GET /about
 * About page.
 */
exports.getLocal = function(req, res) {

    res.render('local', {
      title: '在地好資源',
      hasChosen: false,
      activeTab: 'taipei'
    });
  
};
exports.getLocalDistrict = function(req, res) {
  // console.log(req.params.district);
  LocalResources.find({district: req.params.district}, function(err, allResources) {
    // console.log(allResources);
    res.render('local', {
      title: '在地好資源',
      hasChosen: true,
      allResources: allResources,
      activeTab: req.params.district
    });
  });

};
exports.getBevo = function(req, res) {
  OrgForm.find({},{},{sort:{_id: -1}}, function(err, allOrgForms) {
      if (err) {
        return next(err);
      }

      if(req.hasOwnProperty("user")){
        VolunForm.findOne(req.user.id, function(err, thisForm) {
          if (err) {
            return next(err);
          }
          
          res.render('bevo', {
            title: '青年當志工',
            vForm: thisForm?thisForm:new VolunForm,
            allOrgForms: allOrgForms
          });
        });
      }
      else{
        res.render('bevo', {
          title: '青年當志工',
          vForm: new VolunForm,
          allOrgForms: allOrgForms
        });
      }
  });
};
exports.getFindvo = function(req, res) {
  if(req.user){
    OrgForm.find({uid: req.user.id},{},{sort:{_id: -1}}, function(err, allOrgForms) {
        if (err) {
          return next(err);
        }
        res.render('findvo', {
          title: '機構找志工',
          oForm: new OrgForm,
          allOrgForms: allOrgForms
        });
    });
  }
  else{
    res.render('findvo', {
        title: '機構找志工',
        oForm: new OrgForm,
        // allOrgForms: allOrgForms
      });
  }
};
exports.getLaunchteam = function(req, res) {
  res.render('launchteam', {
    title: '揪團去服務'
  });
};
exports.getEmpower = function(req, res) {
  VolunTrain.find({},{},{sort:{_id: -1}}, function(err, allVolunTrains) {
      if (err) {
        return next(err);
      }
  TalentTrain.find({},{},{sort:{_id: -1}}, function(err, allTalentTrains) {
      if (err) {
        return next(err);
      }
    Speech.find({},{},{sort:{_id: -1}}, function(err, allSpeechs) {
        if (err) {
          return next(err);
        }
      
        Mentor.find({},{},{sort:{order: 1}}, function(err, allMentors) {
            if (err) {
              return next(err);
            }
          
              res.render('empower', {
                title: '青年培力',
                allMentors: allMentors,
                allSpeechs: allSpeechs,
                allTalentTrains: allTalentTrains,
                allVolunTrains: allVolunTrains
              });
          
        });
    });
  });
});
};