var Model = require('../model/models.js')
var utils = require('../utils')
var moment = require('moment')

module.exports.sendMessage = function (req, res) {
    var toUsername = req.body.to;
    var fromUsername = req.user.username;
    var subject = req.body.subject;
    var body = req.body.body;

    utils.getUserByUsername(toUsername, function(user) {
        if (!user) {
            return res.send({success: false, message: "User does not exist"})
        }

        var newMessage = {
            toUsername: toUsername,
            fromUsername: fromUsername,
            subject: subject.substring(0, 50),
            body: body.substring(0, 500),
            userId: req.user.id
        }
        utils.sendPushNotification(req.app.pnNsp, toUsername, {type: "new message", title: "New Message",
            message: fromUsername+" has sent you a message.", url: '/messages'})

        Model.Message.create(newMessage).then(function(){})
        res.send({success: true})
    })
}

module.exports.getMessages = function (req, res) {
    Model.Message.findAll({
        where: {
            toUsername: req.user.username
        },
        order: [
            ['createdAt', 'DESC']
        ]
    }).then(function(rows) {
        var rowData = []
        rows.forEach(function(row) {
            row.dataValues.timeAlive = moment(row.dataValues.createdAt).fromNow()
            rowData.push(row.dataValues)
        })
        res.render('messages', {messages: rowData, currentUrl: 'messages'})
    }).catch(function(error) {
        req.flash('error', error.message)
        res.redirect('/')
    })
}

module.exports.deleteMessage = function (req, res) {
    Model.Message.destroy({
        where: {
            id: req.body.messageId
        }
    }).then(function() {
        res.redirect('messages')
    }).catch(function(error) {
        req.flash('error', error.message)
        req.redirect('messages')
    })
}
module.exports.setMessageAsRead = function (req, res) {
    var messageId = req.body.messageId;

    Model.Message.update({
        unread: false
    }, {
        where: {
            id: messageId
        }
    }).then(function(result) {
        if (result) {
            return res.send({success: true})
        }
        res.send({success: false, message: result.message})
    })
}
