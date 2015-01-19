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

        controller.setPropertyKey(ngServerRepeatCtrl.memberIdentifier);

        ngServerRepeatCtrl.addMember(controller.getMember());
      },
      controller: function($scope) {
        var member = {};

        this.getMember = function() {
          return member;
        };

        this.setProperty = function(key, value) {
          member[key] = value;
        };

        this.setPropertyKey = function(propertyKey) {
          $scope[propertyKey] = member;
        };
      }
    };
  })

  .directive('ngAssign', function() {
    return {
      require: '^ngMember',
      link: function(scope, element, attrs, ngMemberCtrl) {
        ngMemberCtrl.setProperty(attrs.ngAssign, element.text());
      }
    };
  });
