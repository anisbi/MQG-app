var app = angular.module('qmaker', 
	[
	 'ui.router', 
	 'ui.bootstrap',
	 'angularFileUpload',
	 'dndLists',

]);





app.run(
  function($rootScope, $location, $state, authentication) {
  	$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
      //console.log("from state: ",fromState);
      //console.log("to state: ",toState);
      //console.log("location path",$location.path());
      if ($location.path() === '/profile' && !authentication.isLoggedIn()) {
        event.preventDefault();
        $location.path('/login');
        $state.go('login');
      }
      else if ($location.path() === '/login' && authentication.isLoggedIn()) {
        event.preventDefault();
        $location.path('/profile');
        $state.go('profile');
      }
      else if ($location.path() === '/register' && authentication.isLoggedIn()) {
        event.preventDefault();
        $location.path('/profile');
        $state.go('profile');
      }
      else if ($location.path() === '/logout' && !authentication.isLoggedIn()) {
        event.preventDefault();
        $location.path('/login');
        $state.go('login');
      }
      else if ($location.path() === '/home' && !authentication.isLoggedIn()) {
        event.preventDefault();
        $location.path('/login');
        $state.go('login');
      }
    });
  }
);


/*
app.config(['$httpProvider', function($httpProvider) {
    //initialize	 get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};    
    }    
    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    // extra
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
}]);
*/

app.config(
function($stateProvider, $urlRouterProvider) {

	$stateProvider
	 

	 .state('home', {
	 	url: '/home',
	 	templateUrl: '/views/home.html',
	 	controller: 'homeCtrl'
	 })

/*
	$stateProvider
	 .state('home', {
	 	url: '/home',
	 	templateUrl: '/views/home.html',
	 	controller: 'homeCtrl',
	 	resolve: {
	 		questionnaires: ['qstnrs', function(qstnrs) {
	 			return qstnrs.getAll();
	 		}]
	 	}
	 })

*/

	 .state('questionnaires', {
	 	url: '/questionnaires/{id}',
	 	templateUrl: '/views/questionnaire.html',
	 	controller: 'questionnairesCtrl',
	 })

	 .state('new', {
	 	url: '/questionnaires/{id}/new',
	 	templateUrl: '/views/new_question.html',
		controller: 'QuestionsCtrl',
	 	resolve: {
	 		questionnaire: ['$stateParams', 'qstnrs', function($stateParams, qstnrs){
	 			return qstnrs.get($stateParams.id);
	 		}]
	 	}
	 })

	 .state('multi_choice', {
	 	url: '/questionnaires/{id}/new/multi_choice',
	 	templateUrl: '/views/question_types/multi_choice.html',
	 	controller: 'multiChoiceCtrl',
	 })

	 /* in this state we provide the question id to the url */
	 .state('edit_multi_choice', {
	 	url: '/questions/{id}/edit/multi_choice',
	 	templateUrl: '/views/edit_multi_choice.html',
	 	controller: 'multiChoiceEditCtrl',
	 })


 	 .state('open_question', {
	 	url: '/questionnaires/{id}/new/open_question',
	 	templateUrl: '/views/question_types/open_question.html',
	 	controller: 'openQuestionCtrl',
	 })

 	 .state('edit_open_question', {
	 	url: '/questions/{id}/edit/open_question',
	 	templateUrl: '/views/question_types/open_question.html',
	 	controller: 'openQuestionEditCtrl',
	 })

	 .state('pair_matching', {
	 	url: '/questionnaires/{id}/new/pair_matching',
	 	templateUrl: '/views/question_types/pair_matching.html',
	 	controller: 'pairMatchingCtrl',
	 }) 

	 .state('edit_pair_matching', {
	 	url: '/questions/{id}/edit/pair_matching',
	 	templateUrl: '/views/question_types/edit_pair_matching.html',
	 	controller: 'pairMatchingEditCtrl',
	 })

 	 .state('card_matching', {
	 	url: '/questionnaires/{id}/new/card_matching',
	 	templateUrl: '/views/card_matching.html',
	 	controller: 'cardMatchingCtrl',
	 })

	 .state('edit_card_matching', {
	 	url: '/questions/{id}/edit/card_matching',
	 	templateUrl: '/views/card_matching.html',
	 	controller: 'cardMatchingCtrl',
	 })

	 /* The first page when solving a questionnaire.
		Quiz id corresponds to questionnaire ID.
	  */
	 .state('quiz', {
	 	url: '/quiz/{id}',
	 	templateUrl: '/views/quiz.html',
	 	controller: 'quizCtrl',
	 	resolve: {
	 		quiz: ['$stateParams', 'qstnrs', function($stateParams, qstnrs) {
	 			return qstnrs.getQuiz($stateParams.id);
	 		}]
	 	}
	 })

	.state('quizQuestion_multi_choice', {
		url: '/quiz/question/{id}/multi_choice',
		templateUrl: '/views/quizquestion_multi_choice.html',
		controller: 'MultiChoiceQuizQuestionCtrl',
		resolve: {
			question: ['$stateParams', 'qstnrs', function($stateParams, qstnrs) {
				return qstnrs.getQuizQuestion($stateParams.id);
			}]
		}
	})

	 .state('registerTeacher', {
	 	url: '/register/teacher',
	 	templateUrl: '/views/register.html',
	 	controller: 'registerCtrl',
	 })

	 .state('register', {
	 	url: '/register',
	 	templateUrl: '/views/register.html',
	 	controller: 'registerCtrl',
	 })
	
	.state('login', {
	 	url: '/login',
	 	templateUrl: '/views/login.html',
	 	controller: 'loginCtrl',
	 })

	.state('profile', {
	 	url: '/profile',
	 	templateUrl: '/views/profile.html',
	 	controller: 'profileCtrl',
	 })

	.state('logout', {
	 	url: '/logout',
	 	templateUrl: '/views/login.html',
	 	controller: 'logoutCtrl',
	 })

	 //$urlRouterProvider.otherwise('home');
	 $urlRouterProvider.otherwise(function($injector, $location){
	 	$injector.invoke(['$state', function($state) {
	 		$state.go('home');
	 	}]);
	 });
});



