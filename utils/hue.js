let huejay = require('huejay');
let env=require("../_env.js");

let client = new huejay.Client({
  host:     env.hue.bridge,
  port:     80,
  username: env.hue.username,
  timeout:  15000,
});


module.exports=function(state){
  client.lights.getAll()
  .then(lights => {
    for (let light of lights) {
      if(light.uniqueId==state.hue_id){
        //change
        light.on=state.open;
        light.brightness = state.brightness;
        client.lights.save(light);
      }
    }
}
