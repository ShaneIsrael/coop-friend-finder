var socket = io();
var username = $('#chatWell').attr('username');
var unamePatt = new RegExp("\\b"+username+"\\b", "g");

$(".modalMinimize").on("click", function(){
    scrollChat();
    $('#message').focus();
});

$('#chatForm').submit(function(e) {
    socket.emit('chat message', {content: $('#message').val(), username: username, timestamp: Date.now()});
    $('#message').val('');
    return false;
});
socket.on('chat message', function(msg) {
    //check for handles
    var tagged = unamePatt.test(msg.content)
    var taggedCss = '';
    if (tagged) {
        taggedCss = 'msgTagged'
        $('#globalChatModal').find('.modal-header').toggleClass(taggedCss);
        setTimeout(function() {
            $('#globalChatModal').find('.modal-header').toggleClass(taggedCss);
        }, 3000)
    }
    var usernameHtml;
    if (msg.username == $('#chatWell').attr('username')) {
        usernameHtml = "<b style='color: #1d599e'>"+msg.username+"</b>: "
    } else {
        usernameHtml = "<b style='color: orange'>"+msg.username+"</b>: "
    }
    $('#chatMessages').append($("<a class='list-group-item "+taggedCss+"'>").html("<span class='badge pull-right'>"+new Date(msg.timestamp).toLocaleTimeString()+"</span>" + usernameHtml + msg.content))

    if ($('#chatmessages > a').length > 100) {
        $('#chatMessages > a')[0].remove();
    }
    scrollChat();
})

function scrollChat() {
    $('#chatWell').animate({
        scrollTop: 100000
    }, 10);
}
