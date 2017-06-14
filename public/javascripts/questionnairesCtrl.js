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

	$scope.question_type_names  = ['Multiple Choice', 
								   'Test type 2'];

	$scope.question_types 		= ['multi_choice', 
								   'test_type_2']; 





	$scope.pickType = false;





	$scope.pickQt = function() {
		$scope.pickType = !($scope.pickType);
	}


	$scope.newQuestion = function() {

		qstnrs.newQuestion(questionnaire._id, {

			qtype: $scope.type

		}).success(function(question) {
			$scope.qstnr.questions.push(question);
		});
		
		$scope.type = '';




	};

	$scope.delQuestion = function(id) {
		var result = confirm("Are you sure you want to delete this question?");
		if (result)
		{
			qstnrs.deleteQuestion($scope.qstnr.questions[id]._id);
			$scope.qstnr.questions.splice(id,1);
		}
	};

   }

})
