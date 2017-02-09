/** * @class chatterboxCtrl
 * @description Controller for chat. Makes use of databaseAndAuth factory in order to retrieve/update chat messages from the databse.
*/
angular.module('myApp').controller('chatterboxCtrl', function($scope, $rootScope, $location, $http, databaseAndAuth) {

 var database = firebase.database();
 
 //default setting for recording button
 $scope.srcChange = "red.png";

 $scope.messageObj = {};
 /**
   * @function sendMessage
   * @memberOf chatterboxCtrl
   * @description Gets the user email and username from the database. Takes user input ($scope.text) and updates the database with that input. Each input is added to the user that submitted it.
 */
 $scope.sendMessage = function(userId, text) {
   var chatEmail = databaseAndAuth.auth.currentUser.email;
   var chatUsername = chatEmail.slice(0, chatEmail.indexOf('@'));
   
   var chatId = +new Date(Date()); //use time in milliseconds for chatId

   database.ref('chats/' + chatId).set({
     username: chatUsername,
     text: $scope.text,
     createdAt: Date()
   });

   $scope.text = '';
 };
 /**
   * @function fetchMessage
   * @memberOf chatterboxCtrl
   * @description Gets all the chats from the database, attaches them to the scope, and then renders the updated scope ($scope.apply())
 */
$scope.binaryClient;
$scope.isRecording = null;
window.Stream;

 $scope.fetchMessage = function() {
   
   var ref = database.ref('chats');
   
   ref.limitToLast(9).on('value', function(chat) {
     $scope.messageObj = chat.val();
     $scope.$apply();
   });

 };

 $scope.recording = function(){
   var session = {
     audio: true,
     video: false
   };


   if ($scope.srcChange === "green.jpg") {
     $scope.srcChange = "red.png";
     window.Stream.end();

   } else {
     $scope.srcChange = "green.jpg";

     $scope.binaryClient = new BinaryClient('ws://localhost:9001');

     $scope.binaryClient.on('open', function() {
       window.Stream = $scope.binaryClient.createStream();

       if (!navigator.getUserMedia)
         navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
       navigator.mozGetUserMedia || navigator.msGetUserMedia;

       if (navigator.getUserMedia) {
         navigator.getUserMedia({audio:true}, success, function(e) {
           alert('Error capturing audio.');
         });
       } else alert('getUserMedia not supported in this browser.');
       
 

       function success(e) {
         audioContext = window.AudioContext || window.webkitAudioContext;
         context = new audioContext();

         // the sample rate is in context.sampleRate
         audioInput = context.createMediaStreamSource(e);

         var bufferSize = 2048;
         recorder = context.createScriptProcessor(bufferSize, 1, 1);

         recorder.onaudioprocess = function(e){
          if ($scope.srcChange === 'red.png') {
             return;
          }
           console.log ('recording');
           var left = e.inputBuffer.getChannelData(0);
          
           window.Stream.write(convertoFloat32ToInt16(left));
          
         }

         audioInput.connect(recorder)
         recorder.connect(context.destination);
       }

       function convertoFloat32ToInt16(buffer) {
         var l = buffer.length;
         var buf = new Int16Array(l)

         while (l--) {
           buf[l] = buffer[l]*0xFFFF;    //convert to 16 bit
         }
         return buf.buffer
       }
     });
   }

 }

 $scope.hidePartial = function() {
   $rootScope.showMessages = false;
 }

});