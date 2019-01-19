displayGamecardModal = function(game) {
    $("#gamecardModal").find(".modal-title").html("Quick Create - " + game);
    $("#gamecardModal").find("#gameTitle").attr("value", game);
    $("#gamecardModal").modal();
}

var notesTextMax = 500;
$("#gamecardModal").find('#notesCountMessage').html(notesTextMax + ' remaining');
$("#gamecardModal").find('.notes').keyup(function() {
    var notesTextLength = $(this).val().length;
    var notesTextCurrent = notesTextMax - notesTextLength;
    $("#gamecardModal").find('#notesCountMessage').html(notesTextCurrent + ' remaining');
});

$(".motd-alert").click(function() {
    if ($(this).attr('data-status') == 'shown') {
        $(this).attr('data-status', 'hidden')
        $(this).slideUp(500, function () {});
    } else if ($(this).attr('data-status') == 'hidden') {
        $(this).attr('data-status', 'shown')
        $(this).slideDown(500, function () {});
    }
})
