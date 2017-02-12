
var express = require('express');
var path = require('path');
var https = require('https');
var app = express();
var fs = require('fs');
var BinaryServer = require('binaryjs').BinaryServer;
var recorder = require('./recorder')
var bodyParser = require('body-parser');
var twilio = require('twilio');
var admin = require("firebase-admin");
var serviceAccount = require("./firebaseAdminKey.json");

//firebase setup
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://misanthropiccustard.firebaseio.com"
});

// Twilio Credentials
var accountSid = 'AC4d28a323f87518fb7415f19864d01c56';
var authToken = 'b0bd854524b33b38956f4ea4804a46e5';

//require the Twilio module and create a REST client
var client = require('twilio')(accountSid, authToken);

// Initialize Firebase
var config = {
  apiKey: "AIzaSyCku_D8eKGNvKkbUlvxhYAt_MRn6jajrws",
  authDomain: "misanthropiccustard.firebaseapp.com",
  databaseURL: "https://misanthropiccustard.firebaseio.com",
  storageBucket: "misanthropiccustard.appspot.com",
  messagingSenderId: "177915198055"
};

var db = admin.database();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

//Config for Google Speech
const request = {
  config: {
    encoding: 'LINEAR16',
    sampleRate: 48000
  }
};

binaryServer = BinaryServer({port: 9001});

binaryServer.on('connection', function(client) {
 console.log('new connection!');

 client.on('stream', function(stream, meta) {

  const Speech = require('@google-cloud/speech');
  const speech = Speech();
  const request = {
    config: {
      encoding: 'LINEAR16',
      sampleRate: 48000
    }
  };

  const recognizeStream = speech.createRecognizeStream(request)
    .on('error', console.error)
    .on('data', (data) => {
console.log('data!')
      // process.stdout.write(data.results);
      // DATA 
      if (data.results) {
        message += data.results;
        var id = Date.now();
        db.ref('chats/' + id).update({
          'createdAt': new Date(),
          'text': message,
          'username': userName
        });
        db.ref('recordMessages/' + id).update({
          'message': message,
        });
        console.log('data message', message)
      }
    });

    stream.pipe(recognizeStream);

   stream.on('end', function() {
      message = '';
      console.log('end')
   });
 });
});

app.use(express.static(__dirname + '/../client'));

var userName;
app.post('/recording', function(req, res) {
 userName = req.body.username;
})

//Records and transcribes phone calls
app.post('/voice', function(req, res) {

  res.send(`
    <Response>
      <Record playBeep="true" timeout="20" transcribe="true" transcribeCallback="/handleTranscribe"/>
    </Response>
  `);
})

// Allows us to work with the recording when it is done transcribing
app.post('/handleTranscribe', function(req, res) {
  var sender = req.body.From.slice(1);
  var message = req.body.TranscriptionText;
  var userTwilioNumber = req.body.To.slice(1);
  var uniqueId = req.body.TranscriptionSid;

  db.ref('twilioMessages/' + userTwilioNumber + '/' + uniqueId).set({
    "from": sender,
    "body": message
  });

  res.send('message received');
})

app.get('/getMessages', function(uid) {
  console.log('retrieving messages from database');

  databaseAndAuth.database.ref('users/' + user.uid).update({
    "UserMessages": newTwilioNumber
  });
});

app.post('/message', function(req, res) {
  console.log('----------', req.body);

  var msgTo = req.body.To.slice(1);
  var unqNumber = req.body.SmsMessageSid;
  var msgFrom = req.body.From.slice(1);
  var msgBody = req.body.Body;

  db.ref('twilioMessages/' + msgTo + '/' +  unqNumber).set({
    "from": msgFrom,
    "body": msgBody
  })
  res.send(`<Response>
    <Message>
    Hello ${msgFrom}. You said: ${msgBody}
    </Message>
    </Response>`)
});

//start and stop recording
app.post('/recorder', function(req, res) {
    console.log('PARSED request', req.socket);
    res.send('start recording');
});

app.get('*', function (req, res) {
 res.sendFile(path.join(__dirname, '/../client/index.html'));
});

app.listen(3000, function() {
  console.log('listening on port 3000');
});
