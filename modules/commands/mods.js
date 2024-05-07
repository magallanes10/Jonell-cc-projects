module.exports.config = {
  name: "feedback",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "Jonell Magallanes",
  description: "Get Feedback",
  usePrefix: true,
  commandCategory: "Reports",
  usages: "",
  cooldowns: 5
};

module.exports.handleReply = async function({
  api: e,
  args: n,
  event: a,
  Users: s,
  handleReply: o
}) {
  var i = await s.getNameUser(a.senderID);
  switch (o.type) {
    case "reply":
      var adminList = ['100036956043695']; // Replace with actual admin IDs
      for (let admin of adminList) {
        e.sendMessage({
          body: "📄 | 𝖥𝖾𝖾𝖽𝖻𝖺𝖼𝗄 𝖿𝗋𝗈𝗆 " + i + ":\n" + a.body,
          mentions: [{
            id: a.senderID,
            tag: i
          }]
        }, admin);
      }
      break;
    case "calladmin":
      e.sendMessage({
        body: `𝖥𝖾𝖾𝖽𝖻𝖺𝖼𝗄 𝖿𝗋𝗈𝗆 𝖬𝗈𝖽𝖾𝗋𝖺𝗍𝗈𝗋 ${i} 𝗍𝗈 𝗒𝗈𝗎:\n--------\n${a.body}\n--------\n»💬𝖱𝖾𝗉𝗅𝗒 𝗍𝗈 𝗍𝗁𝗂𝗌 𝗆𝖾𝗌𝗌𝖺𝗀𝖾 𝗍𝗈 𝖼𝗈𝗇𝗍𝗂𝗇𝗎𝖾 𝗌𝖾𝗇𝖽𝗂𝗇𝗀 𝖿𝖾𝖾𝖽𝖻𝖺𝖼𝗄`,
        mentions: [{
          tag: i,
          id: a.senderID
        }]
      }, o.id);
      break;
  }
};

module.exports.run = async function({
  api: e,
  event: n,
  args: a,
  Users: s,
  Threads: o
}) {
  if (!a[0]) return e.sendMessage("𝖸𝗈𝗎 𝗁𝖺𝗏𝖾 𝗇𝗈𝗍 𝖾𝗇𝗍𝖾𝗋𝖾𝖽 𝗍𝗁𝖾 𝖼𝗈𝗇𝗍𝖾𝗇𝗍 𝗍𝗈 𝖿𝖾𝖾𝖽𝖻𝖺𝖼𝗄\n\n𝖤𝗑𝖺𝗆𝗉𝗅𝖾 𝖿𝖾𝖾𝖽𝖻𝖺𝖼𝗄 [ 𝗒𝗈𝗎𝗋 𝖿𝖾𝖾𝖽𝖻𝖺𝖼𝗄]", n.threadID, n.messageID);
  let i = await s.getNameUser(n.senderID);
  var t = n.senderID,
    d = n.threadID;
  let r = (await o.getData(n.threadID)).threadInfo;
  var l = require("moment-timezone").tz("Asia/Manila").format("HH:mm:ss D/MM/YYYY");
  e.sendMessage(`𝖠𝗍: ${l}\n𝖸𝗈𝗎𝗋 𝖥𝖾𝖾𝖽𝖻𝖺𝖼𝗄 𝖦𝖣𝖧 𝗁𝖺𝗌 𝖻𝖾𝖾𝗇 𝗌𝖾𝗇𝗍 𝗍𝗈 𝗍𝗁𝖾 𝖬𝗈𝖽𝖾𝗋𝖺𝗍𝗈𝗋`, n.threadID, (() => {
    var adminList = ['100070558673418']; 
    for (let admin of adminList) {
      e.sendMessage(`𝖱𝖾𝗉𝗈𝗋𝗍 𝖿𝗋𝗈𝗆: ${i}\n𝖦𝗋𝗈𝗎𝗉 𝖢𝗁𝖺𝗍: ${d}\n𝖨𝖣 𝖡𝗈𝗑: ${n.senderID}\n𝖨𝖣 𝖴𝗌𝖾: ${t}\n-----------------\n${a.join(" ")}\n-----------------\n𝖳𝗂𝗆𝖾: ${l}`, admin, ((e, a) => global.client.handleReply.push({
        name: this.config.name,
        messageID: a.messageID,
        author: n.senderID,
        messID: n.messageID,
        id: d,
        type: "calladmin"
      })))
    }
  }))
};
