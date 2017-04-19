let huejay = require('huejay');

huejay.discover()
  .then(bridges => {
    for (let bridge of bridges) {
      console.log(`Id: ${bridge.id}, IP: ${bridge.ip}`);
    }
  })
  .catch(error => {
    console.log(`An error occurred: ${error.message}`);
  });



//find bridge
//find aurora user, if doesn't exists=> create


client.users.getByUsername('usernamehere')
  .then(user => {
    console.log(`Username: ${user.username}`);
  });
  .catch(error => {
    console.log(error.stack);
  });
