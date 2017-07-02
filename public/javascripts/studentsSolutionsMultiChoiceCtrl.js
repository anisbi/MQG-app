angular.module('qmaker')

.controller('studentsSolutionsMultiChoiceCtrl', function($stateParams, $scope, $location, $timeout, authentication, mqgAppData) {
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

    $scope.qbodyequation = $scope.question.publicdata.equations.qbody;
    $scope.qbodyEqType = $scope.question.publicdata.equations.qbodyType;
    $scope.qoptionsequation = $scope.question.publicdata.equations.qoptions;
    $scope.answer = $scope.question.data.answer;

    var d = new Date($scope.solution.createdon);
    $scope.solutionDate = d.toLocaleDateString()+' '+d.toTimeString().substring(0, d.toTimeString().indexOf("GMT"));

    $scope.plotError = false;
    $timeout(function() {
      console.log('plotting view.');
      $scope.refreshPreview();
    }, 230);
  };

  $scope.refreshPreview = function() {

    if ($scope.qbodyequation.length > 0) {

      if ($scope.qbodyEqType === "fn") {
        try { //plot equation in body
          functionPlot({
              width: 250,
              height: 250,
                target: '#plot-body',
                data: [{
                  fn: $scope.qbodyequation,
                  sampler: 'builtIn',
                  graphType: 'polyline'
                }]
            });
        } catch (err) {
          $scope.plotError = true;
        }
      }

      else if ($scope.qbodyEqType === "im") {
        try { //plot equation in body
            functionPlot({
                width: 250,
                height: 250,
                  target: '#plot-body',
                  data: [{
                    fn: $scope.qbodyequation,
                    fnType: 'implicit'
                  }]
              });
          } catch (err) {
            console.log('err caught: '+err);
            $scope.plotError = true;
          }
      }
    }
    
    for (var i = 0; i < $scope.qoptionsequation.length; i++) {

      if ($scope.qoptionsequation[i].equation.length > 0) {
        console.log('should plot index: '+i);
        if ($scope.qoptionsequation[i].eqType === "fn") {
          try {
            functionPlot({
              width: 250,
              height: 250,
                target: '#plot-' +i,
                data: [{
                  fn: $scope.qoptionsequation[i].equation,
                  sampler: 'builtIn',
                  graphType: 'polyline'
                }]
            });
            $scope.plotError = false;
          } catch (err) {
          $scope.plotError = true;
          }
        }

        else if($scope.qoptionsequation[i].eqType === "im") {
          try { //plot equation in body
            console.log('3');
            console.log('plotting #plot-A-'+1);
            functionPlot({
                width: 250,
                height: 250,
                  target: '#plot-'+i,
                  data: [{
                    fn: $scope.qoptionsequation[i].equation,
                    fnType: 'implicit'
                  }]
              });
          } catch (err) {
            console.log('err caught: '+err);
            $scope.plotError = true;
          }
        }
      }
    }
  };
})