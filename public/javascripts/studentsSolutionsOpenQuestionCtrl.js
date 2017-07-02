angular.module('qmaker')

.controller('studentsSolutionsOpenQuestionCtrl', function($stateParams, $scope, $location, $timeout, authentication, mqgAppData) {
  $scope.questionnaire_id = $stateParams.questionnaire_id;
  $scope.dataLoaded = false;
  $scope.failure = false;
  mqgAppData.getSingleSolution($stateParams.solution_id)
      .success(function (response) {

        if (response.result === "failure") {
          $scope.failure = true;
          $scope.message = response.message;
        }
        else if (response.result === "success") {
          $scope.solutionData = response.data;
          loadPageData();
        }
        $scope.dataLoaded = true;
      })

          .error(function(e) {
            $scope.dataLoaded = true;
            console.log('error',e);
          });


  var loadPageData = function() {
    $scope.question = $scope.solutionData.question;
    $scope.solution = $scope.solutionData.solution;

    $scope.teacherComment = $scope.solution.data.comment;
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
  };

  $scope.sendComment = function() {
    var comment = {
      "comment" : $scope.teacherComment
    };
    mqgAppData.postSolutionComment($stateParams.solution_id, comment)
        .success(function (response) {
          $location.path('/students_solutions/' + $scope.questionnaire_id + '/' + $scope.question._id);
        })
            .error(function(e) {
              console.log('error',e);
            });
  };

})