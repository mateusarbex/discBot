const YouTube = require('simple-youtube-api')
const config = require('../config.json')
const ytdl = require('ytdl-core')
const youtube = new YouTube(config.YouTubeAPI)
module.exports = {
	name: 'play',
	description: 'Procura e executa um video no youtube',
	async execute(message, arg, discord) {
      let searchResult = []
      const promise = await youtube.search(arg,5)
      for(let video in promise){
            searchResult.push(`${Number.parseInt(video) + 1} - [${promise[video].title}](https://www.youtube.com/watch?v=${promise[video].id})`)
      }
      searchResult = searchResult.join("\n")
      const searchSelect = new discord.RichEmbed()
        .setTitle("Busca - Diga o número do video para tocar")
        .setDescription(searchResult)
        .setThumbnail("https://img.icons8.com/cotton/344/youtube.png")
    message.channel.send(searchSelect)
    try{
        const filter = f=> f.content.match(/^[0-9]+$/i);
        message.channel.awaitMessages(filter,{ maxMatches:1, time:7000 }).then((msg)=>{
            message.member.voiceChannel.join().then(connection=>{
                const stream = ytdl(`https://www.youtube.com/watch?v=${promise[msg.first().content-1].id}`)
                const dispatcher =  connection.playOpusStream(stream)
                message.channel.send(`Now Playing ${promise[msg.first().content-1].title}`)
            }).catch(err=>{
                message.channel.send("Timeout!")
                console.log(err)
            })
        })
    }catch{
        console.log("err")
    }
   
    }
}
