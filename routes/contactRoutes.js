var contactController = require('../controllers/contactController.js')

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

    router.post('/addContact', isAuthenticated, contactController.addContact)
    router.post('/deleteContact', isAuthenticated, contactController.deleteContact)
    router.get('/getContacts', isAuthenticated, contactController.getAllContacts)

    return router
}
