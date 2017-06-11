angular.module('qmaker')

.controller('questionnairesCtrl', function($stateParams, $scope, $location, authentication, mqgAppData) {

  mqgAppData.getQuestionnaire($stateParams.id)
  .success(function (response) {
     $scope.questionnaire = response.data;
     loadHomePage();
     //console.log('$scope inside', $scope.questionnaires);
   })
   .error(function(e) {
 	 console.log('error',e);
   });

   var loadHomePage = function() { 
   	 $scope.qstnr = $scope.questionnaire;
   }

})
