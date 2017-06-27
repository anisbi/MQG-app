angular.module('qmaker')

.controller('cardMatchingSolutionCtrl', function($scope, $stateParams, $timeout, $state, authentication, mqgAppData) {
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
          $scope.plotView();
        }
      })
          .error(function(e) {
            console.log('error',e);
          });

  var loadPageData = function() {
    $scope.question = $scope.solutionData.question;
    $scope.solution = $scope.solutionData.solution[0];

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

    $scope.plotError = false;
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
})