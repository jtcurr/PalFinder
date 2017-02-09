var express = require('express');
var path = require('path');
var https = require('https');
var app = express();
var fs = require('fs');
var BinaryServer = require('binaryjs').BinaryServer;
var wav = require('wav');
var auth = require('./authorization.js');
var watson = require('watson-developer-cloud');
var SpeechToTextV1 = require('watson-developer-cloud/speech-to-text/v1');
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

var speech_to_text = new SpeechToTextV1 ({
 username: auth.speech_to_text.username,
 password: auth.speech_to_text.password
});

var params = {
  model: 'en-US_BroadbandModel',
  content_type: 'audio/wav',
  continuous: true,
  'interim_results': true,
  'max_alternatives': 3,
  'word_confidence': false,
  timestamps: false,
  smart_formatting: true
};


var index = 1;
var outFile = 'demo'+index+ '.wav';

binaryServer = BinaryServer({port: 9001});

binaryServer.on('connection', function(client) {
 console.log('new connection');

 var fileWriter = new wav.FileWriter(outFile, {
   channels: 1,
   sampleRate: 48000,
   bitDepth: 16
 });

 client.on('stream', function(stream, meta) {
   stream.pipe(fileWriter);

   stream.on('end', function() {
     fileWriter.end();
     console.log('wrote to file ' + outFile);
   });
 });
});

// Create the stream.
var recognizeStream = speech_to_text.createRecognizeStream(params);

// Pipe in the audio
fs.createReadStream('demo1.wav').pipe(recognizeStream);

// Pipe out the transcription to a file.
recognizeStream.pipe(fs.createWriteStream('transcription.txt'));

// Get strings instead of buffers from 'data' events.
recognizeStream.setEncoding('utf8');

// Listen for events.
recognizeStream.on('results', function(event) { 
  console.log(event);
});
recognizeStream.on('data', function(event) { 
  console.log(event);
});
recognizeStream.on('error', function(event) { 
});
recognizeStream.on('close', function(event) { 
});



app.use(express.static(__dirname + '/../client'));

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
  console.log('From', req.body.From.slice(1));
  console.log('To text', req.body.To.slice(1));
  console.log('transcription text', req.body.TranscriptionText);

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
  // console.log('----------', req.body);

  var msgFrom = req.body.From;
  var msgBody = req.body.Body;
  exports.phoneNumber = msgFrom
  exports.message = msgBody;
  exports.result = true;

  res.send(`<Response>
    <Message>
    Hello ${msgFrom}. You said: ${msgBody}
    </Message>
    </Response>`)
});


app.use(express.static(__dirname + '/../client'));

//start and stop recording
app.post('/recorder', function(req, res) {
    console.log('PARSED request', req.socket);
    res.send('start recording');
});

app.get('*', function (req, res) {
 res.sendFile(path.join(__dirname, '/../client/index.html'));
});

// app.get('/send-message', function(req,res) {
//   console.log('serving request ' + req.method + ' at ' + req.url);
//   res.sendFile(path.join(__dirname, '/../client/index.html'));
// });


app.listen(3000, function() {
  console.log('listening on port 3000');
});
