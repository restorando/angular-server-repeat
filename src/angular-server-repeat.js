angular.module('ServerRepeat', [])

  .directive('ngServerRepeat', function() {
    return {
      controller: function($scope, $attrs) {
        var match = $attrs.ngServerRepeat.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)$/);

        this.memberIdentifier = match[1];
        this.collectionIdentifier = match[2];

        var collection = $scope[this.collectionIdentifier] = [];

        this.addMember = function(member) {
          collection.push(member);
        };
      }
    };
  })

  .directive('ngMember', function() {
    return {
      require: ['^ngServerRepeat', 'ngMember'],
      scope: true,
      link: function(scope, element, attrs, controllers) {
        var ngServerRepeatCtrl = controllers[0],
            controller         = controllers[1];

        controller.exposeToScope(ngServerRepeatCtrl.memberIdentifier);

        if (attrs.ngMember) {
          controller.setProperties(angular.fromJson(attrs.ngMember));
        }

        ngServerRepeatCtrl.addMember(controller.getMember());
      },
      controller: function($scope) {
        var member = {};

        this.getMember = function() {
          return member;
        };

        this.getProperty = function(key) {
          return member[key];
        };

        this.setProperty = function(key, value) {
          member[key] = value;
        };

        this.setProperties = function(properties) {
          angular.extend(member, properties);
        };

        this.exposeToScope = function(scopeVariable) {
          $scope[scopeVariable] = member;
        };
      }
    };
  })

  .directive('ngAssign', function() {
    return {
      require: '^ngMember',
      link: function(scope, element, attrs, ngMemberCtrl) {
        ngMemberCtrl.setProperty(attrs.ngAssign, element.text());
        element = element[0];

        scope.$watch(function() {
          return ngMemberCtrl.getProperty(attrs.ngAssign);
        }, function (value) {
          if (element.textContent === value) return;
          element.textContent = value === undefined ? '' : value;
        });
      }
    };
  });
