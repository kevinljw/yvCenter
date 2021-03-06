/**
 * Module dependencies.
 */
var _ = require('lodash');
var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var favicon = require('serve-favicon');
var session = require('express-session');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var lusca = require('lusca');
var methodOverride = require('method-override');
var dotenv = require('dotenv');
var MongoStore = require('connect-mongo/es5')(session);
var flash = require('express-flash');
var path = require('path');
var mongoose = require('mongoose');
var passport = require('passport');
var expressValidator = require('express-validator');
var sass = require('node-sass-middleware');
var multer = require('multer');
var upload = multer({ dest: path.join(__dirname, 'public/uploads') });
var upload_icon = multer({ dest: path.join(__dirname, 'public/uploads/linkIcon') });
var upload_homeCover = multer({ dest: path.join(__dirname, 'public/uploads/homeCover') });
var upload_profile = multer({ dest: path.join(__dirname, 'public/uploads/profile') });

var ghost = require('./ghost-app/ghost-in-the-middle');

// console.log(pat÷h.join(__dirname, 'uploads'));
/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 *
 * Default path: .env (You can remove the path argument entirely, after renaming `.env.example` to `.env`)
 */
dotenv.load({ path: '.env.example' });

/**
 * Controllers (route handlers).
 */
var homeController = require('./controllers/home');
var userController = require('./controllers/user');
var apiController = require('./controllers/api');
var contactController = require('./controllers/contact');
var aboutController = require('./controllers/about');
var youthController = require('./controllers/youth');
var matchController = require('./controllers/match');
var adminController = require('./controllers/admin');
/**
 * API keys and Passport configuration.
 */
var passportConf = require('./config/passport');

/**
 * Create Express server.
 */
var app = express();

/**
 * Connect to MongoDB.
 */
