var express = require('express');
var path = require('path');
var https = require('https');
var app = express();
var fs = require('fs');
var auth = require('./authorization.js');
var watson = require('watson-developer-cloud');
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

// var text_to_speech = watson.text_to_speech(auth.text_to_speech);
// var params = {
//   text: 'I am the real DJ!',
//   voice: 'en-US_AllisonVoice',
//   accept: 'audio/wav'
// }

// text_to_speech.synthesize(params).pipe(fs.createWriteStream('speech.wav'))

// app.use('/bower_components', express.static(path.join(__dirname, '/../client/bower_components')));
// app.use('/scripts', express.static(path.join(__dirname, '/../client/scripts')));
// app.use('/styles', express.static(path.join(__dirname, '/../client/styles')));
// app.use('/partials', express.static(path.join(__dirname, '/../client/partials')));
// app.use('/images', express.static(path.join(__dirname, '/../client/images')));

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

//start and stop recoing
app.get('/recorder', recorder.toggleState)

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '/../client/index.html'));
});

// app.get('/send-message', function(req,res) {
//   console.log('serving request ' + req.method + ' at ' + req.url);
//   res.sendFile(path.join(__dirname, '/../client/index.html'));
// });

app.listen(3000, function() {
  console.log('listening on port 3000');
})
