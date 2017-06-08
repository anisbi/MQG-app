angular.module('qmaker')

.controller('registerCtrl', function($scope, $location, authentication) {
 
  
	/*
  $scope.credintials = {
  	name: "name",
  	email: "email",
  	password: "password"
  };
  */
  $scope.name = "";
  $scope.email = "";
  $scope.password = "";

  $scope.onSubmit = function() {
  	console.log('submitting', $scope.name,$scope.email,$scope.password);
  	var data = {
  		name : $scope.name,
  		email : $scope.email,
  		password : $scope.password
  	};
  	console.log("packing data", data);
  	
  	authentication
  	    .register(data)
  	    .error(function(err) {
  	      alert(err);	
  	    })
  	    .then(function(res) {
  	      if (res.data.result === "failure") {
  	      	console.log("Failed to register.",res.data.message);
  	      }
  	      else if (res.data.result === "success") {
  	      	$location.path('profile');
  	      }
  	      
  	    });
  	
  };
})