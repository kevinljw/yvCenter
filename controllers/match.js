var VolunForm = require('../models/VolunForm');
var OrgForm = require('../models/OrgForm');
var User = require('../models/User');
var nodemailer= require('nodemailer');
var moment = require('moment');

var transporter = nodemailer.createTransport('smtps://'+process.env.GOOGLE_MAIL_USER+':'+process.env.GOOGLE_MAIL_PASSWORD+'@'+process.env.GOOGLE_MAIL_SERVER);

// sendOrgValidationEmail();

function sendOrgValidationEmail(){
  eMai({
    targetEmail: 'crawljw@gmail.com',
    targetUserName: 'KevinLJW',
    titleSub: '機構送交審核通知',
    org: 'informaship'
  });
}

/**GOOGLE_MAIL_PASSWORD+'@'+
 * GET /about
 * About page.
 */
exports.getLookupVolunInfo = function(req, res, next) {
  console.log(req.params.oid, req.params.uid);
  OrgForm.findById(req.params.oid, function(err, existForm) {
    if (err) {
      return next(err);
    }
    if(existForm){
      existForm.timesOfView += 1;
      // console.log(existForm.timesOfView);
      existForm.save(function(err) {
        if (err) {
          return next(err);
        }
      });
    }
    else{
      console.log("can't find: "+existForm.timesOfView);
    }
  });
  VolunForm.findOne({uid:req.params.uid}, function(err, existingUser) {
    if (err) {
      return next(err);
    }

    if(existingUser){
      existingUser.timesOfView+=1;
      // console.log(existingUser.timesOfView);
      existingUser.save(function(err) {
        if (err) {
          return next(err);
        }
        res.render('voluninfo', {
          title: '志工資訊',
          userInfo: existingUser
        });
      });
      
    }
    else{
      res.render('voluninfo', {
        title: '志工資訊',
        
      });
    }

  });
};
exports.postForm = function(req, res) {
  // console.log(req.params.id);
  // console.log(req.body);
  VolunForm.findOne({uid:req.user.id}, function(err, existingUser) {
    if (err) {
      return next(err);
    }
    if(existingUser){
      existingUser.name= req.body.name || existingUser.name;
      existingUser.gender= req.body.gender || existingUser.gender;
      existingUser.location= req.body.location || existingUser.location;
      existingUser.email= req.body.email || existingUser.email;
      existingUser.idcode= req.body.idcode || existingUser.idcode;
      existingUser.birth= req.body.birth || existingUser.birth;
      existingUser.role= req.body.role || existingUser.role;
      existingUser.role_text= req.body.role_text[existingUser.role=='在學學生'?0:(existingUser.role=='社會人士'?1:2)] || existingUser.role_text;
      existingUser.transportation=req.body.transportation || existingUser.transportation;
      existingUser.callnumber= req.body.callnumber || existingUser.callnumber;
      existingUser.phonenumber= req.body.phonenumber || existingUser.phonenumber;
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
      
        req.flash('success', { msg: '表單修改成功。' });
        res.redirect('/youth/bevo#formDone');
      });
    }
    else{

      var vForm = new VolunForm({
        uid: req.user.id,
        name: req.body.name || '',
        gender: req.body.gender || '',
        location: req.body.location || '',
        email: req.body.email || '',
        idcode: req.body.idcode || '',
        birth: req.body.birth || '',
        role: req.body.role || '',
        role_text: req.body.role_text[req.body.role=='student'?0:(req.body.role=='worker'?1:2)] || '',
        callnumber: req.body.callnumber || '',
        phonenumber: req.body.phonenumber || '',
        speak: req.body.speak || [],
        hasTrain: req.body.hasTrain || '',
        needProof: req.body.needProof || '',
        ability_computer: req.body.ability_computer || [],
        ability_activity: req.body.ability_activity || [],
        ability_photo: req.body.ability_photo || [],
        ability_teach: req.body.ability_teach || [],
        ability_design: req.body.ability_design || [],
        ability_skill: req.body.ability_skill || [],
        ability_license: req.body.ability_license || [],
        ability_other: req.body.ability_other || [],
        service_type: req.body.service_type || [],
        time: req.body.time || [],
      });
      
      vForm.save(function(err) {
        if (err) {
          return next(err);
        }
        User.findById(req.user.id, function(err, thisUser) {
          if (err) {
            return next(err);
          }
          thisUser.IsVolunform = true;
          thisUser.save(function(err) {
            if (err) {
              return next(err);
            }
          });
        });
        
        req.flash('success', { msg: '表單送出成功。' });
        res.redirect('/youth/bevo#formDone');
      });

    }
    
  });
  
};

