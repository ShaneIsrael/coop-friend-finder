var CronJob = require('cron').CronJob
var Model = require('../model/models.js')

// every day remove expired subscriptions, send user message
var job = new CronJob('0 0 0 */1 * *', function() {
    console.log('running job: expire subscriptions')
    var today = new Date()
    Model.Subscription.findAll({
        where: {
            endDate: {
                $lt: today
            }
        }
    }).then(function (rows) {
        rows.forEach(function(row) {
            Model.User.findOne({
                where: {
                    id: row.dataValues.userId
                }
            }).then(function(user) {
                var newMessage = {
                    toUsername: user.username,
                    fromUsername: 'SYSTEM',
                    subject:'SMS Subscription Expired',
                    body: 'Your sms 1 year subscription has expired. If you would like to keep getting sms notifications' +
                    ' you will need renew your subscription. To do that, visit your profile page.',
                    userId: -1
                }
                Model.Message.create(newMessage).then(function(){})
            })
        })

        Model.Subscription.destroy({
            where: {
                endDate: {
                    $lt: today
                }
            }
        })
    })
});

job.start();
