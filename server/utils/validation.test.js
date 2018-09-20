const expect = require('expect');
const {isRealString} = require('./validation');

describe('isRealString', () => {
    it('should reject non string entries', ()=> {
        var testStr = 6666666666;
        var result= isRealString(testStr);
        expect(result).toBe(false);
    });

    it('should reject string that is only spaces', ()=> {
        var testStr = '     ';
        var result = isRealString(testStr);
        expect(result).toBe(false);
    });

    it('should allow strings with non space chars', ()=> {
        var testStr = '   !@#$%^&*()-1234567;"890+-={}\/\/\/,./?!<>><><html>   '
        var result = isRealString(testStr);
        expect(result).toBe(true);
    });
});

