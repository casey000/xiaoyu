module.exports = angular.module('myApp').controller('callCarListController',
    ['$rootScope', '$scope', '$stateParams', 'server','$localForage', 'configInfo', '$filter', 'b64ToBlob','$interval',
        function ($rootScope, $scope, $stateParams, server, $localForage, configInfo, $filter, b64ToBlob,$interval) {
            $scope.userCode = configInfo.userCode;
            $scope.initList = function (){
                // $scope.svList = [];

                !$scope.pullToRefreshActive  && $rootScope.startLoading();

                server.maocGetReq('ghsDutyTask/listMyTaskMain').then(function (respon) {
                    if(respon.data.statusCode == 200) {
                        $scope.svList = respon.data.data;
                        $scope.pullToRefreshActive = false;
                    }
                    if(respon.data.statusCode == 204) {
                        $scope.svList = [];
                        $scope.pullToRefreshActive = false;
                    }

                    $rootScope.endLoading();
                }).catch(function (err) {
                    $scope.pullToRefreshActive = false;
                    $rootScope.endLoading();
                })
            };
            $scope.initList()

        }
    ]);