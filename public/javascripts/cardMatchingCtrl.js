angular.module('qmaker')

.controller('cardMatchingCtrl', function($stateParams, $state, $scope, $timeout, $location, authentication, mqgAppData) {
console.log('state',$state);

$scope.currentUser = authentication.currentUser();

if ($state.current.name === "edit_card_matching") {
	//Get question
	mqgAppData.getQuestion($stateParams.id)
	.success(function (response) {
	  if (response.result === "success") {
	    $scope.questionData = response.data;
	    $scope.questionnaire_id = $scope.questionData.questionnaire.id;
	    loadViewData();
	  }
	});
}
else {

	$scope.questionnaire_id = $stateParams.id;
	$scope.list1 = "רשימה 1";
	$scope.list2 = "רשימה 2";
	$scope.list3 = "רשימה 3";
	$scope.qbody = "";

	$scope.question = {
		qtype: 'card_matching',
		author: { 
			id : $scope.currentUser.id,
			name : $scope.currentUser.name
		},
		data: {
	    	allowedTypes: {"listA" : ["1"], "listB": ["2"], "listC": ["3"]},
			lists: {
				"listA": [],
				"listB": [],
				"listC": []
			}
		},
		publicdata:
		{

			list1: $scope.list1,
			list2: $scope.list2,
			list3: $scope.list3,
			qbody: $scope.qbody
		}
	};

	$scope.models = {
		allowedTypes: {"listA" : ["1"], "listB": ["2"], "listC": ["3"]},
		lists: {
			"listA": [],
			"listB": [],
			"listC": []
		}
	};

	

}

var loadViewData = function() {
	$scope.question = $scope.questionData;
	$scope.models = {
		allowedTypes: {"listA" : ["1"], "listB": ["2"], "listC": ["3"]},
		lists: {
			"listA": $scope.question.data.lists.listA,
			"listB": $scope.question.data.lists.listB,
			"listC": $scope.question.data.lists.listC
		}
	};
	$scope.list1 = $scope.question.publicdata.list1;
	$scope.list2 = $scope.question.publicdata.list2;
	$scope.list3 = $scope.question.publicdata.list3;
	$scope.qbody = $scope.question.publicdata.qbody;
};



$scope.resetControls = function() {
	$scope.addListItemActive = false;
	$scope.listLists = false;
	$scope.listCardType = false;
	$scope.addToList = 1;
	$scope.cardType = 0;
	$scope.showContentType = false;
	$scope.equationType = 'fn';
	$scope.equationContent = '';
	$scope.textContent = '';
}
$scope.resetControls();
$scope.addListItem = function() {
	$scope.addListItemActive = 
	    $scope.listLists = 
	    $scope.listCardType = 
	    !$scope.addListItemActive;
}
$scope.setList = function(index) {
	if (index > 0 && index < 4) {
		$scope.addToList = index;
	}
	$scope.listCardType = true;
}
$scope.setType = function(index) {
	if (index > 0 && index < 3) {
		$scope.cardType = index;
		$scope.showContentInput = true;
	}
}
$scope.commitItem = function() {
	var data = null;
	var list = $scope.addToList;
	console.log('list',list);
	console.log('typeof list', typeof(list));
	if ($scope.cardType === 2) {
		console.log('in card type 2');
		data = {
			type: "text",
			data: {
				type: ""+list,
				content: $scope.textContent,
			}
		};
		console.log('data:',data);
	}
	else if ($scope.cardType === 1) {
		console.log('in card type 1');
		data = {
			type: "function",
			data: {
				type: ""+list,
				fnContent: $scope.equationContent,
				fnType: $scope.equationType
			}
		};

	}
	if (list === 1) {
		$scope.models.lists.listA.push(data);
	}
	else if (list === 2) {
		$scope.models.lists.listB.push(data);
	}
	else if (list === 3) {
		$scope.models.lists.listC.push(data);
	}
	$scope.resetControls();
}
$scope.editList1 = $scope.editList2 = $scope.editList3 = false;
$scope.editListName = function(index) {
	if (index > 0 && index < 4) {
		if (index === 1) {
			$scope.editList1 = true;
		}
		else if (index === 2) {
			$scope.editList2 = true;
		}
		else if (index === 3) {
			$scope.editList3 = true;
		}
	}
}

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

$scope.commitQuestion = function() {
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
	//If creating a new question
	else {
		mqgAppData.newQuestion($stateParams.id, $scope.question)
				  .success(function(response) {
				  	$location.path('/questionnaires/' + $stateParams.id);
				  })
				  .error(function (e) {
				  	console.log('error',e);
				  });
	}
}

// Model to JSON for demo purpose
$scope.$watch('models', function(model) {
    $scope.modelAsJson = angular.toJson(model, true);
    $timeout(function() {
		console.log('plotting view.');
		$scope.plotView();
	}, 230);
}, true);



})