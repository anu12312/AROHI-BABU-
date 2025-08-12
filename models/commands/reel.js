const axios = require("axios");

module.exports.config = {
    name: "img",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "ANURAG MISHRA",
    description: "Pinterest se multiple images bheje keyword ke hisaab se",
    commandCategory: "tools",
    usages: ".img <keyword>",
    cooldowns: 3
};

module.exports.run = async ({ api, event, args }) => {
    try {
        const keyword = args.join(" ");
        if (!keyword) return api.sendMessage("❌ Bhai, keyword bata (jaise: .img cat, .img sunset)", event.threadID, event.messageID);

        api.sendMessage(`🔍 "${keyword}" images la raha hoon...`, event.threadID, event.messageID);

        const res = await axios.get(`https://api.vyturex.com/pinterest?search=${encodeURIComponent(keyword)}`);

        if (!res.data || res.data.length === 0) {
            return api.sendMessage(`❌ Koi image nahi mili keyword "${keyword}" ke liye.`, event.threadID, event.messageID);
        }

        // Random 3 images select
        let attachments = [];
        let usedIndexes = new Set();
        while (attachments.length < 3 && usedIndexes.size < res.data.length) {
            let randomIndex = Math.floor(Math.random() * res.data.length);
            if (!usedIndexes.has(randomIndex)) {
                usedIndexes.add(randomIndex);
                attachments.push(await global.utils.getStreamFromURL(res.data[randomIndex]));
            }
        }

        api.sendMessage({
            body: `📌 "${keyword}" ka result (3 images):`,
            attachment: attachments
        }, event.threadID, event.messageID);

    } catch (err) {
        console.error(err);
        api.sendMessage("⚠ Error aa gaya Pinterest se data laate waqt.", event.threadID, event.messageID);
    }
};
