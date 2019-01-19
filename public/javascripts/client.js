$('[data-toggle="tooltip"]').tooltip();

$(".nav li").on("click", function() {
    $(".nav li").removeClass("active");
    $(this).addClass("active");
});

var notesTextMax = 500;
$('.notes').keyup(function() {
    var notesTextLength = $('.notes').val().length;
    var notesTextCurrent = notesTextMax - notesTextLength;
    $('.notesCountMessage').html(notesTextCurrent + ' remaining');
});
$('.serverNotes').keyup(function() {
    var notesTextLength = $('.serverNotes').val().length;
    var notesTextCurrent = notesTextMax - notesTextLength;
    $('.serverNotesCountMessage').html(notesTextCurrent + ' remaining');
});
$('.gamecardNotes').keyup(function() {
    var notesTextLength = $('.gamecardNotes').val().length;
    var notesTextCurrent = notesTextMax - notesTextLength;
    $('.gamecardNotesCountMessage').html(notesTextCurrent + ' remaining');
});
$('.addContact').click(function() {
    var username = $(this).attr('value');
    var csrf = $("#csrf").val();
    $.post('addContact', {username: username, _csrf: csrf}, function(resp) {
        if (resp.success) {
            return swal({
                title: 'Contact Added!',
                type: 'success',
                showConfirmButton: false,
                timer: 2000
            })
        }
        return swal({
            title: resp.message,
            type: 'error',
            showConfirmButton: false,
            timer: 2000
        })
    })
})
//if ($("#slideAlert")) {
//    $("#slideAlert").fadeTo(3000,500).slideUp(500);
//}
$('.modal').on('hidden.bs.modal', function () {
    $('.notesCountMessage').html(notesTextMax + ' remaining');
    $('.serverNotesCountMessage').html(notesTextMax + ' remaining');
    $('.gamecardNotesCountMessage').html(notesTextMax + ' remaining');
    $(this).find('form').trigger('reset');
})

var checkAndCreateListing = function($form, $modal, title, platform, csrf) {
    $.get('/listingsCheck', {title: title, platform: platform, _csrf: csrf}, function(match) {
        if (match.found) {
            swal({
                title: 'Found '+match.count+' matching listings!',
                text: "We found active listings matching the game you're posting about.",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'View Matches',
                cancelButtonText: 'Create My Listing',
                confirmButtonClass: 'btn btn-success',
                cancelButtonClass: 'btn btn-danger',
                buttonsStyling: false
            }).then(function() {
                window.location = "/listingsFiltered?_csrf="+csrf+"&contains="+title+"&platform="+platform+"&region=Any&orderBy=age+asc&type=game"
            }, function(dismiss) {
                // dismiss can be 'cancel', 'overlay',
                // 'close', and 'timer'
                if (dismiss === 'cancel') {
                    $.post('/createListing',$form.serialize(), function(resp) {
                        if (resp.success) {
                            swal({
                                title: 'Listing Posted!',
                                text: 'Add your email to your profile to get notified as soon as someone requests to play!',
                                type: 'success',
                                showConfirmButton: true
                            })
                        } else {
                            swal({
                                title: 'Listing Denied!',
                                text: resp.message,
                                type: 'error',
                                showConfirmButton: true
                            })
                        }
                        $modal.modal('hide');
                    })
                }
            })
        } else {
            $.post('/createListing',$form.serialize(), function(resp) {
                if (resp.success) {
                    swal({
                        title: 'Listing Posted!',
                        text: 'Add your email to your profile to get notified as soon as someone requests to play!',
                        type: 'success',
                        showConfirmButton: true
                    })
                } else {
                    swal({
                        title: 'Listing Denied!',
                        text: resp.message,
                        type: 'error',
                        showConfirmButton: true
                    })
                }
                $modal.modal('hide');
            })
        }
    })
}

$("#createListingForm").submit(function(e) {
    e.preventDefault();
    var $form = $(this)
    var $modal = $('#createListingModal')
    var title = $form.find('#gameTitle').val()
    var platform = $form.find('#platform').val()
    var csrf = $("#csrf").val();
    checkAndCreateListing($form, $modal, title, platform, csrf)
});
$("#gamecardForm").submit(function(e) {
    e.preventDefault();
    var $form = $(this)
    var $modal = $('#gamecardModal')
    var title = $form.find('#gameTitle').val()
    var platform = $form.find('#platform').val()
    var csrf = $("#csrf").val();
    checkAndCreateListing($form, $modal, title, platform, csrf)
});
$("#createServerForm").submit(function(e) {
    e.preventDefault();
    $.post('/createServer',$("#createServerForm").serialize(), function(resp) {
        if (resp.success) {
            swal({
                title: 'Server Posted!',
                type: 'success',
                showConfirmButton: true
            })
        } else {
            swal({
                title: 'Listing Denied!',
                text: resp.message,
                type: 'error',
                showConfirmButton: true
            })
        }
        $("#createServerListingModal").modal('hide');
    })
});
