const discord = require('discord.js');
const config = require('./config.json');
const SteamAPI = require('steamapi');
const steam = new SteamAPI(config.steamToken);
const client = new discord.Client();
const numeral = require('numeral');
const fs = require('fs');
client.commands = new discord.Collection();
let deletedMsg = new Array;
const commandFiles = fs.readdirSync('./commands').filter(file=> file.endsWith('.js'));
for(const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.on('messageDelete', message=>{
	deletedMsg.push({ msg:message.content, author:message.author.username, channel:message.channel.name, date:message.createdAt.toDateString() + ' ' + message.createdAt.toTimeString().slice(0, 8) });
	if(deletedMsg.length == 50) {
		deletedMsg.shift();
	}
});
client.on('message', message =>{
	if(!message.content.startsWith(config.prefix) || message.author.bot) {
		return;
	}
	const arg = message.content.slice(config.prefix.length).split(' ');
	const command = arg.shift().toLowerCase();

	if(command == 'featured') {
		client.commands.get('featured').execute(message, steam, numeral);
	}
	if(command == 'reveal') {
		const Reveal = new discord.RichEmbed().setTitle('Deleted messages');
		for(const deleted of deletedMsg) {
			Reveal.addField(deleted.author + ' ' + deleted.date + ' at ' + deleted.channel, deleted.msg);
		}
		message.channel.send(Reveal);
		deletedMsg = [];
	}
	if(command.startsWith('game')) {
		client.commands.get('game').execute(message, arg, steam, discord);
	}
	if(command == 'char'){
		client.commands.get('char').execute(arg[0],discord,message)
	}
});

client.login(config.token);

