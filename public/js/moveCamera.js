$('button').click(function(e) {
    e.preventDefault();
console.log($('#camUri').val());
    $.ajax({
        type: 'POST',
        url: '/camera',
        data: {
            id: $(this).val(),
            uri: $('#camUri').html()
        },
        success: result => {
            console.log(result);
        },
        error: result => {
            console.log(result);
        }
    });
});

