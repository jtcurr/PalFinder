angular.module('myApp').controller('searchMessages', function($rootScope, $scope, databaseAndAuth) {

  $rootScope.chatMessage = {};
  $rootScope.privMessage = {};
  $rootScope.matchingTwilioMessage = {};

  $scope.searchAllMessages = function(keyword) {
    var user = firebase.auth().currentUser;
    var db = firebase.database();
    var dbUser = db.ref('users');
    var dbChats = db.ref('chats');
    var dbPrivMess = db.ref('privateMessages');
    var dbTwilioMessages = db.ref('twilioMessages');

    dbUser.on('value', function(snapshot) {
      var users = snapshot.val();
      //loop through each user
      for(var singleUser in users) {
        //when we have the right user
        if(user.email === users[singleUser].email) {
          //we get their info
          var username = users[singleUser].username;
          var email = users[singleUser].email;
          var twilioNumber = users[singleUser].twilioNumber;

          //search chats for message
          dbChats.on('value', function(snaps) {
            var chat = snaps.val();
            //loop through chat messages
            for(var chatKey in chat) {
              //if the chat message contains the keyword
              if(chat[chatKey].text.includes(keyword)){
                $rootScope.chatMessage[chatKey] = chat[chatKey];
                console.log('chat', $rootScope.chatMessage);
              }
            }
            dbPrivMess.on('value', function(snap) {
              var privateMessage = snap.val();
              //loop through private messages -> user emails
              //$scope.email.slice(0, $scope.email.indexOf('@'))
              for(var privKey in privateMessage) {
                if(privKey.slice(0, privKey.indexOf('@')) === email.slice(0, privKey.indexOf('@'))) {
                  //loop through unique keys to get message
                  for(var uniqKey in privateMessage[privKey]) {
                    if(privateMessage[privKey][uniqKey].message.includes(keyword)){
                      $rootScope.privMessage[uniqKey] = privateMessage[privKey][uniqKey];
                      console.log('privMessage', $rootScope.privMessage);
                    }
                  }
                }
              }
              dbTwilioMessages.on('value', function(sn) {
                var twilioNumbers = sn.val();
                //loop through twilio numbers to find users twilio number
                for(var twilioNumberKey in twilioNumbers) {
                  if(twilioNumberKey == twilioNumber) {
                    //loop through unique keys to find message
                    for(var uniqTwilioKey in twilioNumbers[twilioNumberKey]) {
                      if(twilioNumbers[twilioNumberKey][uniqTwilioKey].body.includes(keyword)){
                        $rootScope.matchingTwilioMessage[uniqTwilioKey] = twilioNumbers[twilioNumberKey][uniqTwilioKey];
                        console.log('twilioMess', $rootScope.matchingTwilioMessage);
                      }
                    }
                  }
                }
              })
            });
          });
        }
      }
    });
  }
  $scope.searchAllMessages();
});
