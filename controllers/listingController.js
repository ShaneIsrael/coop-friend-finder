var Model = require('../model/models.js')
var moment = require('moment')
var utils = require('../utils')
var Cookies = require('cookies')

module.exports.createGameListing = function(req, res) {
    var game = req.body.game.substring(0, 50)
    var platform = req.body.platform
    var platformUsername = req.body.platformUsername
    var region = req.body.region
    var notes = req.body.notes
    var voiceServer = req.body.voiceServer
    var voiceServerPassword = req.body.voiceServerPassword
    var voip = req.body.voip ? true : false

    if (notes) {
        notes = notes.substring(0, 500);
    }

    var userId = req.user.id

    var newListing = {
        userId: userId,
        type: "game",
        game: game,
        username: req.user.username,
        platform: platform,
        platformUsername: platformUsername,
        notes: notes,
        region: region,
        voip: voip,
        voiceServer: voiceServer,
        voiceServerPassword: voiceServerPassword
    }

    createListing(res, userId, newListing)
}

module.exports.createServerListing = function(req, res) {
    var game = req.body.game.substring(0, 50)
    var platform = req.body.platform
    var platformUsername = req.body.platformUsername
    var region = req.body.region
    var notes = req.body.notes
    var voiceServer = req.body.voiceServer
    var voiceServerPassword = req.body.voiceServerPassword
    var voip = false
    var serverName = req.body.serverName.substring(0, 50)
    var serverHost = req.body.serverHost
    var serverPort = req.body.serverPort
    var serverCapacity = req.body.serverCapacity

    if (notes) {
        notes = notes.substring(0, 500);
    }

    var userId = req.user.id

    var newListing = {
        userId: userId,
        type: "server",
        game: game,
        username: req.user.username,
        platform: platform,
        platformUsername: platformUsername,
        notes: notes,
        region: region,
        voip: voip,
        voiceServer: voiceServer,
        voiceServerPassword: voiceServerPassword,
        serverName: serverName,
        serverHost: serverHost,
        serverPort: serverPort,
        serverCapacity: serverCapacity
    }

    createListing(res, userId, newListing);
}

module.exports.gameListingCheck = function(req, res) {
    var title = req.query.title
    var platform = req.query.platform
    Model.Listing.findAndCountAll({
        where: {
            userId: {
                $ne: req.user.id
            },
            game: {
                $like: "%"+title,
                $or: {
                    $like: title+"%"
                },
                $or: {
                    $like: "%"+title+"%"
                }
            },
            platform: platform
        }
    }).then(function(result) {
        var found = result.count > 0 ? true : false
        res.send({found: found, count: result.count})
    })
}

var createListing = function(res, userId, newListing) {
    Model.Listing.count({
        where: {
            userId: userId
        }
    }).then(function (count) {
        if (count >= process.env.MAX_LISTINGS_ALLOWED) {
            res.send({success: false, message: 'You can only have ' + (process.env.MAX_LISTINGS_ALLOWED) + ' active listings at any given time. Please delete a listing and try again.'})
        } else {
            Model.Listing.create(newListing).then(function () {
                res.send({success: true})
            }).catch(function (error) {
                res.send({success: false, message: "An error occurred trying to create your listing: " + error})
            })
        }
    })
}
module.exports.delete = function(req, res) {
    var id = req.body.id;

    /** delete any associated requests **/
    Model.Request.destroy({
        where: {
            listingId: id
        }
    }).then(function(){
        /** then delete the listing **/
        Model.Listing.destroy({
            where: {
                id: id
            }
        }).then(function() {
            res.redirect("myListings")
        }).catch(function(error) {
            req.flash('error', error)
            res.redirect("myListings")
        })
    })
}

module.exports.showMyListings = function(req, res) {
    var cookies = new Cookies(req, res)
    getMyListingData(req, function(data) {
        res.render('myListings', data)
    })
}

