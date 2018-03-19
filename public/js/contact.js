var socket =  io();

socket.on('connect', function() {
    console.log('Connected to server.');

    // socket.emit('createMessage', {
    //     from: 'Marnel',
    //     text: 'Yup. That works with me.'
    // });

});

socket.on('disconnect', function() {
    console.log('Disconnected from the server.');
});

socket.on('newMessage', function(message) {
    console.log('newMessage', message);

    var li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    // jQuery('#conversation').append(`${message.from}: ${message.text}`);

    jQuery('#conv-list').append(li);
});


jQuery('#message-form').on('submit', function(e){
    e.preventDefault();
    
    socket.emit('createMessage', {
        from:'User',
        text: jQuery('#message').val()
    }, function(){

    });
    
});