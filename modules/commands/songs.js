const axios = require('axios');

module.exports.config = {
    name: "songs",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Jonell Magallanes",
    description: "Search for songs from GDPH SERVER",
    usePrefix: true,
    commandCategory: "GDPH TOOLS",
    usages: "[song title]",
    cooldowns: 30
};

module.exports.run = async function ({ api, event, args }) {
    const title = encodeURIComponent(args.join(" "));
    const apiUrl = `https://gdph-song-list-api-by-jonell-magallanes.onrender.com/gdph?songlist=${title}`;

    if (!title) return api.sendMessage("𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗌𝗈𝗇𝗀 𝗍𝗂𝗍𝗅𝖾.\n\n𝖴𝗌𝖺𝗀𝖾: 𝗌𝗈𝗇𝗀𝗌 [𝗒𝗈𝗎𝗋 𝗌𝖾𝖺𝗋𝖼𝗁 𝗌𝗈𝗇𝗀 𝗍𝗂𝗍𝗅𝖾]", event.threadID, event.messageID);

    try {
        const searchMessage = await api.sendMessage("🔍 | 𝖢𝗁𝖾𝖼𝗄𝗂𝗇𝗀 𝖳𝗁𝖾 𝖣𝖺𝗍𝖺𝖻𝖺𝗌𝖾 𝖿𝗈𝗋 𝖲𝖾𝖺𝗋𝖼𝗁𝗂𝗇𝗀 𝗌𝗈𝗇𝗀𝗌. 𝖯𝗅𝖾𝖺𝗌𝖾 𝗐𝖺𝗂𝗍...", event.threadID);

        const response = await axios.get(apiUrl);
        const songs = response.data;

        if (songs.length === 0) {
            await api.sendMessage("𝖭𝗈 𝗌𝗈𝗇𝗀𝗌 𝖿𝗈𝗎𝗇𝖽 𝗐𝗂𝗍𝗁 𝗍𝗁𝖺𝗍 𝗍𝗂𝗍𝗅𝖾.", event.threadID);
            return api.unsendMessage(searchMessage.messageID);
        }

        for (const song of songs) {
            let resultMessage = `ID: ${song.id}\n𝖲𝗈𝗇𝗀: ${song.song}\n𝖠𝗎𝗍𝗁𝗈𝗋: ${song.author}\n𝖲𝗂𝗓𝖾: ${song.size}\n\n`;
            await api.sendMessage(resultMessage, event.threadID);
        }

        api.unsendMessage(searchMessage.messageID);
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while processing your request.", event.threadID);
    }
};