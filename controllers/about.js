var Link = require('../models/Link');
var iconEachLink = require('../config/secrets').link.iconEachLink;
var OpenHouse = require('../models/OpenHouse');
/**
 * GET /about
 * About page.
 */
exports.getAbout = function(req, res) {
  res.render('about', {
    title: '認識我們'
  });
};
exports.getCenter = function(req, res) {
  res.render('center', {
    title: '認識本中心'
  });
};
exports.getTOYPF = function(req, res) {
  res.render('toypf', {
    title: '十傑基金會'
  });
};
exports.getVolunTeam = function(req, res) {
  res.render('volunteam', {
    title: '十傑志工隊'
  });
}; 
exports.getMap = function(req, res) {
  // console.log("getMap")
  res.render('map', {
    title: '我們在這裡'
  });
};
exports.getRent = function(req, res) {
  // console.log("getMap")
  res.render('rent', {
    title: '租用資訊'
  });
};
exports.getNovelty = function(req, res) {
  // console.log("getMap")
  OpenHouse.find({},{},{sort:{_id: -1}}, function(err, allOpenHouses) {
      if (err) {
        return next(err);
      }
    
        res.render('novelty', {
          title: '公益新鮮事',
          allOpenHouses: allOpenHouses,
        });
    
  });
  
};
exports.getLinks = function(req, res) {
  Link.find({},null, {sort:{order: 1}},function(err, allLinks){
    if (err) {
      return next(err);
    }
    Link.count({area: 'gov'},function(err, govNum){
      if (err) {
        return next(err);
      }
      Link.count({area: 'vcenter'},function(err, vcenterNum){
        if (err) {
          return next(err);
        }
        Link.count({area: 'servicePoint'},function(err, servicePointNum){
          if (err) {
            return next(err);
          }
          Link.count({area: 'goodLink'},function(err, goodLinkNum){
            if (err) {
              return next(err);
            }
            // console.log(goodLinkNum, servicePointNum, vcenterNum, govNum)
            res.render('links', {
              title: '友好連結',
              allLinks: JSON.stringify(allLinks),
              goodLinkNum: Math.ceil(goodLinkNum/iconEachLink),
              servicePointNum: Math.ceil(servicePointNum/iconEachLink),
              vcenterNum: Math.ceil(vcenterNum/iconEachLink),
              govNum: Math.ceil(govNum/iconEachLink)

            });
          });
        });
      });
    });
  });
};