var Model = require('../model/models.js')
var moment = require('moment')
var userController = require('./userController.js')
var utils = require('../utils')
var emailService = require('../services/emailService.js')
var smsService = require('../services/smsService.js')
var Cookies = require('cookies')

module.exports.sendRequest = function(req, res) {
    var listingId = req.body.listingId
    var platformUsername = req.body.platformUsername.substring(0,20)
    var userId = req.user.id

    if (platformUsername) {

        Model.Listing.findOne({
            where: {
                id: listingId
            }
        }).then(function (row) {
            var newRequest = {
                listingId: listingId,
                userId: userId,
                toUsername: row.username,
                toUserId: row.userId,
                username: req.user.username,
                game: row.game,
                platform: row.platform,
                platformUsername: platformUsername
            }

            /**
             * Send Push notification
             */
            utils.sendPushNotification(req.app.pnNsp, row.username, {
                type: "request", title: "New Game Request",
                message: req.user.username + " wants to play " + row.game + " with you!", url: '/requests'
            })

            /**
             * Send the toUserId an email
             */
            emailService.sendRequestNotification(row.userId, req.user.username, row)
            smsService.sendSmsNotification(row.userId, req.user.username + ' has requested to play ' + row.game +
                '. Please Log In to Accept or Decline their game request.')

            Model.Request.create(newRequest).then(function () {
                res.send({success: true})
            }).catch(function (error) {
                res.send({success: false, error: "An error occurred trying to create your listing: " + error})
            })

        })
    } else {
        res.send({success: false, error: "You must provide a platform specific username."})
    }
}
module.exports.declineRequest = function(req, res) {
    Model.Request.destroy({
        where: {
            toUserId: req.user.id,
            id: req.body.id
        }
    }).then(function() {
        res.redirect('requests')
    })
}
module.exports.acceptRequest = function(req, res) {
    /** send pending ratings **/
    var requestId = req.body.id;

    /** get the request that was sent to me **/
    Model.Request.findOne({
        where: {
            id: requestId,
            toUserId: req.user.id
        }
    }).then(function(request) {

        /** remove the request **/
        Model.Request.destroy({
            where: {
                id: requestId
            }
        }).then(function(){})

        Model.Listing.findOne({
            where: {
                id: request.dataValues.listingId
            }
        }).then(function(listing) {

            var newGameMatch = {
                accepterId: req.user.id,
                accepterUsername: req.user.username,
                accepterPlatformUsername: listing.dataValues.platformUsername,
                requesterId: request.dataValues.userId,
                requesterUsername: request.dataValues.username,
                requesterPlatformUsername: request.dataValues.platformUsername,
                game: request.dataValues.game,
                platform: request.dataValues.platform,
                voiceServer: listing.dataValues.voiceServer,
                voiceServerPassword: listing.dataValues.voiceServerPassword

            }

            Model.GameMatch.create(newGameMatch);

            /** swap details **/
            var messageToRequestee = {
                userId: -1,
                fromUsername: "SYSTEM",
                toUsername: request.dataValues.username,
                subject: listing.dataValues.game + " - Request Accepted!",
                body: "<b>" + req.user.username + "</b> has accepted your game request to play "+listing.dataValues.game+"! Check your <strong>Accepted Requests</strong> for contact details!"

            }
            var messageToAcceptee = {
                userId: -1,
                fromUsername: "SYSTEM",
                toUsername: req.user.username,
                subject: listing.dataValues.game + " - Accepted Request!",
                body: "You have accepted a game request from <b>" + request.dataValues.username + "</b>. Check your <strong>Accepted Requests</strong> for contact details!"
            }
            /** end swap details **/

            /** send push to requestee **/
            utils.sendPushNotification(req.app.pnNsp, request.dataValues.username, {type: "accepted request", title: "Game Request Accepted",
                message: req.user.username+" has accepted your request to play " + listing.dataValues.game, url: '/acceptedRequests'})

            /** send push to acceptee **/
            utils.sendPushNotification(req.app.pnNsp, req.user.username, {type: "accepted request", title: "Game Request Accepted",
                message: "You have accepted a game request. Check Accepted Requests for contact details.", url: '/acceptedRequests'})

            emailService.sendAcceptedRequestNotification(request.dataValues.userId, req.user.username, listing);
            smsService.sendSmsNotification(request.userId, req.user.username + ' has accepted your request to play ' + listing.game +
                                            '. Check your Accepted Requests for contact details.')

            Model.Message.create(messageToAcceptee).then(function () {
            })
            Model.Message.create(messageToRequestee).then(function () {
            })

            req.flash('success', "Your contact details have been sent to " + request.dataValues.username +
                ", Check your messages to find their details. Have fun!")
            res.redirect('requests')
        })
    })
}
module.exports.cancelRequest = function(req, res) {
    Model.Request.destroy({
        where: {
            userId: req.user.id,
            id: req.body.id
        }
    }).then(function() {
        res.redirect('requestsSent')
    })
}
module.exports.showRequests = function(req, res) {
    Model.Request.findAll({
        where: {
            toUserid: req.user.id
        },
        order: [
            ['createdAt', 'DESC']
        ]
    }).then(function(rows) {
        var rowData = []
        rows.forEach(function(row) {
            row.dataValues.timeAlive = moment(row.dataValues.createdAt).fromNow();
            rowData.push(row.dataValues)
        })
        res.render('myRequests', {requests: rowData, currentUrl: 'requests'})
    }).catch(function(error) {
        req.flash('error', error.message)
        res.redirect('/')
    })
}
module.exports.showSentRequests = function(req, res) {
    Model.Request.findAll({
        where: {
            userId: req.user.id
        },
        order: [
            ['createdAt', 'DESC']
        ]
    }).then(function(rows) {
        var rowData = []
        rows.forEach(function(row) {
            row.dataValues.timeAlive = moment(row.dataValues.createdAt).fromNow();
            var values = {
                timeAlive: moment(row.dataValues.createdAt).fromNow(),
                toUsername: row.dataValues.toUsername,
                game: row.dataValues.game,
                platform: row.dataValues.platform,
                id: row.dataValues.id
            }
            rowData.push(values)
        })
        res.render('sentRequests', {requests: rowData, currentUrl: 'requests'})
    }).catch(function(error) {
        req.flash('error', error.message)
        res.redirect('/')
    })
}
module.exports.showAcceptedRequests = function(req, res) {
    var cookies = new Cookies(req, res)
    Model.GameMatch.findAll({
        where: {
            $or: {
                requesterId: req.user.id,
                accepterId: req.user.id
            }
        },
        order: [
            ['createdAt', 'DESC']
        ]
    }).then(function(rows) {
        var rowData = []
        rows.forEach(function(row) {
            var op = row.dataValues.accepterId == req.user.id ? true : false
            var ratedUp = op == true ? row.dataValues.accepterRatedUp : row.dataValues.requesterRatedUp
            var values = {
                op: op,
                time: moment(new Date(row.dataValues.createdAt)).utcOffset(-(cookies.get('timeOffset'))).format('dddd, MMMM Do, h:mm:ss A'),
                gameMatchId: row.dataValues.id,
                accepterId: row.dataValues.accepterId,
                accepterUsername: row.dataValues.accepterUsername,
                accepterPlatformUsername: row.dataValues.accepterPlatformUsername,
                requesterId: row.dataValues.requesterId,
                requesterUsername: row.dataValues.requesterUsername,
                requesterPlatformUsername: row.dataValues.requesterPlatformUsername,
                ratedUp: ratedUp,
                game: row.dataValues.game,
                platform: row.dataValues.platform,
                voiceServer: row.dataValues.voiceServer,
                voiceServerPassword: row.dataValues.voiceServerPassword
            }
            rowData.push(values);
        })
        res.render('acceptedRequests', {matches: rowData, currentUrl: 'requests'})
    }).catch(function(error) {
        req.flash('error', error.message)
        res.redirect('/')
    })
}
module.exports.rate = function(req, res) {
    var matchId = req.body.id
    var ratedUp = req.body.ratedUp

    Model.GameMatch.findOne({
        where: {
            $and: {
                id: matchId,
                $or: {
                    requesterId: req.user.id,
                    accepterId: req.user.id
                }
            }
        }
    }).then(function(match) {
        var op = match.accepterId == req.user.id ? true : false
        if (op == true) {
            match.accepterRatedUp = ratedUp
        } else {
            match.requesterRatedUp = ratedUp
        }
        match.save();
        res.send({success: true})
    }).catch(function(error) {
        res.send({success: false})
    })
}
