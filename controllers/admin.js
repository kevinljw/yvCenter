var VolunForm = require('../models/VolunForm');
var User = require('../models/User');
var passport = require('passport');
var OrgForm = require('../models/OrgForm');
var LocalResources = require('../models/LocalResources');
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
  res.render('admin/home', {
    title: '管理中心'
  });
};
exports.getGhostAdmin = function(req, res) {
  res.render('admin/ghost', {
    title: '文章管理'
  });
};
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
exports.getLocalMgr = function(req, res) {
  LocalResources.find({},function(err, allResources) {
      if (err) {
        return next(err);
      }
      res.render('admin/localMgr', {
        title: '在地好資源',
        allResources: allResources
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
      phone: req.body.phone || '',
      abstract: req.body.abstract || '',
      link: req.body.link || ''
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