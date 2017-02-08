var getUserMedia = require('get-user-media-promise');
var MicrophoneStream = require('microphone-stream');
console.log(getUserMedia.isSupported);
module.exports = {
	isRecording: false,
  toggleState: function(req, res) {
    // if (this.isRecording === true) {
    // 	this.isRecording = false;
    // 	res.json();
    // } else {
    // 	this.isRecording = true;
      //if the recording is not going, start to record
      console.log('STARTING RECORDING');
      getUserMedia({video: false, audio: true}).then(function(stream){
        var micStream = new MicrophoneStream(stream);

        micStream.on('data', function(chunk){
          var raw = MicrophoneStream.toRaw(chunk);
        })

        micStream.on('format', function(format) {
          console.log(format);
        });

        document.getElementById('img').onclick = function() {
          micStream.stop();
          };
          console.log(micStream);
      }).catch(function(error) {
        console.log(error);
  });
        res.json();
    }
  }