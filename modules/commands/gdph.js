const axios = require('axios');
const cheerio = require('cheerio');

module.exports.config = {
    name: "gdph",
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
    const command = args[0].toLowerCase();
    let url;

    switch (command) {
        case 'admins':
        case 'mods':
            url = 'https://gdph.ps.fhgdps.com/tools/stats/vipList.php';
            break;
        default:
            return api.sendMessage("Invalid command. Please use '?gdph admins' or '?gdph mods'.", event.threadID, event.messageID);
    }

    try {
        const waitMessage = await api.sendMessage("🔍 | Checking.....", event.threadID);

        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:94.0) Gecko/20100101 Firefox/94.0' // Using Mozilla Firefox 94.0 user agent
            }
        });
        const $ = cheerio.load(response.data);

        let title, tableSelector;
        switch (command) {
            case 'admins':
                title = '𝖠𝖽𝗆𝗂𝗇𝗂𝗌𝗍𝗋𝖺𝗍𝗈𝗋 𝗈𝖿 𝖦𝖣𝖯𝖧 𝖲𝖾𝗋𝗏𝖾𝗋';
                tableSelector = 'h1:contains("VIP List") + h2:contains("Admin") + table';
                break;
            case 'mods':
                title = '𝖬𝗈𝖽𝖾𝗋𝖺𝗍𝗈𝗋𝗌 𝗈𝖿 𝖦𝖣𝖯𝖧 𝖲𝖾𝗋𝗏𝖾𝗋';
                tableSelector = 'h2:contains("Moderator") + table';
                break;
        }

        const userList = [];
        $(tableSelector).find('tr').each((index, element) => {
            if (index !== 0) {
                const columns = $(element).find('td');
                const user = $(columns[0]).text().trim();
                const lastOnline = $(columns[1]).text().trim();
                userList.push({ user, lastOnline });
            }
        });

        const formattedResponse = `${title}\n\n${userList.map(({ user, lastOnline }) => `『 ${user}\nLast Online: ${lastOnline} 』`).join('\n\n')}`;

        await api.editMessage(formattedResponse, waitMessage.messageID, event.threadID);
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while fetching user information.", event.threadID);
    }
};
