angular.module('qmaker')

.controller('solvePairMatchingCtrl', function($scope, $stateParams, authentication, mqgAppData) {

	mqgAppData.getQuizQuestion("pair_matching", $stateParams.question_id)
     .success(function (data) {
     	$scope.receivedQuizzes = data;
     	loadPageData();
     })
     .error(function(e) {
     	console.log('error',e);
     });

     var loadPageData = function() {
     	$scope.data = $scope.receivedQuizzes;
     };
	

})