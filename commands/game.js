const getApp = require('../functions');
module.exports = {
	name: 'game',
	description: 'Search for a specified game and if it does not find an equal match, return a list of possible games',
	execute(message, arg, steam, discord) {
		const list = [];
		let id = 0;
		let nomatch = true;
		message.channel.send('Procurando.....');
		steam.getAppList().then(games=> {
			games.sort((a, b)=>(a.name > b.name) ? 1 : -1);
			for(const game of games) {
				if(game.name.toLowerCase() == arg.join(' ').toLowerCase()) {
					nomatch = false;
					getApp.setGameInfo(game.appid, game, steam, message, discord);
					break;
				}
				if(game.name.toLowerCase().startsWith(arg.join(' ').toLowerCase()) && list.length < 10) {
					steam.getGameDetails(game.appid).then(detail=> {
						if(detail.type == 'game') {
							game.index = ++id;
							list.push(game);
						}
					}).catch(()=>' ');

				}

			}
			if(nomatch) {
				setTimeout(()=> {
					{
						if(list.length < 1) {
							message.channel.send('Nenhum jogo encontrado');
						}
						else {
							const GameList = new discord.RichEmbed()
								.setTitle('Games');
							for(const game of list) {
								GameList.addField(game.index + '. ' + game.name, `https://store.steampowered.com/app/${game.appid}`);
							}
							message.channel.send(GameList).then(()=> {
								{
									const filter = f=> f.content.match(/^[0-9]+$/i);
									message.channel.send('Diga o índice para visualizar');
									message.channel.awaitMessages(filter, { maxMatches:1, time:15000 }).then(msg=> {
										for(const g of list) {
											if(g.index == msg.first().content) {
												getApp.setGameInfo(g.appid, g, steam, message, discord);
											}
										}
									}
									).catch(()=>{
										message.channel.send('Acabou o tempo de resposta');
									});
								}
							});
						}
					}
				}, 3000);
			}
		});
	} };

