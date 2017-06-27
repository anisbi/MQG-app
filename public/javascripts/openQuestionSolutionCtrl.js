angular.module('qmaker')

.controller('openQuestionSolutionCtrl', function($stateParams, $scope, $state, $timeout, $location, authentication, mqgAppData) {

  $scope.currentUser = authentication.currentUser();
  $scope.failure = true;
  $scope.dataLoaded = false;
  mqgAppData.getUserSolution("open_question", $stateParams.question_id)
     .success(function (data) {

      if (data.result === "failure") {
        $scope.failure = true;
        $scope.message = data.message;
        $scope.dataLoaded = true;
        $scope.questionnaire_id = $stateParams.questionnaire_id;
        return;
      }
      else if (data.result === "success") {
        $scope.failure = false;
        $scope.solutionData = data.data;
        loadPageData();
        $scope.refreshPreview();
        $scope.dataLoaded = true;
      }
     })
     .error(function(e) {
      console.log('error',e);
     });

  var loadPageData = function() {
    $scope.question = $scope.solutionData.question;
    $scope.solution = $scope.solutionData.solution[0];

    var d = new Date($scope.solution.createdon);
    $scope.solutionDate = d.toLocaleDateString()+' '+d.toTimeString().substring(0, d.toTimeString().indexOf("GMT"));

    $timeout(function() {
      $scope.refreshPreview();
    }, 230);
  };

  $scope.refreshPreview = function() {
    var arrLength = $scope.question.publicdata.equations.equationsArray.length;
    for (var i = 0; i <  arrLength; i++) {
      try {
        if ($scope.question.publicdata.equations.equationsArray[i].equationType == 'fn') {
          console.log('refreshPreview2',$scope.question.publicdata.equations.equationsArray[i]);
          console.log('refreshPreview Title:',$scope.question.publicdata.equations.equationsArray[i].equationComment);
          functionPlot({
            width: 250,
            height: 250,
              target: '#plot-' +i,
              data: [{
                fn: $scope.question.publicdata.equations.equationsArray[i].equation,
                sampler: 'builtIn',
                graphType: 'polyline'
              }]
          });
        }
        if ($scope.question.publicdata.equations.equationsArray[i].equationType == 'im') {
          functionPlot({
            width: 250,
            height: 250,
              target: '#plot-' +i,
              data: [{
                fn: $scope.question.publicdata.equations.equationsArray[i].equation,
                fnType: 'implicit'
              }]
          });
        }
      } catch(err) {
        $scope.plotError = true;
      }
    }
  }

})