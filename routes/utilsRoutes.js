var utilsController = require('../controllers/utilsController.js')

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

    router.get('/serverStatus', isAuthenticated, utilsController.serverStatus)

    return router
}
