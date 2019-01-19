var client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
var Model = require('../model/models.js')

module.exports.sendSmsNotification = function(toId, body) {
    Model.Subscription.findOne({
        where: {
            userId: toId,
            subscription: 'sms'
        }
    }).then(function(exists) {
        if (exists) {
            Model.ProfileInfo.findOne({
                where: {
                    userId: toId
                }
            }).then(function(profile) {
                if (profile.phone != '') {
                    client.sendMessage({
                        to: profile.phone,
                        from: process.env.TWILIO_PHONE,
                        body: body
                    })
                }
            })
        }
    })
}