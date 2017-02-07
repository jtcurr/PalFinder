angular.module('myApp').controller('addTwilioNumber', function($rootScope, $scope) {
  $scope.updateTwilioNumber = function() {
    var user = firebase.auth().currentUser;
    console.log('user in updateTwilioNumber', user);
    var newTwilioNumber = $scope.newTwilioNumber;
  }
});
