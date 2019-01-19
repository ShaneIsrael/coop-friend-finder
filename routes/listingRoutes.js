var listingController = require('../controllers/listingController.js')

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

    router.post('/createListing', isAuthenticated, listingController.createGameListing)
    router.post('/createServer', isAuthenticated, listingController.createServerListing)
    router.post('/deleteListing', isAuthenticated, listingController.delete)
    router.get('/listingsFiltered', isAuthenticated, listingController.showListingsWithFilters)
    router.get('/myListings', isAuthenticated, listingController.showMyListings)
    router.get('/listings', isAuthenticated, listingController.showListings)
    router.get('/listingsCheck', isAuthenticated, listingController.gameListingCheck)
    router.get('/readOnly', listingController.showReadOnlyListings)

    return router
}