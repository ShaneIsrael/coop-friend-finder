var Model = require('../model/models.js')
var redis = require('redis')
var moment = require('moment')
var Cookies = require('cookies')
var utils = require('../utils')

var redisCredentials = {'port': process.env.REDIS_PORT, 'host': process.env.REDIS_HOST}
var redisClient = redis.createClient(redisCredentials.port, redisCredentials.host);

module.exports.show = function (req, res) {
    var cookies = new Cookies(req, res)
    var MOTD = process.env.MOTD

    var gameTitles = process.env.POPULAR_GAMES.split(',');

    Model.Request.findOne({
        where: {
            toUserId: req.user.id
        }
    }).then(function(row) {
        Model.Message.findOne({
            where: {
                toUsername: req.user.username,
                unread: true
            }
        }).then(function(message) {
            utils.getListingStats(function(stats) {
                // checks if we have any requests
                var hasRequests = row ? true : false;
                var hasUnreadMessages = message ? true : false;
                redisClient.lrange('chatMessages', 0, 99, function(err, reply) {
                    if (!err) {
                        var chatMessages = []
                        for (var msg in reply) {
                            var message = JSON.parse(reply[msg])
                            //message.timestamp = message.timestamp - (cookies.get('timeOffset') * 60000)
                            //message.timestamp = formatTime(message.timestamp)
                            message.timestamp = moment(new Date(message.timestamp)).utcOffset(-(cookies.get('timeOffset'))).format('h:mm:ss A');
                            chatMessages.push(message)
                        }
                        chatMessages.reverse()
                        res.render('home', {stats: stats, hasRequests: hasRequests, hasUnreadMessages: hasUnreadMessages, username: req.user.username, chatHistory: chatMessages, motd: MOTD, gameTitles: gameTitles})
                    } else {
                        res.render('home', {stats: stats, hasRequests: hasRequests, hasUnreadMessages: hasUnreadMessages, username: req.user.username, chatHistory: [], motd: MOTD, gameTitles: gameTitles})
                    }
                })
            })
        }).catch(function(error) {
            res.flash('error', error)
            res.render('home')
        })
    }).catch(function(error) {
        res.flash('error', error)
        res.render('home')
    })
}

function formatTime(time)
{
    var d = new Date(time);
    var hh = d.getUTCHours();
    var m = d.getUTCMinutes();
    var s = d.getUTCSeconds();
    var dd = "AM";
    var h = hh;
    if (h >= 12) {
        h = hh-12;
        dd = "PM";
    }
    if (h == 0) {
        h = 12;
    }
    //h = h<10?"0"+h:h;
    m = m<10?"0"+m:m;
    s = s<10?"0"+s:s;

    return h+':'+m+':'+s+' '+dd
}
