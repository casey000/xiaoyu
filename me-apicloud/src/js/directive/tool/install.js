angular.module('myApp')
    .directive('ccInstall', ['$rootScope', '$filter',
        function ($rootScope, $filter) {
            return {
                restrict: "E",
                templateUrl: "tool/cc-install.html",
                replace: true,
                transclude: true,
                link: link,
                scope: {
                    submit: '&',
                    source: '='
                }
            };

            function link($scope) {

            }
        }]);
