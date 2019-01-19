var Model = require('../model/models.js')
var moment = require('moment')
var pn = null;

module.exports.getUserByUsername = function (username, callback) {
    Model.User.findOne({
        where: {
            username: username
        }
    }).then(function(user) {
        callback(user)
    })
}

module.exports.getAverageUserRating = function(id, callback) {
    Model.GameMatch.findAll({
        where: {
            $or: {
                accepterId: id,
                requesterId: id
            }
        }
    }).then(function(rows) {
        var totalRatingUp = 1;
        var totalVotes = 1;
        rows.forEach(function(row) {
            var op = id == row.dataValues.accepterId ? true : false
            if (op == true) {
                if (row.dataValues.requesterRatedUp != null) {
                    if (row.dataValues.requesterRatedUp == true) {
                        totalRatingUp++
                    }
                    totalVotes++
                }
            } else {
                if (row.dataValues.accepterRatedUp != null) {
                    if (row.dataValues.accepterRatedUp == true) {
                        totalRatingUp++
                    }
                    totalVotes++
                }
            }
        })
        callback(totalVotes == 1 ? 100 : (totalRatingUp > 0 ? Math.round((totalRatingUp / totalVotes) * 100) : 1))
    })
}

module.exports.sendPushNotification = function(pn, username, data) {
    Model.User.findOne({
        where: {
            username: username
        }
    }).then(function(user) {
        var pnChannel = user.dataValues.pushNotificationChannel
        pn.emit(pnChannel, data)
    })
}

module.exports.getListingStats = function(callback) {
    var stats = {};
    Model.Listing.findAndCountAll().then(function(result) {
        stats.currentListings = result.count
        if (result.count > 0) {
            stats.totalListingsCreated = result.rows[result.count - 1].dataValues.id
        } else {
            stats.totalListingsCreated = 'unavailable';
        }
    }).then(function() {
        Model.Request.findAndCountAll().then(function(result) {
            stats.currentRequests = result.count
            if (result.count > 0) {
                stats.totalRequestsMade = result.rows[result.count - 1].dataValues.id
            } else {
                stats.totalRequestsMade = 'unavailable';
            }
        }).then(function() {
            Model.User.count().then(function(count) {
                stats.totalAccountsCreated = count
                callback(stats)
            })
        })
    })
}
