
angular.module('qmaker')

.controller('pairMatchingCtrl', function($scope, $timeout) {
	//Template for new question
	$scope.question = {
		qtype: 'pair_matching',
		data: {
        	lists: {"A": [], "B": []}
		},
		publicdata:
		{
			qbody: ''
		}
	};

	$scope.resetControls = function() {
		$scope.listType = false;
		$scope.addToList =0;
		$scope.listItemType =0;
		$scope.equationContent = '';
		$scope.equationType = 'fn';
		$scope.textContent = '';
		$scope.addListItemActive = false;
		$scope.listChoice = false;
		$scope.showContentInput = false;
	}
	$scope.resetControls();

	$scope.addListItem = function() {
		$scope.listChoice = !$scope.listChoice;
		$scope.addListItemActive = $scope.listChoice;
		if ($scope.addToList != 1 && $scope.addToList != 2) $scope.listType = false;
		else $scope.listType = $scope.addListItemActive;
		$scope.showContentInput = $scope.listChoice;
	}

	$scope.setList = function(list) {
		if (list != 1 && list != 2) list = 1;
		$scope.addToList = list;
		$scope.listType=true;
	}
	
	$scope.setType = function(type) {
		if (type != 1 && type != 2) type = 1;
		$scope.listItemType = type;
	}

	$scope.commitItem = function() {
		//Graph
		if ($scope.listItemType == 1) {
			if ($scope.addToList == 1) {
				$scope.models.lists.A.push({
					type: "function",
					data: {
						fnContent: $scope.equationContent,
						fnType: $scope.equationType
					}
				});
			}
			else if ($scope.addToList == 2 || $scope.addToList!=1) {
				$scope.models.lists.B.push({
					type: "function",
					data: {
						fnContent: $scope.equationContent,
						fnType: $scope.equationType
					}
				});
			}
		}
		//Text
		else if ($scope.listItemType == 2) {
			if ($scope.addToList == 1) {
				$scope.models.lists.A.push({
					type: "text",
					data: {
						content: $scope.textContent
					}
				});
			}
			else if ($scope.addToList == 2 || $scope.addToList!=1) {
				$scope.models.lists.B.push({
					type: "text",
					data: {
						content: $scope.textContent
					}
				});
			}
		}
		$scope.resetControls();
        $timeout(function() {
			console.log('plotting view.');
			$scope.plotView();
		}, 230);
	}
	
	$scope.models = {
        lists: {"A": [], "B": []}
    };

    // Generate initial model
    //for (var i = 1; i <= 3; ++i) {
    //    $scope.models.lists.A.push({label: "x^2+"+i+"", type: "function"});
    //    $scope.models.lists.B.push({label: "Item B", type: "text"});
   // }

    // Model to JSON for demo purpose
    $scope.$watch('models', function(model) {
        $scope.modelAsJson = angular.toJson(model, true);
        $timeout(function() {
			console.log('plotting view.');
			$scope.plotView();
		}, 230);
    }, true);



	$scope.plotView = function() {
	var allItems;
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

	$scope.commitQuestion = function() {
		//TODO: save to DB.
		$scope.question.data.lists.A = $scope.models.lists.A;
		$scope.question.data.lists.B = $scope.models.lists.B;
		console.log($scope.question);
	}

	$timeout(function() {
		console.log('plotting view.');
		$scope.plotView();
	}, 230);
})