exports.postApplyJob = function(req, res, next) {
 
  var applyJobArr = (typeof req.body.applyJob === 'string')?[req.body.applyJob]:req.body.applyJob;

  VolunForm.findOne({uid:req.user.id}, function(err, thisForm) {
    if (err) {
      return next(err);
    }
    if(thisForm){
      thisForm.applyIdArr = applyJobArr;
      var applyNameArrTmp = [];
      // thisForm.applyNameArr=[];
      thisForm.save(function(err) {
        if (err) {
          return next(err);
        }
      });
      applyJobArr.forEach(function(eachOrgId,indexOrg){

          OrgForm.findById(eachOrgId, function(err, thisOrg) {
            if (err) {
              return next(err);
            }
            
            applyNameArrTmp.push(thisOrg.uname+':'+thisOrg.activity_name);
            
            if(thisOrg.applyIdArr.indexOf(req.user.id)<0){

              var eachItem = {
                "uid": req.user.id,
                "uname": thisForm.name,
                "gender": thisForm.gender,
                "location": thisForm.location,
                "role": thisForm.role,
                "hasTrain": thisForm.hasTrain,
                "timestamp": moment().format("YYYY-MM-DD HH:mm:ss")
              };
              

              thisOrg.applyArr.push(eachItem);
              thisOrg.applyIdArr.push(req.user.id);
              
              thisOrg.save(function(err) {
                if (err) {
                  return next(err);
                }

              });
            }
            if(indexOrg>=applyJobArr.length-1){
              thisForm.applyNameArr=applyNameArrTmp;
              thisForm.save(function(err) {
                if (err) {
                  return next(err);
                }
              });
            }
          });

      });

      
      // console.log(thisForm.applyNameArr);
      
      req.flash('success', { msg: ' 志工申請送出成功。' });
    }
    else{
      req.flash('errors', { msg: ' 尚未填寫服務青表單' });
    }
    res.redirect('/youth/bevo#applyDone');
  });
};
exports.postEditOrgForm = function(req, res) {
  // console.log(req.params.id);
  // console.log(req.body);
  OrgForm.findById(req.params.id, function(err, existingUser) {
    if (err) {
      return next(err);
    }
    if(existingUser){
      existingUser.uname= req.body.uname || existingUser.uname;
      existingUser.activity_name= req.body.activity_name || existingUser.activity_name;
      existingUser.activity_abstract= req.body.activity_abstract || existingUser.activity_abstract;
      existingUser.activity_website= req.body.activity_website || existingUser.activity_website;
      existingUser.service_date_since = req.body.service_date_since || existingUser.service_date_since ;
      existingUser.service_date_until = req.body.service_date_until || existingUser.service_date_until ;
      existingUser.service_time_since = req.body.service_time_since || existingUser.service_time_since ;
      existingUser.service_time_until = req.body.service_time_until || existingUser.service_time_until ;
      existingUser.service_location = req.body.service_location || existingUser.service_location ;
      existingUser.service_hours = req.body.service_hours || existingUser.service_hours ;
      existingUser.service_content = req.body.service_content || existingUser.service_content ;
      existingUser.service_type = req.body.service_type || existingUser.service_type ;
      existingUser.volunNum = req.body.volunNum || existingUser.volunNum;
      existingUser.volunConditions = req.body.volunConditions || existingUser.volunConditions ;
      existingUser.hasFood = req.body.hasFood || existingUser.hasFood ;
      existingUser.volunInsurance = req.body.volunInsurance || existingUser.volunInsurance ;
      existingUser.volunLisence = req.body.volunLisence || existingUser.volunLisence ;
      existingUser.volunSubsidy = req.body.volunSubsidy || existingUser.volunSubsidy ;
      existingUser.pre_train = req.body.pre_train || existingUser.pre_train ;
      existingUser.pre_train_date_since = req.body.pre_train_date_since || existingUser.pre_train_date_since ;
      existingUser.pre_train_date_until = req.body.pre_train_date_until || existingUser.pre_train_date_until ;
      existingUser.pre_train_time_since = req.body.pre_train_time_since || existingUser.pre_train_time_since ;
      existingUser.pre_train_time_until = req.body.pre_train_time_until || existingUser.pre_train_time_until ;
      existingUser.pre_train_location = req.body.pre_train_location || existingUser.pre_train_location ;
      existingUser.recruit_deadline = req.body.recruit_deadline || existingUser.recruit_deadline ;
      existingUser.howToInform = req.body.howToInform || existingUser.howToInform ;
      existingUser.otherInfo = req.body.otherInfo || existingUser.otherInfo ;
      existingUser.contact_person = req.body.contact_person || existingUser.contact_person ;
      existingUser.contact_job_title = req.body.contact_job_title || existingUser.contact_job_title ;
      existingUser.contact_phone = req.body.contact_phone || existingUser.contact_phone ;
      existingUser.contact_email = req.body.contact_email || existingUser.contact_email ;
      existingUser.hasCompleted = req.body.hasCompleted || existingUser.hasCompleted ;

      existingUser.save(function(err) {
        if (err) {
          return next(err);
        }
        // console.log(existingUser)
        req.flash('success', { msg: '表單修改成功。' });
        if(req.body.returnWhere=='服務管理'){
          res.redirect('/serviceMgr');
        }
        else{
          res.redirect('/youth/findvo#formDone');
        }
        
      });
    }
    else{
      req.flash('errors', { msg: '表單資料錯誤。' });
        res.redirect('/youth/findvo#errorForm');
    }
  });
};
exports.postOrgForm = function(req, res) {


      var oForm = new OrgForm({
        uid: req.user.id || '',
        uname: req.user.profile.name || '',
        timestamp: moment().format("YYYY-MM-DD HH:mm:ss") || '',
        activity_name: req.body.activity_name || '',
        activity_abstract: req.body.activity_abstract || '',
        activity_website: req.body.activity_website || '',
        service_date_since: req.body.service_date_since || '',
        service_date_until: req.body.service_date_until || '',
        service_time_since: req.body.service_time_since || '',
        service_time_until: req.body.service_time_until || '',
        service_location: req.body.service_location || '',
        service_hours: req.body.service_hours || 1,
        service_content: req.body.service_content || '',
        service_type: req.body.service_type || [],
        volunNum: req.body.volunNum || 1,
        volunConditions: req.body.volunConditions || [],
        hasFood: req.body.hasFood || '',
        volunInsurance: req.body.volunInsurance || [],
        volunLisence: req.body.volunLisence || '',
        volunSubsidy: req.body.volunSubsidy || '',
        pre_train: req.body.pre_train || '',
        pre_train_date_since: req.body.pre_train_date_since || '',
        pre_train_date_until: req.body.pre_train_date_until || '',
        pre_train_time_since: req.body.pre_train_time_since || '',
        pre_train_time_until: req.body.pre_train_time_until || '',
        pre_train_location: req.body.pre_train_location || '',
        recruit_deadline: req.body.recruit_deadline || '',
        howToInform: req.body.howToInform || [],
        otherInfo: req.body.otherInfo || '',
        contact_person: req.body.contact_person || '',
        contact_job_title: req.body.contact_job_title || '',
        contact_phone: req.body.contact_phone || '',
        contact_email: req.body.contact_email || '',
        
      });

       User.findById(req.user.id, function(err, thisUser) {
          if (err) {
            return next(err);
          }

          if(thisUser.IsOrgActivation){
              oForm.save(function(err) {
                if (err) {
                  return next(err);
                }
               
                req.flash('success', { msg: '表單送出成功。' });
                res.redirect('/youth/findvo#formDone');
              });

          }
          else{
            req.flash('errors', { msg: '錯誤，您的機構帳號尚未認證成功，請聯絡志工中心管理員' });
            res.redirect('/youth/findvo#ActivationErr');
          }
          
      });
    
  
};
function eMai(sMyJSON){
  
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
歡迎加入Airbnb！在開始使用Airbnb之前，<wbr>您必須先確認您的電子郵件地址。\
</div>\
<div style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;margin-top:1em">\
<a href="https://www.airbnb.com.tw/users/confirm_email?code=fe3b294a4a9d442f70ab78a61dff34d0&amp;eluid=0&amp;euid=9d673613-21dc-d9f4-62b5-ffd41845a774&amp;user_id=44515664" style="margin:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;border:1px solid;display:block;padding:10px 16px;text-decoration:none;border-radius:2px;text-align:center;vertical-align:middle;font-weight:bold;white-space:nowrap;background:#ffffff;border-color:#ff5a5f;background-color:#ff5a5f;color:#ffffff;border-top-width:1px" target="_blank">\
確認電子郵件地址\
</a>\
</div>\
<div style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;margin-top:1em">\
謝謝！ <br style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif">Airbnb團隊\
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
<a href="https://www.facebook.com/airbnb?eluid=2&amp;euid=9d673613-21dc-d9f4-62b5-ffd41845a774" title="Facebook" style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;color:#ff5a5f;text-decoration:none" target="_blank">\
<img alt="Facebook" height="42" src="https://ci5.googleusercontent.com/proxy/J93KSR75YSSwYTGKthe3XskWGErWPvIBoPCfnHxG0l30T3kdR-udXm46snmIg6mqv4dX4a4yWeFsk5YaB_nTzbHnJtoVEPCKS9gU8zc_qbcgqmTc6Wwp-OzFxKtykhQoIVtfm1FGT_tYUMmvlhR2Iz3-ssDid9k=s0-d-e1-ft#https://a1.muscache.com/airbnb/rookery/email/footer/facebook-942db036304a4d7531bd634125b0ed95.png" width="42" style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;max-width:100%;border:0">\
</a> </td>\
<td style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;padding:5px">\
<a href="https://twitter.com/airbnb?eluid=3&amp;euid=9d673613-21dc-d9f4-62b5-ffd41845a774" title="Twitter" style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;color:#ff5a5f;text-decoration:none" target="_blank">\
<img alt="Twitter" height="42" src="https://ci3.googleusercontent.com/proxy/uo0yrhda2c9LIyyQedfD_nOKxRmf7bOv6WPpvtOJrqlPNGYmd9UzzOoTv0XeCqxArx-inudUqLtsu7SMZdwoFXUuhQkNNi2h9_Zq6VhPAemsz_rwjFjl70nuJupp0aUl4RZ8Ywzlmdd1LBhoDpDYzfdCBaiC8Q=s0-d-e1-ft#https://a0.muscache.com/airbnb/rookery/email/footer/twitter-1b57cb4f627e51c567753c2b1d89bd9a.png" width="42" style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;max-width:100%;border:0">\
</a> </td>\
<td style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;padding:5px">\
<a href="https://instagram.com/airbnb?eluid=4&amp;euid=9d673613-21dc-d9f4-62b5-ffd41845a774" title="Instagram" style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;color:#ff5a5f;text-decoration:none" target="_blank">\
<img alt="Instagram" height="42" src="https://ci4.googleusercontent.com/proxy/mAXlr9PUeIYCDqOMzD5sVeC9gsz8J5spkawC5Gw8lQDkQGVYGsN9el6_05biRy-zn5CCxGkaZenwOLaUKFSDX8wQ-q6f_Z863W0VVrYySM-CzpqTz5RLiDBm86yxEqR4cRVZEclqFzEtyDXY7o3-TD2e1oYJ2bMY=s0-d-e1-ft#https://a1.muscache.com/airbnb/rookery/email/footer/instagram-a6066bd633da64d7acbaa7c2331ef40e.png" width="42" style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;max-width:100%;border:0">\
</a> </td>\
<td style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;padding:5px">\
<a href="https://www.pinterest.com/airbnb/?eluid=5&amp;euid=9d673613-21dc-d9f4-62b5-ffd41845a774" title="Pinterest" style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;color:#ff5a5f;text-decoration:none" target="_blank">\
<img alt="Pinterest" height="42" src="https://ci4.googleusercontent.com/proxy/lLCBZ2xwtL-9uZUPiXLVh8bYBL5pwQaizh7qBLZ3rQzoLGPexH5M2h62O-5eRwA2DpBTfwm9X7T8X-OO6RIXNyTcp4JZe-nnSvqlSnVRm8Wgwrydot3YLSX3w3eJzKQHoT8-BGWbpaapgbzxb2mMpWSjhl4zkguv=s0-d-e1-ft#https://a0.muscache.com/airbnb/rookery/email/footer/pinterest-d4e581eecbc64b8855c8464dedaa5c9c.png" width="42" style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;max-width:100%;border:0">\
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
由Airbnb總部發送<img alt="&amp;#9829;" height="10" src="https://ci6.googleusercontent.com/proxy/qsjmTX9ewR3rsS6TGhIj_4ZI9QbSil8BafCcF52ptrAM2PoEmjOEdx3aBpmwUhUxQOOeFi0U3XhRxvkegQQSLXwEztRK35o4hn8cUSUQCuVlK_K8OkGxH8R8rniqzEOXGsTlPiEkeamrX9aQI8biQ_-w4tg=s0-d-e1-ft#https://a1.muscache.com/airbnb/rookery/email/footer/heart-40429bf8c39010bbdf3a3037be994609.png" width="12" style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;max-width:100%"><br style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif">\
<a href="http://www.airbnb.com.tw/users/notifications?eluid=6&amp;euid=9d673613-21dc-d9f4-62b5-ffd41845a774" style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;color:#9ca299;text-decoration:underline" target="_blank">\
電子郵件偏好\
</a>\
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
<span style="margin:0;padding:0;font-family:&quot;Helvetica Neue&quot;,&quot;Helvetica&quot;,Helvetica,Arial,sans-serif;font-size:1px!important;color:#eeeeee!important">### Airbnb ###</span>\
<img src="https://ci3.googleusercontent.com/proxy/NR0jiUur-w2ahFnxzHwpSPrWm8r_XZ0RxpEECych-JdXhi3tHKrCSS_GFluIJbr_ETafa9wi89X8qTokqiV34pVxLnbb5s2SzH8mO-KwaVQIX20cH0q8yYgKQMrBTYdPCMHA94NrAdvb_IZPwu_IoOL4BSD8FVufi-hz0kcKhPe4ykGOjKMDyFFzPt3xs3dM8QzSbdZ2VxcI2WgxncXCPgbOTVyRh7KIBmb2cf8BaQv1Cy-26tYgtfwAn3lkJh5tGrtwKj9bVRoWBb60OBNiK3A-alq2Q0XYP7NCbRCpuBGZmDeIpXiX2jahcOmhUVIkEe2U3udoBN5nM4hG_oKNa0UbIw5rpKxn-S4iz27-IQkFhik9IoJj8otg5HGy6RaKVUG6oNwoGYrLqXPvUFJxyFaiNdBhqYUyxxTQSDQTAk1-kWqXs0WlCPVBBaDUhRU_jVwReGfNmDvyMiiv2c3fkoh986ypKnuoVhbJpIZrlsrHAYxSHYX9uMWwiuXqobsxlo5Ws_ONc_u1R23qU9p4z5No6EwdI7afq8gPw7I2bibbg_s_xqZ93d_uam80qVjMf5emZbf-2ZxVyOp3nAKpgY_OoZ5NQqmqHSafoE6Tb3cXqXDtESa3j4NQHC37G18aJj0wZbPsfjnGEfrA_23jBcOgT4-fSCNdyHV4X4I76owbiGqTi_ZDRkDYGHJssow=s0-d-e1-ft#http://email.airbnb.com/wf/open?upn=p4hLbBBir5-2FM-2BktMEvT6U6WQiUKmEtp10Vjcv66lvbD3BH-2FP3tkxqu-2FZRVHGNeOreXfGO04AVdCZJ8BLpfKEvEag-2FgC2vXzfQJOWus2M90pgqHjKqcRqkO-2F2VmlrCMmetPuel4xY-2FgTt6-2BNWBDc1ewbvU5r-2B-2BTMuJcu1czRg1fyZGIinS-2FzMNy-2BDa8V7op1WyLEsLpGcen-2B-2B89BqAdsEm3ZWWYFoAuz7sSj9DgCY0fHG34ltpFtwlxFSNP56yzp-2BLTEudQkeq6tawK-2Btl33dLey4vitbGVDrApLWXVplazPlVn-2BHqk98WdEAXm2zfTGP4Vw87wqyTXDdy1svkzri72P9foQ05Xiv6rAyNmDmHmeNca3-2FMPrRPNSw9BhmrcCsGXo4SVmd29CPSRuGyiA9ZaB8slj5jTRZ1p1sDef-2BUR8-3D" alt="" width="1" height="1" border="0" style="min-height:1px!important;width:1px!important;border-width:0!important;margin-top:0!important;margin-bottom:0!important;margin-right:0!important;margin-left:0!important;padding-top:0!important;padding-bottom:0!important;padding-right:0!important;padding-left:0!important">\
</div>'

  };

  transporter.sendMail(message, function(error, info) {
    if (error) {
        console.log('Error occurred');
        console.log(error.message);
        return;
    }
    console.log('Message sent successfully!->'+sMyJSON.titleSub);
    console.log('Server responded with %s', info.response);
  });
    
}