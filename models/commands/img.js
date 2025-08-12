module.exports.config = {
    name: "img",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Shivansh + GPT",
    description: "Search image from Pinterest and send",
    commandCategory: "media",
    usages: "[keyword]",
    cooldowns: 3,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "request": ""
    }
};

module.exports.run = async function ({ api, event, args }) {
    const axios = require("axios");
    const fs = require("fs-extra");
    const request = require("request");

    if (!args[0]) return api.sendMessage("❌ Keyword dena bhai, example: img cat", event.threadID, event.messageID);

    const keyword = encodeURIComponent(args.join(" "));
    const apiUrl = `https://pinterest-api-one.vercel.app/?q=${keyword}`; // free Pinterest API

    try {
        const res = await axios.get(apiUrl);
        if (!res.data || res.data.length === 0) return api.sendMessage("⚠️ Koi image nahi mili!", event.threadID, event.messageID);

        // Random ek image select karega
        const imageUrl = res.data[Math.floor(Math.random() * res.data.length)];

        let imgPath = __dirname + "/cache/pinimg.jpg";
        let callback = () => api.sendMessage({
            body: `📌 Pinterest Image for: ${decodeURIComponent(keyword)}`,
            attachment: fs.createReadStream(imgPath)
        }, event.threadID, () => fs.unlinkSync(imgPath), event.messageID);

        request(imageUrl).pipe(fs.createWriteStream(imgPath)).on("close", callback);

    } catch (err) {
        console.error(err);
        api.sendMessage("❌ Error aaya Pinterest se image laate waqt.", event.threadID, event.messageID);
    }
};
