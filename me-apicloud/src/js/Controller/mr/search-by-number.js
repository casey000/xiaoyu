module.exports = (function() {
    angular.module('myApp').controller('searchByNumberController', ['$scope', 'airport', 'configInfo', 'favoriteFlight', '$stateParams', '$location', 'flightInfo', '$rootScope', '$q', 'paramTransfer', '$timeout', 'filterFlightInfo', 'filterFaultFlightInfo', 'flightFaultInfo', '$filter','brand', 'umengEventIdTransform', 'server',
        function($scope, airport, configInfo, favoriteFlight, $stateParams, $location, flightInfo, $rootScope, $q, paramTransfer, $timeout, filterFlightInfo, filterFaultFlightInfo, flightFaultInfo, $filter,brand, umengEventIdTransform, server)
        {
            var that = this,total = 0;
            var scope = $scope;
            //当为true时，表示没有更多的数据。
            $scope.noMoreData = false;
            $scope.loadMore = false;
            $scope.showAdd = true;
            $scope.airportArr = [];
            $scope.airportChosen = [];
            $scope.allRelease = null;
            $scope.allUnrelease = null;
            $scope.allWarn = null;
            $scope.number = "";
            $scope.dataList = [];
            $scope.pageIndex = 1;
            $scope.pageSize = 20;
            // $scope.$watch('airportChosen',function (n,o) {
            //     console.log(n,'n')
            // });
            var lanConfig = require('../../../../i18n/lanConfig');
            //返回
            $scope.goBack = function(){
                $rootScope.go('back');
            };
            $scope.localConfig = {
                'vc': lanConfig.vc,
                'rc': lanConfig.rc
            };
            // $scope.queryJSON ={
            //     releaseStatus: '',
            //     maintenanceStatus: '',
            //     station: "",
            //     // date:new Date().getTime()
            // };

            NativeAppAPI.hideTabBar();
            // var firstFlag = true;

            //查询原因字典
            $scope.getReasonData = function(){
                server.maocGetReq('assembly/analysisDomainTypeByCode',{domainCode:"DEPLOY_REASON_TYPE"}).then(function (data) {
                    console.log("数据"+JSON.stringify(data));
                    if (data.data.statusCode === 200) {
                        $scope.allReason= data.data.data[0].DEPLOY_REASON_TYPE || [];
                        console.log("字典的数据"+JSON.stringify($scope.allReason));
                    };
                    // $rootScope.endLoading();
                }).catch(function (error) {
                    // $rootScope.endLoading();
                });
            };
            $scope.getReasonData();

            $scope.init = function (){
                $scope.queryJSON ={
                    "status":"",
                    "contract": $scope.number,
                    "station":"",
                    "pageIndex":$scope.pageIndex,
                    "pageSize":$scope.pageSize
                };
                $rootScope.startLoading();
                server.maocPostReq('receipt/list', $scope.queryJSON,true).then(function (data) {
                    if (data.data.statusCode === 200) {
                        // $scope.dataList = data.data.data || [];
                        var  getListData = data.data.data;
                        getListData = angular.forEach(getListData,function (value,key) {
                            if(value.reason){
                                value.reason = Number(value.reason)-1;
                            };
                        });

                        if(!!$scope.number){
                            // $scope.dataList = $scope.dataList.concat(getListData);
                            $scope.dataList = getListData;
                        }else {
                            $scope.dataList = [];
                        }
                        //模拟数据
                        // $scope.dataList = modeData.data || [];
                        console.log("总计数据"+JSON.stringify($scope.dataList ));
                        // if(firstFlag){
                        //     $scope.airportArr = queryAirport;
                        // }
                        // firstFlag = false
                    };
                    // if (data.data.dataSize == 0) {
                    $rootScope.endLoading();
                    // }
                }).catch(function (error) {
                    $rootScope.endLoading();
                });
            };
            $scope.init();


            $scope.stationChange = function () {
                $scope.queryJSON.station = $scope.airportChosen && $scope.airportChosen.join(',');
                $scope.init()
            };

            //点击搜索
            $scope.searchByNumber = function () {
                $scope.dataList = [];
                $scope.init()
            };

            // 下拉刷新
            scope.getNextPage = function (){setTimeout(function() {
                //首先查现在有的条目数是否小于pageSize,小于则说明搜索到的数据已经到头了
                $scope.totalPageSize = Number($scope.pageSize) * Number($scope.pageIndex);
                console.log("totalPage"+JSON.stringify($scope.totalPageSize ));
                console.log("查询到的数据"+JSON.stringify($scope.totalPageSize ));
                if($scope.dataList.length == $scope.totalPageSize){
                    $scope.pageIndex = Number($scope.pageIndex)+1;
                    console.log("执行"+JSON.stringify($scope.pageIndex ));
                    $scope.init();
                }else if($scope.dataList.length < $scope.totalPageSize){
                    //    说明数据已经到头了
                    $scope.noMoreData = true;
                    console.log("不执行");
                }
            },900)};

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
                    },
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
                        "status": "N",
                        "receiptName": "ggggg",
                        "receiptSn": "YC.SI",
                        "station": "SXZ",
                        "receiptDay": "20200515",
                        "receiptTime": "162020"
                    },
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
                        "status": "N",
                        "receiptName": "ddd",
                        "receiptSn": "YC.SI",
                        "station": "SXZ",
                        "receiptDay": "20200515",
                        "receiptTime": "163143"
                    },
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
                        "status": "N",
                        "receiptName": "ggggg",
                        "receiptSn": "YC.SI",
                        "station": "SXZ",
                        "receiptDay": "20200515",
                        "receiptTime": "162020"
                    },
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
                        "status": "N",
                        "receiptName": "ggggg",
                        "receiptSn": "YC.SI",
                        "station": "SXZ",
                        "receiptDay": "20200515",
                        "receiptTime": "162020"
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