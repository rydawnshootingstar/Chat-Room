/*///////////////////////////////////////////////////
*
*                 OTHER FUNCTIONS
*
*
*/////////////////////////////////////////////////////
var socket = io();
var scrollToBottom = function (){
    //selectors
    //gets entire OL
    var messages = $('#chatzone');
    //last posted message
    var newMessage = messages.children('li:last-child');

    //jquery way to cross-browser select a height property
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

/*///////////////////////////////////////////////////
*
*                 SOCKETS
*
*
*/////////////////////////////////////////////////////

/*listener for when user loads this file. they will click login on index, be redirected to chat.html
* at which time this socket will be created, immediately requesting to join room
* */
socket.on('connect', function () {
    var params = $.deparam(window.location.search);
    socket.emit('joinRoom', params, function(err){
        if(err){
            alert(err);
            //manipulate which page user is on (send them home)
            window.location.href = '/';
        }else{
            console.log('no error joining room');
        }
    });
});

//listener for messages coming back from server
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

//listener for location message coming back from server
socket.on('newLocationMessage', function (message){
    var li=$('<li></li>');
   //opens a link in a new tab
   var a = $('<a target="_blank">My Current Location</a>');
   //specify value of an element
   a.attr('href', message.url);
   li.append(a);
   $('#locationholder').append(li);
});

/*submission of message to server (send button in chat.html)
e is the argument we get back and need to access*/
jQuery('#messageForm').on('submit', function (e) {
    //default action of submitting a form (POST request) is not wanted
e.preventDefault();
var messageTextbox = $('[name=message]');
socket.emit('createMessage', {
    text: messageTextbox.val()
}, function (){
    //clear box after sending
        //messageTextbox.val('');
    });
$('[name=message]').val('');
});

//# is select by id. this is actually the more efficient way to do this, rather than tack .on to the first call
var locationButton = $('#sendLocation');
locationButton.on('click', function (){
   if(!navigator.geolocation) {
       return alert('Geolocation Not Supported By Browser');
   }
   /*if user has support for feature, disable it after a click, so they can't request again
    side note: this re-enables button - locationButton.removeAttr('disabled');
    */
   locationButton.attr('disabled', 'disabled');

   //get coordinates based on browser
   navigator.geolocation.getCurrentPosition(function(position){
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

//listener for connection with the server
socket.on('disconnect', function () {
    console.log('server ded');
});

//listener for userlist. updates in the sidebar of chat.html
socket.on('updateUserList', function (users){
    var ol = $('<ol> </ol>');
    users.forEach(function (user){
        ol.append($('<li></li>').text(user));
    });
    //div element inside sidebar
    $('#users').html(ol);
});
