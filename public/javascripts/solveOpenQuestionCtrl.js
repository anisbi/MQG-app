angular.module('qmaker')

.controller('solveOpenQuestionCtrl', function($scope, $stateParams, $timeout, authentication, mqgAppData) {
  $scope.currentUser = authentication.currentUser();

  $scope.failure = true;
  $scope.dataLoaded = false;
  mqgAppData.getQuizQuestion("open_question", $stateParams.question_id)
     .success(function (data) {

      if (data.result === "failure") {
        $scope.failure = true;
        $scope.message = data.message;
        $scope.question = {"questionnaire" : $stateParams.questionnaire_id};
      }
      else if (data.result === "success") {
        $scope.failure = false;
        $scope.receivedQuizQuestion = data;
        loadPageData();
      }
      $scope.dataLoaded = true;
     })
     .error(function(e) {
        $scope.failure = true;
        $scope.message = e.message;
        $scope.question = {"questionnaire" : $stateParams.questionnaire_id};
     });

  var loadPageData = function() {
    $scope.question = $scope.receivedQuizQuestion.data;
    $scope.answerBody = '';
    $timeout(function() {
      console.log('plotting view.');
      $scope.plotGraphs();
    }, 230);
  };

  $scope.confirmSend = function() {
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
   };

   $scope.sendAnswer = function() {
    var dataToSend = {
      "solver": {
        "id" : $scope.currentUser.id,
        "name" : $scope.currentUser.name
      },
      "question": {
        "id" : $scope.question.id,
        "qtype" : "open_question",
        "author" : {
          "id" : $scope.question.author.id,
          "name" : $scope.question.author.name
        }
      },
      "data": $scope.answerBody
    };
    mqgAppData.postSolution(dataToSend)
     .success(function (data) {
       console.log("After posting answer:",data);
     })
     .error(function(e) {
      console.log('error',e);
     });
   };

   $scope.plotGraphs = function() {
    for (var i=0; i<$scope.question.data.equations.length; i++) {
     var item = $scope.question.data.equations[i];
     if (item.equationType === 'fn') {
      try { //plot equation in body
        functionPlot({
            width: 250,
            height: 250,
              target: '#plot-'+i,
              data: [{
                fn: item.equation,
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
    else if (item.equationType === 'im') {
      try { //plot equation in body
        functionPlot({
            width: 250,
            height: 250,
              target: '#plot-'+i,
              data: [{
                fn: item.equation,
                fnType: 'implicit'
              }]
          });
      } catch (err) {
        console.log('err caught: '+err);
        $scope.plotError = true;
      }
    }
   }
  };
})