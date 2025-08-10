const fs = require("fs");
module.exports.config = {
	name: "khana_kha_lo",
    version: "1.0.1",
	hasPermssion: 0,
	credits: "𝙋𝙧𝙞𝙮𝙖𝙣𝙨𝙝 𝙍𝙖𝙟𝙥𝙪𝙩", 
	description: "hihihihi",
	commandCategory: "no prefix",
	usages: "khana_kha_lo",
    cooldowns: 5, 
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;
	if (event.body.indexOf("KHANA KHA LO")==0 || event.body.indexOf("Khana kha lo")==0 || event.body.indexOf("khana kha lo")==0 || event.body.indexOf(".khana kha lo")==0) {
		var msg = {
				body: "💝 YE LO BBY KHANA KHAO 🥗\n\n(-𝐌𝐚𝐝𝐞 𝐁𝐲 ANURAG ❤️-)",
				attachment: 
fs.createReadStream(__dirname + `/ARIF-BABU/BIRYANI.jpg`)
			}
			api.sendMessage(msg, threadID, messageID);
    api.setMessageReaction("🥗", event.messageID, (err) => {}, true)
		}
	}
	module.exports.run = function({ api, event, client, __GLOBAL }) {

	}
