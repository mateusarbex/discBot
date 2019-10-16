const axios = require('axios')
const config = require('./config.json')
module.exports = {
	name: 'async functions',
	description: '',
	execute(appid, game, steam, message, discord) {
		const cg = { sp:false, multi:false, coop:false };
		steam.getGameDetails(appid).then(detail=> {
			for(const categories of detail.categories) {
				if(categories.description == 'Single-player') {
					cg.sp = true;
				}
				if(categories.description == 'Multi-player') {
					cg.multi = true;
				}
				if(categories.description == 'Co-op') {
					cg.coop = true;
				}
			}
			const GameInfo = new discord.RichEmbed()
				.setURL(`https://store.steampowered.com/app/${game.appid}`)
				.setImage(detail.header_image)
				.setTitle(detail.name)
				.addField('Preço', detail.is_free ? 'Free to Play' : detail.price_overview.final_formatted)
				.addField('Single-player', cg.sp ? 'Yes' : 'No', true)
				.addField('Multi-player', cg.multi ? 'Yes' : 'No', true)
				.addField('Co-op', cg.coop ? 'Yes' : 'No', true);
			return message.channel.send(GameInfo);
		}).catch(()=>'error');
	},
	async getMembershipId(searchString){
		const response = await axios.get(`${config.BaseURL}/User/SearchUsers`,{headers:config.header,params:{"q":searchString}})
 		const id = response.data.Response.find(element=>{return element.uniqueName==searchString}).membershipId
	 	return id
	},
	async getMembershipIdData(uniqueID){
		const id = await this.getMembershipId(uniqueID)
		membershipType = 254
		const response = await axios.get(`${config.BaseURL}/User/GetMembershipsById/${id}/${membershipType}/`,{headers:config.header})
		return response.data.Response.destinyMemberships.find(id=>{return id.membershipId})
	}
};

