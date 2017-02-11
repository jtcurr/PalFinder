angular.module('myApp').controller('addPhoneNumber', function($rootScope, $scope, databaseAndAuth) {
  $scope.updatePhoneNumber = function() {
    var user = firebase.auth().currentUser;
    var newPhoneNumber = $scope.newPhoneNumber;
    if(newPhoneNumber[0] !== 1) {
      newPhoneNumber = '1' + newPhoneNumber;
    }
    $rootScope.phoneNumber = $scope.newPhoneNumber;
    databaseAndAuth.database.ref('users/' + user.uid).update({
      "phoneNumber": newPhoneNumber
    }, function(error) {
      if (error) {
        console.log("Phone number could not be saved." + error);
      } else {
        console.log("Phone number saved successfully.");
      }
    });
  }
});
