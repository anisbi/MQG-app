angular.module('qmaker')

.controller('multiChoiceSolutionCtrl', function($scope, $stateParams, $timeout, $state, authentication, mqgAppData) {
 $scope.currentUser = authentication.currentUser();
  $scope.failure = true;
  $scope.dataLoaded = false;
  mqgAppData.getUserSolution("multi_choice", $stateParams.question_id)
     .success(function (data) {

      if (data.result === "failure") {
        $scope.failure = true;
        $scope.message = data.message;
        $scope.dataLoaded = true;
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
  }

})