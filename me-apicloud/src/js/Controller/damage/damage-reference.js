module.exports = angular.module('myApp').controller('damageReferenceController',
    ['$rootScope', '$scope', 'server', 'configInfo', 'airport', '$stateParams','$localForage',
        function($rootScope, $scope, server, configInfo, airport,$stateParams,$localForage) {
            $rootScope.endLoading();
            var type = $stateParams.type;
            $scope.title = type==1 ? '附件':'损伤二维码';
            $scope.data = $stateParams.info;
        }
    ]);