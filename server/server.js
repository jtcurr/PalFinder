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

var speech_to_text = new SpeechToTextV1 ({
 username: auth.speech_to_text.username,
 password: auth.speech_to_text.password
});

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

app.use(express.static(__dirname + '/../client'));

//start and stop recording
app.post('/recorder', function(req, res) {
    console.log('PARSED request', req.socket);
    res.send('start recording');
});

app.get('*', function (req, res) {
 res.sendFile(path.join(__dirname, '/../client/index.html'));
});


app.listen(3000, function () {
 console.log('Server listening on port 3000!')
})