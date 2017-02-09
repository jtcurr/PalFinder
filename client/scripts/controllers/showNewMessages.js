angular.module('myApp').controller('showNewMessages', function($rootScope, $scope) {
  $scope.showAllNewMessages = function() {
    $http({
      method: 'GET',
      url: 'http://localhost:3000/getMessages'
    })
  }
});
