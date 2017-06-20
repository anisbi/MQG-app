
describe("A suite", function() {
  it("contains spec with an expectation", function() {
    var a = "anis"
    expect(a).toBe("anis");
  });
});

describe("Multi_choice controller", function() {
  beforeEach(module('qmaker'));

  var $controller;
  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  }));

  describe('$scope.addOption', function() {
    it('Adds an option to the list of options', function() {
      var $scope = {};
      var controller = $controller('multiChoiceCtrl', {$scope: $scope});
      expect($scope.question).toBe('Hello');
    });
  });
});