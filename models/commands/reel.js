const axios = require("axios");
const cheerio = require("cheerio");

module.exports.config = {
    name: "reel",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Shivansh",
    description: "Pinterest se mood based reel bheje",
    commandCategory: "fun",
    usages: ".reel <mood>",
    cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
    if (!args[0]) return api.sendMessage("Bhai mood type kar: sad, funny, romantic...", event.threadID, event.messageID);

    let mood = args.join(" ");
    let searchURL = `https://www.pinterest.com/search/videos/?q=${encodeURIComponent(mood)}`;

    try {
        api.sendMessage(`⏳ Ruko bhai, "${mood}" reel la raha hoon...`, event.threadID, event.messageID);

        let { data } = await axios.get(searchURL, {
            headers: {
                "User-Agent": "Mozilla/5.0"
            }
        });

        const $ = cheerio.load(data);
        let videoLinks = [];

        $("video").each((i, el) => {
            let src = $(el).attr("src");
            if (src && src.startsWith("https")) videoLinks.push(src);
        });

        if (videoLinks.length === 0) {
            return api.sendMessage("❌ Koi reel nahi mili is mood ke liye.", event.threadID, event.messageID);
        }

        let randomVideo = videoLinks[Math.floor(Math.random() * videoLinks.length)];
        api.sendMessage({
            body: `🎬 "${mood}" mood ki ek reel le bhai!`,
            attachment: await axios({
                url: randomVideo,
                method: "GET",
                responseType: "stream"
            }).then(res => res.data)
        }, event.threadID, event.messageID);

    } catch (err) {
        console.log(err);
        api.sendMessage("⚠️ Error aagya bhai, shayad Pinterest block kar raha hai.", event.threadID, event.messageID);
    }
};
