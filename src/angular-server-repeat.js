angular.module('ServerRepeat', [])

  .directive('ngServerRepeat', function() {
    return {
      scope: true,
      controller: function($scope, $attrs) {
        var match                = $attrs.ngServerRepeat.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)$/);
        var memberIdentifier     = match[1];
        var collectionIdentifier = match[2];
        var member               = $scope[memberIdentifier] = {};

        ($scope.$parent[collectionIdentifier] = $scope.$parent[collectionIdentifier] || []).push(member);

        this.setProperty = function(key, value) {
          member[key] = value;
        };

        this.getProperty = function(key) {
          return member[key];
        };
      }
    };
  })

  .directive('ngAssign', function() {
    return {
      require: '^ngServerRepeat',
      link: function(scope, element, attrs, ngServerRepeatCtrl) {
        ngServerRepeatCtrl.setProperty(attrs.ngAssign, element.text());
        element = element[0];

        scope.$watch(function() {
          return ngServerRepeatCtrl.getProperty(attrs.ngAssign);
        }, function (value) {
          if (element.textContent === value) return;
          element.textContent = value === undefined ? '' : value;
        });
      }
    };
  });
