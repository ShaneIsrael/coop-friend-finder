var ping = require('ping')

module.exports.serverStatus = function (req, res) {
    var url = req.query.url;

    if (url.indexOf('http://') == 0) {
        url = url.replace('http://', '');
    }
    if (url.indexOf('https://') == 0) {
        url = url.replace('https://', '');
    }
    url = url.replace(/\//g, '');
    ping.sys.probe(url, function(isAlive) {
        if (isAlive) {
            return res.send(true);
        }
        return res.send(false);
    })
}
