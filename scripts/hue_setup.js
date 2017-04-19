let huejay = require('huejay');

const create_user=(bridge)=>{
  let client = new huejay.Client({
    host:     bridge.ip,
    port:     80,               // Optional
    username: '', // Optional
    timeout:  15000,            // Optional, timeout in milliseconds (15000 is the default)
  });
  console.log("You have 15 seconds to press the button...")
  setTimeout(()=>{
    let user = new client.users.User;
    // Optionally configure a device type / agent on the user
    user.deviceType = 'aurora'; // Default is 'huejay'
    client.users.create(user)
      .then(user => {
        console.log(`New user created - Username: ${user.username}`);
        console.log("------------");
        console.log("write this in your _env.js file:")
        console.log("hue:{"+'\n'+
                    "   bridge:'"+bridge.ip+"',"+'\n'+
                    "   username:'"+user.username+"'"+'\n'+
                    "}")
        console.log("")
      })
      .catch(error => {
        if (error instanceof huejay.Error && error.type === 101) {
          return console.log(`Link button not pressed. Try again...`);
        }
        console.log(error.stack);
      });
  },15000)
}

huejay.discover()
  .then(bridges => {
    for (let bridge of bridges) {
      create_user(bridge)
    }
  })
  .catch(error => {
    console.log(`An error occurred: ${error.message}`);
  });
