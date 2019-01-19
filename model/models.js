var UserMeta = require('./User.js'),
    ListingMeta = require('./Listing.js'),
    RequestMeta = require('./Request.js'),
    RatingMeta = require('./Ratings.js'),
    Contact = require('./Contact.js'),
    Message = require('./Message.js'),
    ProfileInfo = require('./ProfileInfo.js'),
    Subscription = require('./Subscription.js'),
    Donation = require('./Donations.js'),
    GameMatch = require('./GameMatch.js'),
    connection = require('../sequelize.js')

var models = {}

models.User = connection.define('users', UserMeta.attributes, UserMeta.options)
models.Listing = connection.define('listings', ListingMeta.attributes, ListingMeta.options)
models.Request = connection.define('requests', RequestMeta.attributes, RequestMeta.options)
models.Ratings = connection.define('ratings', RatingMeta.attributes, RatingMeta.options)
models.Contact = connection.define('contacts', Contact.attributes, Contact.options)
models.Message = connection.define('messages', Message.attributes, Message.options)
models.ProfileInfo = connection.define('profileInfo', ProfileInfo.attributes, ProfileInfo.options)
models.Subscription = connection.define('subscription', Subscription.attributes, Subscription.options)
models.Donation = connection.define('donation', Donation.attributes, Donation.options)
models.GameMatch = connection.define('gameMatch', GameMatch.attributes, GameMatch.options)

models.User.hasMany(models.Listing)
models.User.hasMany(models.Request)
models.User.hasMany(models.Ratings)
models.User.hasMany(models.Contact)
models.User.hasMany(models.Subscription)
models.User.hasOne(models.ProfileInfo)
models.Listing.hasMany(models.Request)
models.Request.belongsTo(models.User)
models.Request.belongsTo(models.Listing)
models.Contact.belongsTo(models.User)

connection.sync()


module.exports = models
