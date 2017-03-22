var mqtt = require('mqtt')
var env = require('./_env.js')
var client  = mqtt.connect(env.mqtt.server)
var rpio = require("rpio");

process.on ('SIGINT', () => {
  env.nodes.forEach(function(node){
    rpio.write(node.pin,rpio.LOW);
  })
  console.log ('\n closing...');
  process.exit (0);
});



client.on('connect', function () {
  env.nodes.forEach(function(node){
    topic=env.user_uuid+"/"+node.uuid+"/update"
    rpio.open(node.pin, rpio.OUTPUT, rpio.LOW);
    client.subscribe(topic)
  })
})

client.on('message', function (topic, message) {
  // message is Buffer
  var node=env.nodes.find(function(node){
    return node.uuid==topic.split("/")[1]
  })
  var m=JSON.parse(message)
  var command= m.open ? rpio.HIGH : rpio.LOW
  rpio.write(node.pin, command);
  console.log(node, JSON.parse(message).open)
})
