var messageController = require('../controllers/messageController.js')

module.exports = function(express) {
    var router = express.Router()

    var isAuthenticated = function (req, res, next) {
        if (req.isAuthenticated()) {
            if (req.user.isBanned) {
                return req.logout()
            } else {
                return next()
            }
        }
        req.flash('error', 'You have to be logged in to access the page.')
        res.redirect('/')
    }

    router.post('/sendMessage', isAuthenticated, messageController.sendMessage)
    router.post('/deleteMessage', isAuthenticated, messageController.deleteMessage)
    router.post('/messages/read', isAuthenticated, messageController.setMessageAsRead)
    router.get('/messages', isAuthenticated, messageController.getMessages)

    return router
}
