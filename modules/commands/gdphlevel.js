const axios = require('axios');

module.exports.config = {
    name: "gdphlevel",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Jonell Magallanes",
    description: "Get GDPH level information",
    usePrefix: true,
    commandCategory: "GDPH",
    usages: "[levelID]",
    cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
    const level = encodeURIComponent(args[0]);

    if (!level) return api.sendMessage("Please provide a level ID.", event.threadID, event.messageID);

    try {
        const waitMessage = await api.sendMessage("🔍 | 𝖢𝗁𝖾𝖼𝗄𝗂𝗇𝗀...", event.threadID, event.messageID);

        const response = await axios.get(`https://geometry-dash-fs-secondary-api-by-jonell.onrender.com/api/levelinfo?level=${level}`);
        const data = response.data;

        const levelName = data.name.replace(/\\nID/gi, '');

        const formattedResponse = `[ 𝖦𝖣𝖯𝖧 𝖲𝖾𝗋𝗏𝖾𝗋 𝖫𝖾𝗏𝖾𝗅 𝖨𝗇𝖿𝗈𝗋𝗆𝖺𝗍𝗂𝗈𝗇 ]\n\n
📝 𝖫𝖾𝗏𝖾𝗅 𝖭𝖺𝗆𝖾: ${levelName}
🔖 𝖨𝖣: ${data.ID}
👤 𝖠𝗎𝗍𝗁𝗈𝗋: ${data.Author}
🎵 𝖲𝗈𝗇𝗀: ${data.Song}
😶 𝖣𝗂𝖿𝖿𝗂𝖼𝗎𝗅𝗍𝗒: ${data.Difficulty}
🔷 𝖢𝗈𝗂𝗇𝗌: ${data.Coins}
🕐 Length: ${data.Length}
⏱️ 𝖴𝗉𝗅𝗈𝖺𝖽 𝖳𝗂𝗆𝖾: ${data["Upload Time"]}
⏲️ 𝖴𝗉𝖽𝖺𝗍𝖾 𝖳𝗂𝗆𝖾: ${data["Update Time"] }
🔲 𝖮𝖻𝗃𝖾𝖼𝗍𝗌: ${data.Objects}
💾 𝖫𝖾𝗏𝖾𝗅 𝖵𝖾𝗋𝗌𝗂𝗈𝗇: ${data["Level Version"] }
💻 𝖦𝖺𝗆𝖾 𝖵𝖾𝗋𝗌𝗂𝗈𝗇: ${data["Game Version"]}
📥 𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗌: ${data.Downloads}
👍 𝖫𝗂𝗄𝖾𝗌: ${data.Likes}`;

        await api.editMessage(formattedResponse, waitMessage.messageID, event.threadID, event.messageID);
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while fetching Geometry Dash level information.", event.threadID);
    }
};
