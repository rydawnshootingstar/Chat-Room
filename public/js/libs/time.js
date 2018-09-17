//Unix time starts Jan 1 1970 @ 00:00:00 AM
//js Date().getTime() stores the time since that date in ms
var moment = require('moment');
// var date = new Date();
// //0-11 is the date range
// console.log('month', date.getMonth());

var date = moment();
date.add(1,'year');
console.log(date.format('MMM Do, YYYY'));

console.log(date.format('h:mm a'))

//this is the same as a js date
var timeStamp = moment().valueOf();

console.log(timeStamp);

