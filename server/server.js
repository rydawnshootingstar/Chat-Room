//imports
const path = require('path');
const express = require('express');
//directory magic
const publicPath = path.join(__dirname, '../public');
const indexPath = path.join(publicPath, '/index.html');
//variables
const port = process.env.PORT || 3000;

//server
var app = express();
app.use(express.static(publicPath));

//routes
app.get('/', (req, res)=> {
   res.sendFile(indexPath);
});



//start server
app.listen(port, () => {
    console.log(`listening on port ${port}, bitches`);
});
