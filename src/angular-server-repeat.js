angular.module('ServerRepeat', [])

  .directive('serverRepeat', function() {
    return {
      scope: true,
      controller: ['$scope', '$attrs', function($scope, $attrs) {
        var match                = $attrs.serverRepeat.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)$/);
        var memberIdentifier     = match[1];
        var collectionIdentifier = match[2];
        var member               = $scope[memberIdentifier] = { $$scope: $scope };
        var collection           = $scope.$parent[collectionIdentifier] || [];

        $scope.$parent[collectionIdentifier] = collection;

        $scope.$index  = collection.length;
        $scope.$first  = ($scope.$index === 0);
        $scope.$last   = false;
        $scope.$middle = false;
        $scope.$odd    = !($scope.$even = ($scope.$index&1) === 0);

        if ($scope.$first) {
          var removeWatcher = $scope.$parent.$watchCollection(collectionIdentifier, function(collection) {
            angular.forEach(collection, function(member) {
              member.$$scope.$last = (member.$$scope.$index === (collection.length - 1));
              member.$$scope.$middle = !(member.$$scope.$first || member.$$scope.$last);
            });
            removeWatcher();
          });
        }

        collection.push(member);

        this.setProperty = function(key, value) {
          member[key] = value;
        };

        this.setProperties = function(properties) {
          angular.extend(member, properties);
        };

        this.getProperty = function(key) {
          return member[key];
        };
      }]
    };
  })

  .directive('serverBind', function() {
    return {
      require: '^serverRepeat',
      restrict: 'A',
      link: function(scope, element, attrs, ngServerRepeatCtrl) {
        if (attrs.hasOwnProperty('serverRepeat')) {
          ngServerRepeatCtrl.setProperties(angular.fromJson(attrs.serverBind));
        } else {
          ngServerRepeatCtrl.setProperty(attrs.serverBind, element.text());
          element = element[0];

          scope.$watch(function() {
            return ngServerRepeatCtrl.getProperty(attrs.serverBind);
          }, function (value) {
            if (element.textContent === value) return;
            element.textContent = value === undefined ? '' : value;
          });
        }
      }
    };
  });
