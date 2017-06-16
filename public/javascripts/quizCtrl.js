angular.module('qmaker')

.controller('quizCtrl', function($scope, $stateParams, $state, authentication, mqgAppData) {
	$scope.currentUser = authentication.currentUser();
	
	mqgAppData.getQuizzes()
     .success(function (data) {
     	$scope.receivedQuizzes = data;
     	loadPageData();
     })
     .error(function(e) {
     	console.log('error',e);
     });

     var loadPageData = function() {
     	$scope.quizzes = $scope.receivedQuizzes.data;
     	if ($state.current.name === "quiz_questions") {
     		for (var i = 0; i < $scope.quizzes.length; i++) {
     			if ($scope.quizzes[i]._id===$stateParams.id) {
     				$scope.questionnaire = $scope.quizzes[i];
     			}
     		}
     	}
     };

})