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

// Twilio Credentials
var accountSid = 'AC4d28a323f87518fb7415f19864d01c56';
var authToken = 'b0bd854524b33b38956f4ea4804a46e5';

//require the Twilio module and create a REST client
var client = require('twilio')(accountSid, authToken);

app.use(bodyParser.urlencoded({
  extended: true
}));
>>>>>>> Add heroku

// var text_to_speech = watson.text_to_speech(auth.text_to_speech);
// var params = {
//   text: 'I am the real DJ!',
//   voice: 'en-US_AllisonVoice',
//   accept: 'audio/wav'
// }

// text_to_speech.synthesize(params).pipe(fs.createWriteStream('speech.wav'))

var options = {
  cert: fs.readFileSync('client-cert.pem'),
  key: fs.readFileSync('client-key.pem')
};

// app.use('/bower_components', express.static(path.join(__dirname, '/../client/bower_components')));
// app.use('/scripts', express.static(path.join(__dirname, '/../client/scripts')));
// app.use('/styles', express.static(path.join(__dirname, '/../client/styles')));
// app.use('/partials', express.static(path.join(__dirname, '/../client/partials')));
// app.use('/images', express.static(path.join(__dirname, '/../client/images')));

app.use(express.static(__dirname + '/../client'));

//start and stop recording
app.get('/recorder', recorder.toggleState);

app.post('/voice', function(req, res) {
  console.log('inside the voice post');
  var twimlRes = new twilio.TwimlResponse();

  twimlRes.message('Thank you for sending me a message');
  res.writeHead(200, {
    'Content-Type':'text/xml'
  });
  res.end(twimlRes.toString());
})
>>>>>>> Add heroku

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '/../client/index.html'));
});

// app.get('/send-message', function(req,res) {
//   console.log('serving request ' + req.method + ' at ' + req.url);
//   res.sendFile(path.join(__dirname, '/../client/index.html'));
// });

var server = https.createServer(options, app);

server.listen(3000, function () {
  console.log('Server listening on port 3000!')
})
