var express = require('express');
var path = require('path');
var https = require('https');
var bodyParser = require('body-parser');
var app = express();
// var fs = require('fs');
// var auth = require('./authorization.js');
var watson = require('watson-developer-cloud');

// var text_to_speech = watson.text_to_speech(auth.text_to_speech);
// var params = {
//   text: 'I am the real DJ!',
//   voice: 'en-US_AllisonVoice',
//   accept: 'audio/wav'
// }

// text_to_speech.synthesize(params).pipe(fs.createWriteStream('speech.wav'))

// var options = {
//   cert: fs.readFileSync('client-cert.pem'),
//   key: fs.readFileSync('client-key.pem')
// };

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/../client'));

// app.get('/message', function(req, res) {
// 	res.send('HHIIHIH');
// });
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

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '/../client/index.html'));
});

// app.get('/send-message', function(req,res) {
//   console.log('serving request ' + req.method + ' at ' + req.url);
//   res.sendFile(path.join(__dirname, '/../client/index.html'));
// });

// var server = https.createServer(options, app);

// server.listen(3000, function () {
//   console.log('Server listening on port 3000!')
// })
app.listen(3000, function() {
  console.log('You are listening on port 3000!')
})