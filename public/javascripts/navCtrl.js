angular.module('qmaker')

.controller('navCtrl', function($scope, authentication) {


  console.log('isLogged: ',authentication.isLoggedIn());
  $scope.isLoggedIn = authentication.isLoggedIn();

  $scope.$watch('authentication.isLoggedIn', function(){
  	$scope.isLoggedIn = authentication.isLoggedIn();
  });

  $scope.currentUser = authentication.currentUser();

})