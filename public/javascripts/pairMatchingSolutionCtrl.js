angular.module('qmaker')

.controller('pairMatchingSolutionCtrl', function($stateParams, $scope, $state, $timeout, $location, authentication, mqgAppData) {

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
        $scope.plotView();
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

    $scope.solutionModels = {
      lists: {"A": [], "B": []}
    };
    $scope.solutionModels.lists.A = $scope.question.data.lists.A;
    $scope.solutionModels.lists.B = $scope.question.data.lists.B;

    $scope.answerModels = {
      lists: {"A": [], "B": []}
    };
    $scope.answerModels.lists.A = $scope.solution.data.A;
    $scope.answerModels.lists.B = $scope.solution.data.B;

    $timeout(function() {
      $scope.plotView();
    }, 230);
  };

  $scope.plotView = function() {
      for (var i = 0; i < $scope.solutionModels.lists.A.length; i++) {
          if ($scope.solutionModels.lists.A[i].type == "function") {
               if ($scope.solutionModels.lists.A[i].data.fnType == 'fn') {
                    try { //plot equation in body
               console.log('plotting #plot-A-'+1);
                         functionPlot({
                                   width: 250,
                                   height: 250,
                                   target: '#plot-A-'+i,
                                   data: [{
                                   fn: $scope.solutionModels.lists.A[i].data.fnContent,
                                   sampler: 'builtIn',
                                   graphType: 'polyline'
                                   }]
                              });
                    } catch (err) {
                         console.log('err caught: '+err);
                         $scope.plotError = true;
                    }
               }

               else if ($scope.solutionModels.lists.A[i].data.fnType == 'im') {
                    try { //plot equation in body
               console.log('plotting #plot-A-'+1);
                         functionPlot({
                                   width: 250,
                                   height: 250,
                                   target: '#plot-A-'+i,
                                   data: [{
                                   fn: $scope.solutionModels.lists.A[i].data.fnContent,
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
      for (var i = 0; i < $scope.solutionModels.lists.B.length; i++) {
          if ($scope.solutionModels.lists.B[i].type == "function") {
               if ($scope.solutionModels.lists.B[i].data.fnType == 'fn') {
                    try { //plot equation in body
                         functionPlot({
                                   width: 250,
                                   height: 250,
                                   target: '#plot-B-'+i,
                                   data: [{
                                   fn: $scope.solutionModels.lists.B[i].data.fnContent,
                                   sampler: 'builtIn',
                                   graphType: 'polyline'
                                   }]
                              });
                    } catch (err) {
                         console.log('err caught: '+err);
                         $scope.plotError = true;
                    }
               }

               else if ($scope.solutionModels.lists.B[i].data.fnType == 'im') {
                    try { //plot equation in body
                         functionPlot({
                                   width: 250,
                                   height: 250,
                                   target: '#plot-B-'+i,
                                   data: [{
                                   fn: $scope.solutionModels.lists.B[i].data.fnContent,
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

      /*
        Plot student's answer 
      */
      for (var i = 0; i < $scope.answerModels.lists.A.length; i++) {
          if ($scope.answerModels.lists.A[i].type == "function") {
               if ($scope.answerModels.lists.A[i].data.fnType == 'fn') {
                    try { //plot equation in body
               console.log('plotting #plot-A-'+1);
                         functionPlot({
                                   width: 250,
                                   height: 250,
                                   target: '#plot-answer-A-'+i,
                                   data: [{
                                   fn: $scope.answerModels.lists.A[i].data.fnContent,
                                   sampler: 'builtIn',
                                   graphType: 'polyline'
                                   }]
                              });
                    } catch (err) {
                         console.log('err caught: '+err);
                         $scope.plotError = true;
                    }
               }

               else if ($scope.answerModels.lists.A[i].data.fnType == 'im') {
                    try { //plot equation in body
               console.log('plotting #plot-A-'+1);
                         functionPlot({
                                   width: 250,
                                   height: 250,
                                   target: '#plot-answer-A-'+i,
                                   data: [{
                                   fn: $scope.answerModels.lists.A[i].data.fnContent,
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
      for (var i = 0; i < $scope.answerModels.lists.B.length; i++) {
          if ($scope.answerModels.lists.B[i].type == "function") {
               if ($scope.answerModels.lists.B[i].data.fnType == 'fn') {
                    try { //plot equation in body
                         functionPlot({
                                   width: 250,
                                   height: 250,
                                   target: '#plot-answer-B-'+i,
                                   data: [{
                                   fn: $scope.answerModels.lists.B[i].data.fnContent,
                                   sampler: 'builtIn',
                                   graphType: 'polyline'
                                   }]
                              });
                    } catch (err) {
                         console.log('err caught: '+err);
                         $scope.plotError = true;
                    }
               }

               else if ($scope.answerModels.lists.B[i].data.fnType == 'im') {
                    try { //plot equation in body
                         functionPlot({
                                   width: 250,
                                   height: 250,
                                   target: '#plot-answer-B-'+i,
                                   data: [{
                                   fn: $scope.answerModels.lists.B[i].data.fnContent,
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
     } //End of plotView()  

})