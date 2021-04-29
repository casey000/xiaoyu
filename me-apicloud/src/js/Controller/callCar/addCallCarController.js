module.exports = angular.module('myApp').controller('addCallCarController',
    ['$rootScope', '$scope', '$stateParams', 'server','$localForage', 'configInfo', '$filter', 'b64ToBlob','$interval',
        function ($rootScope, $scope, $stateParams, server, $localForage, configInfo, $filter, b64ToBlob,$interval) {
            $rootScope.endLoading();
            $scope.staInfo = {station:'SZX'};

            $scope.userCode = configInfo.userCode;
            $scope.firstInit = true;
            $scope.toStation = '航站';
            (function(){
                $scope.flightHasBay = false;
                $scope.flightList = [];
                $scope.showJson = {
                    acType:'',
                    acReg:'',
                    flightNo:'',
                }
                var nowDate = new Date().getTime();
                $scope.preDay = new Date(nowDate - (24 * 60 * 60 * 1000))
                $scope.nextDay = new Date(nowDate + (24 * 60 * 60 * 1000))
                $scope.typeChnName = '';
                $scope.bdType = [
                    {
                        VALUE:1,
                        TEXT:'摆渡人员'
                    },
                    {
                        VALUE:2,
                        TEXT:'摆渡航材'
                    }
                ];
            })()
            $scope.changeType = function(data){
                if($scope.typeData.length > 0){
                    $scope.typeChnName = $scope.typeData.filter(function (res) {
                        return data == res.id;
                    })[0].taskTypeName;
                }
                $scope.showJson = {
                    acType:'',
                    acReg:'',
                    flightNo:'',
                }
                $scope.flightHasBay = false;
                for(var k in $scope.insertJson){
                    if( k == 'taskTypeId'){
                        continue;
                    }
                    $scope.insertJson[k] = ''
                }

                console.log($scope.insertJson)

            };
            $scope.$watch('staInfo.station',function (n,o) {
                // $scope.insertJson.fromStation
                (n && n.length == 3) && getTaskType(n)
            });
            function getTaskType(data) {
                $rootScope.startLoading()
                server.maocGetReq('ghsDutyTask/findAllTaskMainType',{airportCode:angular.uppercase(data)}).then(function (res) {
                    if(res.data.statusCode == 200){
                        $scope.typeData = res.data.data[0].dutyList || [];
                    }else{
                        $scope.typeData =  [];
                    }
                    $rootScope.endLoading()
                }).catch(function (err) {
                    $rootScope.endLoading()
                    console.log(err)
                })
            }
            // getTaskType('SZX');
            $scope.keyEvent = function (event) {
                if (event.keyCode === 13) {
                    $scope.clickBtnSearch();
                }
            }
            $scope.clickBtnSearch = function () {
                if ($scope.searchVal.trim() != '') {
                    searchInfo();
                } else {
                    alert("搜索内容不能为空");
                }
            };

            function searchInfo() {
                $scope.firstInit = false;
                $rootScope.startLoading()
                server.maocGetReq('ghsDutyTask/listFlightInfo',{airportCode:angular.uppercase($scope.staInfo.station),flightNo:$scope.searchVal,startDate:$scope.preDay.getTime(),endDate:$scope.nextDay.getTime()}).then(function (res) {
                    if(res.data.statusCode == 200){
                        $scope.flightList = res.data.data|| [];
                    }else{
                        $scope.flightList =  [];
                    }
                    $rootScope.endLoading();
                }).catch(function (err) {
                    $rootScope.endLoading();
                    console.log(err)
                })
            }
            $scope.toChooseFlight = function(){
                if(!$scope.staInfo.station){
                    alert("请先选择航站");
                    return
                }
                if($scope.staInfo.station && $scope.staInfo.station.length != 3){
                    alert("请选择正确航站三字码");
                    return
                }
                if(!$scope.typeChnName){
                    alert("请先选择任务类型");
                    return
                }
                $scope.chooseFlight = true
            }

            $scope.toDet = function (item) {
                $scope.flightHasBay = false;
                $scope.insertJson.flightId = item.id;
                if($scope.typeChnName.indexOf('撤离任务') != -1){
                    $scope.insertJson.startLocation = item.bay || '';
                }else{
                    $scope.insertJson.endLocation = item.bay || '';
                }
                item.bay && ($scope.flightHasBay = true)
                $scope.showJson.acType = item.acType;
                $scope.showJson.acReg = item.acReg;
                $scope.showJson.flightNo = item.flightNo;
                $scope.chooseFlight = false;
            }

            $scope.submit = function () {
                $scope.myForm.$valid = false;
                $scope.insertJson.airportCode = angular.uppercase($scope.staInfo.station);
                if($scope.insertJson.taskTypeId == "473" && !$scope.insertJson.ferryType){
                    alert("摆渡车类型必选");
                    $scope.myForm.$valid = true;
                    return
                }
                if($scope.insertJson.personNum && $scope.insertJson.ferryType == 1){
                    var reg = /^[0-9]+$/ ;
                    if(!reg.test($scope.insertJson.personNum)){
                        alert("输入人数非法");
                        $scope.myForm.$valid = true;
                        return
                    }
                }
                if($scope.insertJson.ferryType == 1){
                    if($scope.insertJson.personNum.toString() == 0 ||  $scope.insertJson.personNum.toString() == 00 ){
                        alert("输入人数不能为0");
                        $scope.myForm.$valid = true;
                        return
                    }
                }
                $rootScope.startLoading();
                server.maocPostReq('ghsDutyTask/createDutyTaskMain',$scope.insertJson,true).then(function (res) {
                    if(res.status == 200){
                        api.alert({
                            msg: '叫车成功'
                        },function(ret, err) {
                            $rootScope.go('back');
                        });
                    }
                    $rootScope.endLoading();
                }).catch(function (err) {
                    $rootScope.endLoading();
                    $scope.myForm.$valid = true;
                    console.log(err)
                })
            }




        }
    ]);