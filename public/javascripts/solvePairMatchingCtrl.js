angular.module('qmaker')

.controller('solvePairMatchingCtrl', function($scope, $stateParams, $location, $timeout, authentication, mqgAppData) {
  $scope.currentUser = authentication.currentUser();

  $scope.failure = true;
  $scope.dataLoaded = false;
	mqgAppData.getQuizQuestion("pair_matching", $stateParams.question_id)
     .success(function (data) {
      if (data.result === "failure") {
        /*$scope.failure = true;
        $scope.dataLoaded = true;
        $scope.message = data.message;
        $scope.question = {"questionnaire" : $stateParams.questionnaire_id};
        */

        $scope.failure = true;
        $scope.message = data.message;
        $scope.question = {"questionnaire" : $stateParams.questionnaire_id};
        $scope.dataLoaded = true; return false;
      }
      else if (data.result === "success") {
        $scope.failure = false;
        $scope.dataLoaded = true;
        $scope.receivedQuizzes = data;
        loadPageData();
      }
      $scope.dataLoaded = true;
     	
     })
     .error(function(e) {
     	console.log('error',e);
     });

     var loadPageData = function() {
     	$scope.data = $scope.question = $scope.receivedQuizzes.data;

      $scope.qbody = $scope.question.publicdata.qbody;
      $scope.list1 = $scope.question.publicdata.listName1;
      $scope.list2 = $scope.question.publicdata.listName2;
      
      $scope.models = {
         lists: {"A": [], "B": []}
      };
      $scope.models.lists.A = $scope.data.lists.A;
      $scope.models.lists.B = $scope.data.lists.B;

      $timeout(function() {
           console.log('plotting view.');
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
            confirmButtonText: 'כן, שלח תשובה!',
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
          "qtype" : "pair_matching",
          "author" : {
            "id" : $scope.question.author.id,
            "name" : $scope.question.author.name
          }
        },
        "data": $scope.models.lists
      };
      mqgAppData.postSolution(dataToSend)
       .success(function (data) {
          $location.path('/quiz/' + $scope.question.questionnaire);
       })
       .error(function(e) {
        console.log('error',e);
       });
    }

     $scope.$watch('models', function(model) {
        $scope.modelAsJson = angular.toJson(model, true);
        $timeout(function() {
               console.log('plotting view.');
               $scope.plotView();
          }, 230);
     }, true);

     $scope.plotView = function() {
      if ($scope.failure) return;
      for (var i = 0; i < $scope.models.lists.A.length; i++) {
          if ($scope.models.lists.A[i].type == "function") {
               if ($scope.models.lists.A[i].data.fnType == 'fn') {
                    try { //plot equation in body
               console.log('plotting #plot-A-'+1);
                         functionPlot({
                                   width: 250,
                                   height: 250,
                                   target: '#plot-A-'+i,
                                   data: [{
                                   fn: $scope.models.lists.A[i].data.fnContent,
                                   sampler: 'builtIn',
                                   graphType: 'polyline'
                                   }]
                              });
                    } catch (err) {
                         console.log('err caught: '+err);
                         $scope.plotError = true;
                    }
               }

               else if ($scope.models.lists.A[i].data.fnType == 'im') {
                    try { //plot equation in body
               console.log('plotting #plot-A-'+1);
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
      for (var i = 0; i < $scope.models.lists.B.length; i++) {
          if ($scope.models.lists.B[i].type == "function") {
               if ($scope.models.lists.B[i].data.fnType == 'fn') {
                    try { //plot equation in body
                         functionPlot({
                                   width: 250,
                                   height: 250,
                                   target: '#plot-B-'+i,
                                   data: [{
                                   fn: $scope.models.lists.B[i].data.fnContent,
                                   sampler: 'builtIn',
                                   graphType: 'polyline'
                                   }]
                              });
                    } catch (err) {
                         console.log('err caught: '+err);
                         $scope.plotError = true;
                    }
               }

               else if ($scope.models.lists.B[i].data.fnType == 'im') {
                    try { //plot equation in body
                         functionPlot({
                                   width: 250,
                                   height: 250,
                                   target: '#plot-B-'+i,
                                   data: [{
                                   fn: $scope.models.lists.B[i].data.fnContent,
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