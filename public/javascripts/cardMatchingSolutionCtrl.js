angular.module('qmaker')

.controller('multiChoiceSolutionCtrl', function($scope, $stateParams, $timeout, $state, authentication, mqgAppData) {
  $scope.currentUser = authentication.currentUser();
  $scope.failure = true;
  mqgAppData.getUserSolution("multi_choice", $stateParams.question_id)
     .success(function (data) {

      if (data.result === "failure") {
        $scope.failure = true;
        $scope.message = data.message;
        return;
      }
      else if (data.result === "success") {
        $scope.failure = false;
        $scope.solutionData = data.data;
        loadPageData();
        $scope.refreshPreview();
      }
     })
     .error(function(e) {
      console.log('error',e);
     });
})