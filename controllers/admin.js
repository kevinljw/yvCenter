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
var xlsx = require("exceljs");
var async = require('async');
// var moment = require('moment');
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
exports.getEmpowerMgr_speech  = function(req, res, next) {
 
    Speech.find({},{},{sort:{order: 1}}, function(err, allSpeechs) {
        if (err) {
          return next(err);
        }
      
          res.render('admin/empowerMgr_speech', {
            title: '青年培力-研習講座',
            allSpeechs: allSpeechs,
          });
      
    });
  
}; 
exports.getEmpowerMgr_talentTrain  = function(req, res, next) {
 
    TalentTrain.find({},{},{sort:{order: 1}}, function(err, allTalentTrains) {
        if (err) {
          return next(err);
        }
      
          res.render('admin/empowerMgr_talentTrain', {
            title: '青年培力-專長訓練',
            allTalentTrains: allTalentTrains,
          });
      
    });
  
}; 
exports.getEmpowerMgr_volunTrain  = function(req, res, next) {
 
    VolunTrain.find({},{},{sort:{order: 1}}, function(err, allVolunTrains) {
        if (err) {
          return next(err);
        }
      
          res.render('admin/empowerMgr_volunTrain', {
            title: '青年培力-志工訓練',
            allVolunTrains: allVolunTrains,
          });
      
    });
  
}; 
exports.getEmpowerMgr_mentor  = function(req, res, next) {
 
    Mentor.find({},{},{sort:{order: 1}}, function(err, allMentors) {
        if (err) {
          return next(err);
        }
      
          res.render('admin/empowerMgr_mentor', {
            title: '青年培力-諮詢業師',
            allMentors: allMentors,
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
  
    var abstractLi = req.body.abstract.filter(Boolean)
    // console.log("postNewMentor",abstractLi)
    Mentor.count({}, function(err, numOfMentor) {
      var newMentor = new Mentor({
        name: req.body.name,
        abstract: abstractLi,
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
          res.redirect('/empowerMgr_mentor');
      });

    });

}
exports.postEditLinksData  = function(req, res, next) {
    
  Link.findById(req.params.id, function(err, existingOne) {
    if (err) {
      return next(err);
    }
    if(existingOne){
      existingOne.name= req.body.name || existingOne.name;
      existingOne.link= req.body.link || existingOne.link;
      existingOne.abstract= req.body.abstract;
      
      existingOne.save(function(err) {
        if (err) {
          return next(err);
        }
      
        // req.flash('success', { msg: '表單修改成功。' });
        res.redirect('/linksMgr');
      });
  
    }   
  });

}
exports.postEditSpeechData  = function(req, res, next) {
    
  Speech.findById(req.params.id, function(err, existingOne) {
    if (err) {
      return next(err);
    }
    if(existingOne){
      existingOne.title= req.body.title || existingOne.title;
      existingOne.location= req.body.location;
      existingOne.abstract= req.body.abstract || existingOne.abstract;
      existingOne.org= req.body.org || existingOne.org;
      existingOne.link= req.body.link;
      existingOne.date= req.body.date || existingOne.date;
      existingOne.save(function(err) {
        if (err) {
          return next(err);
        }
      
        // req.flash('success', { msg: '表單修改成功。' });
        res.redirect('/empowerMgr_speech');
      });
  
    }   
  });

}
exports.postEditTalentTrainData  = function(req, res, next) {
    
  TalentTrain.findById(req.params.id, function(err, existingOne) {
    if (err) {
      return next(err);
    }
    if(existingOne){
      existingOne.title= req.body.title || existingOne.title;
      existingOne.location= req.body.location;
      existingOne.abstract= req.body.abstract || existingOne.abstract;
      existingOne.org= req.body.org || existingOne.org;
      existingOne.link= req.body.link;
      existingOne.date= req.body.date || existingOne.date;
      existingOne.save(function(err) {
        if (err) {
          return next(err);
        }
      
        // req.flash('success', { msg: '表單修改成功。' });
        res.redirect('/empowerMgr_talentTrain');
      });
  
    }   
  });

}
exports.postEditVolunTrainData  = function(req, res, next) {
    
  VolunTrain.findById(req.params.id, function(err, existingOne) {
    if (err) {
      return next(err);
    }
    if(existingOne){
      existingOne.title= req.body.title || existingOne.title;
      existingOne.location= req.body.location;
      existingOne.abstract= req.body.abstract || existingOne.abstract;
      existingOne.org= req.body.org || existingOne.org;
      existingOne.link= req.body.link;
      existingOne.date= req.body.date || existingOne.date;
      existingOne.save(function(err) {
        if (err) {
          return next(err);
        }
      
        // req.flash('success', { msg: '表單修改成功。' });
        res.redirect('/empowerMgr_volunTrain');
      });
  
    }   
  });

}
exports.postEditMentorData  = function(req, res, next) {
    
  Mentor.findById(req.params.id, function(err, existingOne) {
    if (err) {
      return next(err);
    }
    if(existingOne){
      existingOne.name= req.body.name || existingOne.name;
      existingOne.job= req.body.job || existingOne.job;
      existingOne.abstract= req.body.abstract || existingOne.abstract;
      existingOne.link= req.body.link || existingOne.link;
      existingOne.save(function(err) {
        if (err) {
          return next(err);
        }
      
        // req.flash('success', { msg: '表單修改成功。' });
        res.redirect('/empowerMgr_mentor');
      });
  
    }   
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
          res.redirect('/empowerMgr_volunTrain');
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
          res.redirect('/empowerMgr_talentTrain');
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
          res.redirect('/empowerMgr_speech');
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
   
    res.redirect('/empowerMgr_volunTrain');
  });

}
exports.postRemoveTalentTrain  = function(req, res, next) {

  TalentTrain.remove({ _id: req.params.id }, function(err) {
    if (err) {
      return next(err);
    }
   
    res.redirect('/empowerMgr_talentTrain');
  });

}
exports.postRemoveSpeech  = function(req, res, next) {

  Speech.remove({ _id: req.params.id }, function(err) {
    if (err) {
      return next(err);
    }
   
    res.redirect('/empowerMgr_speech');
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
   
    res.redirect('/empowerMgr_mentor');
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
exports.getVolunXLSX = function(req, res, next) {
  
  VolunForm.find({},function(err, allVoluns) {
      if (err) {
        return next(err);
      }
      var xlsxFilename = Date.now()+"_志工資料.xlsx";
      var xlsxFilePath = "./public/xlsx_data/"+xlsxFilename;
      saveVolunXLSX(allVoluns, xlsxFilePath, function(){
          res.download(xlsxFilePath);
      });
      
  });
  
};
exports.getServiceXLSX = function(req, res, next) {
  
  OrgForm.find({},function(err, allServices) {
      if (err) {
        return next(err);
      }
      var xlsxFilename = Date.now()+"_服務列表.xlsx";
      var xlsxFilePath = "./public/xlsx_data/"+xlsxFilename;
      saveServiceXLSX(allServices, xlsxFilePath, function(){
          res.download(xlsxFilePath);
      });
      
  });
  
};
function saveServiceXLSX(data, filepath, callback){
      console.log("xlsx saving..."+filepath);

      var workbook = new xlsx.Workbook();
      var sheet = workbook.addWorksheet("服務列表");
      var tmpMatch;
      // console.log("xlsx1");
      var tmpColumns = [
              { header: "編號", key: "uid", width: 26 },
              { header: "機構名", key: "name", width: 26 },
              { header: "Email", key: "email", width: 23 },
              { header: "發布時間", key: "gender", width: 41 },
              { header: "服務名稱", key: "location", width: 27 },
              { header: "服務簡述", key: "month", width: 25 }, 
              { header: "服務網站", key: "date", width: 36 },
              { header: "服務日期", key: "role", width: 27 },
              { header: "服務時間", key: "role_text", width: 16 },
              { header: "地點", key: "order", width: 30 },
              { header: "時數", key: "user", width: 6 },
              { header: "服務內容", key: "msg", width: 30 },
              { header: "服務類型", key: "sentiment", width: 26 },
              { header: "志工需求數量", key: "comments", width: 14 },
              { header: "志工條件", key: "like", width: 22 },
              { header: "供餐", key: "ability", width: 6 },
              { header: "志工保險", key: "service_type", width: 18 },
              { header: "志工證明", key: "time", width: 12 },
              { header: "志工補貼", key: "timesOfView", width: 12 },     
              { header: "行前培訓", key: "pre_train", width: 13 },
              { header: "培訓日期", key: "pre_train_date", width: 26 },
              { header: "培訓時間", key: "pre_train_time", width: 26 },
              { header: "培訓地點", key: "pre_train_location", width: 26 },
              { header: "招募期限", key: "recruit_deadline", width: 15 },
              { header: "通知方式", key: "howToInform", width: 16 },
              { header: "其他資訊", key: "others", width: 26 },
              { header: "聯絡人", key: "contact", width: 14 },
              { header: "聯絡人職稱", key: "contact_job", width: 14 },
              { header: "聯絡人手機", key: "contact_phone", width: 13 },
              { header: "聯絡人email", key: "contact_email", width: 19 },
              { header: "是否已結案", key: "hasCompleted", width: 14 },
              { header: "已應徵人數", key: "applyArr_num", width: 15 },
              { header: "應徵者姓名", key: "applyArr_name", width: 50 },
              { header: "被點閱數", key: "timesOfView", width: 15 },
            ];
      // console.log(sheet.columns);
      sheet.columns = tmpColumns;
      // console.log("xlsx2");
       // console.log(sheet.columns);
      async.forEachOf(data, function (eachData, eachIndex, data_callback) {
        // var tmpMoment = moment(eachData.created_time);
          var rowTobeAdd = [          
                      eachData.uid?eachData.uid:"無",
                      eachData.uname?eachData.uname:"無",
                      eachData.email?eachData.email:"無",
                      eachData.timestamp?eachData.timestamp:"無",
                      eachData.activity_name?eachData.activity_name:"無",
                      eachData.activity_abstract?eachData.activity_abstract:"無",
                      eachData.activity_website?eachData.activity_website:"無",
                      eachData.service_date_since?(eachData.service_date_until?eachData.service_date_since+"-"+eachData.service_date_until:"無"):"無",
                      eachData.service_time_since?(eachData.service_time_until?eachData.service_time_since+"-"+eachData.service_time_until:"無"):"無",
                      eachData.service_location?eachData.service_location:"無",
                      eachData.service_hours?eachData.service_hours:"無",
                      eachData.service_content?eachData.service_content:"無",
                      eachData.service_type.join(",")?eachData.service_type.join(","):"無",
                      eachData.volunNum?eachData.volunNum:"無",
                      eachData.volunConditions.join(",")?eachData.volunConditions.join(","):"無",
                      eachData.hasFood?eachData.hasFood:"無",
                      eachData.volunInsurance.join(",")?eachData.volunInsurance.join(","):"無",
                      eachData.volunLisence?(eachData.volunLisence=='n'?"否":"是"):"無",
                      eachData.volunSubsidy?(eachData.volunSubsidy=='n'?"否":"是"):"無",
                      eachData.pre_train?(eachData.pre_train=='n'?"否":"是"):"無",
                      eachData.pre_train_date_since?(eachData.pre_train_date_until?eachData.pre_train_date_since+"-"+eachData.pre_train_date_until:"無"):"無",
                      eachData.pre_train_time_since?(eachData.pre_train_time_until?eachData.pre_train_time_since+"-"+eachData.pre_train_time_until:"無"):"無",
                      eachData.pre_train_location?eachData.pre_train_location:"無",
                      eachData.recruit_deadline?eachData.recruit_deadline:"無",
                      eachData.howToInform.join(",")?eachData.howToInform.join(","):"無",
                      eachData.otherInfo?eachData.otherInfo:"無",
                      eachData.contact_person?eachData.contact_person:"無",
                      eachData.contact_job_title?eachData.contact_job_title:"無",
                      eachData.contact_phone?eachData.contact_phone:"無",
                      eachData.contact_email?eachData.contact_email:"無",
                      eachData.hasCompleted?eachData.hasCompleted:"無",
                      eachData.applyArr.join(",")?eachData.applyArr.length:0,
                      eachData.applyArr.join(",")?eachData.applyArr.map(function(obj){
                        return obj.uname;
                      }).join(","):"無",
                      eachData.timesOfView?eachData.timesOfView:0,
                   ];
        // console.log("xlsx3_"+eachIndex);
        // console.log(rowTobeAdd);
        sheet.addRow(rowTobeAdd).commit();
        data_callback();
        
      }, function (err) {
      if (err) console.error(err.message); 
      // Finished the workbook.
      // workbook.commit();
     // sheet.commit();
     // console.log("xlsx4");
      workbook.xlsx.writeFile(filepath)
        .then(function() {
          data.length=0;
          var nameVal = filepath.split('/');
          // console.log("xlsx5");
          // console.log(nameVal[nameVal.length-2]+'/'+nameVal[nameVal.length-1]);
            callback({source: filepath, target: nameVal[nameVal.length-1]});

        });

    });    
   
      
}
function saveVolunXLSX(data, filepath, callback){
      console.log("xlsx saving..."+filepath);

      var workbook = new xlsx.Workbook();
      var sheet = workbook.addWorksheet("志工列表");
      var tmpMatch;
      // console.log("xlsx1");
      var tmpColumns = [
              { header: "編號", key: "uid", width: 26 },
              { header: "姓名", key: "name", width: 12 },
              { header: "性別", key: "gender", width: 7 },
              { header: "居住縣市/鄉鎮區", key: "location", width: 12 },
              { header: "Email", key: "email", width: 23 },
              { header: "身份證字號", key: "month", width: 14 }, 
              { header: "出生年月日", key: "date", width: 15 },
              { header: "身份別", key: "role", width: 12 },
              { header: "身份", key: "role_text", width: 20 },
              { header: "室內電話", key: "order", width: 20 },
              { header: "手機電話", key: "user", width: 20 },
              { header: "自備交通工具", key: "msg", width: 19 },
              { header: "語言", key: "sentiment", width: 20 },
              { header: "已完成志工基礎訓練", key: "comments", width: 22 },
              { header: "需要服務學習證明", key: "like", width: 22 },
              //
              { header: "志工專長-電腦", key: "ability", width: 25 },
              { header: "志工專長-活動", key: "ability", width: 25 },
              { header: "志工專長-影像", key: "ability", width: 25 },
              { header: "志工專長-教學", key: "ability", width: 25 },
              { header: "志工專長-設計", key: "ability", width: 25 },
              { header: "志工專長-技藝", key: "ability", width: 25 },
              { header: "志工專長-證照", key: "ability", width: 25 },
              { header: "志工專長-其他", key: "ability", width: 25 },
              //
              { header: "志願服務", key: "service_type", width: 40 },
              //
              { header: "可服務時段", key: "time", width: 45 },
              //
              { header: "被點擊數", key: "timesOfView", width: 18 },
              { header: "申請機構_ID", key: "applyIdArr", width: 26 },
              { header: "申請機構_名稱", key: "applyNameArr", width: 26 },
            ];
      // console.log(sheet.columns);
      sheet.columns = tmpColumns;
      // console.log("xlsx2");
       // console.log(sheet.columns);
      async.forEachOf(data, function (eachData, eachIndex, data_callback) {
        // var tmpMoment = moment(eachData.created_time);
          var rowTobeAdd = [
                    eachData.uid,
                    eachData.name,
                    eachData.gender?eachData.gender:"無",
                    eachData.location?eachData.location:"無",
                    eachData.email?eachData.email:"無",
                    eachData.idcode?eachData.idcode:"無",
                    eachData.birth?eachData.birth:"無",
                    eachData.role?eachData.role:"無",
                    eachData.role_text?eachData.role_text:"無",
                    eachData.callnumber?eachData.callnumber:"無",
                    eachData.phonenumber?eachData.phonenumber:"無",
                    eachData.transportation?eachData.transportation:"無",
                    eachData.speak.join(",")?eachData.speak.join(","):"無",
                    eachData.hasTrain?(eachData.hasTrain=='f'?"否":"是"):"無",
                    eachData.needProof?(eachData.needProof=='f'?"否":"是"):"無",
                    eachData.ability_computer.join(",")?eachData.ability_computer.join(","):"無",
                    eachData.ability_activity.join(",")?eachData.ability_activity.join(","):"無",
                    eachData.ability_photo.join(",")?eachData.ability_photo.join(","):"無",
                    eachData.ability_teach.join(",")?eachData.ability_teach.join(","):"無",
                    eachData.ability_design.join(",")?eachData.ability_design.join(","):"無",
                    eachData.ability_skill.join(",")?eachData.ability_skill.join(","):"無",
                    eachData.ability_license.join(",")?eachData.ability_license.join(","):"無",
                    eachData.ability_other?eachData.ability_other:"無",
                    eachData.service_type.join(",")?eachData.service_type.join(","):"無",
                    eachData.time.join(",")?eachData.time.join(","):"無",
                    eachData.timesOfView?eachData.timesOfView:"無",
                    eachData.applyIdArr.join(",")?eachData.applyIdArr.join(","):"無",
                    eachData.applyNameArr.join(",")?eachData.applyNameArr.join(","):"無",
                   ];
        // console.log("xlsx3_"+eachIndex);
        // console.log(rowTobeAdd);
        sheet.addRow(rowTobeAdd).commit();
        data_callback();
        
      }, function (err) {
      if (err) console.error(err.message); 
      // Finished the workbook.
      // workbook.commit();
     // sheet.commit();
     // console.log("xlsx4");
      workbook.xlsx.writeFile(filepath)
        .then(function() {
          data.length=0;
          var nameVal = filepath.split('/');
          // console.log("xlsx5");
          // console.log(nameVal[nameVal.length-2]+'/'+nameVal[nameVal.length-1]);
            callback({source: filepath, target: nameVal[nameVal.length-1]});

        });

    });    
   
      
}