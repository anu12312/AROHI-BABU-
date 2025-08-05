const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');

app.use(bodyParser.json());

// Facebook Messenger API settings
const PAGE_ACCESS_TOKEN = 'YOUR_PAGE_ACCESS_TOKEN';
const VERIFY_TOKEN = 'YOUR_VERIFY_TOKEN';

// NLP library
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const analyzer = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');

// ✅ GLOBAL: Reply-only mode
module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;
  if (!isActive || !body || senderID == api.getCurrentUserID()) return;
  
// ❌ Only reply if user is replying to a message from the bot
  if (!messageReply || messageReply.senderID !== api.getCurrentUserID()) return;
  
// Function to handle incoming messages
function handleMessage(senderPsid, message) {
  // Tokenize the message
  const tokens = tokenizer.tokenize(message);

  // Analyze the sentiment of the message
  const sentiment = analyzer.getSentiment(tokens);

  // Generate a response based on the sentiment
  let response;
  if (sentiment > 0) {
    response = 'Aap khush lag rahe hain!';
  } else if (sentiment < 0) {
    response = 'Aap dukhi lag rahe hain. Main yahan hoon aapke liye.';
  } else {
    response = 'Aapne kya kaha?';
  }

  // Send the response back to the user
  callSendAPI(senderPsid, response);
}

// Function to send a response to the user
function callSendAPI(senderPsid, response) {
  const requestBody = {
    'recipient': {
      'id': senderPsid
    },
    'message': {
      'text': response
    }
  };

  axios.post(`https://graph.facebook.com/v13.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, requestBody)
    .then((res) => {
      console.log('Message sent!');
    })
    .catch((error) => {
      console.error(error);
    });
}

// Handle incoming messages
app.post('/webhook', (req, res) => {
  const body = req.body;

  if (body.object === 'page') {
    body.entry.forEach((entry) => {
      entry.messaging.forEach((event) => {
        if (event.message) {
          handleMessage(event.sender.id, event.message.text);
        }
      });
    });

    res.status(200).send('EVENT_RECEIVED');
  } else {
    res.sendStatus(404);
  }
});

// Verify the webhook
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});