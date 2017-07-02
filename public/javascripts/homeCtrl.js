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
  	//console.log('in load', $scope.questionnaires);
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

	

	$scope.delQuestionnaire = function(index) {
    swal({
      title: '⸮האם את/ה בטוח/ה',
      text: "כל השאלות ימחקו ןאי אפשר להחזירם.",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '!כן, מחק שאלון',
      cancelButtonText : 'ביטול'
      
    }).then(function () {
         $scope.sendDeleteRequest(index);
    }, function (dismiss) {
           // dismiss can be 'cancel', 'overlay',
           // 'close', and 'timer'
           if (dismiss === 'cancel') {
              // in case cancel is clicked
             
           }
      });
	};

	$scope.sendDeleteRequest = function(index) { 
		var id = $scope.qstnrs[index]._id;
		mqgAppData.deleteQuestionnaire(id)
			  .success(function (response) {
			     console.log('Delete: ',response);
			     if (response.result==="success") {
			     	swal(
						  'הצלחה',
						  'שאלון נמחק בהצלחה',
						  'success'
						);
						$scope.qstnrs.splice(index,1);
						$scope.filteredQstnrs.splice(index,1);
			     }
			     else {
			     	swal(
						  'שגיאה',
						  'שגיאה במחיקת שאלון. יש לפנות לתמיכה.',
						  'error'
						);
			     }
			   })
					   .error(function(e) {
					 	 console.log('error',e);
					   });
		//console.log($scope.qstnrs[index]._id);
	};


})

.controller('homeStudentCtrl', function($scope, $location, authentication, mqgAppData) {

})