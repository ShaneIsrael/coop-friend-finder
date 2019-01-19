var Model = require('../model/models.js')

module.exports.addContact = function (req, res) {
    var usernameToAdd = req.body.username;

    Model.User.findOne({
        where: {
            username: usernameToAdd
        }
    }).then(function(exists) {
        if (!exists) {
            return res.send({success: false, message: "That user does not exist"})
        }
        Model.Contact.findOne({
            where: {
                userId: req.user.id,
                username: usernameToAdd
            }
        }).then(function(exists) {
            if (exists) {
                return res.send({success: false, message: "Already Added"})
            }
            var newContact = {
                username: usernameToAdd,
                userId: req.user.id
            }
            Model.Contact.create(newContact).then(function(){})
            return res.send({success: true})
        })
    })
}
module.exports.getAllContacts = function (req, res) {
    var userId = req.user.id;

    Model.Contact.findAll({
        where: {
            userId: userId
        }
    }).then(function(rows) {
        var contacts = []
        rows.forEach(function(row) {
            contacts.push(row.dataValues)
        })
        res.send({success: true, contacts: contacts})
    })
}
module.exports.deleteContact = function (req, res) {
    var id = req.body.id;

    Model.Contact.destroy({
        where: {
            id: id
        }
    }).then(function(){})

    res.send({success: true})
}
