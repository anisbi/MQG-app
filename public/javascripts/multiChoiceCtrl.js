angular.module('qmaker')

.controller('multiChoiceCtrl', function($stateParams, $scope, $location, authentication, mqgAppData) {

//$scope.currentUser = authentication.currentUser();
$scope.currentUser = {"id" : "00000000", "name" : "Test User"};
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
			qoptions: [''] //equation to be attached to question options
		}
	}
};

$scope.qbodyequation = $scope.question.publicdata.equations.qbody;
$scope.qoptionsequation = $scope.question.publicdata.equations.qoptions;
$scope.answer = $scope.question.data.answer;

$scope.plotError = false;

//Refreshes the preview on the page of new question in order to
//display changes to function plot.
$scope.refreshPreview = function() {
	console.log('refresh');
	if ($scope.qbodyequation.length > 0) {
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
	for (var i = 0; i < $scope.qoptionsequation.length; i++) {
		if ($scope.qoptionsequation[i].length > 0) {
			try {
				functionPlot({
					width: 250,
					height: 250,
			  		target: '#plot-' +i,
			  		data: [{
			    		fn: $scope.qoptionsequation[i],
			    		sampler: 'builtIn',
			    		graphType: 'polyline'
			  		}]
				});
				$scope.plotError = false;
			} catch (err) {
			$scope.plotError = true;
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
		''
	);
}

//Commit the new question to database.
$scope.commitQuestion = function() {

	mqgAppData.newQuestion($stateParams.id, $scope.question)
	  .success(function(response) {
	  	$location.path('/questionnaires/' + $stateParams.id);
	  })
	  .error(function (e) {
	  	console.log('error',e);
	  });
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


.controller('multiChoiceEditCtrl', function($stateParams, $scope, $location, authentication, mqgAppData) {
	//getQuestion
	mqgAppData.getQuestion($stateParams.id)
    .success(function (response) {
      if (response.result === "success") {
        $scope.questionData = response.data;
        loadPageData();
  	  }
      //console.log('$scope inside', $scope.questionnaires);
    })
    .error(function(e) {
 	  console.log('error',e);
    });

   var loadPageData = function() {
    $scope.question = $scope.questionData;
	$scope.answer = $scope.question.data.answer;

	if ($scope.question.publicdata) {
		$scope.qoptionsequation = $scope.question.publicdata.equations.qoptions;
		$scope.qbodyequation = $scope.question.publicdata.equations.qbody;
	} else {
		$scope.qoptionsequation = [];
		for (var i=0; i<$scope.question.options.length; i++)
			$scope.qoptionsequation.push('');
		$scope.qbodyequation = '';
	}

	$scope.plotError = false;

	$scope.refreshPreview = function() {
		if ($scope.qbodyequation.length > 0) {
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


		for (var i = 0; i < $scope.qoptionsequation.length; i++) {
			if ($scope.qoptionsequation[i].length > 0) {
				try {
					functionPlot({
						width: 250,
						height: 250,
				  		target: '#plot-' +i,
				  		data: [{
				    		fn: $scope.qoptionsequation[i],
				    		sampler: 'builtIn',
				    		graphType: 'polyline'
				  		}]
					});	
				} catch (err) {
				$scope.plotError = true;
				}
			}
		}
	}
	
	$scope.setAnswer = function(answ) {
		$scope.question.data.answer = answ;
		$scope.answer = $scope.question.data.answer;
		console.log($scope.question.data.answer);
	}

	$scope.isAnswer = function(answ) {
		return ($scope.answer == answ);
	}

	$scope.addOption = function() {
		$scope.question.options.push({body: 'new option'});
		$scope.qoptionsequation.push('');
	}

	$scope.commitQuestion = function() {
		mqgAppData.editQuestion($stateParams.id, $scope.question)
	    .success(function(response) {
	  	  $location.path('/questionnaires/' + $scope.question.questionnaire.id);
	    })
	    .error(function (e) {
	  	  console.log('error',e);
	    });
	}

	$scope.deleteOption = function(index) {
		$scope.question.options.splice(index, 1);
		$scope.qoptionsequation.splice(index, 1);

		if (index < $scope.answer)
			$scope.setAnswer($scope.answer-1);
	
		else if 
			(	index == $scope.question.options.length
			&&	index == $scope.answer)
				$scope.setAnswer($scope.answer-1)
	}
   }
})