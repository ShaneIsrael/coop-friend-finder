var passport = require('passport'),
    signupController = require('../controllers/signupController.js'),
    homeController = require('../controllers/homeController.js'),
    landingController = require('../controllers/landingController.js'),
    Cookies = require('cookies')

module.exports = function(express) {
  var router = express.Router()

  var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
      if (req.user.isBanned) {
        req.flash('error', 'You have been banned.')
        return req.logout()
      } else {
        return next()
      }
    }
    req.flash('error', 'You have to be logged in to access the page.')
    res.redirect('/')
  }

  router.get('/signup', signupController.show)
  router.post('/signup', signupController.signup)

  router.get('/login', function(req, res) {
    res.render('login');
  })
  router.post('/login', function(req, res, next) {
    var cookies = new Cookies(req, res)
    cookies.set('timeOffset', req.body.timeOffset)
    passport.authenticate('local', function(err, user, info) {
      if (err) { return res.send(info.message); }
      if (!user) { return res.send(info.message); }
      if (user.pushNotificationChannel == null) {
        user.pushNotificationChannel = user.username + "_" + Math.random().toString(12).slice(2);
        user.save();
      }
      res.cookie('pnc', user.pushNotificationChannel, {maxAge: 900000, httpOnly: false});

      req.logIn(user, function(err) {
        if (err) { return res.send(info.message); }
        return res.send({success: true});
      });
    })(req, res, next);
  })

  router.get('/', landingController.show)

  router.get('/home', isAuthenticated, homeController.show)

  router.get('/logout', function(req, res) {
    req.logout()
    res.redirect('/')
  })

  return router
}