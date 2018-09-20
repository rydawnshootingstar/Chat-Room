/*///////////////////////////////////////////////////
*
*                 IMPORTS
*
*
*/////////////////////////////////////////////////////
const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const {generateMessage} = require('./utils/message');
const {generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');


/*///////////////////////////////////////////////////
*
*                 SERVER CONFIG
*
*
*/////////////////////////////////////////////////////
//variables
const port = process.env.PORT || 3000;
//directory magic
const publicPath = path.join(__dirname, '../public');

var app = express();
//we can pass in our express app because express is built right on top of core http. we must do this to use socket.io
var server = http.createServer(app);
//add socket.io functionality
var io = socketIO(server);
//new list of users
var users = new Users();
//serve up static assets
app.use(express.static(publicPath));

/*///////////////////////////////////////////////////
*
*                 SOCKETS
*
*
*/////////////////////////////////////////////////////

//event listener for the built in "connect" event
io.on('connect', (socket) => {
    console.log('somebodys here');

    //listener for join room event (button in index.html)
    socket.on('joinRoom', (params, callback)=> {
        if(!isRealString(params.name) || !isRealString(params.room)){
            return callback('Name and Room Required!');
        }
        //joins a socket on a string value
        socket.join(params.room);
        //removes user from any other rooms they might have been in
        users.removeUser(socket.id);
        //add user to users array
        users.addUser(socket.id, params.name, params.room);
        //send info to client so they can update list
        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        //welcome message to new user
        socket.emit('newMessage', generateMessage('announcer', `welcome to ${params.room}`));
        //message to users already in room
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('announcer', `***A CHALLENGER APPEARS***\n WELCOME ${params.name}`));

        callback();
    });

    //listener for message event coming from client, emit message back to them (button in chat.html)
    socket.on('createMessage', (message)=> {
        var user = users.getUser(socket.id);
            //only send message if user exists and message text wasn't blank
            if(user && isRealString(message.text)){
                io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
            }
        });

    //listener for location event (button in chat.html)
    socket.on('createLocationMessage', (coords)=> {

        var user = users.getUser(socket.id);

        if(user){
            socket.emit('newLocationMessage', generateLocationMessage(coords.lat, coords.lng));
        }
    });

    //listener for disconnected clients
    socket.on('disconnect', ()=> {
        console.log('wow bye');

        //stores potentially removed user
        var user = users.removeUser(socket.id);

        if(user){
            io.to(user.room).emit('updateUserList',users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('announcer', `farewell, ${user.name}`));
        }
    });

});

/*///////////////////////////////////////////////////
*
*                 START SERVER
*
*
*/////////////////////////////////////////////////////
//serves index.html by default
    server.listen(port, () => {
    console.log(`listening on port ${port}`);
});
