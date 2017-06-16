angular.module('qmaker')

.controller('homeCtrl', function($scope, $location, authentication, mqgAppData) {

if (!authentication.isLoggedIn()) {
	$location.path('/login');
  	return;
}

else {
  mqgAppData.getQuestionnaires()
  .success(function (response) {
     $scope.questionnaires = response.data;
     loadHomePage();
     console.log('$scope inside', $scope.questionnaires);
   })
   .error(function(e) {
 	 console.log('error',e);
   });
  
  
  
  var loadHomePage = function() {
  	  $scope.currentUser = authentication.currentUser();
  	  console.log('in load', $scope.questionnaires);
	  $scope.qstnrs = $scope.questionnaires;
	  $scope.formView = false;
	  $scope.qstnrsView = false;

	  //Used for Pagination:
	  $scope.filteredQstnrs = [];
	  $scope.currentPage = 1;
	  $scope.numPerPage = 10;
	  $scope.maxSize = 5;
	  //End of Pagination.

	  $scope.$watch('currentPage + numPerPage', function() {
		var begin = (($scope.currentPage - 1) * $scope.numPerPage)
		  , end = begin + $scope.numPerPage;

	   $scope.filteredQstnrs = $scope.qstnrs.slice(begin, end);
	  });

	  //Display 'new questionnaire' form.
	  $scope.createQstnrForm = function() {
		$scope.qstnrsView = false;
		$scope.formView = !($scope.formView);
	  }

	  //Display list of all questionnaires.
		$scope.listQstnrs = function() {
			$scope.formView = false;
			$scope.qstnrsView = !($scope.qstnrsView);
		}

		//Commit new questionnaire to database.
		$scope.newQstnr = function () {

			var data = {
				title: $scope.title,
				author: {
					id : $scope.currentUser.id,
					name : $scope.currentUser.name
				}
			};

			console.log("qstnr data: ",data);
			mqgAppData.newQuestionnaire(data)
						  .success(function(response) {
						  	//console.log("new qstnr successful: ",response);
						    $scope.qstnrs.push(response.data);
						    var begin = (($scope.currentPage - 1) * $scope.numPerPage)
							  , end = begin + $scope.numPerPage;

						    $scope.filteredQstnrs = $scope.qstnrs.slice(begin, end);
						  })
						  .error(function (e) {
						  	console.log('error',e);
						  });

			/*
			qstnrs.create({
				title: $scope.title,
				author: 'admin'
			}).success(function(questionnaire) {
				$scope.qstnrs.push(questionnaire);
			});
			*/
			$scope.title = '';

			$scope.formView = false;
			$scope.qstnrsView = true;
		};
 	}
 }


})