angular.module('qmaker')

.controller('loginCtrl', function($scope, $location, $window, $state, authentication) {
    console.log('in loginCtrl');

    $scope.email = $scope.password = "";

    $scope.onSubmit = function() {
    	var data = {
    	  email : $scope.email,
    	  password : $scope.password
    	};

      authentication.login(data)
      .error(function(err) {
        alert(err);
      })
      .then(function(res) {
        if (res.data.result === "failure") {
        	console.log("Failed to login.",res.data.message);
        }
        else if (res.data.result === "success") {
          $window.location.reload();
        }
      });
    };      

})


.controller('logoutCtrl', function($scope, $location, authentication) {
    authentication.logout();
    $location.path('/login');
});