app.factory('qstnrs', ['$http', function($http, mqgAppData){
 var o = {
 	qstnrs: []
 };

 /* get all questionnaires */
 o.getAll = function() {
	/*return $http.get('/questionnaires').then(function(res) {
		//angular.copy(data, o.qstnrs);
		return res.data;
	});*/

  mqgAppData.getQuestionnaires()
     .success(function (result) {
     	if (result.result === "success") {
     		console.log("retrieved all qstnrs: ",result);
     		return result.data;
     	}
     	else {
     	  return {"result":"failure"};
     	}
     })
     .error(function(e) {
     	console.log('error',e);
     });
 };


 /* post a new questionnaire */
 o.create = function(questionnaire) {
 	return $http.post('/questionnaires', questionnaire).success(function(data){
 		o.qstnrs.push(data);
 	});
 };

 /* get single questionnaire */
 o.get = function(id) {
 	return $http.get('/questionnaires/' + id).then(function(res){
 		return res.data;
 	});
 };

 /* get single question */
 o.getQuestion = function(id) {
 	return $http.get('/question/' + id).then(function(res){
 		return res.data;
 	});
 };


 /* post new question */
 o.newQuestion = function(id, question) {
 	return $http.post('/questionnaires/' + id + '/questions', question);
 };

 o.newSolution = function(solution) {
 	return $http.post('/solutions', solution);
 };



/* Edit a single question */
 o.editQuestion = function(id, question) {
 	return $http.put('/question/'+id, question);
 };

 o.deleteQuestion = function(id) {
 	return $http.delete('/question/' +id);
 };

 /* Get a questionnaire for a 'quiz' (exclude answer) */
 o.getQuiz = function(id) {
 	return $http.get('/quiz/' +id).then(function(res){
 		console.log(res.data);
 		return res.data;
 	});
 };



 /* Get a question for a 'quiz' (exclude answer) */
 o.getQuizQuestion = function(id) {
 	console.log('/quiz/question/' +id);
 	return $http.get('/quiz/question/' +id).then(function(res){
 		console.log('data:' + res.data);
 		return res.data;
 	});
 };


 return o;

}]);


app.directive("mathjaxBind", function() {
    return {
        restrict: "A",
        controller: ["$scope", "$element", "$attrs", 
        function($scope, $element, $attrs) {
            $scope.$watch($attrs.mathjaxBind, function(value) {
                $element.text(value == undefined ? "" : value);
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, $element[0]]);
            });
        }]
    };
});

//Focus an input element
app.directive('focus',
	function($timeout) {
	 return {
	 scope : {
	   trigger : '@focus'
	 },
	 link : function(scope, element) {
	  scope.$watch('trigger', function(value) {
	    if (value === "true") {
	      $timeout(function() {
	       element[0].focus();
	      });
	   }
	 });
	 }
	};
}); 

