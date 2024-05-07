const axios = require('axios');

module.exports.config = {
    name: "wr",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Jonell Magallanes",
    description: "Get who rated the GDPH level",
    usePrefix: true,
    commandCategory: "GDPH",
    cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
    const levelID = encodeURIComponent(args[0]);

    if (!levelID) return api.sendMessage("Please provide a level ID.", event.threadID, event.messageID);

    try {
        const waitMessage = await api.sendMessage("🔍 | 𝖢𝗁𝖾𝖼𝗄𝗂𝗇𝗀...", event.threadID, event.messageID);

        const response = await axios.get(`https://geometry-dash-fs-secondary-api-by-jonell.onrender.com/api/whorated?id=${levelID}`);
        const data = response.data;

        if (!data.WhoRated) {
            await api.editMessage("No one has rated this level yet.", waitMessage.messageID, event.threadID);
        } else {
            const formattedResponse = `📝 𝖫𝖾𝗏𝖾𝗅 𝖨𝖣: ${data.levelID}\n👤𝖶𝗁𝗈 𝖱𝖺𝗍𝖾𝖽: ${data.WhoRated}\n\n𝖳𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝗐𝗁𝗈 𝗋𝖺𝗍𝖾𝖽 𝗒𝗈𝗎𝗋 𝗅𝖾𝗏𝖾𝗅𝗌`;
            await api.editMessage(formattedResponse, waitMessage.messageID, event.threadID, event.messageID);
        }
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while fetching information.", event.threadID);
    }
};
