$('#loginHelp').click(function() {
    $('#signupAlert').addClass('hidden');
    $('#loginModal').modal('hide');
});
$('#signupHelp').click(function() {
    $('#loginAlert').addClass('hidden');
    $('#signupModal').modal('hide');
});
$('#loginButton').click(function(e) {
    e.preventDefault()
    var csrf = $("#csrf").val();
    $.post("/login", {
        username: $("#inputUsername").val(),
        password: $("#inputPassword").val(),
        timeOffset: (new Date()).getTimezoneOffset(),
        _csrf: csrf
    }, function(resp) {
        if (!resp.success) {
            $("#loginAlert").html(resp)
            $("#loginAlert").removeClass('hidden')
        } else {
            window.location.replace("/home")
        }
    })
})

$('#signupForm').submit(function(e) {
    $.post("/signup",$('#signupForm').serialize(), function(resp) {
        if (!resp.success) {
            $("#signupAlert").html(resp.message)
            $("#signupAlert").removeClass('hidden')
            grecaptcha.reset();
        } else {
            $('#signupModal').modal('hide');
            $('#loginModal').modal('show');
        }
    })
    e.preventDefault();
})

$('.modal').on('hidden.bs.modal', function () {
    grecaptcha.reset();
    $('#signupAlert').addClass('hidden');
    $('#loginAlert').addClass('hidden');
    $(this).find('form').trigger('reset');
})
$('.supportCff').click(function() {
    $("html, body").animate({ scrollTop: $(document).height() }, 1000);
})
