angular.module('myApp').controller('privateMessages', function($rootScope, $scope) {
  $scope.showAllNewMessages = function() {
    $http({
      method: 'GET',
      url: 'http://localhost:3000/getMessages'
    })
  }
});
