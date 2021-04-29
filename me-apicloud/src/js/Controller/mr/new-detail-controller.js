module.exports = angular.module('myApp').controller('mrNewDetailController',
    ['$rootScope', '$scope', '$stateParams', 'server', '$localForage', 'configInfo',
        function ($rootScope, $scope, $stateParams, server, $localForage, configInfo) {
            var mrId = $stateParams.mrId;
            var station = $stateParams.station;
            var storeLoc = $stateParams.storeLoc||"";
            $scope.mrDetail = {};
            $rootScope.loading = false;
            //从服务器获取数据
            if (mrId) {
                $rootScope.startLoading();
                server.maocGetReq('mr/findAirmaterialByItemNumAndStation', {
                    itemNum: mrId,
                    station: station,
                    storeLoc:storeLoc
                }).then(function (data) {
                    if (200 === data.status) {
                        $scope.mrDetail = data.data.data[0];
                        $rootScope.endLoading();
                    }
                }).catch(function (error) {
                    $rootScope.endLoading();
                    return error;
                });
            }

            //点击返回
            $scope.goBack = function () {
                $scope.$on('$locationChangeSuccess', function (event, newUrl) {
                    $rootScope.endLoading();
                });
                $rootScope.isMrList = true;
                $rootScope.go('back');
            }
            window.goBack = $scope.goBack;
        }
    ]);