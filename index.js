var mqtt = require('mqtt')
var env = require('./_env.js')
var client  = mqtt.connect(env.mqtt.server)

client.on('connect', function () {
  env.nodes.forEach(function(node){
    topic=env.user_uuid+"/"+node.uuid+"/update"
    client.subscribe(topic)
  })
})

client.on('message', function (topic, message) {
  // message is Buffer
  var node=env.nodes.find(function(node){
    return node.uuid==topic.split("/")[1]
  })
  console.log(node, JSON.parse(message).open)
})
