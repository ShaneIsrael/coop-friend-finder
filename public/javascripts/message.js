$('.quickSendMessage').click(function() {
    $("#composeMessageModal").modal();
    $("#composeMessageModal").find("#inputTo").val($(this).val());
})

$("#composeMessageForm").on('submit', function(e) {
    e.preventDefault();

    $.post('sendMessage', $("#composeMessageForm").serialize(), function(resp) {
        if (resp.success) {
            swal({
                title: "Message Sent!",
                type: 'success',
                showConfirmButton: false,
                timer: 2000
            })
            return $("#composeMessageModal").modal('hide');
        }
        swal({
            title: resp.message,
            type: 'error',
            showConfirmButton: false,
            timer: 2000
        })
        //$("#composeMessageModal").modal('hide');
    })
})

var prev = null;
$(".messageItem").click(function() {
    var subject = stripScripts($(this).attr("messageSubject"));
    var body = stripScripts($(this).attr("messageBody"));
    var id = $(this).attr("messageId");
    var unread = $(this).attr("unread");
    var from = $(this).attr("messageFrom");
    var csrf = $("#csrf").val();

    if (unread) {
        $(this).addClass('read');
        $(this).find('.badge').html('read');
        $.post("/messages/read", {_csrf: csrf, messageId: id}, function (resp) {})
    }

    $(this).addClass('selected-message');
    if (prev)
        $(prev).removeClass('selected-message');
    prev = $(this);
    if (subject && body) {
        $('.messagePanel').removeClass('hidden');
        $('.messagePanel').find('.quickSendMessage').val(from);
    }
    $('.messagePanel').find('.panel-heading').html(subject);
    $('.messagePanel').find('.panel-body').html(body);
    $('.addContact').click(function() {
        var username = $(this).attr('value');
        $.post('addContact', {username: username}, function(resp) {
            if (resp.success) {
                return swal({
                    title: 'Contact Added!',
                    type: 'success',
                    showConfirmButton: false,
                    timer: 2000
                })
            }
            swal({
                title: resp.message,
                type: 'error',
                showConfirmButton: false,
                timer: 2000
            })
        })
    })
})

var bodyTextMax = 500;
$('#bodyCountMessage').html(bodyTextMax + ' remaining');
$('#inputBody').keyup(function() {
    var bodyTextLength = $('#inputBody').val().length;
    var bodyTextCurrent = bodyTextMax - bodyTextLength;
    if (bodyTextCurrent < 0) {
        $('#inputBody').val($('#inputBody').val().substring(0, bodyTextMax));
    }
    $('#bodyCountMessage').html(bodyTextCurrent + ' remaining');
});


showContactsModal = function(contacts) {
    if (contacts.length > 0) {
        var html = "";
        contacts.forEach(function (contact) {
            html += "<button id='contact-" + contact.id + "' class='list-group-item contactItem' value='" + contact.username + "'><h3>" + contact.username + "</h3><a id='deleteContactButton' value='" + contact.id + "' class='btn btn-sm btn-danger pull-right'>remove</a></button>"
        });
        $("#contactListGroup").html(html);
        $(".contactItem").click(function () {
            var contact = $(this).val();
            $("#inputTo").val(contact);
            $("#contactListModal").modal('hide');
        })
        $("#deleteContactButton").click(function (e) {
            e.stopPropagation();
            var contactId = $(this).attr("value");
            var csrf = $("#csrf").val();
            $.post("deleteContact", {_csrf: csrf, id: contactId}, function (resp) {
                if (resp.success) {
                    $("#contact-" + contactId).remove();
                }
            });
        })
        $("#contactListModal").modal('show');
    } else {
        swal({
            title: "You don't have any contacts",
            type: "warning",
            showConfirmButton: false,
            timer: 2000
        })
    }
}

var contacts = [];
$(".viewContactsButton").click(function() {
    if (contacts.length == 0) {
        $.get("getContacts", function(resp) {
           if (resp.success) {
               resp.contacts.forEach(function(contact) {
                   contacts.push(contact);
               })
               showContactsModal(contacts);
           }
        });
    } else {
        showContactsModal(contacts);
    }
});

$('.modal').on('hidden.bs.modal', function () {
    $(this).find('form').trigger('reset');
})
function stripScripts(s) {
    var div = document.createElement('div');
    div.innerHTML = s;
    var scripts = div.getElementsByTagName('script');
    var i = scripts.length;
    while (i--) {
        scripts[i].parentNode.removeChild(scripts[i]);
    }
    return div.innerHTML;
}