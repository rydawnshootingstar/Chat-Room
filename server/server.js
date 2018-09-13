//imports
const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
//directory magic
const publicPath = path.join(__dirname, '../public');
const indexPath = path.join(publicPath, '/index.html');
//variables
const port = process.env.PORT || 3000;

//server
var app = express();
//we can pass in our express app because express is built right on top of http
var server = http.createServer(app);
//add socket.io functionality
var io = socketIO(server);
app.use(express.static(publicPath));

//event listener
io.on('connect', (socket) => {
    console.log('somebodys here');

    //send object to client
    // socket.emit('newMessage', {
    //    from: 'stav',
    //     text: 'hell yeah dude',
    //     createdAt: new Date().getTime()
    // });

    //listener for an event coming from client
    socket.on('createMessage', (message)=> {
        message.createdAt = new Date().getTime().toString();
        console.log('NEW MESSAGE \n', message);
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        })
    });




    socket.on('disconnect', ()=> {
        console.log('frig off');
    });

});



//routes
// app.get('/', (req, res)=> {
//     res.sendFile(indexPath);
// });


//start server
    server.listen(port, () => {
    console.log(`listening on port ${port}, bitches`);
});
