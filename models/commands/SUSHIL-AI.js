const axios = require("axios");

module.exports.config = {
  name: "Shona",
  version: "2.1.0",
  hasPermssion: 0,
  credits: "Amir",
  description: "Shona - Global AI that replies only on message replies (Roman Urdu)",
  commandCategory: "AI",
  usePrefix: false,
  usages: "[Reply to Shona's message]",
  cooldowns: 2,
};

let userMemory = {};
let isActive = true;

// ✅ GLOBAL: Reply-only mode
module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;
  if (!isActive || !body || senderID == api.getCurrentUserID()) return;

  // ❌ Only reply if user is replying to a message from the bot
  if (!messageReply || messageReply.senderID !== api.getCurrentUserID()) return;

  const userQuery = body.trim();

  // 🧠 Create memory if doesn't exist
  if (!userMemory[senderID]) userMemory[senderID] = [];

  const conversationHistory = userMemory[senderID].join("\n");
  const fullQuery = `${conversationHistory}\nUser: ${userQuery}\nBot:`;

  const apiURL = `https://shankar-gpt-3-api.vercel.app/api?message=${encodeURIComponent(fullQuery)}`;

  try {
    const response = await axios.get(apiURL);
    let botReply = response.data.response || "Mujhe samajh nahi aaya, zara dobara kehna.";

    // 💾 Update user memory
    userMemory[senderID].push(`User: ${userQuery}`);
    userMemory[senderID].push(`Bot: ${botReply}`);
    if (userMemory[senderID].length > 15) userMemory[senderID].splice(0, 2);

    return api.sendMessage(botReply, threadID, messageID);
  } catch (err) {
    console.error("❌ Shona API Error:", err.message);
    return api.sendMessage("Shona se jawab nahi aya, thori dair baad koshish karo.", threadID, messageID);
  }
};

// ⚙️ Admin command to control Shona
module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const command = args[0] && args[0].toLowerCase();

  if (command === "on") {
    isActive = true;
    return api.sendMessage("✅ Shona ab har thread mein ON hai (sirf reply pe jawab degi).", threadID, messageID);
  } else if (command === "off") {
    isActive = false;
    return api.sendMessage("❌ Shona ab OFF hai.", threadID, messageID);
  } else if (command === "clear") {
    if (args[1] === "all") {
      userMemory = {};
      return api.sendMessage("🧹 Sab users ki memory clear kar di gayi hai.", threadID, messageID);
    }
    if (userMemory[senderID]) {
      delete userMemory[senderID];
      return api.sendMessage("🧹 Tumhari memory clear kar di gayi hai.", threadID, messageID);
    } else {
      return api.sendMessage("⚠️ Tumhari koi memory saved nahi hai.", threadID, messageID);
    }
  } else {
    return api.sendMessage("❓ Usage: /shona on | off | clear | clear all", threadID, messageID);
  }
};