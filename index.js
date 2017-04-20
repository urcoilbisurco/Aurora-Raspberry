var mqtt = require('mqtt')
var env = require('./_env.js')
var client  = mqtt.connect(env.mqtt.server)
var rpio = require("rpio");
var sensor=require("node-dht-sensor");
var schedule = require('node-schedule');




process.on ('SIGINT', () => {
  env.nodes.filter(function(node){return node.type=="switch"}).forEach(function(node){
    rpio.write(node.pin,rpio.LOW);
  })
  console.log ('\n closing...');
  process.exit (0);
});


function read_temperature(node){
  sensor.read(11, node.pin, function(err, temperature, humidity) {
    if (!err) {
      console.log('temp: ' + temperature.toFixed(1) + '°C, ' + 'humidity: ' + humidity.toFixed(1) + '%');
      var data={
        temp:temperature.toFixed(0),
        humidity:humidity.toFixed(0)
      }
      topic=env.user_uuid+"/"+node.uuid+"/updated"
      client.publish(topic, JSON.stringify(data));
    }else{
      //try again
      read_temperature(node)
      console.log(err);
    }
  });
}

function start_temperature_monitoring(node){
  var j = schedule.scheduleJob('1 * * * *', function(){
    read_temperature(node)
  });
}


function init(){ 
  //initialize all the switch nodes
  env.nodes.filter(function(node){return node.type=="switch"}).forEach(function(node){
    topic=env.user_uuid+"/"+node.uuid+"/update"
    rpio.open(node.pin, rpio.OUTPUT, rpio.LOW);
    client.subscribe(topic)
  })

  //connect temperature monitor to temp node
  temp_node=env.nodes.filter(function(node){return node.type=="temperature"})[0]
  start_temperature_monitoring(temp_node)
}

client.on('connect', function () {
  console.log("connected to server");
})

client.on("close", function(){
  console.log("closed connection.");
})

client.on("reconnect", function(){
  console.log("reconnected connection.");
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


init();
