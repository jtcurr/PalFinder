angular.module('myApp').controller('showNewMessages', function($rootScope, $scope) {
  $scope.showAllNewMessages = function() {
    var messages = firebase.database().ref('twilioMessages');
    console.log('scope messages', messages);
  }
});
