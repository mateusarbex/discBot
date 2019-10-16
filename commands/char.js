const config = require("../config.json")
const axios = require('axios')
const functions = require("../functions")
const header = {
    "X-API-Key":config.bungieAPI
}
module.exports={
    name:"char",
    description:"return Destiny 2 chars",
    async execute(uniqueId, discord,message){
        const destiny = await functions.getMembershipIdData(uniqueId)
        const profile = await axios.get(`${config.BaseURL}/Destiny2/${destiny.membershipType}/Profile/${destiny.membershipId}/`,{headers:config.header,params:{"components":200}})
        const characters = profile.data.Response.characters.data
        for(chars in characters){
            message.channel.send(characters[chars].light)
        }
    },

}
