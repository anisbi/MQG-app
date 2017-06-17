angular.module('qmaker')

.controller('solveCardMatchingCtrl', function($scope, $stateParams, $timeout, authentication, mqgAppData) {
	$scope.currentUser = authentication.currentUser();
  mqgAppData.getQuizQuestion("card_matching", $stateParams.question_id)
     .success(function (data) {
     	$scope.receivedQuizQuestion = data;
     	loadPageData();
     })
     .error(function(e) {
     	console.log('error',e);
     });

    var loadPageData = function() {
      $scope.question = $scope.receivedQuizQuestion.data;

      $scope.models = {
        allowedTypes: {"listA" : ["1"], "listB": ["2"], "listC": ["3"]},
        lists: {
          "listA": $scope.question.data.lists.A,
          "listB": $scope.question.data.lists.B,
          "listC": $scope.question.data.lists.C
        }
      };
      $scope.list1 = $scope.question.data.listNameA;
      $scope.list2 = $scope.question.data.listNameB;
      $scope.list3 = $scope.question.data.listNameC;
      $scope.qbody = $scope.question.data.qbody;

      $timeout(function() {
              $scope.plotView();
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
          "qtype" : "card_matching",
          "author" : {
            "id" : $scope.question.author.id,
            "name" : $scope.question.author.name
          }
        },
        "data": $scope.question.data.lists
      };
      mqgAppData.postSolution(dataToSend)
       .success(function (data) {
         console.log("After posting answer:",data);
       })
       .error(function(e) {
        console.log('error',e);
       });
     };

    $scope.plotView = function() {
      //Plot first list
      for (var i = 0; i < $scope.models.lists.listA.length; i++) {
        
        var item = $scope.models.lists.listA[i];
        if (item.type==="function") {
          //Case real function
          if (item.data.fnType === 'fn') {
            try { //plot equation in body
                console.log('plotting #plot-A-'+i);
              functionPlot({
                  width: 250,
                  height: 250,
                    target: '#plot-A-'+i,
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
                console.log('plotting #plot-A-'+i);
              functionPlot({
                  width: 250,
                  height: 250,
                    target: '#plot-A-'+i,
                    data: [{
                      fn: $scope.models.lists.A[i].data.fnContent,
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
      for (var i = 0; i < $scope.models.lists.listB.length; i++) {
        
        var item = $scope.models.lists.listB[i];
        if (item.type==="function") {
          //Case real function
          if (item.data.fnType === 'fn') {
            try { //plot equation in body
                console.log('plotting #plot-B-'+i);
              functionPlot({
                  width: 250,
                  height: 250,
                    target: '#plot-B-'+i,
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
                    target: '#plot-B-'+i,
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
      for (var i = 0; i < $scope.models.lists.listC.length; i++) {
        
        var item = $scope.models.lists.listC[i];
        if (item.type==="function") {
          //Case real function
          if (item.data.fnType === 'fn') {
            try { //plot equation in body
                console.log('plotting #plot-C-'+i);
              functionPlot({
                  width: 250,
                  height: 250,
                    target: '#plot-C-'+i,
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
                    target: '#plot-C-'+i,
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

    $scope.$watch('models', function(model) {
      $scope.modelAsJson = angular.toJson(model, true);

      $timeout(function() {
        $scope.plotView();
      }, 230);

    }, true);

    /* Data for commiting question 
    $scope.question.data.lists = $scope.models.lists;
    $scope.question.publicdata.list1 = $scope.list1;
    $scope.question.publicdata.list2 = $scope.list2;
    $scope.question.publicdata.list3 = $scope.list3;
    $scope.question.publicdata.qbody = $scope.qbody;
    //If editing an existing question
    if ($state.current.name === "edit_card_matching") {
      mqgAppData.editQuestion($stateParams.id, $scope.question)
          .success(function(response) {
            $location.path('/questionnaires/' + $scope.question.questionnaire.id);
          })
          .error(function (e) {
            console.log('error',e);
          });
    }
    */
})