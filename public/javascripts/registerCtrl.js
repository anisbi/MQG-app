angular.module('qmaker')

.controller('registerCtrl', function($scope, $state, $location, authentication) {
 
  
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
  $scope.referrer = "";
  $scope.registerCode = "";
  $scope.type = "student";
  $scope.viewReferrerField = false;
  $scope.viewRegisterCodeField = false;
  if ($state.current.name === "registerTeacher") {
    $scope.type = "teacher";
    $scope.viewRegisterCodeField = "true";
  }
  else if ($state.current.name === "register") {
    $scope.viewReferrerField = true; //In case a student registers, request teacher field
  }

  $scope.onSubmit = function() {
  	console.log('submitting', $scope.name,$scope.email,$scope.password);
  	var data = null;
    if ($state.current.name === "registerTeacher") {
      data = {
    		name : $scope.name,
    		email : $scope.email,
        type : $scope.type,
    		password : $scope.password,
        regiserCode : $scope.registerCode
    	};
    }
  	
    else if ($state.current.name === "register") {
      data = {
        name : $scope.name,
        email : $scope.email,
        type : $scope.type,
        password : $scope.password,
        data : { referrer : $scope.referrer }
      };
    }
  	
  	authentication
  	    .register(data)
  	    .error(function(err) {
  	      alert(err);	
  	    })
  	    .then(function(res) {
          console.log("success registered res:",res);
  	      if (res.data.result === "failure") {
  	      	console.log("Failed to register.",res.data.message);
  	      }
  	      else if (res.data.result === "success") {
  	      	$location.path('profile');
            $state.go('profile');
  	      }
  	      
  	    });
  	
  };
})