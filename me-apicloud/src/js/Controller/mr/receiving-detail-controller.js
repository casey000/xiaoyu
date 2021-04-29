module.exports = (function() {
    angular.module('myApp').controller('receivingDetailController', ['$scope', 'airport', 'configInfo', 'favoriteFlight', '$stateParams', '$location', 'flightInfo', '$rootScope', '$q', 'paramTransfer', '$timeout', 'filterFlightInfo', 'filterFaultFlightInfo', 'flightFaultInfo', '$filter','brand', 'umengEventIdTransform', 'server',
        function($scope, airport, configInfo, favoriteFlight, $stateParams, $location, flightInfo, $rootScope, $q, paramTransfer, $timeout, filterFlightInfo, filterFaultFlightInfo, flightFaultInfo, $filter,brand, umengEventIdTransform, server)
        {
            var that = this,total = 0;
            var lanConfig = require('../../../../i18n/lanConfig');
            console.log("父页面带来的数据"+JSON.stringify($stateParams.orderItem));
            $scope.dataList = {
            };
            $scope.shelf = "";

//返回
            $scope.goBack = function(){
                $rootScope.go('back');
            };

//初始化
            $scope.init = function (){
                // var url = 'receipt/selectByContract/'+$stateParams.orderNo+"/"+$stateParams.orderItem;
                $rootScope.startLoading();
                server.maocGetReq('receipt/selectByContract/'+$stateParams.orderNo+"/"+$stateParams.orderItem).then(function (data) {
                    if (data.data.statusCode === 200) {
                        $scope.dataList = data.data.data[0] || {};
                        //模拟数据
                        // $scope.dataList = modeData.data || [];
                        console.log("查询到的数据"+JSON.stringify($scope.dataList ));

                    };
                    $rootScope.endLoading();
                }).catch(function (error) {
                    $rootScope.endLoading();
                });
            };
            $scope.init();

//提交
            $scope.disabledFlage = false;
            $scope.submitMr =function(mrInfo){
                //提交参数
                $scope.queryJSON ={
                    "orderNo": $stateParams.orderNo,
                    "orderItem":$stateParams.orderItem,
                    "shelf": $scope.dataList.shelf ||""
                };
                $scope.disabledFlage = true;
                $rootScope.confirmInfo = "确定要提交吗？";
                $rootScope.confirmShow = true;
                $rootScope.confirmOk = function(){
                    $rootScope.confirmShow = false;
                    $rootScope.startLoading();
                    server.maocPostReq('receipt/confirm', $scope.queryJSON,true).then(function (data) {
                        console.log("查询到的数据"+JSON.stringify(data));
                        if (data.data.statusCode === 200) {
                            alert("提交成功");
                        };
                        $rootScope.endLoading();
                        $rootScope.go('back');
                    }).catch(function (error) {
                        $rootScope.endLoading();
                        alert("提交失败："+error);
                        $scope.disabledFlage = false;
                    });
                };
                $rootScope.confirmCancel = function(){
                    $rootScope.confirmShow = false;
                    $scope.disabledFlage = false;
                }
                };

//    模拟数据
            var modeData = {
                "statusCode": 200,
                "statusInfo": "OK",
                "data": [
                    {
                        "id": "0080000870000010",
                        "contract": "UB20000291",
                        "contractItem": "00010",
                        "orderNo": "0080000870",
                        "orderItem": "000010",
                        "pn": "007F3113-1",
                        "batchNo": "1911209960",
                        "planQty": 5,
                        "unit": "EA",
                        "sn":"45454545",
                        "reason": "备件补充",
                        "status": "Y",
                        "receiptName": "Tom",
                        "receiptSn": "YC.SI",
                        "station": "SXZ",
                        "receiptDay": "20200515",
                        "receiptTime": "155114"
                    }
                ],
                "dataSize": 3,
                "returnDate": 1590456791433,
                "total": 3,
                "pageIndex": 1,
                "pageSize": 10
            }

        }])
})()