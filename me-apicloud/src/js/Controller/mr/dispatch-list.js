module.exports = (function() {
    angular.module('myApp').controller('dispatchListController', ['$scope', 'airport', 'configInfo', 'favoriteFlight', '$stateParams', '$location', 'flightInfo', '$rootScope', '$q', 'paramTransfer', '$timeout', 'filterFlightInfo', 'filterFaultFlightInfo', 'flightFaultInfo', '$filter','brand', 'umengEventIdTransform', 'server',
        function($scope, airport, configInfo, favoriteFlight, $stateParams, $location, flightInfo, $rootScope, $q, paramTransfer, $timeout, filterFlightInfo, filterFaultFlightInfo, flightFaultInfo, $filter,brand, umengEventIdTransform, server)
        {
            var that = this,total = 0;
            var scope = $scope;
            $scope.dataList = [];
            $scope.allDataList = [];
            $scope.station = $stateParams.station;
            console.log("父页面带来的数据"+JSON.stringify($stateParams));

            //当为true时，表示没有更多的数据。
            $scope.noMoreData = false;
            $scope.pageIndex = 1;
            $scope.pageSize = 10;
            $scope.status = "Y";
            $scope.selectByStatuesData = [];
            $scope.selectByTypeData = [];
            $scope.mrInfo={
                status: 'open',
                fileNumber:[],
                fileType:[]
            };
            $scope.airportChosen = [];
            $scope.fileTypeChosen = [];
            $scope.workOrderId = $stateParams.workOrderId;
            console.log("workOrderId数据"+JSON.stringify($stateParams.workOrderId));
            var lanConfig = require('../../../../i18n/lanConfig');
            //返回
            $scope.goBack = function(){
                $rootScope.go('back');
            };
            var firstFlag = true;
            $scope.init = function (){
                $scope.queryJSON ={
                    "workOrderId":$scope.workOrderId,
                    "page":1,
                    "rows":200
                };
                $rootScope.startLoading();
                server.maocPostReq('issue/pageList ', $scope.queryJSON,true).then(function (data) {
                    // console.log("查询到的数据"+JSON.stringify(data));
                    if (data.data.statusCode === 200) {
                        // console.log("查询的参数"+JSON.stringify($scope.queryJSON));
                        $scope.allDataList = data.data.data;
                        $scope.dataList = $scope.allDataList || [];
                        //第一次加载
                        if(firstFlag){
                            $scope.pushFileNumber();
                            $scope.pushFileType();
                            $scope.selectByTypeNumberStatue();
                            firstFlag = false;
                        };
                        // $scope.dataList = $scope.dataList.concat(data.data.data);
                        //模拟数据
                        // $scope.dataList = modeData.data || [];
                    };
                    // if (data.data.dataSize == 0) {
                    $rootScope.endLoading();
                    // }
                }).catch(function (error) {
                    $rootScope.endLoading();
                });
            };
            $scope.init();

//把所有的文件编号放到下拉列表
            $scope.pushFileNumber = function () {
                var fileNumber=[] ;
                for(var i in $scope.allDataList) {
                    //只在第一次把数据写入
                        //如果FileNumber没有，且数据里面有,重复过滤
                        if ($scope.allDataList[i].workNumber &&  fileNumber.indexOf($scope.allDataList[i].workNumber) < 0 ) {
                            fileNumber.push($scope.dataList[i].workNumber)
                        };
                };
                $scope.mrInfo.fileNumber = fileNumber;
                // firstFlag = false;
            };

//联动过滤（文件编号，类型，状态都一起搜索）
            $scope.selectByTypeNumberStatue = function(){
                $scope.dataList = $scope.selectByStatuesCallBack($scope.mrInfo.status,$scope.selectByTypeCallBack($scope.fileTypeChosen,$scope.selectByNumberCallBack($scope.airportChosen,$scope.allDataList)));
            };

//文件编号  number:选择的编号    listdata:进行筛选的数据   callback:回执
            $scope.selectByNumberCallBack = function(number,listdata){
                var selectListData = [];
                if(!!number && number.length != 0){
                        angular.forEach(listdata, function(value, key){
                            if(!!value){
                                for(var i=0;i<number.length;i++){
                                    if(value.workNumber == number[i]){
                                        selectListData.push(value);
                                    }
                                }
                            }
                        });
                }else {
                    selectListData = listdata;
                };
                return selectListData;
            };

            $scope.selectByTypeCallBack = function(types,listdata){
                var selectListData = [];
                if(!!types && types.length != 0){
                    angular.forEach(listdata, function(value, key){
                        if(!!value){
                            for(var i=0;i<types.length;i++){
                                if(value.workType == types[i]){
                                    selectListData.push(value);
                                }
                            }
                        }
                    });
                }else {
                    selectListData = listdata;
                };
                return selectListData;
            };

            $scope.selectByStatuesCallBack = function(statues,listdata){
                var selectListData = [];
                angular.forEach(listdata, function(value, key){
                    if(!!value){
                        //如果是开放的
                        if(value.status == true && statues == "open" ){
                            selectListData.push(value);
                        }else if(value.status == false && statues == "close" ){
                            selectListData.push(value);
                        }else if( $scope.mrInfo.status == "" ){
                            selectListData.push(value);
                        }
                    }
                });
                return selectListData;
            };

//把所有的文件类型放到下拉列表
            $scope.pushFileType = function () {
                var FileType=[] ;
                for(var i in $scope.allDataList) {
                    //只在第一次把数据写入
                    //如果workType没有，且数据里面有
                    if ($scope.allDataList[i].workType &&  FileType.indexOf($scope.allDataList[i].workType) < 0 ) {
                        FileType.push($scope.dataList[i].workType)
                    };
                };
                $scope.mrInfo.fileType = FileType;
            };



        }])
})()