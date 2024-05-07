"use strict";

const axios = require('axios');

module.exports.config = {
    name: "servercheck",
    version: "1.1.2",
    hasPermssion: 0,
    credits: "Jonell Magallanes",
    description: "Check the status of GD servers in real-time",
    usePrefix: true,
    commandCategory: "Utility",
    cooldowns: 10
};

module.exports.run = async function ({ api, event }) {
    const servers = [
        "https://gdph.ps.fhgdps.com/",
        "https://gdph.ps.fhgdps.com/tools/songAdd.php",
        "https://gdph.ps.fhgdps.com/tools/stats/songList.php",
        "https://gdph.ps.fhgdps.com/tools/index.php"
    ];

    const checkingMessage = await api.sendMessage("🔍 | Checking server status...", event.threadID);

    const checkServer = async (server) => {
        try {
            const response = await axios.get(server, { timeout: 5000 });
            return `✅ ${response.status}`;
        } catch (error) {
            if (error.response) {
                return `❌ ${error.response.status}`;
            } else if (error.request) {
                return '❌ No response received';
            } else {
                return '❌ Error';
            }
        }
    };

    const results = await Promise.allSettled(
        servers.map(server => checkServer(server))
    );

    let status = {
        "Homepage": results[0].value,
        "Song Add": results[1].value,
        "Song List": results[2].value,
        "Index Homepage": results[3].value
    };

    let response = `GDP𝖧 Server Status Check\n\n`;

    for (const [server, stat] of Object.entries(status)) {
        response += `${server}: ${stat}\n`;
    }

    const upCount = Object.values(status).filter(stat => stat.startsWith('✅')).length;
    const downCount = Object.values(status).filter(stat => stat.startsWith('❌')).length;

    if (upCount === 4) {
        response += "\nAll servers are up.";
    } else if (downCount === 4) {
        response += "\nAll servers are down.";
    } else {
        response += `\n${upCount} server(s) are up, ${downCount} server(s) are down.`;
    }

    api.editMessage(response, checkingMessage.messageID, event.threadID, event.messageID);
};
