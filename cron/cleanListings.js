var CronJob = require('cron').CronJob
var Model = require('../model/models.js')

// every hour deletes any listing older than 12 hours
var job = new CronJob('0 0 */1 * * *', function() {
   var cutoffTime = new Date();
   var cutoffTimeServer = new Date();
   cutoffTime.setHours(cutoffTime.getHours() - 48);
   cutoffTimeServer.setHours(cutoffTime.getHours() - 72);

   /** Remove game listings after 2 days **/
   Model.Listing.findAll({
      where: {
         type: 'game',
         createdAt: {
            $lt: cutoffTime
         }
      }
   }).then(function (rows) {
      rows.forEach(function(row) {
         Model.Request.destroy({
            where: {
               listingId: row.dataValues.id
            }
         })
         Model.Listing.destroy({
            where: {
               id: row.id
            }
         })
      })
   })

   /** Remove server listings after 3 days **/
   Model.Listing.findAll({
      where: {
         type: 'server',
         createdAt: {
            $lt: cutoffTimeServer
         }
      }
   }).then(function (rows) {
      rows.forEach(function(row) {
         Model.Listing.destroy({
            where: {
               id: row.id
            }
         })
      })
   })
});

job.start();