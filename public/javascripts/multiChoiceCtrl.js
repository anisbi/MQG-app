/*
	Controller for multi choice questions.
	Includes CRUD - and solving implementation.
*/


angular.module('qmaker')
.controller('mTestCtrl', function($scope) {
	$scope.test = 'test yo';
})

/*
	Controller used when creating a new question of 'multi_choice'
	question type.
*/
.controller('MultiChoiceCtrl', [
'$scope',
'$location',
'questionnaire',
'qstnrs',
function($scope, $location, questionnaire, qstnrs) {



$scope.qstnr = questionnaire;

//Template for new question
$scope.question = {
	qtype: 'multi_choice',
	body: '',
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

	qstnrs.newQuestion(questionnaire._id, $scope.question)
		
	.success(function(question) {
			$scope.qstnr.questions.push($scope.question);
			$location.path('/questionnaires/' + questionnaire._id);
	});

}

//Delete an option from the question
$scope.deleteOption = function(index) {

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

}])

/*
	Controller used for editing a question of type multi_choice.
	At the moment almost identical to new question controller, will 
	be merged if needed.
*/
.controller('MultiChoiceEditCtrl', ['$scope', '$location', 'qstnrs', 'question',
	
 function($scope, $location, qstnrs, question) {
	$scope.question = question;
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
		$scope.question.publicdata.equations.qbody = $scope.qbodyequation;
		qstnrs.editQuestion(question._id, $scope.question)

		.success(function(question) {
			$location.path('/questionnaires/'+ question.questionnaire);
		})
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

]);