var VolunForm = require('../models/VolunForm');
var OrgForm = require('../models/OrgForm');
var User = require('../models/User');
/**
 * GET /about
 * About page.
 */
exports.postForm = function(req, res) {
  // console.log(req.params.id);
  console.log(req.body);
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
      existingUser.role_text= req.body.role_text[existingUser.role=='student'?0:(existingUser.role=='worker'?1:2)] || existingUser.role_text;
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

exports.postOrgForm = function(req, res) {
  // console.log(req.params.id);
  console.log(req.body);
  // OrgForm.findOne({uid:req.user.id}, function(err, existingUser) {
  //   if (err) {
  //     return next(err);
  //   }
  //   if(existingUser){
  //     existingUser.uname= req.body.uname || existingUser.uname;
  //     existingUser.activity_name= req.body.activity_name || existingUser.activity_name;
  //     existingUser.activity_abstract= req.body.activity_abstract || existingUser.activity_abstract;
  //     existingUser.activity_website= req.body.location || existingUser.location;
  //     existingUser.service_date_since = req.body.service_date_since || existingUser.service_date_since ;
  //     existingUser.service_date_until = req.body.service_date_until || existingUser.service_date_until ;
  //     existingUser.service_time_since = req.body.service_time_since || existingUser.service_time_since ;
  //     existingUser.service_time_until = req.body.service_time_until || existingUser.service_time_until ;
  //     existingUser.service_location = req.body.service_location || existingUser.service_location ;
  //     existingUser.service_hours = req.body.service_hours || existingUser.service_hours ;
  //     existingUser.service_content = req.body.service_content || existingUser.service_content ;
  //     existingUser.service_type = req.body.service_type || existingUser.service_type ;
  //     existingUser. = req.body. || existingUser. ;
  //     existingUser. = req.body. || existingUser. ;
  //     existingUser. = req.body. || existingUser. ;
  //     existingUser. = req.body. || existingUser. ;
  //     existingUser. = req.body. || existingUser. ;
  //     existingUser. = req.body. || existingUser. ;
  //     existingUser. = req.body. || existingUser. ;
  //     existingUser. = req.body. || existingUser. ;
  //     existingUser. = req.body. || existingUser. ;
  //     existingUser. = req.body. || existingUser. ;
  //     existingUser. = req.body. || existingUser. ;
  //     existingUser. = req.body. || existingUser. ;
  //     existingUser. = req.body. || existingUser. ;
  //     existingUser. = req.body. || existingUser. ;
  //     existingUser. = req.body. || existingUser. ;
  //     existingUser. = req.body. || existingUser. ;
  //     existingUser. = req.body. || existingUser. ;
  //     existingUser. = req.body. || existingUser. ;


      

  //     existingUser.save(function(err) {
  //       if (err) {
  //         return next(err);
  //       }
      
  //       req.flash('success', { msg: '表單修改成功。' });
  //       res.redirect('/youth/bevo#formDone');
  //     });
  //   }
  //   else{

      var oForm = new OrgForm({
        uid: req.user.id || '',
        uname: req.user.profile.name || '',
        timestamp: Date() || '',
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
                res.redirect('/youth/bevo#formDone');
              });

          }
          else{
            req.flash('errors', { msg: '錯誤，您的機構帳號尚未認證成功，請聯絡志工中心管理員' });
            res.redirect('/youth/findvo#ActivationErr');
          }
          
      });
    // }
    
  // });
  
};