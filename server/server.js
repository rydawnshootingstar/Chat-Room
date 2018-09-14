//imports
const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const {generateMessage} = require('./utils/message');
//directory magic
const publicPath = path.join(__dirname, '../public');
const indexPath = path.join(publicPath, '/index.html');
//variables
const port = process.env.PORT || 3000;

//server
var app = express();
//we can pass in our express app because express is built right on top of http. we must do this to use socket.io
var server = http.createServer(app);
//add socket.io functionality
var io = socketIO(server);
//serve up static assets
app.use(express.static(publicPath));

//event listener for the built in "connect" event
io.on('connect', (socket) => {
    console.log('somebodys here');

    //fires to everyone except this socket
    socket.broadcast.emit('newMessage', generateMessage('small mitch', '***A CHALLENGER APPEARS***'));

    //send welcome message to new user upon connection
    socket.emit('newMessage', generateMessage('small mitch', 'welcome to da chat zone'));

    //listener for an event coming from client
    socket.on('createMessage', (message)=> {
        message.createdAt = new Date().getTime().toString();
        console.log('NEW MESSAGE \n', message);
        io.emit('newMessage', generateMessage(message.from, message.text));
        });

    socket.on('disconnect', ()=> {
        console.log('frig off');
    });
});

//start server. serves index.html by default
    server.listen(port, () => {
    console.log(`listening on port ${port}, bitches`);
});
