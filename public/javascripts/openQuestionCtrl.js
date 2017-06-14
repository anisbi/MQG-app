angular.module('qmaker')

.controller('openQuestionCtrl', function($stateParams, $scope, $location, authentication, mqgAppData) {

$scope.currentUser = authentication.currentUser();

//Template for new question
$scope.question = {
	qtype: 'open_question',
	body: '',
	author: { 
		id : $scope.currentUser.id,
		name : $scope.currentUser.name
	},
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

//$scope.equations = $scope.question.publicdata.equations.equationsArray;

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
	var arrLength = $scope.question.publicdata.equations.equationsArray.length;
	for (var i = 0; i <  arrLength; i++) {
		try {
			if ($scope.question.publicdata.equations.equationsArray[i].equationType == 'fn') {
				console.log('refreshPreview2',$scope.question.publicdata.equations.equationsArray[i]);
				console.log('refreshPreview Title:',$scope.question.publicdata.equations.equationsArray[i].equationComment);
				functionPlot({
					width: 250,
					height: 250,
			  		target: '#plot-' +i,
			  		data: [{
			    		fn: $scope.question.publicdata.equations.equationsArray[i].equation,
			    		sampler: 'builtIn',
			    		graphType: 'polyline'
			  		}]
				});
			}
			if ($scope.question.publicdata.equations.equationsArray[i].equationType == 'im') {
				functionPlot({
					width: 250,
					height: 250,
			  		target: '#plot-' +i,
			  		data: [{
			    		fn: $scope.question.publicdata.equations.equationsArray[i].equation,
			    		fnType: 'implicit'
			  		}]
				});
			}
		} catch(err) {
			$scope.plotError = true;
		}
	}
}

$scope.deleteGraph = function(index) {
	console.log("splicing",index);
	$scope.question.publicdata.equations.equationsArray.splice(index,1);
	$scope.refreshPreview();
};


$scope.commitQuestion = function() {

	mqgAppData.newQuestion($stateParams.id, $scope.question)
	  .success(function(response) {
	  	$location.path('/questionnaires/' + $stateParams.id);
	  })
	  .error(function (e) {
	  	console.log('error',e);
	  });
};

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
})

.controller('openQuestionEditCtrl', function($timeout, $stateParams, $scope, $location, authentication, mqgAppData) {

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
	var arrLength = $scope.question.publicdata.equations.equationsArray.length;
	for (var i = 0; i <  arrLength; i++) {
		try {
			if ($scope.question.publicdata.equations.equationsArray[i].equationType == 'fn') {
				console.log('refreshPreview2',$scope.question.publicdata.equations.equationsArray[i]);
				console.log('refreshPreview Title:',$scope.question.publicdata.equations.equationsArray[i].equationComment);
				functionPlot({
					width: 250,
					height: 250,
			  		target: '#plot-' +i,
			  		data: [{
			    		fn: $scope.question.publicdata.equations.equationsArray[i].equation,
			    		sampler: 'builtIn',
			    		graphType: 'polyline'
			  		}]
				});
			}
			if ($scope.question.publicdata.equations.equationsArray[i].equationType == 'im') {
				functionPlot({
					width: 250,
					height: 250,
			  		target: '#plot-' +i,
			  		data: [{
			    		fn: $scope.question.publicdata.equations.equationsArray[i].equation,
			    		fnType: 'implicit'
			  		}]
				});
			}
		} catch(err) {
			$scope.plotError = true;
		}
	}
};


$scope.deleteGraph = function(index) {
	console.log("splicing",index);
	$scope.question.publicdata.equations.equationsArray.splice(index,1);
	$scope.refreshPreview();
};


$scope.commitQuestion = function() {

	mqgAppData.editQuestion($stateParams.id, $scope.question)
	  .success(function(response) {
	  	$location.path('/questionnaires/' + $scope.question.questionnaire.id);
	  })
	  .error(function (e) {
	  	console.log('error',e);
	  });
};

//Refresh preview on load.
$timeout(function() {
			$scope.refreshPreview();
		}, 230);

};

})