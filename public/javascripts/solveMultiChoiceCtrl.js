angular.module('qmaker').

controller('solveMultiChoiceCtrl', function($scope, $stateParams, $location, $timeout, authentication, mqgAppData) {
  $scope.currentUser = authentication.currentUser();
  $scope.failure = true;
  $scope.dataLoaded = false;
  mqgAppData.getQuizQuestion("multi_choice", $stateParams.question_id)
     .success(function (data) {

      if (data.result === "failure") {
        $scope.failure = true;
        $scope.message = data.message;
        $scope.question = {"questionnaire" : $stateParams.questionnaire_id};
        $scope.dataLoaded = true;
        return;
      }
      else if (data.result === "success") {
        $scope.failure = false;
        $scope.receivedQuizQuestion = data;
        loadPageData();
        $timeout(function() {
          $scope.plotView();
        }, 230);
      }
     })
     .error(function(e) {
      console.log('error',e);
     });

  var loadPageData = function() {
    $scope.question = $scope.receivedQuizQuestion.data;
    $scope.qbodyequation = $scope.question.data.equations.qbody;
    $scope.qbodyEqType = $scope.question.data.equations.qbodyType;
    $scope.qoptionsequation = $scope.question.data.equations.qoptions;
    $scope.chosenAnswer = -1; //Init at -1 until user picks answer.
    $scope.plotView();
  };

  $scope.setAnswer = function(answer) {
    if (answer >= 0 && answer < $scope.question.data.options.length) {
      $scope.chosenAnswer = answer;
    }
  };

  $scope.confirmSend = function() {
    if ($scope.chosenAnswer >= 0 && $scope.chosenAnswer < $scope.question.data.options.length) {
      swal({
        title: '⸮האם את/ה בטוח/ה',
        text: "אחרי שהתשובה נשלחת, אי אפשר לשנות אותה",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: '!כן, שלח תשובה',
        cancelButtonText : 'ביטול'
        
      }).then(function () {
           $scope.sendAnswer();
      }, function (dismiss) {
             // dismiss can be 'cancel', 'overlay',
             // 'close', and 'timer'
             if (dismiss === 'cancel') {
                // in case cancel is clicked
               
             }
        });
    }
    else {
      swal(
        'שגיאה',
        '!טרם סימנת תשובה נכונה',
        'error'
      );
    }
  };

   $scope.sendAnswer = function() {
    var dataToSend = {
      "solver": {
        "id" : $scope.currentUser.id,
        "name" : $scope.currentUser.name
      },
      "question": {
        "id" : $scope.question.id,
        "qtype" : "multi_choice",
        "author" : {
          "id" : $scope.question.author.id,
          "name" : $scope.question.author.name
        }
      },
      "data": {
        "answer" : $scope.chosenAnswer
      }
    };
    mqgAppData.postSolution(dataToSend)
     .success(function (data) {
        $location.path('/quiz/' + $scope.question.questionnaire);
     })
     .error(function(e) {
      console.log('error',e);
     });
   };

  $scope.plotView = function() {
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
  };
})