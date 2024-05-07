const fs = require('fs');
const path = require('path');
const axios = require('axios');

const permissionMaintenance = ["100036956043695", "100070558673418"]; 
let maintenanceMode = false;

const dataFilePath = path.join(__dirname, 'data.json');
const timeAddSongFilePath = path.join(__dirname, 'timeaddsong.json');

if (fs.existsSync(dataFilePath)) {
    const rawData = fs.readFileSync(dataFilePath);
    const jsonData = JSON.parse(rawData);
    if (jsonData.hasOwnProperty('maintenanceMode')) {
        maintenanceMode = jsonData.maintenanceMode;
    }
}

let userCooldowns = {}; // Object to store cooldowns for each user

function saveTimeData(data) {
    fs.writeFileSync(timeAddSongFilePath, JSON.stringify(data, null, 2));
}

function loadData() {
    if (fs.existsSync(timeAddSongFilePath)) {
        const rawData = fs.readFileSync(timeAddSongFilePath);
        return JSON.parse(rawData);
    } else {
        return { cooldowns: {} };
    }
}

module.exports.config = {
    name: "addsong",
    version: "1.1.5",
    hasPermssion: 0,
    credits: "Jonell Magallanes",
    description: "Reupload music from GDPH",
    usePrefix: true,
    commandCategory: "GDPH",
    usages: "!addsong songlink available like dropbox or other links redirect | name",
};

