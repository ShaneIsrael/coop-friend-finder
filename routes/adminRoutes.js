var adminController = require('../controllers/adminController.js')

module.exports = function(express) {
    var router = express.Router()

    var isAdminAuthenticated = function (req, res, next) {
        if (req.isAuthenticated() && req.user.isAdmin)
            return next()
        req.flash('error', 'You have to be logged in as an admin to access this feature')
        res.redirect('/')
    }

    router.post('/admin/ban', isAdminAuthenticated, adminController.ban)
    router.post('/admin/deleteListing', isAdminAuthenticated, adminController.deleteListing)

    return router
}