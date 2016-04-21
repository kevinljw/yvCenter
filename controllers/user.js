var _ = require('lodash');
var async = require('async');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport('smtps://'+process.env.GOOGLE_MAIL_USER+':'+process.env.GOOGLE_MAIL_PASSWORD+'@'+process.env.GOOGLE_MAIL_SERVER);
var passport = require('passport');
var User = require('../models/User');
var secrets = require('../config/secrets');
var adminArr = secrets.admin.whitelist;
var emailSender = require('./emailSender');
/**
 * GET /login
 * Login page.
 */
exports.getLogin = function(req, res) {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/login', {
    title: 'Login'
  });
};

/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = function(req, res, next) {
  req.assert('email', 'Email 錯誤').isEmail();
  req.assert('password', '密碼不得為空').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/youth/bevo#loginFormatErr');
  }

  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user || user.IsOrg) {
      req.flash('errors', { msg: '錯誤，不存在此帳號' });
      return res.redirect('/youth/bevo#loginErr');
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      req.flash('success', { msg: 'Success! You are logged in.' });
      res.redirect('/youth/bevo#login');
    });
  })(req, res, next);
};
/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLoginOrg = function(req, res, next) {
  req.assert('email', 'Email 錯誤').isEmail();
  req.assert('password', '密碼不得為空').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/youth/findvo#loginFormatErr');
  }

  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    // console.log(user);
    if (!user || !user.IsOrg) {

      req.flash('errors', { msg: '錯誤，不存在此帳號' });
      return res.redirect('/youth/findvo#loginErr');
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      req.flash('success', { msg: 'Success! You are logged in.' });
      res.redirect('/youth/findvo#login');
    });
  })(req, res, next);
};

/**
 * GET /logout
 * Log out.
 */
exports.logout = function(req, res) {
  req.logout();
  res.redirect('/youth/bevo#login');
};
exports.logoutOrg = function(req, res) {
  req.logout();
  res.redirect('/youth/findvo#login');
};
/**
 * GET /signup
 * Signup page.
 */
exports.getSignup = function(req, res) {
  if (req.user) {
    return res.redirect('/');
  }
  res.render('account/signup', {
    title: 'Create Account'
  });
};

/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = function(req, res, next) {
  req.assert('email', 'Email 格式錯誤').isEmail();
  req.assert('password', '密碼須至少4位').len(4);
  req.assert('confirmPassword', '確認密碼兩者不相符').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);

    return res.redirect('/youth/bevo#signup');
  }

  var user = new User({
    email: req.body.email,
    profile: {name: req.body.name},
    password: req.body.password
  });
  if(adminArr.indexOf(req.body.email)>-1) user.IsAdmin =true;

  User.findOne({ email: req.body.email }, function(err, existingUser) {
    if (existingUser) {
      req.flash('errors', { msg: '此 email 之使用者已存在。' });
      return res.redirect('/youth/bevo#exists');
    }
    user.save(function(err) {
      if (err) {
        return next(err);
      }
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        res.redirect('/youth/bevo#signin');
      });
    });
  });
};
/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignupOrg = function(req, res, next) {
  req.assert('email', 'Email 格式錯誤').isEmail();
  req.assert('name', '機構名不得為空').len(1);
  req.assert('location', '地址不得為空').len(1);
  req.assert('website', '網站不得為空').len(1);
  req.assert('contact', '聯絡人不得為空').len(1);
  req.assert('phone', '電話不得為空').len(1);  
  req.assert('password', '密碼須至少4位').len(4);
  req.assert('confirmPassword', '確認密碼兩者不相符').equals(req.body.password);

  var errors = req.validationErrors();

  
  if (errors) {
    req.flash('errors', errors);

    return res.redirect('/youth/findvo#signup');
  }

  var user = new User({
    email: req.body.email,
    IsOrg: true,
    profile: {
      name: req.body.name,
      website: req.body.website,
      location: req.body.location,
      abstract: req.body.abstract,
      phone: req.body.phone,
      contact: req.body.contact
    },
    password: req.body.password,
    
  });
  if(adminArr.indexOf(req.body.email)>-1) user.IsAdmin =true;

  User.findOne({ email: req.body.email }, function(err, existingUser) {
    if (existingUser) {
      req.flash('errors', { msg: '此 email 之使用者已存在。' });
      return res.redirect('/youth/findvo#exists');
    }
    User.find({ IsAdmin: true }, function(err, allAdminUsers) {
      if (!err) {
        allAdminUsers.forEach(function(eachAdmin){
          emailSender.sendOrgValidationEmail(eachAdmin.profile.name, eachAdmin.email, req.body.name);
        });
      }
    });
    
    user.save(function(err) {
      if (err) {
        return next(err);
      }
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        res.redirect('/youth/findvo#signin');
      });
    });
  });
};
/**
 * GET /account
 * Profile page.
 */
