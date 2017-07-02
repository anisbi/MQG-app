angular.module('qmaker')

.controller('multiChoiceCtrl', function($stateParams, $scope, $state, $timeout, $location, authentication, mqgAppData) {

$scope.currentUser = authentication.currentUser();
if ($state.current.name === "multi_choice") {
	$scope.questionnaire_id = $stateParams.id;
	$scope.qbodyequation = '';
	$scope.qbodyEqType = 'fn';
	//Template for new question
	$scope.question = {
		qtype: 'multi_choice',
		body: '',
		author: { 
			id : $scope.currentUser.id,
			name : $scope.currentUser.name
		},
		options: [
			{
			body:    '',
			comment: ''
			}
		],
		data: 
		{
			answer: '0'
		},
		publicdata:
		{
			equations: {
				qbody: '', //Equation to be attached to question body
				qbodyType: 'fn',
				qoptions: [
					{
						equation: '',
						eqType: 'fn'
					}
				]
			}
		}
	};
	$scope.qoptionsequation = $scope.question.publicdata.equations.qoptions;
} 
else if ($state.current.name === "edit_multi_choice") {
	mqgAppData.getQuestion($stateParams.id)
    .success(function (response) {
      if (response.result === "success") {
        $scope.question = response.data;
        loadPageData();
  	  }
      //console.log('$scope inside', $scope.questionnaires);
    })
    .error(function(e) {
 	  console.log('error',e);
    });
}

var loadPageData = function() {
	$scope.qbodyequation = $scope.question.publicdata.equations.qbody;
	$scope.qbodyEqType = $scope.question.publicdata.equations.qbodyType;
	$scope.qoptionsequation = $scope.question.publicdata.equations.qoptions;
	$scope.answer = $scope.question.data.answer;
	$scope.questionnaire_id = $scope.question.questionnaire.id;
	$scope.plotError = false;
	$timeout(function() {
		console.log('plotting view.');
		$scope.refreshPreview();
	}, 230);
};

//Used for unit testing:
//$scope.currentUser = {"id" : "00000000", "name" : "Test User"};

//Refreshes the preview on the page of new question in order to
//display changes to function plot.
$scope.refreshPreview = function() {

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
}

//Handles the radio buttons that indicate the correct answer.
$scope.setAnswer = function(answ) {
	$scope.question.data.answer = answ;
	$scope.answer = $scope.question.data.answer;
	console.log($scope.question.data.answer);
}

$scope.isAnswer = function(answ) {
	return ($scope.answer == answ);
}

//Add a new option to the question
$scope.addOption = function() {
	$scope.question.options.push(
		{
			body:    '',
			comment: ''
		}
	);
	$scope.question.publicdata.equations.qoptions.push(
		{
			equation: '',
			eqType: 'fn'
		}
	);
	$scope.qoptionsequation = $scope.question.publicdata.equations.qoptions;
}

//Commit the new question to database.
$scope.commitQuestion = function() {

	$scope.question.publicdata.equations.qbody = $scope.qbodyequation;
	$scope.question.publicdata.equations.qbodyType = $scope.qbodyEqType;
	$scope.question.publicdata.equations.qoptions = $scope.qoptionsequation;
	$scope.question.data.answer = $scope.answer;	

	if ($state.current.name === "multi_choice") {
		mqgAppData.newQuestion($stateParams.id, $scope.question)
		  .success(function(response) {
		  	$location.path('/questionnaires/' + $stateParams.id);
		  })
		  .error(function (e) {
		  	console.log('error',e);
  	});
	}
	else if ($state.current.name === "edit_multi_choice") {
		mqgAppData.editQuestion($stateParams.id, $scope.question)
	    .success(function(response) {
	  	  $location.path('/questionnaires/' + $scope.question.questionnaire.id);
	    })
	    .error(function (e) {
	  	  console.log('error',e);
	    });
	}
}

//Delete an option from the question
$scope.deleteOption = function(index) {
	if (index > $scope.question.options.length) return;

	$scope.question.options.splice(index, 1);
	$scope.question.publicdata.equations.qoptions.splice(index, 1);

	//Modify correct answer after delete, if needed.
	if (index < $scope.answer)
		$scope.setAnswer($scope.answer-1);

	else if 
		(	index == $scope.question.options.length
		&&	index == $scope.answer)
			$scope.setAnswer($scope.answer-1)

}
})

