const expect = require('expect');
const {Users} = require('./users');

describe('Users functionality', ()=> {
    var users;

    beforeEach(()=> {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'mitch',
            room: 'memes'
        }, {
            id: '2',
            name: 'mac',
            room: 'memes'
        },{
            id: '3',
            name: 'charlie',
            room: 'dogs'
        }]
    });

    it('should add new user', () => {
        var users = new Users();
        var testUser = {id: '123', name: 'testboi', room: 'dogs'};

        users.addUser(testUser.id, testUser.name, testUser.room);

        expect(users.users).toEqual([testUser]);
    });

    it('should return names for memers', () => {
        var userList = users.getUserList('memes');
        expect(userList).toEqual(['mitch', 'mac']);
    });

    it('should return names for doggers', () => {
        var userList = users.getUserList('dogs');
        expect(userList).toEqual(['charlie']);
    });

    it('should remove a user', () => {
        var user = users.removeUser('1');
        expect(user.id).toBe('1');
        expect(users.users).toEqual([{
            id: '2',
            name: 'mac',
            room: 'memes'
        },{
            id: '3',
            name: 'charlie',
            room: 'dogs'
        }]);
    });

    it('should not remove a user', () => {
        var user = users.removeUser('200');
        expect(user).toNotExist();
        expect(users.users).toEqual([{
            id: '1',
            name: 'mitch',
            room: 'memes'
        }, {
            id: '2',
            name: 'mac',
            room: 'memes'
        },{
            id: '3',
            name: 'charlie',
            room: 'dogs'
        }]);
    });

    it('should find a user', () => {
        var user = users.getUser('1');
        expect(user).toEqual({
            id: '1',
            name: 'mitch',
            room: 'memes'
        });
        expect(user.id).toBe('1');
    });

    it('should not find a user', () => {
        var user = users.getUser('200');
        //toNotExist() also works
        expect(user).toBe(undefined);
    });

});