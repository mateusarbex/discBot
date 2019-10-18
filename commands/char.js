const config = require("../config.json")
const axios = require('axios')
const functions = require("../functions")
const Classes = [{"classHash":2271682572,"name":"Warlock"},{"classHash":671679327,"name":"Hunter"},{"classHash":3655393761,"name":"Titan"}]
module.exports={
    name:"char",
    description:"return Destiny 2 chars",
    async execute(uniqueId, discord,message){
        message.channel.send("Procurando perfil....")
        const destiny = await functions.getMembershipIdData(uniqueId)
        const profile = await axios.get(`${config.BaseURL}/Destiny2/${destiny.membershipType}/Profile/${destiny.membershipId}/`,{headers:config.header,params:{"components":200}})
        const characters = profile.data.Response.characters.data
        const CharSelect = new discord.RichEmbed()
            .setTitle(`Personagens de ${uniqueId}`)
        for(chars in characters){
            CharSelect.addField("Classe",Classes.find(element=>{return element.classHash == characters[chars].classHash}).name,true)
            CharSelect.addField("Poder de Luz",characters[chars].light,true)
            CharSelect.addBlankField(true)
        }
        message.channel.send(CharSelect)
    },

}
