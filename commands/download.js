const config = require("../config.json").BearerToken;
const fs = require("fs");
const Path = require("path");
const axios = require("axios").default;

module.exports = {
  name: "download",
  description: "Procura e executa um video no youtube",
  async execute(message, arg, discord) {
    const path = Path.resolve("tweet.mp4");
    const id = arg.match(
      /(?:https:\/\/twitter.com\/)(?:[A-z0-9])+(?:\/status\/)([0-9]+)/
    )[1];
    const entities = await axios.get(
      `https://api.twitter.com/1.1/statuses/show/${id}`,
      {
        headers: { Authorization: `Bearer ${config}` },
      }
    );
    const videoURL = entities.data.extended_entities.media[0].video_info.variants.find(
      (videos) => videos.bitrate
    ).url;
    const videoData = await axios.get(videoURL, {
      responseType: "arraybuffer",
    });
    fs.appendFile(path, videoData.data, async (err) => {
      if (err) {
        return console.log(err);
      }
      const success = await message.channel.send({
        files: [{ attachment: "tweet.mp4", name: "tweet.mp4" }],
      });
      if (success) {
        return fs.unlink("tweet.mp4", (err) => {
          if (err) {
            return console.log("Não foi possível deletar vídeo");
          }
          return console.log("Vídeo deletado");
        });
      }
    });
  },
};
