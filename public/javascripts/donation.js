(function() {
    var handler = StripeCheckout.configure({
        key: $(".stripe-pub-key").attr('data-key'),
        locale: 'auto',
        name: 'Coop Friend Finder',
        image: '/img/favicon.png',
        description: 'One-time donation',
        token: function(token) {
            $('input#stripeToken').val(token.id);
            $('form').submit();
        }
    })
    $('#donateButton').click(function(e) {
        e.preventDefault();
        var amount = $('input#donateInput').val();
        amount = amount.replace(/\$/g, '').replace(/\,/g, '')
        amount = parseFloat(amount);
        if (isNaN(amount)) {
            swal({
                title: 'Invalid Amount!',
                text: 'Please enter a valid amount in USD ($)',
                type: 'error',
                showConfirmButton: true
            })
        }
        else if (amount < 1.00) {
            swal({
                title: 'Invalid Amount!',
                text: 'Donation amount must be at least $1.',
                type: 'error',
                showConfirmButton: true
            })
        }
        else {
            amount = amount * 100; // Needs to be an integer!
            handler.open({
                amount: Math.round(amount)
            })
        }
    })
})()