
## Aurora Raspberry
Raspberry Node for Aurora IoT applications
## Installation

create an "_env.js" file with inside:

```javascript
module.exports={
  user_uuid:"YOUR USER UUID",
  nodes:[
    {
      uuid:"Mongo ID of Node",
      pin:1, //pin associated to on/off
    },
    ...
  ],
  mqtt:{
    server:"mqtt://localhost:1883" //MQTT server
  }
}

```

Then run

```
  npm install
  npm run start
```

Then visit localhost:3456
