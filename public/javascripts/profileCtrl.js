angular.module('qmaker')

.controller('profileCtrl', function($scope, authentication, mqgAppData) {

 $scope.currentUser = authentication.currentUser();
 //$scope.userData = "Data not set";
 mqgAppData.getTest()
     .success(function (data) {
     	$scope.userData = data;
     })
     .error(function(e) {
     	console.log('error',e);
     });
})