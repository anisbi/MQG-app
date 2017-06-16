(function () {

  angular
      .module('qmaker')
      .service('authentication', authentication);

  authentication.$inject = ['$http','$window'];
  function authentication($http, $window) {

    var saveToken = function(token) {
      console.log('setting local storage to: ',token);
      $window.localStorage['mqg-app-token'] = token;	
    };

    var getToken = function() {
      console.log('localStorage', $window.localStorage['mqg-app-token']);
      return $window.localStorage['mqg-app-token'];
    };

    var isLoggedIn = function() {
      var token = getToken();
      console.log('typeof token',typeof( token ));
      var payload;

      if (token) {
        payload = token.split('.')[1];
        payload = $window.atob(payload);
        payload = JSON.parse(payload);
        console.log('payload',payload);
        //console.log('exp:',payload.exp);
        //console.log('datenow / 100', (Date.now() / 1000));
        //console.log('equation', (payload.exp > Date.now() / 1000));
        return payload.exp > Date.now() / 1000;
      }
      else {
      	return false;
      }
    };

    var currentUser = function() {
      if (isLoggedIn()) {
      	var token = getToken();
      	var payload = token.split('.')[1];
      	payload = $window.atob(payload);
      	payload = JSON.parse(payload);
      	return {
          id : payload._id,
      	  email : payload.email,
      	  name : payload.name
      	};
      }
    };

    register = function(user) {
      console.log('in register', user);
      return $http.post('/register',user).success(function(data) {
        if (data.result === "success") {
          console.log('register return data: ',data);
      	  saveToken(data.token);
        }
        else if (data.result === "failure") {
        	if (data.errcode === 11000) {
          		console.log("Email address already registered.");
          		return {
          			data : data
          		};
      		}
        }
      
      });
    };

    login = function(user) {
      return $http.post('/login', user).success(function(data) {
  	    if (data.result === "success") {	
      	  saveToken(data.token);
      	}
      });
    };

    logout = function() {
      $window.localStorage.removeItem('mqg-app-token');
    };


    return {
      saveToken : saveToken,
      getToken : getToken,
      isLoggedIn : isLoggedIn,
      register : register,
      login : login,
      currentUser : currentUser,
      logout : logout
    };

  }

})();

