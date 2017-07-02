angular.module('qmaker')

.controller('studentsSolutionsPairMatchingCtrl', function($stateParams, $scope, $location, $timeout, authentication, mqgAppData) {
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

    $scope.qbody = $scope.question.publicdata.qbody;
    $scope.list1 = $scope.question.publicdata.listName1;
    $scope.list2 = $scope.question.publicdata.listName2;

    $scope.teacherComment = $scope.solution.data.comment;

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
    }; //End of plotView() 


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