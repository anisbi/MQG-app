(function() {

  angular
      .module('qmaker')
      .service('mqgAppData', mqgAppData);
  
  mqgAppData.$inject = ['$http', 'authentication'];
  function mqgAppData($http, authentication) {

    var getProfile = function() {
      return $http.get('/profile', {
      	headers: {
      		Authorization: 'Bearer '+authentication.getToken()
      	}
      });
    };

    return {
  	  getProfile : getProfile
    };

  }
})();