var VolunForm = require('../models/VolunForm');
var User = require('../models/User');
var passport = require('passport');
var OrgForm = require('../models/OrgForm');
var LocalResources = require('../models/LocalResources');
var Link = require('../models/Link');
var HomeCover = require('../models/HomeCover');
var Mentor = require('../models/Mentor');
var OpenHouse = require('../models/OpenHouse');
var Speech = require('../models/Speech');
var TalentTrain  = require('../models/TalentTrain');
var VolunTrain  = require('../models/VolunTrain');
var emailSender = require('./emailSender');
/**
 * GET /about
 * About page.
 */
exports.getAdminLogin = function(req, res) {
  res.render('admin_login', {
    title: '管理員登入'
  });
};
exports.getAdminHome = function(req, res) {
  HomeCover.find({},{},{sort:{order: 1}}, function(err, allCovers) {
      if (err) {
        return next(err);
      }
      
        res.render('admin/home', {
          title: '管理中心',
          allCovers: allCovers,
        });
    
  });
 
};
exports.getGhostAdmin = function(req, res) {
  res.render('admin/ghost', {
    title: '文章管理'
  });
};
// exports.getCalendar = function(req, res) {
//   res.render('admin/calendar', {
//     title: '行事曆管理'
//   });
// };
exports.getOrgVerify = function(req, res) {
  User.find({IsOrg: true}, function(err, allOrgs) {
    if (err) {
      return next(err);
    }
    res.render('admin/orgVerify', {
      title: '機構審核',
      allOrgs: allOrgs,
    });
  });
};
exports.getNoveltyMgr  = function(req, res, next) {
  OpenHouse.find({},{},{sort:{_id: -1}}, function(err, allOpenHouses) {
      if (err) {
        return next(err);
      }
    
        res.render('admin/noveltyMgr', {
          title: '公益新鮮事',
          allOpenHouses: allOpenHouses,
        });
    
  });
};  
exports.getLocalMgr = function(req, res) {
  LocalResources.find({district: /taipei/i},function(err, taipeiRes) {
      if (err) {
        return next(err);
      }
  LocalResources.find({district: /keelung/i},function(err, keelungRes) {
      if (err) {
        return next(err);
      }
  LocalResources.find({district: /kinmen/i},function(err, kinmenRes) {
      if (err) {
        return next(err);
      }
      res.render('admin/localMgr', {
        title: '在地好資源',
        taipeiRes: taipeiRes,
        keelungRes: keelungRes,
        kinmenRes: kinmenRes
      });
  });
  });
  });
}; 
exports.getServiceMgr = function(req, res, next) {
  OrgForm.find({},function(err, allServices) {
      if (err) {
        return next(err);
      }
      res.render('admin/serviceMgr', {
        title: '服務管理',
        allServices: allServices,
      });
  });
  
}; 
exports.getVolunMgr = function(req, res, next) {
  VolunForm.find({},function(err, allVoluns) {
      if (err) {
        return next(err);
      }
      res.render('admin/volunMgr', {
        title: '志工管理',
        allVoluns: allVoluns,
      });
  });
  
}; 
exports.getAdministrator = function(req, res, next) {
  User.find({},{"profile.name": 1, email: 1},function(err, allUsers) {
      if (err) {
        return next(err);
      }
    User.find({IsAdmin: true},function(err, allAdmins) {
        if (err) {
          return next(err);
        }
        res.render('admin/administrator', {
          title: '管理員',
          allAdmins: allAdmins,
          allUsers: allUsers,
        });
    });
  });
}; 
exports.getEmpowerMgr  = function(req, res, next) {
  VolunTrain.find({},{},{sort:{order: -1}}, function(err, allVolunTrains) {
    if (err) {
      return next(err);
    }
  TalentTrain.find({},{},{sort:{order: -1}}, function(err, allTalentTrains) {
    if (err) {
      return next(err);
    }
  Speech.find({},{},{sort:{order: -1}}, function(err, allSpeechs) {
    if (err) {
      return next(err);
    }
    Mentor.find({},{},{sort:{order: 1}}, function(err, allMentors) {
        if (err) {
          return next(err);
        }
      
          res.render('admin/empowerMgr', {
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
exports.getLinksMgr = function(req, res, next) {
  Link.find({},{},{sort:{order: 1}}, function(err, allLinks) {
      if (err) {
        return next(err);
      }
    
        res.render('admin/linksMgr', {
          title: '友好連結',
          allLinks: allLinks,
        });
    
  });
}; 
exports.postNewMentor   = function(req, res, next) {
    Mentor.count({}, function(err, numOfMentor) {
      var newMentor = new Mentor({
        name: req.body.name,
        abstract: req.body.abstract,
        job: req.body.job,
        link: req.body.link,
        picture: 'profile/'+req.file.filename,
        order: numOfMentor+1,
      });
      newMentor.save(function(err) {
          if (err) {
            return next(err);
          }
          // req.flash('success', { msg: '表單送出成功。' });
          res.redirect('/empowerMgr');
      });

    });

}
exports.postEditVolunForm  = function(req, res, next) {
    
  VolunForm.findById(req.params.id, function(err, existingUser) {
    if (err) {
      return next(err);
    }

    if(existingUser){
      // console.log(req.body);
      existingUser.name= req.body.name || existingUser.name;
      existingUser.gender= req.body.gender || existingUser.gender;
      existingUser.location= req.body.location || existingUser.location;
      existingUser.email= req.body.email || existingUser.email;
      existingUser.idcode= req.body.idcode || existingUser.idcode;
      existingUser.birth= req.body.birth || existingUser.birth;
      existingUser.role= req.body.role || existingUser.role;
      existingUser.role_text= req.body.role_text[existingUser.role=='在學學生'?0:(existingUser.role=='社會人士'?1:2)] || existingUser.role_text;
      existingUser.callnumber= req.body.callnumber || existingUser.callnumber;
      existingUser.phonenumber= req.body.phonenumber || existingUser.phonenumber;
      existingUser.transportation=req.body.transportation || existingUser.transportation;
      existingUser.speak= req.body.speak || existingUser.speak;
      existingUser.hasTrain= req.body.hasTrain || existingUser.hasTrain;
      existingUser.needProof= req.body.needProof || existingUser.needProof;
      existingUser.ability_computer= req.body.ability_computer || existingUser.ability_computer;
      existingUser.ability_activity= req.body.ability_activity || existingUser.ability_activity;
      existingUser.ability_photo= req.body.ability_photo || existingUser.ability_photo;
      existingUser.ability_teach= req.body.ability_teach || existingUser.ability_teach;
      existingUser.ability_design= req.body.ability_design || existingUser.ability_design;
      existingUser.ability_skill= req.body.ability_skill || existingUser.ability_skill;
      existingUser.ability_license= req.body.ability_license || existingUser.ability_license;
      existingUser.ability_other= req.body.ability_other || existingUser.ability_other;
      existingUser.service_type = req.body.service_type || existingUser.service_type;
      existingUser.time = req.body.time || existingUser.time;

      existingUser.save(function(err) {
        if (err) {
          return next(err);
        }
      
        // req.flash('success', { msg: '表單修改成功。' });
        res.redirect('/volunMgr');
      });
    }   
  });

}
exports.postNewVolunTrain  = function(req, res, next) {
    
    VolunTrain.count({}, function(err, numOfVolunTrain) {
      var newVolunTrain = new VolunTrain({
        title: req.body.title,
        abstract: req.body.abstract,
        location: req.body.location,
        org: req.body.org,
        date: req.body.date,
        link: req.body.link,
        order: numOfVolunTrain+1
      });
      newVolunTrain.save(function(err) {
          if (err) {
            return next(err);
          }
         
          // req.flash('success', { msg: '表單送出成功。' });
          res.redirect('/empowerMgr');
      });

    });

}
exports.postNewTalentTrain  = function(req, res, next) {
    
    TalentTrain.count({}, function(err, numOfTalentTrain) {
      var newTalentTrain = new TalentTrain({
        title: req.body.title,
        abstract: req.body.abstract,
        location: req.body.location,
        org: req.body.org,
        date: req.body.date,
        link: req.body.link,
        order: numOfTalentTrain+1
      });
      newTalentTrain.save(function(err) {
          if (err) {
            return next(err);
          }
         
          // req.flash('success', { msg: '表單送出成功。' });
          res.redirect('/empowerMgr');
      });

    });

}
exports.postNewSpeech  = function(req, res, next) {
    Speech.count({}, function(err, numOfSpeech) {
      var newSpeech = new Speech({
        title: req.body.title,
        abstract: req.body.abstract,
        location: req.body.location,
        org: req.body.org,
        date: req.body.date,
        link: req.body.link,
        order: numOfSpeech+1
      });
      newSpeech.save(function(err) {
          if (err) {
            return next(err);
          }
         
          // req.flash('success', { msg: '表單送出成功。' });
          res.redirect('/empowerMgr');
      });

    });

}
exports.postAddNewOpenHouse  = function(req, res, next) {
    
      var newOpenHouse = new OpenHouse({
        title: req.body.title,
        abstract: req.body.abstract,
        location: req.body.location,
        org: req.body.org,
        date: req.body.date,
        link: req.body.link,
      });
      newOpenHouse.save(function(err) {
          if (err) {
            return next(err);
          }
         
          // req.flash('success', { msg: '表單送出成功。' });
          res.redirect('/noveltyMgr');
      });

  

}
exports.postNewHomeCover  = function(req, res, next) {
    HomeCover.count({}, function(err, numOfCover) {
      var newCover = new HomeCover({
        title: req.body.title,
        abstract: req.body.abstract,
        link: req.body.link,
        picture: 'homeCover/'+req.file.filename,
        order: numOfCover+1,
      });
      newCover.save(function(err) {
          if (err) {
            return next(err);
          }
         
          // req.flash('success', { msg: '表單送出成功。' });
          res.redirect('/adminMgr');
      });

    });

}
exports.postNewServicePoint  = function(req, res, next) {
    Link.count({area: req.body.area}, function(err, numOfArea) {
      var newLink = new Link({
        name: req.body.name || '',
        area: 'servicePoint',
        link: req.body.link || '',
        picture: 'linkIcon/'+req.file.filename || '',
        order: numOfArea+1,
        abstract: req.body.abstract || '',
      });
      newLink.save(function(err) {
          if (err) {
            return next(err);
          }
         
          // req.flash('success', { msg: '表單送出成功。' });
          res.redirect('/linksMgr');
      });

    });

} 
exports.postNewLink  = function(req, res, next) {
    Link.count({area: req.body.area}, function(err, numOfArea) {
      var newLink = new Link({
        name: req.body.name,
        area: req.body.area,
        link: req.body.link,
        picture: 'linkIcon/'+req.file.filename,
        order: numOfArea+1,
      });
      newLink.save(function(err) {
          if (err) {
            return next(err);
          }
         
          // req.flash('success', { msg: '表單送出成功。' });
          res.redirect('/linksMgr');
      });

    });

}
exports.postUpdateHomeCoverAbstract  = function(req, res, next) {
  // console.log(req.body);
  HomeCover.findById(req.params.id, function(err, thisCover) {
      if (err) {
        return next(err);
      }

      if(thisCover){
         thisCover.abstract = req.body.newAbstract || thisCover.abstract;
         thisCover.save(function(err) {
            if (err) {
              return next(err);
            }
            // req.flash('success', { msg: thisUser.profile.name+' 授權修改成功' });
            res.redirect('/adminMgr');
          });

      }
      else{
        res.redirect('/adminMgr');

      }   
  
  });

};
exports.postUpdateSpeechOrder = function(req, res, next) {
  Speech.findById(req.params.id, function(err, thisSpeech) {
      if (err) {
        return next(err);
      }

      if(thisSpeech){
         thisSpeech.order = req.body.newOrder || 0;
         thisSpeech.save(function(err){
            if (err) {
              return next(err);
            }
            res.redirect('/empowerMgr');
          });

      }
      else{
        res.redirect('/empowerMgr');

      }   
  
  });

};
exports.postUpdateTalentTrainOrder = function(req, res, next) {
  TalentTrain.findById(req.params.id, function(err, thisTalentTrain) {
      if (err) {
        return next(err);
      }

      if(thisTalentTrain){
         thisTalentTrain.order = req.body.newOrder || 0;
         thisTalentTrain.save(function(err){
            if (err) {
              return next(err);
            }
            res.redirect('/empowerMgr');
          });

      }
      else{
        res.redirect('/empowerMgr');

      }   
  
  });

};
exports.postUpdateVolunTrainOrder = function(req, res, next) {

  VolunTrain.findById(req.params.id, function(err, thisVolun) {
      if (err) {
        return next(err);
      }

      if(thisVolun){
         thisVolun.order = req.body.newOrder || 0;
         thisVolun.save(function(err){
            if (err) {
              return next(err);
            }
            res.redirect('/empowerMgr');
          });

      }
      else{
        res.redirect('/empowerMgr');

      }   
  
  });

}; 
exports.postUpdateMentorOrder  = function(req, res, next) {
  // console.log(req.body);
  Mentor.findById(req.params.id, function(err, thisMentor) {
      if (err) {
        return next(err);
      }

      if(thisMentor){
         thisMentor.order = req.body.newOrder || 0;
         thisMentor.save(function(err){
            if (err) {
              return next(err);
            }
            res.redirect('/empowerMgr');
          });

      }
      else{
        res.redirect('/empowerMgr');

      }   
  
  });

};
exports.postUpdateLinkOrder  = function(req, res, next) {
  // console.log(req.body);
  Link.findById(req.params.id, function(err, thisLink) {
      if (err) {
        return next(err);
      }

      if(thisLink){
         thisLink.order = req.body.newOrder || 0;
         thisLink.save(function(err) {
            if (err) {
              return next(err);
            }
            // req.flash('success', { msg: thisUser.profile.name+' 授權修改成功' });
            res.redirect('/linksMgr');
          });

      }
      else{
        res.redirect('/linksMgr');

      }   
  
  });

};
exports.postUpdateHomeCoverOrder  = function(req, res, next) {
  // console.log(req.body);
  HomeCover.findById(req.params.id, function(err, thisCover) {
      if (err) {
        return next(err);
      }

      if(thisCover){
         thisCover.order = req.body.newOrder || 0;
         thisCover.save(function(err) {
            if (err) {
              return next(err);
            }
            // req.flash('success', { msg: thisUser.profile.name+' 授權修改成功' });
            res.redirect('/adminMgr');
          });

      }
      else{
        res.redirect('/adminMgr');

      }   
  
  });

};
exports.postRemoveSevice  = function(req, res, next) {

  OrgForm.remove({ _id: req.params.id }, function(err) {
    if (err) {
      return next(err);
    }
   
    res.redirect('/serviceMgr');
  });

}
exports.postRemoveOrg = function(req, res, next) {

  OrgForm.remove({ uid: req.params.id }, function(err) {
    
    if (err) {
      return next(err);
    }

    User.remove({ _id: req.params.id }, function(err) {
      if (err) {
        return next(err);
      }
     
      res.redirect('/orgVerify');
    });

  });
}
exports.postRemoveVolunForm  = function(req, res, next) {

  VolunForm.remove({ _id: req.params.id }, function(err) {
    if (err) {
      return next(err);
    }
    
    res.redirect('/volunMgr');
  });

}
exports.postRemoveVolunTrain  = function(req, res, next) {

  VolunTrain.remove({ _id: req.params.id }, function(err) {
    if (err) {
      return next(err);
    }
   
    res.redirect('/empowerMgr');
  });

}
exports.postRemoveTalentTrain  = function(req, res, next) {

  TalentTrain.remove({ _id: req.params.id }, function(err) {
    if (err) {
      return next(err);
    }
   
    res.redirect('/empowerMgr');
  });

}
exports.postRemoveSpeech  = function(req, res, next) {

  Speech.remove({ _id: req.params.id }, function(err) {
    if (err) {
      return next(err);
    }
   
    res.redirect('/empowerMgr');
  });

}
exports.postRemoveOpenHouse  = function(req, res, next) {

  OpenHouse.remove({ _id: req.params.id }, function(err) {
    if (err) {
      return next(err);
    }
   
    res.redirect('/noveltyMgr');
  });

}
exports.postRemoveMentor  = function(req, res, next) {

  Mentor.remove({ _id: req.params.id }, function(err) {
    if (err) {
      return next(err);
    }
   
    res.redirect('/empowerMgr');
  });

}
exports.postRemoveHomeCover  = function(req, res, next) {

  HomeCover.remove({ _id: req.params.id }, function(err) {
    if (err) {
      return next(err);
    }
   
    res.redirect('/adminMgr');
  });

}
exports.postRemoveLink  = function(req, res, next) {

  Link.remove({ _id: req.params.id }, function(err) {
    if (err) {
      return next(err);
    }
   
    res.redirect('/linksMgr');
  });

}
exports.postRemoveResource  = function(req, res, next) {
  LocalResources.remove({ _id: req.params.id }, function(err) {
    if (err) {
      return next(err);
    }
   
    res.redirect('/localMgr');
  });

}
exports.postLocalData  = function(req, res, next) {
  // console.log(req.body);
  var newResource = new LocalResources({
      org: req.body.org || '',
      district: req.body.district || '',
      contact: req.body.contact || '',
      abstract: req.body.abstract.replace(/(?:\r\n|\r|\n)/g, ' <br /> ') || '',
      people: req.body.people || 1,
      // link: req.body.link || ''
      // timestamp: Date()
  });
  newResource.save(function(err) {
      if (err) {
        return next(err);
      }
     
      // req.flash('success', { msg: '表單送出成功。' });
      res.redirect('/localMgr');
    });
}

exports.postRemoveAdmin  = function(req, res, next) {
  // console.log(req.body);
  User.findById(req.params.id, function(err, thisUser) {
      if (err) {
        return next(err);
      }

      if(thisUser){
         thisUser.IsAdmin = false;
         thisUser.save(function(err) {
            if (err) {
              return next(err);
            }
            // req.flash('success', { msg: thisUser.profile.name+' 授權修改成功' });
            res.redirect('/administrator');
          });

      }
      else{
        res.redirect('/administrator');

      }   
  
  });

};
exports.postBeAdmin  = function(req, res, next) {
  // console.log(req.body);
  User.findById(req.body.thisAdmin, function(err, thisUser) {
      if (err) {
        return next(err);
      }
      if(thisUser){
         thisUser.IsAdmin = true;
          thisUser.save(function(err) {
            if (err) {
              return next(err);
            }
            // req.flash('success', { msg: thisUser.profile.name+' 授權修改成功' });
            res.redirect('/administrator');
          });

      }
      else{
        res.redirect('/administrator');

      }
     
  
  });

};

exports.postOrgActivation = function(req, res, next) {
  User.findById(req.params.id, function(err, thisUser) {
      if (err) {
        return next(err);
      }
      if(thisUser.IsOrgActivation){
        emailSender.sendOrgValidationUnAuthEmail(thisUser.profile.name, thisUser.email);
      }
      else{
        emailSender.sendOrgValidationCheckEmail(thisUser.profile.name, thisUser.email);
      }
      thisUser.IsOrgActivation = !thisUser.IsOrgActivation;
      thisUser.save(function(err) {
        if (err) {
          return next(err);
        }
        req.flash('success', { msg: thisUser.profile.name+' 授權修改成功' });
        res.redirect('/orgVerify');
      });
  
  });
};
/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLoginAdmin = function(req, res, next) {
  req.assert('email', 'Email 錯誤').isEmail();
  req.assert('password', '密碼不得為空').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/admin_login#loginFormatErr');
  }

  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    // console.log(user);
    if (!user || !user.IsAdmin) {

      req.flash('errors', { msg: '錯誤，不存在此帳號或您不具管理員權限' });
      return res.redirect('/admin_login#loginErr');
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      req.flash('success', { msg: 'Success! You are logged in.' });
      res.redirect('/adminMgr');
    });
  })(req, res, next);
};