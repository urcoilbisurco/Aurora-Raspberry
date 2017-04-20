var huejay = require('huejay');
var env=require("../_env.js");

var client = new huejay.Client({
  host:     env.hue.bridge,
  port:     80,
  username: env.hue.username,
  timeout:  15000,
});


module.exports=function(state){
  client.lights.getAll()
  .then(function(lights){
    for (var light of lights) {
      if(light.uniqueId==state.hue_id){
        //change
        light.on=state.open;
        light.brightness = state.brightness;
        client.lights.save(light);
      }
    }
}
