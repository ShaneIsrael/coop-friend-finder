(function() {
    $('.saveProfileButton').click(function() {
        $.post('/profile', $('#profileForm').serialize(), function(resp) {
            if (resp.success) {
                return swal({
                    title: 'Profile Updated',
                    type: 'success',
                    showConfirmButton: false,
                    timer: 2000
                })
            } else {
                swal({
                    title: 'Error',
                    text: resp.message,
                    type: 'error',
                    showConfirmButton: false,
                    timer: 5000
                })
            }
        })
    })
})()