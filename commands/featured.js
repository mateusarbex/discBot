module.exports = {
	name: 'featured',
	description: 'Return the featured (windows) games on steam',
	execute(message, steam, numeral) {
		steam.getFeaturedGames().then(games=> {
			for(const game of games.featured_win) {
				message.channel.send(game.name + '      ' + numeral(game.final_price).format('0,0') + ' ' + 'R$');
			}
		});

	},
};