angular.module('qmaker')

.controller('questionnairesCtrl', function($stateParams, $scope, $location, authentication, mqgAppData) {

  mqgAppData.getQuestionnaire($stateParams.id)
  .success(function (response) {
     $scope.questionnaire = response.data;
     loadHomePage();
     //console.log('$scope inside', $scope.questionnaires);
   })
   .error(function(e) {
 	 console.log('error',e);
   });

   var loadHomePage = function() { 
   	$scope.qstnr = $scope.questionnaire;

	$scope.question_type_names  = ['Multiple Choice', 
								   'Test type 2'];

	$scope.question_types 		= ['multi_choice', 
								   'test_type_2']; 





	$scope.pickType = false;





	$scope.pickQt = function() {
		$scope.pickType = !($scope.pickType);
	}


	$scope.newQuestion = function() {

		qstnrs.newQuestion(questionnaire._id, {

			qtype: $scope.type

		}).success(function(question) {
			$scope.qstnr.questions.push(question);
		});
		
		$scope.type = '';




	};

	$scope.delQuestion = function(id, index) {
    swal({
      title: '⸮האם את/ה בטוח/ה',
      text: "אין להחזיר שאלה לאחר שנמחקה",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '!כן, מחק שאלון',
      cancelButtonText : 'ביטול'
      
    }).then(function () {
         $scope.sendDeleteRequest(id, index);
    }, function (dismiss) {
         // dismiss can be 'cancel', 'overlay',
         // 'close', and 'timer'
         if (dismiss === 'cancel') {
            // in case cancel is clicked    
         }
    });
	};

  $scope.sendDeleteRequest = function(id, index) {
    mqgAppData.deleteQuestion(id)
        .success(function (response) {
           console.log('Delete: ',response);
           if (response.result==="success") {
            swal(
              'הצלחה',
              'שאלה נמחק בהצלחה',
              'success'
            );
            $scope.qstnr.questions.splice(index,1);
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
  };

 }

})
