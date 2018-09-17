var socket = io();

var scrollToBottom = function (){
    //selectors
    //gets entire OL
    var messages = $('#chatzone');
    //last posted message
    var newMessage = messages.children('li:last-child');

    //heights
    //jquery way to cross browser select a property
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    //moves us to second to last posted message
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop +newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight);
    };
};

socket.on('connect', function () {

});

//object being sent from server
socket.on('newMessage', function (message) {
    var formattedTime = moment(message.createdAt).format('h:mm');
    var template = $('#message-template').html();
    var html = Mustache.render(template, {
        text: (message.text + '\n '),
        from: message.from,
        createdAt: formattedTime
    });

    $('#chatzone').append(html);
    scrollToBottom();
    // var formattedTime = moment(message.createdAt).format('h:mm');
    // console.log('NEW MESSAGE: \n', message);
    // $('#chatzone').append('\n', message.from, ' [',formattedTime, ']: ', message.text);
});

socket.on('newLocationMessage', function (message){
    var li=$('<li></li>');
   //opens a link in a new tab
   var a = $('<a target="_blank">My Current Location</a>');
   //specify value of an element
   a.attr('href', message.url);
   li.append(a);
   $('#locationholder').append(li);
});


window.onload = function () {

};


//e is the argument we get back and need to access
jQuery('#messageForm').on('submit', function (e) {
    //default action of submitting a form is not wanted
e.preventDefault();

//location submit
var messageTextbox = $('[name=message]');
var nameTextbox = $('[name=username]');
socket.emit('createMessage', {
    from: nameTextbox.val(),
    text: messageTextbox.val()
}, function (){
    //clear box after sending
        messageTextbox.val('');
    });
$('[name=message]').val('');
});

//# is select by id. this is actually the more efficient way to do this, rather than tack .on to the first call
var locationButton = $('#sendLocation');
locationButton.on('click', function (){
   if(!navigator.geolocation) {
       return alert('Geolocation Not Supported By Browser');
   }
   //if user has support for feature, disable it after a click, so you can't spam it
   locationButton.attr('disabled', 'disabled');

   //get coordinates based on browser
   navigator.geolocation.getCurrentPosition(function(position){
       //re-enables button
       // locationButton.removeAttr('disabled');
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        socket.emit('createLocationMessage', {
            lat,
            lng
        });
   }, function(err){
       locationButton.removeAttr('disabled');
       alert('Unable to fetch location');
       console.log(err);
   });
});


socket.on('disconnect', function () {
    console.log('server ded');

});
