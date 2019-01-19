var checkServerStatus = function() {
    $(".serverItem").each(function () {

        var $serverItem = $(this);
        var $address = $serverItem.find(".serverHost");
        if ($address) {
            var addressToCheck = $address.val();
            isServerOnline(addressToCheck, $serverItem, function(online, serverItem) {
                if (online == true) {
                    serverItem.find('.online-led span').attr('data-original-title', 'Online')
                    serverItem.find('.online-led').removeClass("led-red");
                    serverItem.find('.online-led').addClass("led-green");
                } else {
                    serverItem.find('.online-led span').attr('data-original-title', 'Offline')
                    serverItem.find('.online-led').removeClass("led-green");
                    serverItem.find('.online-led').addClass("led-red");
                }
            })
        }

    });
}

var isServerOnline = function(address, $item, done){
    var csrf = $("#csrf").val();
    $.get('/serverStatus', {url: address, _csrf: csrf}, function(online) {
        done(online, $item);
    });
}

$("#requestForm").submit(function() {
    $.post("listings/request", $(this).serialize())
})

$(".requestButton").click(function() {
    var listingId = $(this).attr('name');
    var platformTitle = $(this).attr('platform');
    var $form = $("a[listingId="+listingId+"]").find("#requestForm");
    var $requestButton = $(this);

    swal({
        title: platformTitle + " Username?",
        text: "Please enter your in-game name so they have a way to contact you.",
        input: "text",
        showCancelButton: true,
        closeOnConfirm: false,
        inputPlaceholder: "My " + platformTitle + " Username",
        inputValidator: function (value) {
            return new Promise(function (resolve, reject) {
                if (value) {
                    resolve()
                } else {
                    reject('You need to provide your in-game name!')
                }
            })
        }
    }).then(function (result) {
        $form.find('#platformUsername').val(result);
        $.post("listings/request", $form.serialize(), function(resp) {
            if (resp.success == true) {
                $requestButton.prop('disabled', true);
                $requestButton.html('Request Sent!')
                swal({
                    title: 'Request Sent!',
                    text: 'Add your email to your profile to get notified as soon as your request is accepted!',
                    type: "success",
                    showConfirmButton: true
                })
            } else {
                swal({
                    title: 'Sorry!',
                    text: resp.error,
                    type: 'error',
                    showConfirmButton: true
                })
            }
            return
        })
    })
})
checkServerStatus();
