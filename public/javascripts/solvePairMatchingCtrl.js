angular.module('qmaker')

.controller('solvePairMatchingCtrl', function($scope, $stateParams, $timeout, authentication, mqgAppData) {

	mqgAppData.getQuizQuestion("pair_matching", $stateParams.question_id)
     .success(function (data) {
     	$scope.receivedQuizzes = data;
     	loadPageData();
     })
     .error(function(e) {
     	console.log('error',e);
     });

     var loadPageData = function() {
     	$scope.data = $scope.receivedQuizzes.data;
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
          console.log('Sending answer');
     }

     $scope.$watch('models', function(model) {
        $scope.modelAsJson = angular.toJson(model, true);
        $timeout(function() {
               console.log('plotting view.');
               $scope.plotView();
          }, 230);
     }, true);

     $scope.plotView = function() {
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