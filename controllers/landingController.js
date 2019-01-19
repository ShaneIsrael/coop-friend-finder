var Model = require('../model/models.js')
var moment = require('moment')

module.exports.show = function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/home')
    } else {
        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        var firstDayOfMonth = new Date(y, m, 1);
        firstDayOfMonth = moment(firstDayOfMonth).format();

        Model.Donation.findAndCountAll({
            where: {
                createdAt: {
                    $gt: firstDayOfMonth
                }
            }
        }).then(function(result) {
            var totalAmount = 0;
            result.rows.forEach(function(row) {
                totalAmount = totalAmount + parseInt(row.dataValues.amount);
            })
            totalAmount = totalAmount / 100;
            res.render('landing', {donationCount: result.count, donationAmount: totalAmount, donationGoal: process.env.DONATION_GOAL, stripe_pub_key: process.env.STRIPE_PUBLIC_KEY})
        })
    }
}
