var huejay = require('huejay');

const create_user=function(bridge){
  var client = new huejay.Client({
    host:     bridge.ip,
    port:     80,               // Optional
    username: '', // Optional
    timeout:  15000,            // Optional, timeout in milliseconds (15000 is the default)
  });
  console.log("You have 15 seconds to press the button...")
  setTimeout(function(){
    var user = new client.users.User;
    // Optionally configure a device type / agent on the user
    user.deviceType = 'aurora'; // Default is 'huejay'
    client.users.create(user)
      .then(function(user){
        console.log(`New user created - Username: ${user.username}`);
        console.log("------------");
        console.log("add this in your _env.js file:")
        console.log("hue:{"+'\n'+
                    "   bridge:'"+bridge.ip+"',"+'\n'+
                    "   username:'"+user.username+"'"+'\n'+
                    "}")
        console.log("")
      })
      .catch(function(error){
        if (error instanceof huejay.Error && error.type === 101) {
          return console.log(`Link button not pressed. Try again...`);
        }
        console.log(error.stack);
      });
  },15000)
}

huejay.discover()
  .then(function(bridges){
    for (var bridge of bridges) {
      create_user(bridge)
    }
  })
  .catch(function(error){
    console.log(`An error occurred: ${error.message}`);
  });