mongoose.connect(process.env.MONGODB || process.env.MONGOLAB_URI);
mongoose.connection.on('error', function() {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
  process.exit(1);
});

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(compress());
app.use(sass({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
app.use(logger('dev'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB || process.env.MONGOLAB_URI,
    autoReconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function(req, res, next) {
  if (req.path === '/account/profile' || req.path === '/api/upload' || req.path ==='/addNewLink' || req.path ==='/addNewHomeCover' || req.path ==='/addNewServicePoint' || req.path === '/addNewMentor' || req.path.indexOf('/news')>-1) {
    next();
  } else {
    lusca.csrf()(req, res, next);
  }
});
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});
app.use(function(req, res, next) {
  if (/api/i.test(req.path)) {
    req.session.returnTo = req.path;
  }
  next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

app.use( '/news', ghost({
  config: path.join(__dirname, 'ghost-app/config.js')
}) );

/**
 * Primary app routes.
 */
app.get('/', homeController.index);
app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.post('/loginOrg', userController.postLoginOrg);
app.post('/loginAdmin', adminController.postLoginAdmin);

app.get('/logout', userController.logout);
app.get('/logoutOrg', userController.logoutOrg);

app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);
app.post('/signupOrg', userController.postSignupOrg);

app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);
app.get('/account', passportConf.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConf.isAuthenticated, upload_profile.single('profile_pic'), userController.postUpdateProfile);
app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);
app.get('/account/unlink/:provider', passportConf.isAuthenticated, userController.getOauthUnlink);

app.get('/about', aboutController.getAbout);
app.get('/about/center', aboutController.getCenter);
app.get('/about/toypf', aboutController.getTOYPF);
app.get('/about/volunteam', aboutController.getVolunTeam);
app.get('/about/map', aboutController.getMap);
app.get('/about/rent', aboutController.getRent);
app.get('/novelty', aboutController.getNovelty);
app.get('/links', aboutController.getLinks);

app.get('/youth/local', youthController.getLocal);
app.get('/youth/local/:district', youthController.getLocalDistrict);
app.get('/youth/bevo', youthController.getBevo);
app.get('/youth/findvo', youthController.getFindvo);
app.get('/youth/launchteam', youthController.getLaunchteam);
app.get('/youth/empower', youthController.getEmpower);

app.post('/volunform', matchController.postForm);
app.post('/newServiceform', matchController.postOrgForm);
app.post('/editServiceform/:id', matchController.postEditOrgForm);

app.post('/applyJob', matchController.postApplyJob);
app.get('/volunInfo/:oid/:uid', matchController.getLookupVolunInfo);

app.get('/admin_login', adminController.getAdminLogin);
app.get('/adminMgr', passportConf.isAdminAuthenticated, adminController.getAdminHome);
app.get('/ghostAdmin', passportConf.isAdminAuthenticated, adminController.getGhostAdmin);
app.get('/orgVerify', passportConf.isAdminAuthenticated, adminController.getOrgVerify);
app.post('/activation/:id', passportConf.isAdminAuthenticated, adminController.postOrgActivation);
app.get('/localMgr', passportConf.isAdminAuthenticated, adminController.getLocalMgr );
app.get('/serviceMgr', passportConf.isAdminAuthenticated, adminController.getServiceMgr);
app.get('/volunMgr', passportConf.isAdminAuthenticated, adminController.getVolunMgr);

//xlsx---
app.get('/volunXlsx', passportConf.isAdminAuthenticated, adminController.getVolunXLSX);
app.get('/serviceXlsx', passportConf.isAdminAuthenticated, adminController.getServiceXLSX);
app.get('/orgXlsx', passportConf.isAdminAuthenticated, adminController.getOrgXLSX);

app.get('/administrator', passportConf.isAdminAuthenticated, adminController.getAdministrator);
app.post('/beAdmin', passportConf.isAdminAuthenticated, adminController.postBeAdmin);
app.post('/removeAdmin/:id', passportConf.isAdminAuthenticated, adminController.postRemoveAdmin);
app.post('/addLocalData', passportConf.isAdminAuthenticated, adminController.postLocalData);
app.post('/removeResource/:id', passportConf.isAdminAuthenticated, adminController.postRemoveResource);
app.post('/removeService/:id', passportConf.isAdminAuthenticated, adminController.postRemoveSevice);
app.post('/removeVolunForm/:id', passportConf.isAdminAuthenticated, adminController.postRemoveVolunForm);
app.post('/removeOrg/:id', passportConf.isAdminAuthenticated, adminController.postRemoveOrg);
// app.get('/calendarMgr',passportConf.isAdminAuthenticated, adminController.getCalendar);

app.get('/empowerMgr', passportConf.isAdminAuthenticated, adminController.getEmpowerMgr );
app.get('/empowerMgr_mentor', passportConf.isAdminAuthenticated, adminController.getEmpowerMgr_mentor );
app.get('/empowerMgr_volunTrain', passportConf.isAdminAuthenticated, adminController.getEmpowerMgr_volunTrain );
app.get('/empowerMgr_talentTrain', passportConf.isAdminAuthenticated, adminController.getEmpowerMgr_talentTrain );
app.get('/empowerMgr_speech', passportConf.isAdminAuthenticated, adminController.getEmpowerMgr_speech );


app.post('/addNewMentor', passportConf.isAdminAuthenticated, upload_profile.single('profile_pic'), adminController.postNewMentor ); 
app.post('/updateMentorOrder/:id', passportConf.isAdminAuthenticated, adminController.postUpdateMentorOrder);
app.post('/removeMentor/:id', passportConf.isAdminAuthenticated, adminController.postRemoveMentor);
app.post('/updateVolunTrainOrder/:id', passportConf.isAdminAuthenticated, adminController.postUpdateVolunTrainOrder);
app.post('/updateTalentTrainOrder/:id', passportConf.isAdminAuthenticated, adminController.postUpdateTalentTrainOrder);
app.post('/updateSpeechOrder/:id', passportConf.isAdminAuthenticated, adminController.postUpdateSpeechOrder);

app.post('/addNewSpeech', passportConf.isAdminAuthenticated, adminController.postNewSpeech ); 
app.post('/removeSpeech/:id', passportConf.isAdminAuthenticated, adminController.postRemoveSpeech);
app.post('/addNewTalentTrain', passportConf.isAdminAuthenticated, adminController.postNewTalentTrain ); 
app.post('/removeTalentTrain/:id', passportConf.isAdminAuthenticated, adminController.postRemoveTalentTrain);
app.post('/addNewVolunTrain', passportConf.isAdminAuthenticated, adminController.postNewVolunTrain ); 
app.post('/removeVolunTrain/:id', passportConf.isAdminAuthenticated, adminController.postRemoveVolunTrain);
app.post('/editVolunform/:id', passportConf.isAdminAuthenticated, adminController.postEditVolunForm);
app.post('/editMentorData/:id', passportConf.isAdminAuthenticated, adminController.postEditMentorData);
app.post('/editVolunTrainData/:id', passportConf.isAdminAuthenticated, adminController.postEditVolunTrainData);
app.post('/editTalentTrainData/:id', passportConf.isAdminAuthenticated, adminController.postEditTalentTrainData);
app.post('/editSpeechData/:id', passportConf.isAdminAuthenticated, adminController.postEditSpeechData);

app.post('/editLinksData/:id', passportConf.isAdminAuthenticated, adminController.postEditLinksData);



app.get('/noveltyMgr', passportConf.isAdminAuthenticated, adminController.getNoveltyMgr );
app.post('/addNewOpenHouse', passportConf.isAdminAuthenticated, adminController.postAddNewOpenHouse );
app.post('/removeOpenHouse/:id', passportConf.isAdminAuthenticated, adminController.postRemoveOpenHouse );


app.get('/linksMgr', passportConf.isAdminAuthenticated, adminController.getLinksMgr );
app.post('/addNewLink', passportConf.isAdminAuthenticated, upload_icon.single('icon'), adminController.postNewLink ); 
app.post('/addNewServicePoint', passportConf.isAdminAuthenticated, upload_icon.single('icon'), adminController.postNewServicePoint ); 
app.post('/removeLink/:id', passportConf.isAdminAuthenticated, adminController.postRemoveLink);
app.post('/updateLinkOrder/:id', passportConf.isAdminAuthenticated, adminController.postUpdateLinkOrder);



app.post('/addNewHomeCover', passportConf.isAdminAuthenticated, upload_homeCover.single('cover_pic'), adminController.postNewHomeCover ); 
app.post('/removeHomeCover/:id', passportConf.isAdminAuthenticated, adminController.postRemoveHomeCover);
app.post('/updateHomeCoverOrder/:id', passportConf.isAdminAuthenticated, adminController.postUpdateHomeCoverOrder);
app.post('/updateHomeCoverAbstract/:id', passportConf.isAdminAuthenticated, adminController.postUpdateHomeCoverAbstract);

app.get('/volunPage',youthController.getVolunPage);

/**
 * API examples routes.
 */
app.get('/api', apiController.getApi);
app.get('/api/lastfm', apiController.getLastfm);
app.get('/api/nyt', apiController.getNewYorkTimes);
app.get('/api/aviary', apiController.getAviary);
app.get('/api/steam', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getSteam);
app.get('/api/stripe', apiController.getStripe);
app.post('/api/stripe', apiController.postStripe);
app.get('/api/scraping', apiController.getScraping);
app.get('/api/twilio', apiController.getTwilio);
app.post('/api/twilio', apiController.postTwilio);
app.get('/api/clockwork', apiController.getClockwork);
app.post('/api/clockwork', apiController.postClockwork);
app.get('/api/foursquare', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getFoursquare);
app.get('/api/tumblr', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getTumblr);
app.get('/api/facebook', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getFacebook);
app.get('/api/github', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getGithub);
app.get('/api/twitter', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getTwitter);
app.post('/api/twitter', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.postTwitter);
app.get('/api/venmo', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getVenmo);
app.post('/api/venmo', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.postVenmo);
app.get('/api/linkedin', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getLinkedin);
app.get('/api/instagram', passportConf.isAuthenticated, passportConf.isAuthorized, apiController.getInstagram);
app.get('/api/yahoo', apiController.getYahoo);
app.get('/api/paypal', apiController.getPayPal);
app.get('/api/paypal/success', apiController.getPayPalSuccess);
app.get('/api/paypal/cancel', apiController.getPayPalCancel);
app.get('/api/lob', apiController.getLob);
app.get('/api/bitgo', apiController.getBitGo);
app.post('/api/bitgo', apiController.postBitGo);
app.get('/api/upload', apiController.getFileUpload);
app.post('/api/upload', upload.single('myFile'), apiController.postFileUpload);

/**
 * OAuth authentication routes. (Sign in)
 */
app.get('/auth/instagram', passport.authenticate('instagram'));
app.get('/auth/instagram/callback', passport.authenticate('instagram', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'user_location'] }));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/youth/bevo' }), function(req, res) {
  res.redirect(req.session.returnTo || '/youth/bevo');
});
app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/youth/bevo' }), function(req, res) {
  res.redirect(req.session.returnTo || '/youth/bevo');
});
app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});
app.get('/auth/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE' }));
app.get('/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});

/**
 * OAuth authorization routes. (API examples)
 */
app.get('/auth/foursquare', passport.authorize('foursquare'));
app.get('/auth/foursquare/callback', passport.authorize('foursquare', { failureRedirect: '/api' }), function(req, res) {
  res.redirect('/api/foursquare');
});
app.get('/auth/tumblr', passport.authorize('tumblr'));
app.get('/auth/tumblr/callback', passport.authorize('tumblr', { failureRedirect: '/api' }), function(req, res) {
  res.redirect('/api/tumblr');
});
app.get('/auth/venmo', passport.authorize('venmo', { scope: 'make_payments access_profile access_balance access_email access_phone' }));
app.get('/auth/venmo/callback', passport.authorize('venmo', { failureRedirect: '/api' }), function(req, res) {
  res.redirect('/api/venmo');
});
app.get('/auth/steam', passport.authorize('openid', { state: 'SOME STATE' }));
app.get('/auth/steam/callback', passport.authorize('openid', { failureRedirect: '/login' }), function(req, res) {
  res.redirect(req.session.returnTo || '/');
});

/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
