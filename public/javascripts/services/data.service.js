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

    return {
  	  getProfile : getProfile,
      getQuestionnaires: getQuestionnaires,
      getQuestionnaire: getQuestionnaire,
      getTest : getTest,
      newQuestionnaire : newQuestionnaire
    };

  }
})();