/*
	Filter, replaces '\n' with '<br/>'.
	Used when retrieving text from database, stored with '\n',
	which needs to be displayed in html with line breaks.
*/
app.filter('newlines', function () {
    return function(text) {
        return text.replace(/\n/g, '<br/>');
    }
});
/*
	Filter, replaces '<', '>' and '&' stored in the database
	with non-HTML version.
*/
app.filter('noHTML', function () {
    return function(text) {
        return text
                .replace(/&/g, '&amp;')
                .replace(/>/g, '&gt;')
                .replace(/</g, '&lt;');
    }
});

/*
	This control is used for testing.
*/
app.controller('MathCtrl', [
'$scope',
function($scope){

$scope.test = function() {
	console.log('test');
}

$scope.equation = "x^2";

$scope.draw = function() {
	console.log('draw');
	try {
		functionPlot({
			width: 250,
			height: 250,
	  		target: '#plot',
	  		data: [{
	    		fn: $scope.equation,
	    		sampler: 'builtIn',
	    		graphType: 'polyline'
	  		}]
		});
	} catch (err) {
		console.log(err);
	}
}


}]);


/*
	Controller of the home page.
*/
app.controller('MainCtrl', [
'$scope',
'qstnrs',
'questionnaires',
function($scope, qstnrs, questionnaires){


$scope.qstnrs = questionnaires;
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
	qstnrs.create({
		title: $scope.title,
		author: 'admin'
	}).success(function(questionnaire) {
		$scope.qstnrs.push(questionnaire);
	});
	$scope.title = '';

	$scope.formView = false;
	$scope.qstnrsView = true;
};



}]);


app.controller('QuestionsCtrl', [
'$scope',
'questionnaire',
'qstnrs',
function($scope, questionnaire, qstnrs) {


$scope.qstnr = questionnaire;


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

$scope.delQuestion = function(id) {
	var result = confirm("Are you sure you want to delete this question?");
	if (result)
	{
		qstnrs.deleteQuestion($scope.qstnr.questions[id]._id);
		$scope.qstnr.questions.splice(id,1);
	}
};

}]);




/*
	Early implementation of quiz. A quiz is a questionnaire in the way
	it is presented to a student (excludes question answer from HTTP requests).

	=> Not part of the prototype.
*/
app.controller('quizCtrl', [
'$scope',
'$location',
'$http',
'quiz',
'qstnrs',
function($scope, $location, $http, quiz, qstnrs) {

	var uid = 'anis5';
	
	
	//console.log('qstn '+qstn);
	//$scope.quest = qstn;

	$scope.questions = [];
	//$scope.questions = qstnrs.getQuestion(quiz.questions[0]);
	$scope.size = quiz.questions.length;
	$scope.shortBody = [];

	$scope.solved = [];

	for (var i=0; i<quiz.questions.length; i++) {
		$http.get('/solutions/'+uid+'/' +quiz.questions[i]._id).then(function(res){

			if (res.data.Solved != null)
 				$scope.solved.push(res.data.Solved);

 			
 		
 		});
		$scope.questions.push(quiz.questions[i]);
		$scope.shortBody.push(quiz.questions[i].body.substring(0,37));
	}
	


}

]);

/*
	Early implementation of quizzing (presenting a question) for 
	question of type multi_choice.

	=> not part of the prototype.
*/
app.controller('MultiChoiceQuizQuestionCtrl', 
	['$scope', '$http','$location', 'question', 'qstnrs',
	function($scope, $http, $location, question, qstnrs) {

		var uid = 'anis5';
		//Check if question solved by user before:
		$http.get('/solutions/'+uid+'/'+question._id).then(function(res){
			if (res.data.Solved == 'false') {
				$scope.qtype_message = "Please choose the correct answer";
				$scope.question = question;
				$scope.choiceVal = 0;
			}
			else {
				$scope.qtype_message = "You have already solved this question";
				$scope.question = null;
			}

		});
		console.log('$scope.isSovled: '+ $scope.isSolved);
		/*
		if ($scope.isSolved = false) {
			$scope.qtype_message = "Please choose the correct answer";
			$scope.question = question;
			$scope.choiceVal = 0;
		} else {
			$scope.qtype_message = "You have already solved this question";
			$scope.question = null;
		}
		*/
		

		$scope.submitSolution = function() {
			qstnrs.newSolution({
				qtype: 'multi_choice',
				solver: uid,
				data: {
					answer: $scope.choiceVal
				},
				question: question._id
			}).success(function(solution) {

				$location.path('/quiz/' + question.questionnaire);
			});
		}

	}
]);






