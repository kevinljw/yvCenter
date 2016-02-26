var Link = require('../models/Link');
var iconEachLink = require('../config/secrets').link.iconEachLink;
var HomeCover = require('../models/HomeCover');
/**
 * GET /
 * Home page.
 */
exports.index = function(req, res, next) {
  HomeCover.find({}, null, {sort:{order: 1}},function(coverErr, allCovers){
	    if (coverErr) {
	      return next(coverErr);
	    }
	  Link.find({area: 'goodLink'}, null, {sort:{order: 1}},function(linkErr, allLinks){
		    if (linkErr) {
		      return next(linkErr);
		    }
		 // console.log(allCovers)
	  //    console.log(allLinks)
	      // allCovers.forEach(function(eachCover){
	      // 		eachCover.abstract = eachCover.abstract.replace('//g','<br>')

	      // });
		  res.render('home', {
		    title: '首頁',
		    allLinks: JSON.stringify(allLinks),
	        goodLinkNum: Math.ceil(allLinks.length/iconEachLink),
	        allCovers: JSON.stringify(allCovers),
	        homeCoverNum: allCovers.length,
		  });
	  	
	  });
	});
};