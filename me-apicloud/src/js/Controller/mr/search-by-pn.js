module.exports = (function() {
    angular.module('myApp').controller('searchByPnController', ['$scope', 'airport', 'configInfo', 'favoriteFlight', '$stateParams', '$location', 'flightInfo', '$rootScope', '$q', 'paramTransfer', '$timeout', 'filterFlightInfo', 'filterFaultFlightInfo', 'flightFaultInfo', '$filter','brand', 'umengEventIdTransform', 'server',
        function($scope, airport, configInfo, favoriteFlight, $stateParams, $location, flightInfo, $rootScope, $q, paramTransfer, $timeout, filterFlightInfo, filterFaultFlightInfo, flightFaultInfo, $filter,brand, umengEventIdTransform, server)
        {
            $scope.allDataList = [];
            $scope.dataList = [];
            $scope.inputPn =  "";
            $scope.station = $stateParams.station;
            //当为true时，表示没有更多的数据。
            $scope.noMoreData = false;
            $scope.workOrderId = $stateParams.workOrderId;
            var lanConfig = require('../../../../i18n/lanConfig');

            //返回
            $scope.goBack = function(){
                $rootScope.go('back');
            };

            //初始化
            $scope.init = function (){
                $scope.queryJSON ={
                    "workOrderId":$scope.workOrderId,
                    "page":1,
                    "rows":100
                };
                $rootScope.startLoading();
                server.maocPostReq('issue/pageList ', $scope.queryJSON,true).then(function (data) {
                    console.log("查询到的数据"+JSON.stringify(data));
                    if (data.data.statusCode === 200) {
                        console.log("查询的参数"+JSON.stringify($scope.queryJSON));
                        $scope.allDataList = data.data.data;
                        $scope.dataList =  [];
                        //模拟数据
                        // $scope.dataList = modeData.data || [];
                        console.log("赋值到页面的数据"+JSON.stringify($scope.dataList ));
                    };
                    // if (data.data.dataSize == 0) {
                    $rootScope.endLoading();
                    // }
                }).catch(function (error) {
                    $rootScope.endLoading();
                });
            };
            $scope.init();

//件号模糊过滤
            $scope.selectByPn = function () {
                if(!!$scope.inputPn){
                    var list = $scope.allDataList;
                    var keyWord = $scope.inputPn;
                    var arr = [];
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].pn.indexOf(keyWord) >= 0) {
                            arr.push(list[i]);
                        }
                    }
                    $scope.dataList = arr || [];
                }else {
                    $scope.dataList = [];
                }

            };


        }])
})()