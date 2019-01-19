var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
var Model = require('../model/models.js')
var moment = require('moment')

module.exports.chargeSms = function(req, res) {
    var stripeToken = req.body.stripeToken;

    charge(stripeToken, 500, "1 Year SMS Subscription - userId: " + req.user.id, function(resp) {
        if (resp.success == false) {
            req.flash('error', message)
            return res.redirect('/profile')
        }
        //Render a thank you page called "Charge"
        var now = moment(new Date(), "MM-DD-YYYY")
        var end = moment(new Date(), "MM-DD-YYYY").add(12, 'months')
        var subscription = {
            subscription: 'sms',
            startDate: now,
            endDate: end,
            term: 12,
            userId: req.user.id
        }
        Model.Subscription.create(subscription).then(function() {})
        req.flash('success', 'Purchase Successful! To activate SMS notifications, save a phone number to your profile.')
        res.redirect('/profile')
    });
}

module.exports.chargeDonation = function(req, res) {
    var stripeToken = req.body.stripeToken
    var amount = parseInt(req.body.amount * 100)

    charge(stripeToken, amount, "donation", function(resp) {
        if (resp.success == false) {
            req.flash('error', resp.message)
            return res.redirect('/')
        }
        var username = req.user == null ? null : req.user.username
        var newDonation = {
            username: username,
            amount: amount
        }
        Model.Donation.create(newDonation);
        req.flash('success', 'Thank you very much for your donation!')
        res.redirect('/')
    })
}

var charge = function(token, amount, description, done) {
   stripe.charges.create({
        amount: amount,
        currency: "usd",
        source: token,
        description: description
    }, function(err, charge) {
        if (err) {
            var message;
            switch (err.type) {
                case 'StripeCardError':
                    // A declined card error
                    message = err.message; // => e.g. "Your card's expiration year is invalid."
                    break;
                case 'RateLimitError':
                    // Too many requests made to the API too quickly
                    message = 'Too many requests, please try again later.';
                    break;
                default:
                    message = 'An unknown error occurred, please contact an admin: ' + err.message;
                    break;
            }
            done({success: false, message: message});
        }
       done({success: true})
    });
}
