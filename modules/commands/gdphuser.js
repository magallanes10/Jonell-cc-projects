const axios = require('axios');

module.exports.config = {
    name: "gdphuser",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Jonell Magallanes",
    description: "Get GDPH user information",
    usePrefix: true,
    commandCategory: "GDPH",
    usages: "[username]",
    cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
    const username = encodeURIComponent(args[0]);

    if (!username) return api.sendMessage("Please provide a username.", event.threadID, event.messageID);

    try {
        const waitMessage = await api.sendMessage("🔍 | 𝖢𝗁𝖾𝖼𝗄𝗂𝗇𝗀.....", event.threadID, event.messageID);

        const response = await axios.get(`https://geometry-dash-fs-secondary-api-by-jonell.onrender.com/api/player?user=${username}`);
        const data = response.data;

        const formattedResponse = `[ 𝖦𝖣𝖯𝖧 𝖲𝖾𝗋𝗏𝖾𝗋 𝖯𝗅𝖺𝗒𝖾𝗋 𝖲𝗍𝖺𝗍𝗌 ]\n
𝖭𝖺𝗆𝖾: ${data.Name}
𝖴𝗌𝖾𝗋 𝖨𝖣: ${data["User ID"]}
𝖠𝖼𝖼𝗈𝗎𝗇𝗍 𝖨𝖣: ${data["Account ID"]}
𝖲𝗍𝖺𝗋𝗌: ${data.Stars}
𝖢𝗈𝗂𝗇𝗌: ${data.Coins}
𝖴𝗌𝖾𝗋 𝖢𝗈𝗂𝗇𝗌: ${data["User Coins"]}
𝖣𝗂𝖺𝗆𝗈𝗇𝖽𝗌: ${data.Diamonds}
𝖢𝗋𝖾𝖺𝗍𝗈𝗋 𝖯𝗈𝗂𝗇𝗍𝗌: ${data["Creator points"]}
𝖫𝖾𝖺𝖽𝖾𝗋𝖻𝗈𝖺𝗋𝖽𝗌 𝖱𝖺𝗇𝗄: ${data["Leaderboards rank"]}
𝖢𝗋𝖾𝖺𝗍𝗈𝗋 𝖫𝖾𝖺𝖽𝖾𝗋𝖻𝗈𝖺𝗋𝖽𝗌 𝖱𝖺𝗇𝗄: ${data["Creator leaderboards rank"]}
𝖣𝗂𝗌𝖼𝗈𝗋𝖽: ${data.Discord}`;

        await api.editMessage(formattedResponse, waitMessage.messageID, event.threadID, event.messageID);
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while fetching player information.", event.threadID);
    }
};
