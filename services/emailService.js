var nodemailer = require('nodemailer');
var Model = require('../model/models.js')
var fs = require('fs')
var path = require('path')
var util = require('util')

var transporter = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        XOAuth2: {
            user: "coopfriendfinder@gmail.com",
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN
        }
    }
});

var requestTemplate;
var acceptedRequestTemplate;

fs.readFile(path.join(__dirname,"emailTemplates/requestEmail.html"), 'utf8',function (err,data) {
    if (err) {
        console.log(err);
    }
    requestTemplate = data
});
fs.readFile(path.join(__dirname,"emailTemplates/acceptedRequestEmail.html"), 'utf8',function (err,data) {
    if (err) {
        console.log(err);
    }
    acceptedRequestTemplate = data
});


module.exports.sendRequestNotification = function (toId, fromUsername, listing) {

    Model.ProfileInfo.findOne({
        where: {
            userId: toId
        }
    }).then(function(profile) {
        if (profile && profile.email != '') {
            var template = requestTemplate
            template = template.replace(/\[\[toUsername\]\]/gi, listing.username)
            template = template.replace(/\[\[fromUsername\]\]/gi, fromUsername)
            template = template.replace(/\[\[listingTitle\]\]/gi, listing.game)
            var mailOptions = {
                from: '"Coop Friend Finder" <noreply@coopfriendfinder.com>',
                to: profile.email,
                subject: fromUsername + ' wants to play!',
                html: template
            }

            transporter.sendMail(mailOptions, function(error, info) {
            })
        }
    })
}

module.exports.sendAcceptedRequestNotification = function (toId, fromUsername, listing) {
    Model.ProfileInfo.findOne({
        where: {
            userId: toId
        }
    }).then(function(profile) {
        if (profile && profile.email != '') {
            var template = acceptedRequestTemplate
            template = template.replace(/\[\[fromUsername\]\]/gi, fromUsername)
            template = template.replace(/\[\[listingTitle\]\]/gi, listing.game)
            var mailOptions = {
                from: '"Coop Friend Finder" <noreply@coopfriendfinder.com>',
                to: profile.email,
                subject: fromUsername + ' accepted your game request',
                html: template
            }

            transporter.sendMail(mailOptions, function(error, info) {
            })
        }
    })
}