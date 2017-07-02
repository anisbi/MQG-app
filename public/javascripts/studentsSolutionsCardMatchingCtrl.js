angular.module('qmaker')

.controller('studentsSolutionsCardMatchingCtrl', function($stateParams, $scope, $location, $timeout, authentication, mqgAppData) {
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

    $scope.solutionModels = {
      allowedTypes: {"listA" : ["1"], "listB": ["2"], "listC": ["3"]},
      lists: {
        "listA": $scope.question.data.lists.listA,
        "listB": $scope.question.data.lists.listB,
        "listC": $scope.question.data.lists.listC
      }
    };

    $scope.answerModels = {
      allowedTypes: {"listA" : ["1"], "listB": ["2"], "listC": ["3"]},
      lists: {
        "listA": $scope.solution.data.A,
        "listB": $scope.solution.data.B,
        "listC": $scope.solution.data.C
      }
    };

    $scope.list1 = $scope.question.publicdata.list1;
    $scope.list2 = $scope.question.publicdata.list2;
    $scope.list3 = $scope.question.publicdata.list3;
    $scope.qbody = $scope.question.publicdata.qbody;



    

    var d = new Date($scope.solution.createdon);
    $scope.solutionDate = d.toLocaleDateString()+' '+d.toTimeString().substring(0, d.toTimeString().indexOf("GMT"));

    $timeout(function() {
      console.log('plotting view.');
      $scope.plotView();
    }, 230);
  };


  $scope.plotView = function() {
    if ($scope.failure) return;
    //Plot first list
    for (var i = 0; i < $scope.solutionModels.lists.listA.length; i++) {
      
      var item = $scope.solutionModels.lists.listA[i];
      if (item.type==="function") {
        //Case real function
        if (item.data.fnType === 'fn') {
          try { //plot equation in body
              console.log('plotting #plot-A-'+i);
            functionPlot({
                width: 250,
                height: 250,
                  target: '#plot-solution-A-'+i,
                  data: [{
                    fn: item.data.fnContent,
                    sampler: 'builtIn',
                    graphType: 'polyline'
                  }]
              });
          } catch (err) {
            console.log('err caught: '+err);
            $scope.plotError = true;
          }
        }
        //Case implicit function
        else if (item.data.fnType === 'im') {
          try { //plot equation in body
              console.log('plotting #plot-solution-A-'+i);
            functionPlot({
                width: 250,
                height: 250,
                  target: '#plot-solution-A-'+i,
                  data: [{
                    fn: item.data.fnContent,
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

    //Plot second list
    for (var i = 0; i < $scope.solutionModels.lists.listB.length; i++) {
      
      var item = $scope.solutionModels.lists.listB[i];
      if (item.type==="function") {
        //Case real function
        if (item.data.fnType === 'fn') {
          try { //plot equation in body
              console.log('plotting #plot-B-'+i);
            functionPlot({
                width: 250,
                height: 250,
                  target: '#plot-solution-B-'+i,
                  data: [{
                    fn: item.data.fnContent,
                    sampler: 'builtIn',
                    graphType: 'polyline'
                  }]
              });
          } catch (err) {
            console.log('err caught: '+err);
            $scope.plotError = true;
          }
        }
        //Case implicit function
        else if (item.data.fnType === 'im') {
          try { //plot equation in body
              console.log('plotting #plot-B-'+i);
            functionPlot({
                width: 250,
                height: 250,
                  target: '#plot-solution-B-'+i,
                  data: [{
                    fn: item.data.fnContent,
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

    //Plot third list
    for (var i = 0; i < $scope.solutionModels.lists.listC.length; i++) {
      
      var item = $scope.solutionModels.lists.listC[i];
      if (item.type==="function") {
        //Case real function
        if (item.data.fnType === 'fn') {
          try { //plot equation in body
              console.log('plotting #plot-solution-C-'+i);
            functionPlot({
                width: 250,
                height: 250,
                  target: '#plot-solution-C-'+i,
                  data: [{
                    fn: item.data.fnContent,
                    sampler: 'builtIn',
                    graphType: 'polyline'
                  }]
              });
          } catch (err) {
            console.log('err caught: '+err);
            $scope.plotError = true;
          }
        }
        //Case implicit function
        else if (item.data.fnType === 'im') {
          try { //plot equation in body
              console.log('plotting #plot-C-'+i);
            functionPlot({
                width: 250,
                height: 250,
                  target: '#plot-solution-C-'+i,
                  data: [{
                    fn: item.data.fnContent,
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
      Plot for student answers:
    */
    for (var i = 0; i < $scope.answerModels.lists.listA.length; i++) {
      
      var item = $scope.answerModels.lists.listA[i];
      if (item.type==="function") {
        //Case real function
        if (item.data.fnType === 'fn') {
          try { //plot equation in body
              console.log('plotting #plot-A-'+i);
            functionPlot({
                width: 250,
                height: 250,
                  target: '#plot-answer-A-'+i,
                  data: [{
                    fn: item.data.fnContent,
                    sampler: 'builtIn',
                    graphType: 'polyline'
                  }]
              });
          } catch (err) {
            console.log('err caught: '+err);
            $scope.plotError = true;
          }
        }
        //Case implicit function
        else if (item.data.fnType === 'im') {
          try { //plot equation in body
              console.log('plotting #plot-solution-A-'+i);
            functionPlot({
                width: 250,
                height: 250,
                  target: '#plot-answer-A-'+i,
                  data: [{
                    fn: item.data.fnContent,
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

    //Plot second list
    for (var i = 0; i < $scope.answerModels.lists.listB.length; i++) {
      
      var item = $scope.answerModels.lists.listB[i];
      if (item.type==="function") {
        //Case real function
        if (item.data.fnType === 'fn') {
          try { //plot equation in body
              console.log('plotting #plot-B-'+i);
            functionPlot({
                width: 250,
                height: 250,
                  target: '#plot-answer-B-'+i,
                  data: [{
                    fn: item.data.fnContent,
                    sampler: 'builtIn',
                    graphType: 'polyline'
                  }]
              });
          } catch (err) {
            console.log('err caught: '+err);
            $scope.plotError = true;
          }
        }
        //Case implicit function
        else if (item.data.fnType === 'im') {
          try { //plot equation in body
              console.log('plotting #plot-B-'+i);
            functionPlot({
                width: 250,
                height: 250,
                  target: '#plot-answer-B-'+i,
                  data: [{
                    fn: item.data.fnContent,
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

    //Plot third list
    for (var i = 0; i < $scope.answerModels.lists.listC.length; i++) {
      
      var item = $scope.answerModels.lists.listC[i];
      if (item.type==="function") {
        //Case real function
        if (item.data.fnType === 'fn') {
          try { //plot equation in body
              console.log('plotting #plot-solution-C-'+i);
            functionPlot({
                width: 250,
                height: 250,
                  target: '#plot-answer-C-'+i,
                  data: [{
                    fn: item.data.fnContent,
                    sampler: 'builtIn',
                    graphType: 'polyline'
                  }]
              });
          } catch (err) {
            console.log('err caught: '+err);
            $scope.plotError = true;
          }
        }
        //Case implicit function
        else if (item.data.fnType === 'im') {
          try { //plot equation in body
              console.log('plotting #plot-C-'+i);
            functionPlot({
                width: 250,
                height: 250,
                  target: '#plot-answer-C-'+i,
                  data: [{
                    fn: item.data.fnContent,
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

  $scope.sendComment = function() {
    var comment = {
      "comment" : $scope.teacherComment
    };
    mqgAppData.postSolutionComment($stateParams.solution_id, comment)
        .success(function (response) {
          console.log('redirect to: /quiz/' + $scope.questionnaire_id + '/' + $scope.question._id);
          $location.path('/students_solutions/' + $scope.questionnaire_id + '/' + $scope.question._id);
        })
            .error(function(e) {
              console.log('error',e);
            });
  };

})