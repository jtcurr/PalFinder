angular.module('myApp').controller('addTwilioNumber', function($rootScope, $scope, databaseAndAuth) {
  $scope.updateTwilioNumber = function() {
    var user = firebase.auth().currentUser;
    var newTwilioNumber = $scope.newTwilioNumber;
    $rootScope.twilioNumber = $scope.newTwilioNumber;
    databaseAndAuth.database.ref('users/' + user.uid).update({
      "twilioNumber": newTwilioNumber
    }, function(error) {
      if (error) {
        console.log("Twilio number could not be saved." + error);
      } else {
        console.log("Twilio number saved successfully.");
      }
    });
  }
});