exports.getAccount = function(req, res) {
  res.render('account/profile', {
    title: 'Account Management'
  });
};

/**
 * POST /account/profile
 * Update profile information.
 */
exports.postUpdateProfile = function(req, res, next) {
  User.findById(req.user.id, function(err, user) {
    if (err) {
      return next(err);
    }
    user.email = req.body.email || '';
    user.profile.name = req.body.name || '';
    user.profile.gender = req.body.gender || '';
    user.profile.location = req.body.location || '';
    user.profile.website = req.body.website || '';
    user.profile.contact = req.body.contact || '';
    user.profile.phone = req.body.phone || '';
    if(req.file && req.file.filename) user.profile.picture = '/uploads/profile/'+req.file.filename || user.profile.picture;

    user.save(function(err) {
      if (err) {
        return next(err);
      }
      req.flash('success', { msg: '個人資料已更新' });
      if(user.IsOrg){
        res.redirect('/youth/findvo');
      }
      else{
        res.redirect('/youth/bevo');
      }
    });
  });
};

/**
 * POST /account/password
 * Update current password.
 */
exports.postUpdatePassword = function(req, res, next) {
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/account');
  }

  User.findById(req.user.id, function(err, user) {
    if (err) {
      return next(err);
    }
    user.password = req.body.password;
    user.save(function(err) {
      if (err) {
        return next(err);
      }
      req.flash('success', { msg: '密碼已變更成功' });
      res.redirect('/youth/bevo');
    });
  });
};

/**
 * POST /account/delete
 * Delete user account.
 */
exports.postDeleteAccount = function(req, res, next) {
  User.remove({ _id: req.user.id }, function(err) {
    if (err) {
      return next(err);
    }
    req.logout();
    req.flash('info', { msg: '您的帳號已從此平台刪除成功' });
    res.redirect('/youth/bevo');
  });
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
exports.getOauthUnlink = function(req, res, next) {
  var provider = req.params.provider;
  User.findById(req.user.id, function(err, user) {
    if (err) {
      return next(err);
    }
    user[provider] = undefined;
    user.tokens = _.reject(user.tokens, function(token) { return token.kind === provider; });
    user.save(function(err) {
      if (err) return next(err);
      req.flash('info', { msg: provider + ' account has been unlinked.' });
      res.redirect('/youth/bevo');
    });
  });
};

/**
 * GET /reset/:token
 * Reset Password page.
 */
exports.getReset = function(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  User
    .findOne({ resetPasswordToken: req.params.token })
    .where('resetPasswordExpires').gt(Date.now())
    .exec(function(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
        return res.redirect('/forgot');
      }
      res.render('account/reset', {
        title: 'Password Reset'
      });
    });
};

/**
 * POST /reset/:token
 * Process the reset password request.
 */
exports.postReset = function(req, res, next) {
  req.assert('password', 'Password must be at least 4 characters long.').len(4);
  req.assert('confirm', 'Passwords must match.').equals(req.body.password);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('back');
  }

  async.waterfall([
    function(done) {
      User
        .findOne({ resetPasswordToken: req.params.token })
        .where('resetPasswordExpires').gt(Date.now())
        .exec(function(err, user) {
          if (err) {
            return next(err);
          }
          if (!user) {
            req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
            return res.redirect('back');
          }
          user.password = req.body.password;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;
          user.save(function(err) {
            if (err) {
              return next(err);
            }
            req.logIn(user, function(err) {
              done(err, user);
            });
          });
        });
    },
    function(user, done) {
      eMai({
        targetEmail: user.email,
        targetUserName: user.profile.name,
        titleSub: '密碼變更通知',
        content: '您在志工中心的密碼在不久前已變更完成，若正確請忽略此信，若有問題請至網站聯絡志工中心：',
        link: 'http://tkkyvc.org.tw/'
      }, function(err) {
        req.flash('success', { msg: 'Success! Your password has been changed.' });
        done(err);
      });
      // var mailOptions = {
      //   to: user.email,
      //   from: 'hackathon@starter.com',
      //   subject: 'Your Hackathon Starter password has been changed',
      //   text: 'Hello,\n\n' +
      //     'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      // };
      // transporter.sendMail(mailOptions, function(err) {
      //   req.flash('success', { msg: 'Success! Your password has been changed.' });
      //   done(err);
      // });
    }
  ], function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};

