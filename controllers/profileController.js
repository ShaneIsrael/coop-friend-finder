var Model = require('../model/models.js')
var utils = require('../utils')

module.exports.show = function (req, res) {
    var userId = req.user.id
    var stripe_pub_key=process.env.STRIPE_PUBLIC_KEY

    utils.getAverageUserRating(req.user.id, function(rating) {
        Model.ProfileInfo.findOne({
            where: {
                userId: userId
            }
        }).then(function (profile) {
            var data = profile
            if (!profile) {
                data = {
                    email: "",
                    phone: "",
                    userId: userId
                }
                Model.ProfileInfo.create(data).then(function () {
                })
            }
            Model.Subscription.findOne({
                where: {
                    userId: req.user.id,
                    subscription: 'sms'
                }
            }).then(function (subscription) {
                if (subscription) {
                    return res.render('profile', {profile: data, currentUrl: "profile", subscribedToSms: true, rating: rating})
                }
                res.render('profile', {profile: data, currentUrl: "profile", stripe_pub_key: stripe_pub_key, rating: rating})
            })
        })
    })
}
module.exports.save = function (req, res) {
    var userId = req.user.id;
    var phone = ""
    if (req.body.phone) {
        phone = req.body.phone.replace(/\D/g,'');
    }
    Model.ProfileInfo.update({
        email: req.body.email,
        phone: phone
    }, {
        where: {
            userId: userId
        }
    }).then(function(result) {
        if (result) {
            return res.send({success: true})
        }
        res.send({success: false, message: result.message})
    })
}
