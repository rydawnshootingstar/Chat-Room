var socket = io();

socket.on('connect', function () {

});

//object being sent from server
socket.on('newMessage', function (message) {
    console.log('NEW MESSAGE: \n', message);
    $('#chatzone').append('\n', message.from, ':', message.text);
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

socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
}, function (){

    });
//clear box after sending
$('[name=message]').val('');
});

//# is select by id. this is actually the more efficient way to do this, rather than tack .on to the first call
var locationButton = $('#sendLocation');
locationButton.on('click', function (){
   if(!navigator.geolocation) {
       return alert('Geolocation Not Supported By Browser');
   }
   //get coordinates based on browser
   navigator.geolocation.getCurrentPosition(function(position){
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        socket.emit('createLocationMessage', {
            lat,
            lng
        });
   }, function(err){
       alert('Unable to fetch location');
       console.log(err);
   });
});


socket.on('disconnect', function () {
    console.log('server ded');

});