module.exports.run = async function ({ api, event, args }) {
    const { body, threadID, messageID, senderID } = event;
    let link, title;

    const currentTime = Date.now();
    const timeData = loadData();

    if (args.length === 0) {
        // No arguments, command not subject to cooldown
        return api.sendMessage("❌ | 𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝗌𝗈𝗇𝗀 𝗅𝗂𝗇𝗄 𝖺𝗇𝖽 𝗍𝗂𝗍𝗅𝖾.\n\n𝖤𝗑𝖺𝗆𝗉𝗅𝖾 \n𝖨𝖿 𝗒𝗈𝗎𝗍𝗎𝖻𝖾 𝗅𝗂𝗇𝗄 !𝖺𝖽𝖽𝗌𝗈𝗇𝗀 (𝗒𝗈𝗎𝗍𝗎𝖻𝖾 𝗅𝗂𝗇𝗄)\n\n𝖨𝖿 𝖣𝗋𝗈𝗉𝖻𝗈𝗑 𝗅𝗂𝗇𝗄 !𝖺𝖽𝖽𝗌𝗈𝗇𝗀 [ 𝖽𝗋𝗈𝗉𝖻𝗈𝗑 𝗅𝗂𝗇𝗄 ] [ 𝗌𝗈𝗇𝗀 𝗍𝗂𝗍𝗅𝖾 ]", threadID, messageID);
    }

    if (userCooldowns.hasOwnProperty(senderID) && (currentTime - userCooldowns[senderID] < 3600 * 1000)) {
        const timeLeft = userCooldowns[senderID] + 3600 * 1000 - currentTime;
        const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const secondsLeft = Math.floor((timeLeft % (1000 * 60)) / 1000);
        return api.sendMessage(`⏳ | 𝖸𝗈𝗎 𝖼𝖺𝗇 𝗎𝗌𝖾 𝗍𝗁𝗂𝗌 𝖼𝗈𝗆𝗆𝖺𝗇𝖽 𝖺𝗀𝖺𝗂𝗇 𝗂𝗇 ${hoursLeft} 𝗁𝗈𝗎𝗋𝗌 ${minutesLeft} 𝗆𝗂𝗇𝗎𝗍𝖾𝗌 𝖺𝗇𝖽 ${secondsLeft} 𝗌𝖾𝖼𝗈𝗇𝖽𝗌.`, threadID, messageID);
    }

    if (args.length === 1 && args[0] === "on") {
        if (!permissionMaintenance.includes(senderID)) {
            return api.sendMessage("You have no permission to use this command.", threadID, messageID);
        }
        maintenanceMode = false;
        saveData();
        return api.sendMessage("✅ | 𝖱𝖾𝗎𝗉𝗅𝗈𝖺𝖽 𝖬𝗎𝗌𝗂𝖼 𝗂𝗌 𝖡𝖺𝖼𝗄 𝖮𝗇𝗅𝗂𝗇𝖾 𝖲𝗍𝖺𝗍𝗎𝗌", threadID, messageID);
    }

    if (args.length === 1 && args[0] === "off") {
        if (!permissionMaintenance.includes(senderID)) {
            return api.sendMessage("You have no permission to use this command.", threadID, messageID);
        }
        maintenanceMode = true;
        saveData();
        return api.sendMessage("🚧 | 𝖱𝖾𝗎𝗉𝗅𝗈𝖺𝖽 𝖬𝗎𝗌𝗂𝖼 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 𝖬𝖺𝗂𝗇𝗍𝖾𝗇𝖺𝗇𝖼𝖾 𝖬𝗈𝖽𝖾 𝖩𝗎𝗌𝗍 𝖻𝖾 𝖯𝖺𝗍𝗂𝖾𝗇𝖼𝖾", threadID, messageID);
    }

    if (maintenanceMode) {
        return api.sendMessage("🚧 | 𝖱𝖾𝗎𝗉𝗅𝗈𝖺𝖽 𝖬𝗎𝗌𝗂𝖼 𝖦𝖣𝖧 𝗂𝗌 𝖼𝗎𝗋𝗋𝖾𝗇𝗍𝗅𝗒 𝗎𝗇𝖽𝖾𝗋 𝗆𝖺𝗂𝗇𝗍𝖾𝗇𝖺𝗇𝖼𝖾.", threadID, messageID);
    }

    const commandArgs = args.join(" ").split("|").map(arg => arg.trim());
    if (commandArgs.length === 2) {
        link = commandArgs[0];
        title = commandArgs[1];
    } else {
        if (event.type === "message_reply") {
            const replyMessage = event.messageReply.body;
            const youtubeMatch = replyMessage.match(/(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/[^\s]+/);
            if (youtubeMatch) {
                link = youtubeMatch[0];
                title = args.join(" ").trim();
            } else {
                return api.sendMessage("❌ | 𝖳𝗁𝗂𝗌 𝖬𝗎𝗌𝗂𝖼 𝗒𝗈𝗎 𝗋𝖾𝗉𝗅𝗒 𝗁𝖺𝗌 𝗇𝗈 𝖼𝗈𝗇𝗍𝖺𝗂𝗇𝖾𝖽 𝖺 𝖸𝗈𝗎𝖳𝗎𝖻𝖾 𝗅𝗂𝗇𝗄𝗌", threadID, messageID);
            }
        } else {
            [link, title] = args.join(" ").split("|").map(arg => arg.trim());
        }
    }

    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

    if (!link) {
        return api.sendMessage("𝖯𝗅𝖾𝖺𝗌𝖾 𝗉𝗋𝗈𝗏𝗂𝖽𝖾 𝗌𝗈𝗇𝗀 𝗅𝗂𝗇𝗄 𝖺𝗇𝖽 𝗍𝗂𝗍𝗅𝖾.\n\n𝖴𝗌𝖺𝗀𝖾: 𝖺𝖽𝖽𝗌𝗈𝗇𝗀 𝗌𝗈𝗇𝗀𝗅𝗂𝗇𝗄 | 𝖳𝗂𝗍𝗅𝖾 𝗈𝖿 𝖬𝗎𝗌𝗂𝖼", threadID, messageID);
    }

    const waitMessage = await api.sendMessage("☁️ | 𝖱𝖾𝗎𝗉𝗅𝗈𝖺𝖽𝗂𝗇𝗀 𝗍𝗁𝖾 𝖬𝗎𝗌𝗂𝖼 𝖯𝗅𝖾𝖺𝗌𝖾 𝖶𝖺𝗂𝗍..", threadID, messageID);

    try {
        if (!youtubeRegex.test(link)) {
            const reuploadUrl = `https://gdph.ps.fhgdps.com/tools/bot/songAddBot.php?link=${encodeURIComponent(link)}&author=GDPHBOTMUSIC&name=${encodeURIComponent(title)}`;
            const reuploadResponse = await axios.get(reuploadUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });

            const songID = reuploadResponse.data;

            if (songID) {
                const message = `✅ | 𝖱𝖾-𝗎𝗉𝗅𝗈𝖺𝖽𝖾𝖽 𝖬𝗎𝗌𝗂𝖼 𝖦𝖣𝖯𝖧\n\n𝖨𝖣: ${songID}\n𝖭𝖺𝗆𝖾: ${title}`;

                api.editMessage(message, waitMessage.messageID, threadID, messageID);


                userCooldowns = {}; 
                userCooldowns[senderID] = currentTime; 
                saveTimeData({ cooldowns: userCooldowns });

                return;
            } else {
                api.editMessage("Reupload Failed", waitMessage.messageID, threadID, messageID);
                return;
            }
        }

        const apiUrl = `https://reuploadmusicgdpsbyjonellapis-7701ddc59ff1.herokuapp.com/api/jonell?url=${encodeURIComponent(link)}`;

        const response = await axios.get(apiUrl);
        const { title: songTitle, url: finalSongLink } = response.data.Successfully;

        const reuploadUrl = `https://gdph.ps.fhgdps.com/tools/bot/songAddBot.php?link=${encodeURIComponent(finalSongLink)}&author=GDPHBOTMUSIC&name=${encodeURIComponent(songTitle)}`;

        const reuploadResponse = await axios.get(reuploadUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });

        const songID = reuploadResponse.data;

        if (songID) {
            const message = `✅ | 𝖱𝖾-𝗎𝗉𝗅𝗈𝖺𝖽𝖾𝖽 𝖬𝗎𝗌𝗂𝖼 𝖦𝖣𝖯𝖧\n\n𝖨𝖣: ${songID}\n𝖭𝖺𝗆𝖾: ${songTitle}`;

            api.editMessage(message, waitMessage.messageID, threadID, messageID);

            userCooldowns = {}; 
            userCooldowns[senderID] = currentTime; 
            saveTimeData({ cooldowns: userCooldowns });
        } else {
            api.editMessage("Reupload Failed :<", waitMessage.messageID, threadID, messageID);
        }
    } catch (error) {
        console.error(error);
        api.editMessage("Reupload Failed :<", waitMessage.messageID, threadID, messageID);
    }
};

module.exports.toggleMaintenance = function () {
    maintenanceMode = !maintenanceMode;
    saveData();
    return maintenanceMode;
};

function saveData() {
    const data = {
        maintenanceMode: maintenanceMode
    };
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}
