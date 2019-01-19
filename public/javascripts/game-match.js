var rateMatch = function(id, rating) {
    var csrf = $("#csrf").val();
    $.post("/rateAcceptedRequest", {id: id, ratedUp: rating, _csrf: csrf}, function(resp) {
        if (!resp.success) {
            swal({
                title: 'Unknown Error',
                text: 'An unknown error occurred while trying to rate this match.',
                type: 'error',
                showCancelButton: false,
                confirmButtonText: 'OK'
            })
        }
    })
};
$('.rateMatch').click(function() {
    var id = $(this).val();
    swal({
        title: 'Rate This Match',
        type: 'info',
        text: 'How would you rate your experience with this match up?',
        showCloseButton: true,
        showCancelButton: true,
        cancelButtonColor: '#d33',
        confirmButtonText:
            '<i class="fa fa-thumbs-up"></i> Great!',
        cancelButtonText:
            '<i class="fa fa-thumbs-down"></i>'
    }).then(function() {
        $('#ribbon'+id).removeClass('ribbon-black')
        $('#ribbon'+id).addClass('ribbon-green')
        $('#ribbon'+id).html("<i class='fa fa-thumbs-up'></i>")
        $('.rateMatch').removeClass('btn-warning')
        $('.rateMatch').prop('disabled', true);
        $('.rateMatch').html('Already Rated');
        rateMatch(id, true);
    }, function(dismiss) {
        if (dismiss === 'cancel') {
            $('#ribbon'+id).removeClass('ribbon-black')
            $('#ribbon'+id).addClass('ribbon-red')
            $('#ribbon'+id).html("<i class='fa fa-thumbs-down'></i>")
            $('.rateMatch').removeClass('btn-warning')
            $('.rateMatch').prop('disabled', true);
            $('.rateMatch').html('Already Rated');
            rateMatch(id, false);
        }
    })
});