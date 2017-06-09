/*
	Controller for multi choice questions.
	Includes CRUD - and solving implementation.
*/

angular.module('qmaker')

//Controller for CRUD of open question type.
.controller('openQuestionCtrl', [
'$scope',
'$location',
'questionnaire',
'qstnrs',

function($scope, $location, questionnaire, qstnrs, $upload) {

//Template for new question
$scope.question = {
	qtype: 'open_question',
	body: '',
	data: {},
	publicdata:
	{
		equations: {
			equationsArray: [{
				equation: '',
				equationComment: '',
				equationType: 'fn' //Implicit or function. (Ax+By+C=0 OR y=f(x))
			}]
		}
	}
};

$scope.equations = $scope.question.publicdata.equations.equationsArray;

//Adds a graph to the question content
$scope.addGraph = function() {
	$scope.question.publicdata.equations.equationsArray.push(
	 {
	 	equation: '',
	 	equationComment: '',
	 	equationType: 'fn'
	 }
	);
	//$scope.equations = $scope.question.publicdata.equations.equationsArray;
}

//Refreshes the function-plot in preview
$scope.plotError = false;
$scope.refreshPreview = function() {
	
	for (var i = 0; i <  $scope.equations.length; i++) {
		try {
			if ($scope.equations[i].equationType == 'fn') {
				console.log('refreshPreview2');
				functionPlot({
					title: $scope.equations[i].equationComment,
					width: 250,
					height: 250,
			  		target: '#plot-' +i,
			  		data: [{
			    		fn: $scope.equations[i].equation,
			    		sampler: 'builtIn',
			    		graphType: 'polyline'
			  		}]
				});
			}
			if ($scope.equations[i].equationType == 'im') {
				functionPlot({
					title: $scope.equations[i].equationComment,
					width: 250,
					height: 250,
			  		target: '#plot-' +i,
			  		data: [{
			    		fn: $scope.equations[i].equation,
			    		fnType: 'implicit'
			  		}]
				});
			}
		} catch(err) {
			$scope.plotError = true;
		}
	}
}

//Handles file uploads.
$scope.uploadFile = function(){
	console.log('in upload file');
 $scope.fileSelected = function(files) {
		console.log('in files');
     if (files && files.length) {

        $scope.file = files[0];
     }

     $upload.upload({
       url: '/api/upload', //node.js route
       file: $scope.file
     })
     .success(function(data) {
       console.log(data, 'uploaded');
      });

    };
};



}]);