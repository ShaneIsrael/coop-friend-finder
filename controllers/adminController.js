var Model = require('../model/models.js')

module.exports.ban = function (req, res) {
    var usernameToBan = req.body.username;

    Model.User.update({
        isBanned: true
    }, {
        where: {
            username: usernameToBan
        }
    }).then(function(result) {
        if (result) {
            /* delete all users listings */
            Model.Listing.destroy({
                where: {
                    username: usernameToBan
                }
            })
            req.flash('success', 'User banned successfully!')
            res.redirect('/listings')
        }
    })

}
module.exports.deleteListing = function (req, res) {
    var id = req.body.id;

    Model.Listing.destroy({
        where: {
            id: id
        }
    }).then(function(count){
        console.log(count);
        res.redirect('/listings')
    })
}