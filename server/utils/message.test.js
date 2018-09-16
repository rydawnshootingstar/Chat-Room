var expect = require('expect');
var {generateMessage, generateLocationMessage} = require('./message');


describe('generateMessage', () => {
    it('should generate correct message object', ()=> {
        var from = 'mitch';
        var text = 'yo duder';
        var message = generateMessage(from, text);

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({from: from, text: text});
    });
});

describe('generateLocationMessage', () => {
    it('should generate a correct location object', ()=> {
        var lat = 666;
        var lng = 666;
        var url = 'https://www.google.com/maps?q=666,666';
        var message = generateLocationMessage(lat,lng);

        expect(message).toInclude({url});
        expect(message.createdAt).toBeA('number');
    });
});