angular.module('qmaker')

.controller('solutionsCtrl', function($scope, $stateParams, $state, authentication, mqgAppData) {
  $scope.currentUser = authentication.currentUser();
  $scope.failure = true;
  mqgAppData.getQuizzesSolutions()
     .success(function (data) {

      if (data.result === "failure") {
        $scope.failure = true;
        $scope.message = data.message;
        return;
      }
      else if (data.result === "success") {
        $scope.failure = false;
        $scope.solvedQuizzes = data.data;
        loadPageData();
      }
     })
     .error(function(e) {
      console.log('error',e);
     });

  var loadPageData = function() {
    $scope.quizzes = $scope.solvedQuizzes;
    if ($state.current.name === "quizSolutions") {
        for (var i = 0; i < $scope.quizzes.length; i++) {
          if ($scope.quizzes[i]._id===$stateParams.questionnaire_id) {
            $scope.questionnaire = $scope.quizzes[i];
          }
        }
      }
  };

})
