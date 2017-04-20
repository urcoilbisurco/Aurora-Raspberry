let huejay = require('huejay');
let env=require("../_env.js");

var axios = require('axios')
let client = new huejay.Client({
  host:     env.hue.bridge,
  port:     80,
  username: env.hue.username,
  timeout:  15000,
});

axios.get(env.server_url+"/api/v1/state?access_token="+env.user_uuid)
.then(function(res){
  start_scan(res.data.nodes);
})

var start_scan=function(server_nodes){
  client.lights.getAll()
  .then(lights => {
    let nodes=[]
    for (let light of lights) {
      //check if any of this lights is already a node
      existing_node=server_nodes.find((node)=>{
        return node.type=="hue" && node.state.hue_id==light.uniqueId
      })
      if(existing_node){
        //don't do anything, the light is already registered
        //TODO: edit node?
      }else{
        let node={
          name:light.name,
          type:"hue",
          state:{
            hue_id:light.uniqueId,
            open:false,
            brightness:254
          }
        }
        console.log("NODE to create", node)
        axios.post(env.server_url+"/api/v1/nodes?access_token="+env.user_uuid, node)
        .then(function(res){
          console.log(res)
          nodes.push(res.data.uuid)
        })
      }
    }
    let output=[]
    for(let n of nodes){
      output.push("{"+'\n'+
                  "   uuid: '"+n +"'',"+'\n' +
                  "   type:'hue'"+'\n'+
                  "}"
      )
    }
    console.log("add this in the nodes object inside the _env.js file:")
    console.log(output.join(","))
  })

}
//
