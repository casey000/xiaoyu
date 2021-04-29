module.exports = (function() {
    angular.module('myApp').controller('followAircraftMaterialController', ['$scope', 'airport', 'configInfo', 'favoriteFlight', '$stateParams', '$location', 'flightInfo', '$rootScope', '$q', 'paramTransfer', '$timeout', 'filterFlightInfo', 'filterFaultFlightInfo', 'flightFaultInfo', '$filter','brand', 'umengEventIdTransform', 'server',
        function($scope, airport, configInfo, favoriteFlight, $stateParams, $location, flightInfo, $rootScope, $q, paramTransfer, $timeout, filterFlightInfo, filterFaultFlightInfo, flightFaultInfo, $filter,brand, umengEventIdTransform, server)
        {
            var that = this,total = 0,entry = 1;
            var scope = $scope;
            //当为true时，表示没有更多的数据。
            $scope.noMoreData = false;
            $scope.loadMore = false;
            // alert($stateParams.fixedId);
            //设置标题，从父页面带下来
            console.log("从父页面带过来的数据"+JSON.stringify($stateParams));
            if($stateParams.flightNo){
                $scope.title = $stateParams.flightNo;
                $scope.flightId = $stateParams.flightId;
                // $rootScope.acReg = $stateParams.acReg;
            }else{
                $scope.title = "";
            }
            $scope.showAdd = true;
            if($scope.fixStatus == 'UNRELEASED'){
                $scope.showAdd = false;
            }
            var lanConfig = require('../../../../i18n/lanConfig');
            //返回
            $scope.goBack = function(){
                $rootScope.go('back');
            };
            $scope.localConfig = {
                'vc': lanConfig.vc,
                'rc': lanConfig.rc
            };
            //从维修任务进去的flightId就是查询的focFlightId
            var queryJSON ={
                focFlightId:$stateParams.flightId,
                arrivalOrDeparture:entry
            };
            $scope.dataList = [];
            $scope.entry = 1;
            NativeAppAPI.hideTabBar();
            $scope.init = function (){
                $rootScope.startLoading();
                server.maocGetReq('aviationMaterials/findAviationMaterialsByFocFlightId', queryJSON).then(function (data) {
                    console.log("接口返回的数据"+JSON.stringify(data));
                    that.requesting = false;
                    if (data.data.statusCode === 200) {
                        that.total = data.data.total;
                        // that.total = mokeData;
                        // $scope.dataList = mokeData.data[0].dataList&& $scope.dataList.concat(mokeData.data[0].dataList) || [];
                        $scope.dataList = data.data.data[0].dataList&& $scope.dataList.concat(data.data.data[0].dataList) || [];
                        $scope.entry = entry;

                        //刷新判断有无数据
                        if (Math.ceil(that.total / queryJSON.pageSize) == queryJSON.pageIndex) {
                            $scope.noMoreData = true;
                        }

                        //把随机运输的类型对应到相应的显示
                        angular.forEach($scope.dataList,function (item,index) {
                            if(item.type == "1"){
                                item.typeShow = "航材"
                            }
                            if(item.type == "2"){
                                item.typeShow = "工具"
                            }
                        });

                        //运单接收状态改变成对应的显示
                        angular.forEach($scope.dataList,function (item,index) {
                            if(item.requisitionStatus == "1"){
                                item.requisitionStatusShow = "未接收"
                            }
                            if(item.requisitionStatus == "2"){
                                item.requisitionStatusShow = "部分接收"
                            }
                            if(item.requisitionStatus == "3"){
                                item.requisitionStatusShow = "已接收"
                            }
                            if(item.requisitionStatus == "4"){
                                item.requisitionStatusShow = "机务接收"
                            }
                        });

                        //是否随机备件航材
                        angular.forEach($scope.dataList,function (item,index) {
                            if(item.ifSparePart == "1"){
                                item.ifSparePartShow = "随机备件"
                            }
                            if(item.ifSparePart == "2"){
                                item.ifSparePartShow = "随航线备件"
                            }
                        });


                        // $scope.dataList = data.data.data && $scope.dataList.concat(data.data.data) || [];

                        // $scope.dataList = mokeData;
                        // console.log("模拟的list数据"+JSON.stringify($scope.dataList));
                    }
                    // if (data.data.dataSize == 0) {
                    $rootScope.endLoading();
                    // }
                }).catch(function (error) {
                    // console.log("测试接口失败");
                    $rootScope.endLoading();
                });
            };
            $scope.init();
            //下滑获取更多的信息
            $scope.getNextPage = function () {
                if (!$scope.noMoreData && !that.requesting) {
                    if (Math.ceil(that.total / queryJSON.pageSize) > queryJSON.pageIndex) {
                        queryJSON.pageIndex++;
                        that.requesting = true; //防止在底部时同时执行nextPage
                        $scope.init();
                    } else {
                        $scope.noMoreData = true;
                    }
                }
            };
            //点击条目进入运单详情
            $scope.toDetail = function(item){
                if(item.workType == 'NRC'){
                    $rootScope.go('nrcDetail', '', {nrcId:item.cardId,status:item.status,processId:item.id})
                }
                if(item.workType == 'DEFECT'){
                    $rootScope.go('searchFault.faultClose','',{defectId: item.cardId, pt: true, defectInfo: {}, fromSearch: true})
                }
            };
            $scope.toProcess = function(id,event){
                event.stopPropagation();
                $rootScope.go(
                    'nrcfeedbak',
                    '',
                    {
                        nrcInfo:{},
                        itemId:id
                    }
                );
            };
            $scope.isList = true;
            $scope.lanZh = server.lan === 'zh-cn';
            $scope.navIdx = 1;
            //点击页签的时候
            $scope.changeMainNav = function(index){
                if(!that.requesting){
                    that.requesting = true; //防止在底部时同时执行nextPage
                }
                $scope.navIdx = index;
                $scope.noMoreData = false;
                // queryJSON.pageIndex = 1;
                if(index == 1){
                    queryJSON.arrivalOrDeparture = 1;
                    // queryJSON.arrivalOrDeparture = 1;
                    entry = 1 ;
                    $scope.dataList = [];
                    $scope.init();
                }
                if(index == 0){
                    queryJSON.arrivalOrDeparture = 0;
                    // queryJSON.arrivalOrDeparture = 0;
                   entry = 0 ;
                    $scope.dataList = [];
                    $scope.init();
                }
            };

            $scope.addNrc = function (){
                if($scope.fixStatus != "UNRELEASED"){
                    alert("工包已关闭，不能添加nrc");
                    return;
                }

                if($scope.fixedFlightId){
                    $rootScope.go('addNrc','',{fixAcreg:$scope.title,fixModel:$scope.fixModel,fixAcid:$scope.fixAcid,fixWorkId:$scope.fixWorkId})
                }else{
                    alert('请先在PC端选择航班')

                }
            };
            //把数据的状态对应其显示
            $scope.changeDataStatue = function (data) {

            }

        //    模拟数据
            var mokeData = {
                "statusCode": 200,
                "statusInfo": "OK",
                "data": [
                    {
                        "success": true,
                        "dataList": [
                            // "ifSparePart": 1,
                            {
                                "requisitionId": 62210264,
                                "flightId": 62209898,
                                "code": "SFA-2020-128",
                                "departureStation": "SZX",
                                "destinationStation": "HGH",
                                "startDate":1586120100000,
                                "endDate":1586130000000,
                                "type": 2,
                                "ifSparePart": 1,
                                "status": 5,
                                "flightRoute":"XGL-LLL",
                                "requisitionStatus": 1,
                                "boxReceivedRatio": "0/1",
                                "bulkReceivedRatio": "0/0",
                                "boxNum": 1,
                                "bulkNum": 0,
                                "totalWeight": 15,
                                "loadingPosition": "BULK",
                                "sourceFlight": {
                                    "id": 62209843,
                                    "flightNo": "O36932",
                                    "flightSect": "SZX-PEK",
                                    "flightDate": 1586102400000,
                                    "departureAirport": "SZX",
                                    "arrivalAirport": "PEK",
                                    "ifDel": 0,
                                    "status": 1,
                                    "flightType": "N",
                                    "std": 1586120100000,
                                    "sta": 1586130000000,
                                    "focFlightId": 100892618,
                                    "wbStatus": 1,
                                    "dori": "D"
                                },
                                "takeEffectDate": 1586331893779,
                                "receiveStatus": 0,
                                "amProperShips": [
                                    {
                                        "id": 62210265,
                                        "serialNumber": "SFA-2020-128",
                                        "weight": 15,
                                        "measure": "1000x2000x3000",
                                        "ifHazardous": false,
                                        "caseNo": "101",
                                        "remark": "Remark of carton",
                                        "ifDel": false,
                                        "requisitionId": 62210264,
                                        "type": 1,
                                        "boxDetails": [
                                            {
                                                "id": 62210266,
                                                "amount": 1,
                                                "partNumber": "partNo1",
                                                "ifHazardous": false,
                                                "remark": "Remark Of Carton Detail1",
                                                "ifDel": false,
                                                "parentId": 62210265,
                                                "tradeName": "品名1"
                                            }
                                        ]
                                    }
                                ]
                            },
                            //"ifSparePart": 2,
                            {
                                "requisitionId": 62210264,
                                "flightId": 62209898,
                                "code": "SFA-2020-128",
                                "departureStation": "SZX",
                                "destinationStation": "HGH",
                                "departureStationName":"XLX",
                                "destinationStationName":"GXL",
                                "type": 1,
                                "ifSparePart": 2,
                                "status": 5,
                                "requisitionStatus": 2,
                                "boxReceivedRatio": "0/1",
                                "bulkReceivedRatio": "0/0",
                                "startDate":1586120100000,
                                "endDate":1586130000000,
                                "boxNum": 1,
                                "bulkNum": 0,
                                "totalWeight": 15,
                                "loadingPosition": "BULK",
                                "sourceFlight": {
                                    "id": 62209843,
                                    "flightNo": "O36932",
                                    "flightSect": "SZX-PEK",
                                    "flightDate": 1586102400000,
                                    "departureAirport": "SZX",
                                    "arrivalAirport": "PEK",
                                    "ifDel": 0,
                                    "status": 1,
                                    "flightType": "N",
                                    "std": 1586120100000,
                                    "sta": 1586130000000,
                                    "focFlightId": 100892618,
                                    "wbStatus": 1,
                                    "dori": "D"
                                },
                                "takeEffectDate": 1586331893779,
                                "receiveStatus": 0,
                                "amProperShips": [
                                    {
                                        "id": 62210265,
                                        "serialNumber": "SFA-2020-128",
                                        "weight": 15,
                                        "measure": "1000x2000x3000",
                                        "ifHazardous": false,
                                        "caseNo": "101",
                                        "remark": "Remark of carton",
                                        "ifDel": false,
                                        "requisitionId": 62210264,
                                        "type": 1,
                                        "boxDetails": [
                                            {
                                                "id": 62210266,
                                                "amount": 1,
                                                "partNumber": "partNo1",
                                                "ifHazardous": false,
                                                "remark": "Remark Of Carton Detail1",
                                                "ifDel": false,
                                                "parentId": 62210265,
                                                "tradeName": "品名1"
                                            }
                                        ]
                                    }
                                ]
                            },
                            //"ifSparePart": 0,的单程
                            {
                                "requisitionId": 62210264,
                                "flightId": 62209898,
                                "code": "SFA-2020-128",
                                "departureStation": "SZX",
                                "destinationStation": "HGH",
                                "departureStationName":"ABC",
                                "destinationStationName":"BCD",
                                "type": 1,
                                "ifSparePart": 0,
                                "status": 5,
                                "requisitionStatus": 2,
                                "boxReceivedRatio": "0/1",
                                "bulkReceivedRatio": "0/0",
                                "boxNum": 1,
                                "bulkNum": 0,
                                "totalWeight": 15,
                                "loadingPosition": "BULK",
                                "nextFlight": {
                                    "id": 62209843,
                                    "flightNo": "O36932",
                                    "flightSect": "SZX-PEK",
                                    "flightDate": 1586102400000,
                                    "departureAirport": "SZX",
                                    "arrivalAirport": "PEK",
                                    "ifDel": 0,
                                    "status": 1,
                                    "flightType": "N",
                                    "atd": 1596102400000,
                                    "std": 1596102400000,
                                    "sta": 1586130000000,
                                    "focFlightId": 100892618,
                                    "wbStatus": 1,
                                    "dori": "D"
                                },
                                "sourceFlight": {
                                    "id": 62209843,
                                    "flightNo": "O36932",
                                    "flightSect": "SZX-PEK",
                                    "flightDate": 1586102400000,
                                    "departureAirport": "SZX",
                                    "arrivalAirport": "PEK",
                                    "ifDel": 0,
                                    "status": 1,
                                    "flightType": "N",
                                    "std": 1586120100000,
                                    "sta": 1586130000000,
                                    "focFlightId": 100892618,
                                    "wbStatus": 1,
                                    "dori": "D"
                                },
                                "takeEffectDate": 1586331893779,
                                "receiveStatus": 0,
                                "amProperShips": [
                                    {
                                        "id": 62210265,
                                        "serialNumber": "SFA-2020-128",
                                        "weight": 15,
                                        "measure": "1000x2000x3000",
                                        "ifHazardous": false,
                                        "caseNo": "101",
                                        "remark": "Remark of carton",
                                        "ifDel": false,
                                        "requisitionId": 62210264,
                                        "type": 1,
                                        "boxDetails": [
                                            {
                                                "id": 62210266,
                                                "amount": 1,
                                                "partNumber": "partNo1",
                                                "ifHazardous": false,
                                                "remark": "Remark Of Carton Detail1",
                                                "ifDel": false,
                                                "parentId": 62210265,
                                                "tradeName": "品名1"
                                            }
                                        ]
                                    }
                                ]
                            },
                            //"ifSparePart": 0,多程
                            {
                                "requisitionId": 62210264,
                                "flightId": 62209898,
                                "code": "SFA-2020-128",
                                "departureStation": "SZX",
                                "destinationStation": "HGH",
                                "type": 1,
                                "ifSparePart": 0,
                                "status": 5,
                                "requisitionStatus": 3,
                                "boxReceivedRatio": "0/1",
                                "bulkReceivedRatio": "0/0",
                                "departureStationName":"EFG",
                                "destinationStationName":"GHI",
                                "boxNum": 1,
                                "bulkNum": 0,
                                "totalWeight": 15,
                                "loadingPosition": "BULK",
                                "sourceFlight": {
                                    "id": 62209843,
                                    "flightNo": "O36932",
                                    "flightSect": "SZX-PEK",
                                    "flightDate": 1586102400000,
                                    "departureAirport": "SZX",
                                    "arrivalAirport": "PEK",
                                    "ifDel": 0,
                                    "status": 1,
                                    "flightType": "N",
                                    "atd": 1886120100000,
                                    "std": 1886120100000,
                                    "sta": 1586130000000,
                                    "focFlightId": 100892618,
                                    "wbStatus": 1,
                                    "dori": "D"
                                },
                                "takeEffectDate": 1586331893779,
                                "receiveStatus": 0,
                                "amProperShips": [
                                    {
                                        "id": 62210265,
                                        "serialNumber": "SFA-2020-128",
                                        "weight": 15,
                                        "measure": "1000x2000x3000",
                                        "ifHazardous": false,
                                        "caseNo": "101",
                                        "remark": "Remark of carton",
                                        "ifDel": false,
                                        "requisitionId": 62210264,
                                        "type": 1,
                                        "boxDetails": [
                                            {
                                                "id": 62210266,
                                                "amount": 1,
                                                "partNumber": "partNo1",
                                                "ifHazardous": false,
                                                "remark": "Remark Of Carton Detail1",
                                                "ifDel": false,
                                                "parentId": 62210265,
                                                "tradeName": "品名1"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "dataSize": 1,
                "returnDate": 1586507637381
            }


        }])
})()