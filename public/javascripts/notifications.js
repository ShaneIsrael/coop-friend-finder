var pn = io('/push-notifications');
var pncName = getCookie('pnc');

pn.on(pncName, function(data) {
    var icon = 'glyphicon glyphicon-envelop';
    switch (data.type) {
        case 'request':
            icon = 'glyphicon glyphicon-refresh';
            break
        case 'new message':
            icon = 'glyphicon glyphicon-envelop';
            break
        case 'accepted request':
            icon = 'glyphicon glyphicon-star';
            break
    }
    displayPushNotification(data.title, data.message, data.url, icon);
})

function displayPushNotification(title, message, url, icon) {
    $.notify({
        icon: icon,
        title: "<strong>"+title+"</strong>" + " -",
        message: message,
        url: url,
    }, {
        type: "info",
        allow_dismiss: true,
        newest_on_top: true,
        placement: {
            from: "top",
            align: "right"
        },
        animate: {
            enter: 'animated fadeInDown',
            exit: 'animated fadeOutRight'
        },
        delay: 10000
    })


    Notification.requestPermission(function(result) {
        if (result === 'granted') {
            var notification = new Notification(title, {
                body: message,
                icon: '/img/coopff_logo_icon.png'
            });
            notification.onclick = function () {
                window.open(url);
            };
        }
    });
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}

