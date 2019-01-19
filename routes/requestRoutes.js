var requestController = require('../controllers/requestController.js')

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

    router.post('/listings/request', isAuthenticated, requestController.sendRequest)
    router.post('/cancelRequest', isAuthenticated, requestController.cancelRequest)
    router.post('/declineRequest', isAuthenticated, requestController.declineRequest)
    router.post('/acceptRequest', isAuthenticated, requestController.acceptRequest)
    router.post('/rateAcceptedRequest', isAuthenticated, requestController.rate)
    router.get('/requests', isAuthenticated, requestController.showRequests)
    router.get('/requestsSent', isAuthenticated, requestController.showSentRequests)
    router.get('/requestsAccepted', isAuthenticated, requestController.showAcceptedRequests)

    return router
}