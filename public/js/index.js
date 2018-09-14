var socket = io();

socket.on('connect', function () {
    // socket.emit('createEmail', {
    //    to: 'mitch@mitch.com',
    //    text: 'my man be listening'
    // });
});

//object being sent from server
socket.on('newMessage', function (message) {
    console.log('NEW MESSAGE: \n', message);
    var boxText = document.getElementById('chatzone').value += (`\n ${message.from}: ${message.text}`);
});


window.onload = function () {
    document.getElementById("sendButton").addEventListener('click', sendmessage);

};

var sendmessage = function () {
   var boxContents = document.getElementById('messageText').value;
   var name = document.getElementById('name').value;
    socket.emit('createMessage', {
        from: name,
        text: boxContents,
    });
    document.getElementById('messageText').value = '';
};

socket.on('disconnect', function () {
    console.log('server ded');

});