module.exports.showListings = function(req, res) {
    var cookies = new Cookies(req, res)
    // Get any previous listings requests
    getListingData(req, function(data) {
        res.render('listings', data)
    })
}
var getMyListingData = function(req, callback) {
    Model.Listing.findAll({
        where: {
            userId: req.user.id
        },
        order: [
            ['createdAt', 'DESC']
        ]
    }).then(function(rows) {
        var rowData = [];
        var currentRow = 0;
        if(rows.length == 0)
            return callback({listings: rowData, currentUrl: 'myListings'})

        rows.forEach(function (row) {
            utils.getAverageUserRating(row.dataValues.userId, function(rating) {
                var publicValues = {
                    type: row.dataValues.type,
                    game: row.dataValues.game,
                    username: row.dataValues.platformUsername,
                    platform: row.dataValues.platform,
                    listingId: row.dataValues.id,
                    notes: row.dataValues.notes,
                    region: row.dataValues.region,
                    rating: rating,
                    voip: row.dataValues.voip,
                    voiceServer: row.dataValues.voiceServer,
                    voiceServerPassword: row.dataValues.voiceServerPassword,
                    serverName: row.dataValues.serverName,
                    serverHost: row.dataValues.serverHost,
                    serverPort: row.dataValues.serverPort,
                    serverCapacity: row.dataValues.serverCapacity,
                    timeAlive: moment(row.dataValues.createdAt).fromNow(),
                    expires: moment(row.dataValues.createdAt).add(12, 'hours').fromNow(),
                    createdAt: row.dataValues.createdAt

                }
                rowData.push(publicValues)
                currentRow++
                if (currentRow == rows.length) {
                    callback({listings: rowData, displayVoiceServer: true, currentUrl: 'myListings'})
                }
            })
        });
    })
}
var getListingData = function(req, callback) {
    var requestedIds = []
    var totalListings = 0;
    Model.Request.findAll({
        where: {
            userId: req.user.id
        }
    }).then(function (rows) {
        rows.forEach(function (row) {
            requestedIds.push(row.dataValues.listingId);
        })
    }).then(function () {
        Model.Listing.findAndCountAll({
            where: {
                userId: {
                    $ne: req.user.id
                }
            },
            limit: 200,
            order: [
                ['createdAt', 'DESC']
            ]
        }).then(function(result) {
            var rows = result.rows;
            var totalResults = result.count;
            var rowData = [];
            var currentRow = 0;
            if(rows.length == 0)
                return callback({listings: rowData, currentUrl: 'listings', isAdmin: req.user.isAdmin})

            rows.forEach(function (row) {
                // check previous listing request for matches
                utils.getAverageUserRating(row.dataValues.userId, function(rating) {
                    var alreadyRequested = requestedIds.indexOf(row.dataValues.id) == -1 ? false : true
                    var publicValues = {
                        type: row.dataValues.type,
                        game: row.dataValues.game,
                        username: row.dataValues.username,
                        platform: row.dataValues.platform,
                        listingId: row.dataValues.id,
                        notes: row.dataValues.notes,
                        region: row.dataValues.region,
                        rating: rating,
                        voip: row.dataValues.voip,
                        voiceServer: row.dataValues.voiceServer,
                        voiceServerPassword: row.dataValues.voiceServerPassword,
                        serverName: row.dataValues.serverName,
                        serverHost: row.dataValues.serverHost,
                        serverPort: row.dataValues.serverPort,
                        serverCapacity: row.dataValues.serverCapacity,
                        timeAlive: moment(row.dataValues.createdAt).fromNow(),
                        expires: moment(row.dataValues.createdAt).add(12, 'hours').fromNow(),
                        requested: alreadyRequested,
                        createdAt: row.dataValues.createdAt

                    }
                    rowData.push(publicValues)
                    currentRow++
                    if (currentRow == rows.length) {
                        /* Sort them since callbacks may happen out of order */
                        rowData.sort(function (a, b) {
                            if (a.listingId < b.listingId) {
                                return -1;
                            }
                            else if (a.listingId > b.listingId) {
                                return 1;
                            }
                            return 0;
                        });
                        callback({listings: rowData, results: rows.length, resultsTotal: totalResults, currentUrl: 'listings', isAdmin: req.user.isAdmin})
                    }
                })
            });
        })
    })
}
module.exports.showReadOnlyListings = function(req, res) {
    Model.Listing.findAll({
        where: {
            type: 'game'
        },
        limit: 200,
        order: [
            ['createdAt', 'DESC']
        ]
    }).then(function(rows) {
        var rowData = [];
        rows.forEach(function (row) {
            // check previous listing request for matches

            var publicValues = {
                game: row.dataValues.game,
                username: row.dataValues.username,
                platform: row.dataValues.platform,
                listingId: row.dataValues.id,
                region: row.dataValues.region,
                notes: row.dataValues.notes,
                voip: row.dataValues.voip,
                timeAlive: moment(row.dataValues.createdAt).fromNow(),
                createdAt: row.dataValues.createdAt

            }
            rowData.push(publicValues)
        });
        res.render('readOnlyListings', {listings: rowData})
    })
}

