


class Users {
  constructor(){
      //each socket has their own array of users
      this.users = [];
  }
  addUser(id, name, room){
      var user = {id, name, room};
      this.users.push(user);
      return user;
  }
  removeUser(id){
      var user = this.getUser(id);
      if(user){
          this.users = this.users.filter((user)=> user.id !== id);
      }
      return user;
  }

  getUser(id){
      var user = this.users.filter((user)=> user.id === id);
      return user[0];
  }

  getUserList(room){
      //return users that have room of this value
      var users = this.users.filter((user)=> user.room === room);
      var namesArray = users.map((user)=> user.name);

      return namesArray;
  };

};

// class Person {
//     constructor (name, age){
//         this.name = name;
//         this.age = age;
//     }
//
//     getUserDescription(){
//         return  `${this.name}`;
//     }
// };




module.exports = {Users};