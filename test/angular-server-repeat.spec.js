/* jshint expr: true */

describe('serverRepeat', function () {
  'use strict';

  var element, $scope, $compile;

  beforeEach(module('ServerRepeat'));

  beforeEach(function() {
    inject(function($rootScope, _$compile_){
      $scope = $rootScope.$new();
      $compile = _$compile_;
    });
  });

  function compile(html) {
    element = angular.element(html);
    $compile(element)($scope);
    $scope.$digest();
  }

  function $(selector) {
    return jQuery(selector, element);
  }

  var html =
    '<ul>' +
      '<li server-repeat="todo in todos">' +
        '<p>Title 1</p>' +
        '<p>Description 1</p>' +
      '</li>' +
      '<li server-repeat="todo in todos">' +
        '<p>Title 2</p>' +
        '<p>Description 2</p>' +
      '</li>' +
      '<li server-repeat="todo in todos">' +
        '<p>Title 3</p>' +
        '<p>Description 3</p>' +
      '</li>' +
    '</ul>';

  it('creates an array in the parent scope with the name of the collection', function() {
    compile(html);
    expect($scope.todos).to.be.instanceOf(Array);
    expect($scope.todos).to.have.length(3);
  });

  it('keeps a reference to the scope as a member property', function(done) {
    compile(html);

    $scope.todos.forEach(function(todo, i) {
      var el = $('li:eq(' + i + ')');
      expect(todo.$$scope).to.eq(el.scope());
      if (i === 2) done();
    });
  });

  describe('with nested serverBind', function() {
    var html =
      '<ul>' +
        '<li server-repeat="todo in todos">' +
          '<p server-bind="title">Title 1</p>' +
          '<p server-bind="description">Description 1</p>' +
        '</li>' +
        '<li server-repeat="todo in todos">' +
          '<p server-bind="title">Title 2</p>' +
          '<p server-bind="description">Description 2</p>' +
        '</li>' +
        '<li server-repeat="todo in todos">' +
          '<p server-bind="title">Title 3</p>' +
          '<p server-bind="description">Description 3</p>' +
        '</li>' +
      '</ul>';

    beforeEach(function() {
      compile(html);
    });

    it('set the member properties', function(done) {
      $scope.todos.forEach(function(todo, i) {
        var index = i + 1;

        expect(todo).to.have.property('title', 'Title ' + index);
        expect(todo).to.have.property('description', 'Description ' + index);

        if (i === 2) done();
      });
    });

    it('exposes the iteration properties in the child scope', function() {
      var scope = $('li:first').scope();
      expect(scope.$first).to.be.true;
      expect(scope.$last).to.be.false;
      expect(scope.$middle).to.be.false;
      expect(scope.$even).to.be.true;
      expect(scope.$odd).to.be.false;

      scope = $('li:eq(1)').scope();
      expect(scope.$first).to.be.false;
      expect(scope.$last).to.be.false;
      expect(scope.$middle).to.be.true;
      expect(scope.$even).to.be.false;
      expect(scope.$odd).to.be.true;

      scope = $('li:last').scope();
      expect(scope.$first).to.be.false;
      expect(scope.$last).to.be.true;
      expect(scope.$middle).to.be.false;
      expect(scope.$even).to.be.true;
      expect(scope.$odd).to.be.false;
    });

    describe('when a member property changes', function() {

      it('updates the html', function() {
        $scope.todos[0].title = "new title";
        $scope.$digest();
        expect($('li:first > p:first')).to.have.text('new title');
      });

    });
  });

  describe('with inline serverBind', function() {
    var html =
      '<ul>' +
        '<li server-repeat="todo in todos" server-bind=\'{"title":"Title 1","description":"Description 1"}\'>' +
        '</li>' +
        '<li server-repeat="todo in todos" server-bind=\'{"title":"Title 2","description":"Description 2"}\'>' +
        '</li>' +
        '<li server-repeat="todo in todos" server-bind=\'{"title":"Title 3","description":"Description 3"}\'>' +
        '</li>' +
      '</ul>';

    it('set the member properties', function(done) {
      compile(html);

      $scope.todos.forEach(function(todo, i) {
        var index = i + 1;

        expect(todo).to.have.property('title', 'Title ' + index);
        expect(todo).to.have.property('description', 'Description ' + index);

        if (i === 2) done();
      });
    });
  });
});
