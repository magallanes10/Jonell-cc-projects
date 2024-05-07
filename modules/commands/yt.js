const ytdl = require('ytdl-core');
const simpleytapi = require('simple-youtube-api');
const path = require('path');
const fs = require('fs');

const cooldownFilePath = path.join(__dirname, 'cooldownsyt.json');
let cooldowns = {};

if (fs.existsSync(cooldownFilePath)) {
    cooldowns = JSON.parse(fs.readFileSync(cooldownFilePath));
}

module.exports.config = {
    name: "youtube",
    hasPermssion: 0,
    version: "1.0.1",
    credits: "Jonell Magallanes",
    usePrefix: false,
    description: "Search and send YouTube video",
    commandCategory: "video",
};

module.exports.run = async function ({ event, api, args }) {
    const youtube = new simpleytapi('AIzaSyCMWAbuVEw0H26r94BhyFU4mTaP5oUGWRw');

    const tid = event.threadID;
    const mid = event.messageID;

    const userId = event.senderID;
    const currentTime = Date.now();
if (userCooldowns.hasOwnProperty(userId) && (currentTime - userCooldowns[userId] < 5 * 60 * 1000)) {
    const timeLeft = userCooldowns[userId] + 5 * 60 * 1000 - currentTime;
    const minutesLeft = Math.floor(timeLeft / (1000 * 60));
    const secondsLeft = Math.floor((timeLeft % (1000 * 60)) / 1000);
    return api.sendMessage(`⏳ You can use this command again in ${minutesLeft} minutes and ${secondsLeft} seconds.`, event.threadID);


    
    }

    const searchString = args.join(' ');
    if (!searchString) return api.sendMessage("📝 | Please Enter Your Search Query to Youtube Command", tid, mid);
    try {
        const videos = await youtube.searchVideos(searchString, 1);
        api.setMessageReaction("⏱️", event.messageID, () => {}, true);
        console.log(`Downloading Video: ${videos[0].title}`);
        const url = `https://www.youtube.com/watch?v=${videos[0].id}`;

        const videoInfo = await ytdl.getInfo(url);
        const videoTitle = videoInfo.videoDetails.title;
        const file = path.resolve(__dirname, 'cache', `video.mp4`);
        console.log(`Downloaded Complete Ready to send The user`);
        api.setMessageReaction("✅", event.messageID, () => {}, true);

        const videoStream = ytdl(url, { filter: 'videoandaudio' });
        const writeStream = fs.createWriteStream(file);

        videoStream.pipe(writeStream);

        videoStream.on('progress', (chunkLength, downloaded, total) => {
            const progress = (downloaded / total) * 100;
            console.log(`Progress: ${progress.toFixed(2)}%`);
            if (total > 25 * 1024 * 1024) {
                videoStream.destroy();
                writeStream.close();
                fs.unlinkSync(file);
                api.sendMessage("[ ERROR ] This Youtube Video you requested has 25Mb reach limit can't send it", tid);
            }
        });

        writeStream.on('finish', () => {
            if (fs.existsSync(file)) {
                api.sendMessage({
                    body: `🎥 | Here's the YouTube video you requested\nURL: ${url}\n\nTitle: ${videoTitle}`,
                    attachment: fs.createReadStream(file)
                }, event.threadID);
                cooldowns[userId] = currentTime;
                saveCooldownData();
            }
        });
    } catch (error) {
        api.sendMessage("🚨 | An error occurred while searching for the YouTube video.", event.threadID);
    }
};

function saveCooldownData() {
    fs.writeFileSync(cooldownFilePath, JSON.stringify(cooldowns, null, 2));
}
