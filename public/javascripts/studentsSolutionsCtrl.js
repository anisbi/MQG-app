angular.module('qmaker')

.controller('studentsSolutionsCtrl', function($stateParams, $scope, $location, authentication, mqgAppData) {

  $scope.questionnaire_id = $stateParams.questionnaire_id;
  $scope.dataLoaded = false;
  $scope.failure = false;
  mqgAppData.getStudentsSolutions($stateParams.question_id)
      .success(function (response) {

        if (response.result === "failure") {
          $scope.failure = true;
          $scope.message = response.message;
        }
        else if (response.result === "success") {
          $scope.receivedData = response.data;
          loadPageData();
        }
        $scope.dataLoaded = true;
      })

          .error(function(e) {
            $scope.dataLoaded = true;
            console.log('error',e);
          });


  var loadPageData = function() {
    $scope.solutions = $scope.receivedData;
    $scope.solutionDates = Array();
    for (var i = 0; i < $scope.solutions.length; i++) {
      var d = new Date($scope.solutions[i].createdon);
      d = d.toLocaleDateString()+' '+d.toTimeString().substring(0, d.toTimeString().indexOf("GMT"));
      $scope.solutionDates.push(d);
    }
  };
})