// application

var express = require('express'),
    app = express(),
    setupPassport = require('./setup/setupPassport'),
    flash = require('connect-flash'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    jsonParser = bodyParser.json(),
    favicon = require('serve-favicon'),
    path = require('path'),
    socketIo = require('socket.io'),
    redis = require('redis'),
    moment = require('moment'),
    csrf = require('csurf');

var io = socketIo()
app.io = io

var redisCredentials = {'port': process.env.REDIS_PORT, 'host': process.env.REDIS_HOST}
var redisClient = redis.createClient(redisCredentials.port, redisCredentials.host);

var port = process.env.PORT || 3000

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('trust proxy', 1);

app.use(cookieParser())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(session({ secret: '4564f6s4fdsfdfd', resave: false, saveUninitialized: false}))
app.use(csrf());

app.use('/styles', express.static(__dirname + '/styles'))

app.use(flash())
app.use(function(req, res, next) {
    res.locals.errorMessage = req.flash('error')
    res.locals.successMessage = req.flash('success')
    res.locals._csrf = req.csrfToken();
    next()
});

app.use(jsonParser)

// Static Assets
app.use('/img', express.static(path.join(__dirname, 'public/images')));
app.use('/js', express.static(path.join(__dirname, 'public/javascripts')));
app.use('/css', express.static(path.join(__dirname, 'public/stylesheets')));
app.use('/fonts', express.static(path.join(__dirname, 'public/fonts')));
app.use('/sounds', express.static(path.join(__dirname, 'public/sounds')));
app.use(favicon(path.join(__dirname, '/public/images/', 'favicon.png')));

setupPassport(app)

app.use(require('./routes')(express))
app.use(require('./routes/listingRoutes')(express))
app.use(require('./routes/requestRoutes')(express))
app.use(require('./routes/contactRoutes')(express))
app.use(require('./routes/messageRoutes')(express))
app.use(require('./routes/adminRoutes')(express))
app.use(require('./routes/profileRoutes')(express))
app.use(require('./routes/paymentRoutes')(express))
app.use(require('./routes/utilsRoutes')(express))

// Start Cron jobs
var cleanListingsCron = require('./cron/cleanListings')
var expireSubscriptionsCron = require('./cron/expireSubscriptions')

io.on('connection', function(socket) {
    console.log('\nConnected to global')
    socket.on('chat message', function(msg) {
        console.log(msg);
        if (/\S/.test(msg.content)) {
            msg.content = msg.content.replace(/<(?:.|\n)*?>/gm, '')
            msg.content = msg.content.substring(0, 250)
            redisClient.lpush('chatMessages', JSON.stringify(msg))
            redisClient.ltrim('chatMessages', 0, 99);
            io.emit('chat message', msg)
        }
    })
    socket.on('disconnect', function() {
        console.log('\nUser disconnected')
    })
})

var pnNsp = io.of('/push-notifications')
pnNsp.on('connection', function(socket) {
    console.log('\nConnected to notifications')
    socket.on('disconnect', function() {
        console.log('\nDisconnected from notifications')
    })

})

app.pnNsp = pnNsp;

console.log('Server started on port ' + port)

module.exports = app