/**
 * GET /forgot
 * Forgot Password page.
 */
exports.getForgot = function(req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('account/forgot', {
    title: 'Forgot Password'
  });
};

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
exports.postForgot = function(req, res, next) {
  req.assert('email', 'Please enter a valid email address.').isEmail();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/forgot');
  }

  async.waterfall([
    function(done) {
      crypto.randomBytes(16, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email.toLowerCase() }, function(err, user) {
        if (!user) {
          req.flash('errors', { msg: 'No account with that email address exists.' });
          return res.redirect('/forgot');
        }
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      eMai({
        targetEmail: user.email,
        targetUserName: user.profile.name,
        titleSub: '重新設置您的密碼',
        content: '您收到此封郵件，因為您提出重新設置您在北基金志工中心密碼的要求(若沒有，則請忽略)。\n\n請按以下連結前往變更您的密碼：',
        link: 'http://' + req.headers.host + '/reset/' + token
      }, function(err) {
        req.flash('info', { msg: 'An e-mail has been sent to ' + user.email + ' with further instructions.' });
        done(err);
      });
      // var mailOptions = {
      //   to: user.email,
      //   from: 'hackathon@starter.com',
      //   subject: 'Reset your password on Hackathon Starter',
      //   text: 'You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n' +
      //     'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
      //     'http://' + req.headers.host + '/reset/' + token + '\n\n' +
      //     'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      // };
      // transporter.sendMail(mailOptions, function(err) {
      //   req.flash('info', { msg: 'An e-mail has been sent to ' + user.email + ' with further instructions.' });
      //   done(err, 'done');
      // });
    }
  ], function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/forgot');
  });
};

