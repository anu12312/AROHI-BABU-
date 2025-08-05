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
```javascript
const botReply = (userMessage) => {
    let reply;

    switch (userMessage.toLowerCase()) {
        case "hi":
            reply = "Hello! How can I assist you today?";
            break;
        case "how are you?":
            reply = "I'm doing great, thanks for asking!";
            break;
        case "what can you do?":
            reply = "I can provide information, answer questions, or assist with anything you need!";
            break;
        default:
            reply = "I'm sorry, I didn't quite understand that. Could you please rephrase?";
            break;
    }

    return reply;
};

// Example usage:
const userMessage = "hi";
console.log(botReply(userMessage));  // Output: "Hello! How can I assist you today?"
```

This code defines a function `botReply` that takes a user's message as input and returns a suitable reply based on predefined responses for common queries or greetings. Adjust the responses and add more cases
 as needed for your specific chat bot's functionality!