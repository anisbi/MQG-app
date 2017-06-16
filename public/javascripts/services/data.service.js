(function() {

  angular
      .module('qmaker')
      .service('mqgAppData', mqgAppData);
  
  mqgAppData.$inject = ['$http', 'authentication'];
  function mqgAppData($http, authentication) {


    var getTest = function() {
      return $http.get('/test', {
        headers: {
          Authorization: 'Bearer '+authentication.getToken()
        }
      });
    };

    var getProfile = function() {
      return $http.get('/profile', {
      	headers: {
      		Authorization: 'Bearer '+authentication.getToken()
      	}
      });
    };

    var getQuestionnaires = function() {
      return $http.get('/questionnaires', {
        headers: {
          Authorization: 'Bearer '+authentication.getToken()
        }
      });
    };

    var newQuestionnaire = function(data) {
      return $http.post('/questionnaires', data, {
        headers: {
          Authorization: 'Bearer '+authentication.getToken()
        }
      });
    };

    var getQuestionnaire = function(qid) {
      return $http.get('/questionnaires/'+qid, {
        headers: {
          Authorization: 'Bearer '+authentication.getToken()
        }
      });
    };


    var newQuestion = function(questionnaireId, questionData) {
      return $http.post('/questionnaires/'+questionnaireId+'/questions', questionData, {
        headers: {
          Authorization: 'Bearer '+authentication.getToken()
        }
      });
    };

    var getQuestion = function(questionId) {
      return $http.get('/question/'+questionId, {
        headers: {
          Authorization: 'Bearer '+authentication.getToken()
        }
      });
    };

    var editQuestion = function(questionId, questionData) {
      return $http.put('/question/'+questionId, questionData, {
        headers: {
          Authorization: 'Bearer '+authentication.getToken()
        }
      });
    };

    var getQuizzes = function() {
      return $http.get('/quiz', {
        headers: {
          Authorization: 'Bearer '+authentication.getToken()
        }
      });
    };

    var getQuizQuestion = function(qtype, qid) {
      return $http.get('/quiz/'+qid+'/'+qtype, {
        headers: {
          Authorization: 'Bearer '+authentication.getToken()
        }
      });
    };

    return {
  	  getProfile : getProfile,
      getQuestionnaires: getQuestionnaires,
      getQuestionnaire: getQuestionnaire,
      getQuestion : getQuestion,
      getTest : getTest,
      newQuestion : newQuestion,
      editQuestion : editQuestion,
      newQuestionnaire : newQuestionnaire,
      getQuizzes : getQuizzes,
      getQuizQuestion : getQuizQuestion
    };

  }
})();