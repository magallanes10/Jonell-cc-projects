const axios = require('axios');
const fs = require('fs');

module.exports.config = {
    name: "gdlevel",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Jonell Magallanes",
    description: "Fetch GD level info",
    usePrefix: true,
    commandCategory: "GD Server",
    cooldowns: 10
};

module.exports.run = async function ({ api, event, args }) {
    if (!args[0]) {
        return api.sendMessage("𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝖺 𝗅𝖾𝗏𝖾𝗅 𝖨𝖣.", event.threadID);
    }

    const levelid = args[0];
    const apiUrl = `https://gdbrowser.com/api/level/${levelid}`;
    const screenshotUrl = `https://api.screenshotmachine.com/?key=904180&url=https://gdbrowser.com/${levelid}&dimension=1024x768`;

    const checkingMessage = await api.sendMessage("🔍 | 𝖢𝗁𝖾𝖼𝗄𝗂𝗇𝗀 𝖣𝖺𝗍𝖺𝖻𝖺𝗌𝖾 𝖫𝖾𝗏𝖾𝗅 𝖮𝖿 𝖦𝖾𝗈𝗆𝖾𝗍𝗋𝗒 𝖣𝖺𝗌𝗁 𝖲𝖾𝗋𝗏𝖾𝗋. 𝖯𝗅𝖾𝖺𝗌𝖾 𝖶𝖺𝗂𝗍...", event.threadID);

    try {
        const response = await axios.get(apiUrl);
        const levelInfo = response.data;

        let levelMessage = `𝖫𝖾𝗏𝖾𝗅 𝖭𝖺𝗆𝖾: ${levelInfo.name}\n`;
        levelMessage += `𝖫𝖾𝗏𝖾𝗅 𝖨𝖣: ${levelInfo.id}\n`;
        levelMessage += `𝖠𝗎𝗍𝗁𝗈𝗋: ${levelInfo.author}\n`;
        levelMessage += `𝖣𝖾𝗌𝖼𝗋𝗂𝗉𝗍𝗂𝗈𝗇: ${levelInfo.description}\n`;
        levelMessage += `𝖣𝗂𝖿𝖿𝗂𝖼𝗎𝗅𝗍𝗒: ${levelInfo.difficulty}\n`;
        levelMessage += `𝖣𝗈𝗐𝗇𝗅𝗈𝖺𝖽𝗌: ${levelInfo.downloads}\n`;
        levelMessage += `𝖫𝗂𝗄𝖾𝗌: ${levelInfo.likes}\n`;
        levelMessage += `𝖫𝖾𝗇𝗀𝗍𝗁: ${levelInfo.length}\n`;
        levelMessage += `𝖲𝗍𝖺𝗋𝗌: ${levelInfo.stars}\n`;
        levelMessage += `𝖮𝗋𝖻𝗌: ${levelInfo.orbs}\n`;
        levelMessage += `𝖣𝗂𝖺𝗆𝗈𝗇𝖽𝗌: ${levelInfo.diamonds}\n`;
        levelMessage += `𝖥𝖾𝖺𝗍𝗎𝗋𝖾𝖽: ${levelInfo.featured}\n`;
        levelMessage += `𝖤𝗉𝗂𝖼: ${levelInfo.epic}\n`;
        levelMessage += `𝖤𝗉𝗂𝖼 𝖵𝖺𝗅𝗎𝖾: ${levelInfo.epicValue}\n`;
        levelMessage += `𝖫𝖾𝗀𝖾𝗇𝖺𝗋𝗒: ${levelInfo.legendary}\n`;
        levelMessage += `𝖬𝗒𝗍𝗁𝗂𝖼: ${levelInfo.mythic}\n`;
        levelMessage += `𝖦𝖺𝗆𝖾 𝖨𝗏: ${levelInfo.gameVersion}\n`;
        levelMessage += `𝖤𝖽𝗂𝗍𝗈𝗋 𝖳𝗂𝗆𝖾: ${levelInfo.editorTime}\n`;
        levelMessage += `𝖳𝗈𝗍𝖺𝗅 𝖤𝖽𝗂𝗍𝗈𝗋 𝖳𝗂𝗆𝖾: ${levelInfo.totalEditorTime}\n`;
        levelMessage += `𝖵𝖾𝗋𝗌𝗂𝗈𝗇: ${levelInfo.version}\n`;
        levelMessage += `𝖢𝗈𝗉𝗂𝖾𝖽 𝖨𝖣: ${levelInfo.copiedID}\n`;
        levelMessage += `𝖳𝗐𝗈 𝖯𝗅𝖺𝗒𝖾𝗋: ${levelInfo.twoPlayer}\n`;
        levelMessage += `𝖮𝖿𝖿𝗂𝖼𝗂𝖺𝗅 𝖲𝗈𝗇𝗀: ${levelInfo.officialSong}\n`;
        levelMessage += `𝖢𝗎𝗌𝗍𝗈𝗆 𝖲𝗈𝗇𝗀: ${levelInfo.customSong}\n`;
        levelMessage += `𝖢𝗈𝗂𝗇𝗌: ${levelInfo.coins}\n`;
        levelMessage += `𝖵𝖾𝗋𝗂𝖿𝗂𝖾𝖽 𝖢𝗈𝗂𝗇𝗌: ${levelInfo.verifiedCoins}\n`;
        levelMessage += `𝖲𝗍𝖺𝗋𝗌 𝖱𝖾𝗊𝗎𝖾𝗌𝗍𝖾𝖽: ${levelInfo.starsRequested}\n`;
        levelMessage += `𝖫𝖣𝗆: ${levelInfo.ldm}\n`;
        levelMessage += `𝖮𝖻𝗃𝖾𝖼𝗍𝗌: ${levelInfo.objects}\n`;
        levelMessage += `𝖫𝖺𝗋𝗀𝖾: ${levelInfo.large}\n`;
        levelMessage += `𝖢𝖯: ${levelInfo.cp}\n`;
        levelMessage += `𝖯𝖺𝗋𝗍𝗂𝖺𝗅 𝖣𝗂𝖿𝖿𝗂𝖼: ${levelInfo.partialDiff}\n`;
        levelMessage += `𝖣𝗂𝖿𝖿𝗂𝖼𝗎𝗅𝗍𝗒 𝖥𝖺𝖼𝖾: ${levelInfo.difficultyFace}\n`;
        levelMessage += `𝖲𝗈𝗇𝗀 𝖭𝖺𝗆𝖾: ${levelInfo.songName} 𝖻𝗒 ${levelInfo.songAuthor}\n`;
        levelMessage += `𝖲𝗈𝗇𝗀 𝖲𝗂𝗓𝖾: ${levelInfo.songSize}\n`;
        levelMessage += `𝖲𝗈𝗇𝗀 𝖨𝖣: ${levelInfo.songID}\n`;

        const screenshotPath = `./cache/levelgd.png`;

        if (!fs.existsSync(screenshotPath)) {
            const screenshotResponse = await axios.get(screenshotUrl, { responseType: 'arraybuffer' });
            fs.writeFileSync(screenshotPath, screenshotResponse.data);
        }

        await api.sendMessage({ body: levelMessage, attachment: fs.createReadStream(screenshotPath) }, event.threadID, event.messageID);

        await api.unsendMessage(checkingMessage.messageID, event.threadID);
    } catch (error) {
        console.error(error);
        api.sendMessage("❌ | 𝖫𝖾𝗏𝖾𝗅 𝖨𝖣 𝗂𝗌 𝗇𝗈𝗍 𝖤𝗑𝗂𝗌𝗍 𝖮𝗇 𝖦𝖾𝗈𝗆𝖾𝗍𝗋𝗒 𝖣𝖺𝗍𝖺𝖻𝖺𝗌𝖾", event.threadID, event.messageID);
        await api.unsendMessage(checkingMessage.messageID, event.threadID);
    }
};
