describe('MQG App unit tests', function () {
  var $controller;
  beforeEach(module('ui.router'));
  beforeEach(module('ui.bootstrap'));
  beforeEach(module('angularFileUpload'));
  beforeEach(module('qmaker'));

  

  beforeEach(inject(function(_$controller_){
    $controller = _$controller_;
  }));

  describe('Multi choice controller', function () {

    it('tests addOption function', function () {
      var $scope = {};
      var controller = $controller('multiChoiceCtrl', { $scope: $scope });
      var expected = Array();
      for (var i=0; i<6; i++) {
        $scope.addOption();
        expected.push({"body":"","comment":""});
      }
      expected.push({"body":"","comment":""});
      expect($scope.question.options).toEqual(expected);
    });

    it('tests deleteOption function', function() {
      var $scope = {};
      var controller = $controller('multiChoiceCtrl', { $scope: $scope });
      $scope.deleteOption(0);
      var expected = Array();
      expect($scope.question.options).toEqual(expected);
    });

    it('tests add/deleteOption combined together', function() {
      var $scope = {};
      var controller = $controller('multiChoiceCtrl', { $scope: $scope });
      $scope.deleteOption(0);
      var expected = Array();
      for (var i=0; i<10; i++) {
        $scope.addOption();
        $scope.question.options[i].body = 'body'+i;
        expected.push({"body":"body"+i,"comment":""});
      }
      $scope.deleteOption(5);
      $scope.deleteOption(5);
      expected.splice(5,1);
      expected.splice(5,1);
      expect($scope.question.options).toEqual(expected);
    });

    it('tests setAnswer then deleting the option containing the naswer', function() {
      var $scope = {};
      var controller = $controller('multiChoiceCtrl', { $scope: $scope });
      for (var i=0; i<3; i++) {
        $scope.addOption();
      }
      $scope.setAnswer(1);
      $scope.deleteOption(1);
      expect($scope.answer).toEqual(1);
    });

    it('tests deleting the last option when it\'s the answer', function() {
      var $scope = {};
      var controller = $controller('multiChoiceCtrl', { $scope: $scope });
      for (var i=0; i<3; i++) {
        $scope.addOption();
      }
      $scope.setAnswer(4);
      $scope.deleteOption(4);
      expect($scope.answer).toEqual(3);
    });

    it('tests deleting the first option when it\'s the answer', function() {
      var $scope = {};
      var controller = $controller('multiChoiceCtrl', { $scope: $scope });
      for (var i=0; i<3; i++) {
        $scope.addOption();
      }
      $scope.setAnswer(0);
      $scope.deleteOption(0);
      expect($scope.answer).toEqual(0);
    });
  });

  describe('Unit tests for functions that aren\'t in controllers', function() {
    it('tests the shuffle array function found in index.js', function() {

      //Function to test:
      var shuffleArray = function(inputArray) {
        var currentIndex = inputArray.length, temporaryValue, randomIndex;
        var arrayCopy = inputArray.slice(); //Copy array by value
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;

          // And swap it with the current element.
          temporaryValue = arrayCopy[currentIndex];
          arrayCopy[currentIndex] = arrayCopy[randomIndex];
          arrayCopy[randomIndex] = temporaryValue;
        }
        return arrayCopy;
      };

      //The test:
      var originalArray = Array();
      for (var i=0; i<23; i++) {
        originalArray.push(i);
      }
      var shuffledArray = shuffleArray(originalArray);
      expect(shuffledArray).not.toEqual(originalArray);
    });
  });

  
});