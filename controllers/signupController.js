var bcrypt = require('bcrypt'),
    Model = require('../model/models.js'),
    request = require('request');

module.exports.show = function(req, res) {
  res.render('signup')
}

module.exports.signup = function(req, res) {
  var username = req.body.username
  var password = req.body.password
  var password2 = req.body.password2
  var recaptcha = req.body["g-recaptcha-response"]

  if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
    return res.send({success: false, message: "Please complete the reCaptcha"})
  }

  // var patt = new RegExp("/^[a-z0-9\_\-]+$/i");
  // if (patt.test(username)) {
  //   return res.json({success: false, message: "Username can only contain letters and numbers"})
  // }

  var secretKey = "6LdpFygTAAAAAI_G4bfmGcbe0SvaKJE8PKQ2TQsN"
  var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;

  // Hitting GET request to the URL, Google will respond with success or error scenario.
  request(verificationUrl,function(error,response,body) {
    body = JSON.parse(body);
    // Success will be true or false depending upon captcha validation.
    if(!body.success) {
      return res.json({success: false, message:  "Failed captcha verification"})
    }

    if (!username || !password || !password2) {
      return res.send({success: false, message: "Please, fill in all the fields."})
    }

    if (password !== password2) {
      return res.send({success: false, message: "Passwords did not match."})
    }

    if (username.length < 4) {
      return res.send({success: false, message: "Username must be at least 4 characters"})
    }

    var salt = bcrypt.genSaltSync(10)
    var hashedPassword = bcrypt.hashSync(password, salt)

    var newUser = {
      username: username,
      salt: salt,
      password: hashedPassword,
    }

    Model.User.findOne({
      where: {
        username: username
      }
    }).then(function(exists) {
      if (exists) {
        return res.send({success: false, message: "Username already exists."})
      }
      Model.User.create(newUser).then(function() {
        res.send({success: true})
      }).catch(function(error) {
        res.send({success: false, message: error.message})
      })
    })
  });
}
