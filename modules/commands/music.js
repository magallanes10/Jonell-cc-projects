const axios = require("axios");
const fs = require("fs-extra");
const ytdl = require("ytdl-core");
const yts = require("yt-search");

let userCooldowns = {};

module.exports.config = {
    name: "music",
    version: "2.0.6",
    hasPermission: 0,
    credits: "Grey",
    description: "Play a song",
    commandCategory: "utility",
    usages: "[title]",
    usePrefix: true,
    dependencies: {
        "fs-extra": "",
        "request": "",
        "axios": "",
        "ytdl-core": "",
        "yt-search": ""
    }
};

module.exports.run = async ({ api, event, args }) => {
    const search = args.join(" ");

    if (!search) {
        return api.sendMessage("Please enter the title of the song.", event.threadID);
    }

    const currentTime = Date.now();
    const userId = event.senderID;

    if (userCooldowns.hasOwnProperty(userId) && (currentTime - userCooldowns[userId] < 5 * 60 * 1000)) {
        const timeLeft = userCooldowns[userId] + 5 * 60 * 1000 - currentTime;
        const minutesLeft = Math.floor(timeLeft / (1000 * 60));
        const secondsLeft = Math.floor((timeLeft % (1000 * 60)) / 1000);
        return api.sendMessage(`⏳ You can use this command again in ${minutesLeft} minutes and ${secondsLeft} seconds.`, event.threadID);
    }

    try {
        const findingMessage = await api.sendMessage(`Finding "${search}". Please wait...`, event.threadID);

        const searchResults = await yts(search);
        if (!searchResults.videos.length) {
            await api.unsendMessage(findingMessage.messageID);
            return api.sendMessage("Error: Invalid request.", event.threadID);
        }

        const video = searchResults.videos[0];
        const videoUrl = video.url;

        const info = await ytdl.getInfo(videoUrl);

        const fileName = `musicgd.mp3`;
        const filePath = __dirname + `/cache/${fileName}`;

        const stream = ytdl(videoUrl, { filter: "audioonly" });

        stream.pipe(fs.createWriteStream(filePath));

        stream.on('end', async () => {
            console.info('[DOWNLOADER] Downloaded');

            if (fs.statSync(filePath).size > 30 * 1024 * 1024) {
                fs.unlinkSync(filePath);
                await api.unsendMessage(findingMessage.messageID);
                return api.sendMessage('[ERR] The file could not be sent because it is larger than 30MB.', event.threadID);
            }

            const response = await axios.get(`https://music-downloader-yt.onrender.com/music?query=${encodeURIComponent(search)}`, { responseType: 'arraybuffer' });

            fs.writeFileSync(filePath, Buffer.from(response.data));

            const messageBody = `Here's your music, enjoy!\nArtist: ${info.videoDetails.author.name}\nTitle: ${info.videoDetails.title}\nYouTube Link: ${videoUrl}`;
            const message = {
                body: messageBody,
                attachment: fs.createReadStream(filePath)
            };

            await api.sendMessage(message, event.threadID);
            await api.unsendMessage(findingMessage.messageID);
        });

        userCooldowns[userId] = currentTime;
    } catch (error) {
        console.error('[ERROR]', error);
        await api.sendMessage('An error occurred while processing the command.', event.threadID);
    }
};