function eMai(sMyJSON, callback){
  
  // Message object
  var message = {

      // sender info
      from: '北基金青年志工中心 <tkkyvc@gmail.com>',

      // Comma separated list of recipients
      to: sMyJSON.targetEmail,

      // Subject of the message
      subject: sMyJSON.titleSub, //

      headers: {
        'X-Laziness-level': 1000
      },

      // plaintext body
      text: 'tkkyvc',

      // HTML body
      html: '<div bgcolor="#EEEEEE" style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;color:#565a5c;min-height:100%;background-color:#f7f7f7;font-size:16px;line-height:150%;width:100%!important">\
<div style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;width:0;min-height:0;color:transparent;display:none!important"></div>\
<table style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;line-height:150%;border-spacing:0;background-color:#f7f7f7;width:100%">\
<tbody><tr style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif">\
<td style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif"></td>\
<td style="padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;display:block!important;margin:0 auto!important;clear:both!important;max-width:610px!important">\
<div style="font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;padding:15px;max-width:600px;display:block;margin:0 auto;padding-left:5px;padding-right:5px;padding-bottom:5px;padding-top:0px">\
<table style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;line-height:150%;border-spacing:0;margin-bottom:10px;margin-top:10px;width:100%">\
<tbody><tr style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif">\
<td style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif"></td>\
<td style="padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;display:block!important;margin:0 auto!important;clear:both!important;max-width:610px!important">\
<div style="font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;padding:15px;max-width:600px;display:block;margin:0 auto;padding-left:5px;padding-right:5px;padding-bottom:5px;padding-top:0px">\
<table style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;border-spacing:0;line-height:150%;width:100%">\
<tbody><tr style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif">\
<td style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;text-align:center">\
<a href="http://tkkyvc.org.tw" title="北基金青年志工中心" style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;color:#ff5a5f;text-decoration:none" target="_blank">\
<img src="http://tkkyvc.org.tw/img/yvcLogo.png" border="0" alt="北基金青年志工中心" width="123" height="123" style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;max-width:100%;border:0">\
</a>\
</td>\
</tr>\
</tbody></table>\
</div>\
</td>\
<td style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif"></td>\
</tr>\
</tbody></table>\
<div style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif">\
<div style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif">\
'+sMyJSON.targetUserName+'，您好：\
</div>\
<div style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;margin-top:1em">\
'+sMyJSON.content+'\
</div>\
<div style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;margin-top:1em">\
<a href="'+sMyJSON.link+'" style="margin:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;border:1px solid;display:block;padding:10px 16px;text-decoration:none;border-radius:2px;text-align:center;vertical-align:middle;font-weight:bold;white-space:nowrap;background:#ffffff;border-color:#F3BB45;background-color:#F3BB45;color:#ffffff;border-top-width:1px" target="_blank">\
前往\
</a>\
</div>\
<div style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;margin-top:1em">\
謝謝！ <br style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif">北基金志工中心 團隊\
</div>\
<div style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;color:#eeeeee;font-size:1px;min-height:1px;line-height:1px">2015-09-18 18:19:24 +0000</div>\
</div>\
<br style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif"><br style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif">\
</div>\
</td>\
<td style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif"></td>\
</tr>\
<tr style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif">\
<td style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif"></td>\
<td style="padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;display:block!important;margin:0 auto!important;clear:both!important;max-width:610px!important">\
<div style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif">\
<div style="font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;max-width:600px;padding:15px;margin:0 auto;display:block;padding-bottom:5px;padding-top:0px;color:#9ca299;font-size:14px;text-align:center;padding-left:5px;padding-right:5px">\
<table cellpadding="10" style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;border-spacing:0;line-height:150%;width:100%;padding:10px">\
<tbody><tr style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif">\
<td align="center" style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif">\
<table cellpadding="5" style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;border-spacing:0;line-height:150%;width:100%;width:auto">\
<tbody><tr style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif">\
<td style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;padding:5px">\
<a href="https://www.facebook.com/pkkvolunteer/" title="Facebook" style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;color:#ff5a5f;text-decoration:none" target="_blank">\
<img alt="Facebook" height="42" src="https://ci5.googleusercontent.com/proxy/J93KSR75YSSwYTGKthe3XskWGErWPvIBoPCfnHxG0l30T3kdR-udXm46snmIg6mqv4dX4a4yWeFsk5YaB_nTzbHnJtoVEPCKS9gU8zc_qbcgqmTc6Wwp-OzFxKtykhQoIVtfm1FGT_tYUMmvlhR2Iz3-ssDid9k=s0-d-e1-ft#https://a1.muscache.com/airbnb/rookery/email/footer/facebook-942db036304a4d7531bd634125b0ed95.png" width="42" style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;max-width:100%;border:0">\
</a> </td>\
</tr>\
</tbody></table>\
</td>\
</tr>\
</tbody></table>\
<table style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;border-spacing:0;line-height:150%;width:100%">\
<tbody><tr style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif">\
<td style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif"></td>\
<td style="padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;display:block!important;margin:0 auto!important;clear:both!important;max-width:610px!important">\
<div style="font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;padding:15px;max-width:600px;margin:0 auto;display:block;padding-left:5px;padding-right:5px;padding-bottom:5px;padding-top:0px;color:#9ca299;font-size:14px;text-align:center">\
由北基金青年志工中心系統發送<br style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif">\
請勿回覆此信\
</div>\
</td>\
<td style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif"></td>\
</tr>\
</tbody></table>\
</div>\
<div style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;color:#eeeeee;font-size:1px;min-height:1px;line-height:1px">2015-09-18 18:19:24 +0000</div>\
</div>\
<br style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif"><br style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif">\
</td>\
<td style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif"></td>\
</tr>\
</tbody></table>\
<span style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;font-size:1px!important;color:#eeeeee!important">### 北基金青年志工中心 ###</span>\
</div>'

  };

  transporter.sendMail(message, function(error, info) {
    if (error) {
        console.log('Error occurred');
        console.log(error.message);
        callback(error);
    }
    else{
      callback(error);
      console.log('Message sent successfully!->['+sMyJSON.titleSub+'] Send to: '+sMyJSON.targetUserName+', email:'+sMyJSON.targetEmail);
      console.log('Server responded with %s', info.response);
    }
  });
    
}
