/*
	Controller for multi choice questions.
	Includes CRUD - and solving implementation.
*/


angular.module('qmaker')

.controller('mTestCtrl', [
'$scope', '$timeout',
function($scope, $timeout) {

	//Template for new question
	$scope.question = {
		qtype: 'card_matching',
		data: {
        	lists: {"listA": [], "listB": [], "listC": []}
		},
		publicdata:
		{
			qbody: ''
		}
	};
	/*Template for an Item inside one of the lists would be:
		{
		 id: int,
		 type: 'function/text',
		 data: {}
		}
	*/
	/*
	function to generate unique IDs for each card
	*/
	$scope.unique_counter = 0;
	var getCardId = function() {
		return ++$scope.unique_counter;
	}

	$scope.list1 = 'רשימה 1';
	$scope.list2 = 'רשימה 2';
	$scope.list3 = 'רשימה 3';

	$scope.editList1 = false;
	$scope.editList2 = false;
	$scope.editList3 = false;

	$scope.editListName=function(list) {
		$scope.editList1 = false;
		$scope.editList2 = false;
		$scope.editList3 = false;

		switch (list) {
			case 1:
				$scope.editList1 = true;
				break;
			case 2:
				$scope.editList2 = true;
				break;
			case 3:
				$scope.editList3 = true;
				break;
			default:
				break;
		}
	}

	$scope.resetControls = function() {
		$scope.addListItemActive = false;
		$scope.listLists = false;
		$scope.addToList = 0;
		$scope.listCardType = false;
		$scope.cardType = 0;
		$scope.equationType = 'fn';
		$scope.textContent = '';
		$scope.equationContent = '';

	}
	$scope.resetControls();

	$scope.addListItem = function() {
		$scope.listLists = !$scope.listLists;
		$scope.addListItemActive = $scope.listLists;
		if ($scope.addToList != 1 && $scope.addToList != 2 && $scope.addToList != 3) 
			$scope.listCardType = false;
		else $scope.listCardType = $scope.listLists;
		$scope.showContentInput = $scope.listLists;
	}
	$scope.setList = function(list) {
		if (list != 1 && list != 2 && list != 3) list = 1;
		$scope.addToList = list;
		$scope.listCardType = true;
	}
	$scope.setType = function(type) {
		if (type != 1 && type != 2) type = 1;
		$scope.cardType = type;
	}
	$scope.commitItem = function() {
		//return if empty input
		if ($scope.textContent.length == 0 && $scope.cardType == 2) return;
		if ($scope.equationContent.length == 0 && $scope.cardType == 1) return;

		//Graph
		if ($scope.cardType == 1) {
			if ($scope.addToList == 1) {
				$scope.models.lists.listA.push({
					id: getCardId(),
					type: "function",
					data: {
						fnContent: $scope.equationContent,
						fnType: $scope.equationType,
						type: "list1"
					}
				});
			}
			else if ($scope.addToList == 2) {
				$scope.models.lists.listB.push({
					id : getCardId(),
					type: "function",
					data: {
						fnContent: $scope.equationContent,
						fnType: $scope.equationType,
						type: "list2"
					}
				});
			}
			else if ($scope.addToList == 3) {
				$scope.models.lists.listC.push({
					id : getCardId(),
					type: "function",
					data: {
						fnContent: $scope.equationContent,
						fnType: $scope.equationType,
						type: "list3"
					}
				});
			}
		}
		//Text
		else if ($scope.cardType == 2) {
			if ($scope.addToList == 1) {
				$scope.models.lists.listA.push({
					id: getCardId(),
					type: "text",
					data: {
						content: $scope.textContent,
						type: "list1"
					}
				});
			}
			else if ($scope.addToList == 2) {
				$scope.models.lists.listB.push({
					id: getCardId(),
					type: "text",
					data: {
						content: $scope.textContent,
						type: "list2"
					}
				});
			}
			else if ($scope.addToList == 3) {
				$scope.models.lists.listC.push({
					id: getCardId(),
					type: "text",
					data: {
						content: $scope.textContent,
						type: "list3"
					}
				});
			}
		}
		$scope.resetControls();
		$timeout(function() {
			plotView();
		}, 230);
	}

	//Iterate lists model and plot all graphs
	var plotView = function() {
		for (var i=0; i<$scope.models.lists.listA.length; i++) {
			var tmpItem = $scope.models.lists.listA[i];
			if (tmpItem.type == 'function') 
				plotGraph(1, tmpItem.data.fnType, tmpItem.data.fnContent, i);
		}

		for (var i=0; i<$scope.models.lists.listB.length; i++) {
			var tmpItem = $scope.models.lists.listB[i];
			if (tmpItem.type == 'function') 
				plotGraph(2, tmpItem.data.fnType, tmpItem.data.fnContent, i);
		}

		for (var i=0; i<$scope.models.lists.listC.length; i++) {
			var tmpItem = $scope.models.lists.listC[i];
			if (tmpItem.type == 'function') 
				plotGraph(3, tmpItem.data.fnType, tmpItem.data.fnContent, i);
		}
	}

	//Plot a single graph in the designated Div
	var plotGraph = function(list, fnType, fn, index) {
		//Set the target Div ID.
		var target = '#plot-';
		if (list == 1) target += 'A-';
		else if (list == 2) target += 'B-';
		else if (list == 3) target += 'C-';
		else { console.log('Error occured while plotting.'); return; }
		target += index;
		console.log('plotting target: '+target);

		if (fnType == 'fn') {
			try { //plot equation in body
				functionPlot({
						width: 250,
						height: 250,
				  		target: target,
				  		data: [{
				    		fn: fn,
				    		sampler: 'builtIn',
				    		graphType: 'polyline'
				  		}]
					});
			} catch (err) {
				console.log('err caught: '+err);
				$scope.plotError = true;
			}
		}

		else if (fnType == 'im') {
			try { //plot equation in body
				functionPlot({
						width: 250,
						height: 250,
				  		target: target,
				  		data: [{
				    		fn: fn,
				    		fnType: 'implicit'
				  		}]
					});
			} catch (err) {
				console.log('err caught: '+err);
				$scope.plotError = true;
			}
		}
	}

	$scope.models = {
        lists: {"listA": [], "listB": [], "listC": []},
        allowedTypes: {"listA": ["list1"], "listB": ["list2"], "listC": ["list3"]}
    };

    $scope.models.lists.listA = [{"id":1,"type":"function","data":{"fnContent":"x","fnType":"fn","type":"list1"}},{"id":2,"type":"text","data":{"content":"$x$","type":"list1"}},{"id":3,"type":"function","data":{"fnContent":"x^2","fnType":"fn","type":"list1"}}];

    // Model to JSON for demo purpose
    $scope.$watch('models', function(model) {
        $scope.modelAsJson = angular.toJson(model, true);
        $timeout(function() {
			console.log('plotting view.');
				plotView();
		}, 230);
    }, true);
}])

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