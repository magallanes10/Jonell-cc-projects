const num = 3// Number of times spamming before being banned -1, for example, if 5 times, the 6th will be banned
const timee = 10// Within the time `timee`, if spamming `num` times, the user will be banned

module.exports.config = {
  name: "spamban",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "NTKhang", // Fixed by D-Jukie
  description: ``,
  usePrefix: true,
  hide: true,
  commandCategory: "System",
  usages: "x",
  cooldowns: 5
};

module.exports.run = async function ({api, event})  {
  return api.sendMessage(`Automatically ban users if spam ${num} times/${timee}s`, event.threadID, event.messageID);
};

module.exports.handleEvent = async function ({ Users, Threads, api, event})  {
  let { senderID, messageID, threadID } = event;
  var datathread = (await Threads.getData(event.threadID)).threadInfo;
  
  if (!global.client.autoban) global.client.autoban = {};
  
  if (!global.client.autoban[senderID]) {
    global.client.autoban[senderID] = {
      timeStart: Date.now(),
      number: 0
    }
  };
  
  const threadSetting = global.data.threadData.get(threadID) || {};
  const prefix = threadSetting.PREFIX || global.config.PREFIX;
  if (!event.body || event.body.indexOf(prefix) != 0) return;
  
  if ((global.client.autoban[senderID].timeStart + (timee*1000)) <= Date.now()) {
    global.client.autoban[senderID] = {
      timeStart: Date.now(),
      number: 0
    }
  }
  else {
    global.client.autoban[senderID].number++;
    if (global.client.autoban[senderID].number >= num) {
      var namethread = datathread.threadName;
      const moment = require("moment-timezone");
      const timeDate = moment.tz("Asia/Ho_Chi_minh").format("DD/MM/YYYY HH:mm:ss");
      let dataUser = await Users.getData(senderID) || {};
      let data = dataUser.data || {};
      if (data && data.banned == true) return;
      data.banned = true;
      data.reason = `spam bot ${num} times/${timee}s` || null;
      data.dateAdded = timeDate;
      await Users.setData(senderID, { data });
      global.data.userBanned.set(senderID, { reason: data.reason, dateAdded: data.dateAdded });
      global.client.autoban[senderID] = {
        timeStart: Date.now(),
        number: 0
      };
      api.sendMessage("𝖸𝗈𝗎 𝗁𝖺𝗏𝖾 𝖻𝖾𝖾𝗇 𝖻𝖺𝗇𝗇𝖾𝖽 𝖿𝗋𝗈𝗆 𝗎𝗌𝗂𝗇𝗀 𝗍𝗁𝖾 𝖻𝗈𝗍, 𝗉𝗅𝖾𝖺𝗌𝖾 𝗋𝖾𝗆𝗈𝗏𝖾. 𝖣𝖾𝗉𝖾𝗇𝖽𝗂𝗇𝗀 𝗈𝗇 𝗍𝗁𝖾 𝖼𝖺𝗌𝖾, 𝗂𝗍 𝗐𝗂𝗅𝗅 𝖻𝖾 𝗋𝖾𝗆𝗈𝗏𝖾𝖽 𝖻𝗒 𝖠𝖽𝗆𝗂𝗇𝗂𝗌𝗍𝗋𝖺𝗍𝗈𝗋 𝖡𝗈𝗍\nID: " + senderID + " \nName: " + dataUser.name + `\nReason: spam bot ${num} time/${timee}s\n\n✔Reported to bot admin`, threadID,
    () => {
    var idad = global.config.ADMINBOT;
    for(let ad of idad) {
        api.sendMessage(`Spam offender ${num} times/${timee}s\nName: ${dataUser.name} \nID: ${senderID}\nID Box: ${threadID} \nNameBox: ${namethread} \nAt the time: ${timeDate}`, 
          ad);
    }
    })
    }
  }
};