module.exports.showListingsWithFilters = function(req, res) {
    getFilteredListingData(req, function(data) {
        res.render('listings', data)
    })
}

var getFilteredListingData = function (req, callback) {
    var containsText = (typeof req.query.contains != 'undefined') ? req.query.contains : ''
    var platform = req.query.platform
    var type = req.query.type.toLowerCase()
    var voip = req.query.voip ? true : false
    var region = req.query.region.toLowerCase()

    /* if voip not required, then show posts with both voip and not voip */
    if (voip == false) {
        voip = {
            $not: null
        }
    }
    var orderBy = [['createdAt', 'ASC']]
    switch (req.query.orderBy.toLowerCase()) {
        case 'age desc':
            orderBy = [['createdAt', 'DESC']]
            break;
        case 'age asc':
            orderBy = [['createdAt', 'ASC']]
            break;
        case 'user rating':
            orderBy = [['userRating', 'DESC']]
            break
        case 'alphabetical':
            orderBy = [['game', 'ASC']]
            break
        default:
            orderBy = [['createdAt', 'ASC']]
    }

    var filters = {}
    switch (platform) {
        case "Any":
            platform = { $not: null }
            break
        case "PC All":
            platform = { $not: 'Xbox One',
                         $and: { $not: 'Xbox 360'},
                         $and: { $not: 'Playstation 4'},
                         $and: { $not: 'Playstation 3'}}
            break
    }
    switch (type) {
        case "any":
            type = { $not: null }
            break
    }
    switch (region) {
        case "any":
            region = { $not: null }
            break
    }
    filters = {
        where: {
            userId: {
                $ne: req.user.id
            },
            game: {
                $like: "%"+containsText,
                $or: {
                    $like: containsText+"%"
                },
                $or: {
                    $like: "%"+containsText+"%"
                }
            },
            platform: platform,
            type: type,
            region: region,
            voip: voip
        },
        limit: 200,
        order: orderBy
    }

    // Get any previous listings requests
    var listingIds = []
    Model.Request.findAll({
        where: {
            userId: req.user.id
        }
    }).then(function (rows) {
        rows.forEach(function (row) {
            listingIds.push(row.dataValues.listingId);
        })
    }).then(function () {
        Model.Listing.findAndCountAll(filters).then(function(result) {
            var rows = result.rows;
            var totalResults = result.count;
            var rowData = [];
            var currentRow = 0;
            if(rows.length == 0)
                return callback({listings: rowData, currentUrl: 'listings', isAdmin: req.user.isAdmin})
            rows.forEach(function (row) {
                // check previous listing request for matches
                var alreadyRequested = listingIds.indexOf(row.dataValues.id) == -1 ? false : true
                utils.getAverageUserRating(row.dataValues.userId, function(rating) {
                    var publicValues = {
                        type: row.dataValues.type,
                        game: row.dataValues.game,
                        username: row.dataValues.username,
                        platform: row.dataValues.platform,
                        listingId: row.dataValues.id,
                        notes: row.dataValues.notes,
                        region: row.dataValues.region,
                        rating: rating,
                        voip: row.dataValues.voip,
                        voiceServer: row.dataValues.voiceServer,
                        voiceServerPassword: row.dataValues.voiceServerPassword,
                        serverName: row.dataValues.serverName,
                        serverHost: row.dataValues.serverHost,
                        serverPort: row.dataValues.serverPort,
                        serverCapacity: row.dataValues.serverCapacity,
                        timeAlive: moment(row.dataValues.createdAt).fromNow(),
                        requested: alreadyRequested,
                        createdAt: row.dataValues.createdAt

                    }
                    rowData.push(publicValues)
                    currentRow++
                    if (currentRow == rows.length) {
                        callback({listings: rowData, results: rows.length, resultsTotal: totalResults, currentUrl: 'listings', isAdmin: req.user.isAdmin})
                    }
                })
            });

        })

    })
}
function formatTime(time)
{
    var d = new Date(time)

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

    return h + ':' + m + ' ' + dd
}
