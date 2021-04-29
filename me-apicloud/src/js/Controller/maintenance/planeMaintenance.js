module.exports = (function() {
    angular.module('myApp').controller('planeMaintenanceController', ['$scope', 'airport', 'configInfo', 'favoriteFlight', '$stateParams', '$location', 'flightInfo', '$rootScope', '$q', 'paramTransfer', '$timeout', 'filterFlightInfo', 'filterFaultFlightInfo', 'flightFaultInfo', '$filter','brand', 'umengEventIdTransform', 'server',
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
            $scope.queryJSON ={
                releaseStatus: '',
                maintenanceStatus: '',
                station: "",
                // date:new Date().getTime()
            };

            NativeAppAPI.hideTabBar();
            var firstFlag = true;
            $scope.$on('$destroy', function() {
                OPENAPI.closeBoard();
            });
            $scope.init = function (){
                $scope.dataList = [];
                OPENAPI.openBoard();
                $rootScope.startLoading();
                server.maocPostReq('fleetInfo/getlistFleetInfo', $scope.queryJSON,true).then(function (data) {
                    if (data.data.statusCode === 200) {
                        $scope.dataList = data.data.data || [];
                        var queryAirport = [],allRelease = 0,allUnrelease  = 0,allWarn  = 0;
                        for(var i in $scope.dataList){
                            if(firstFlag){
                                if(queryAirport.indexOf($scope.dataList[i].station) < 0 && $scope.dataList[i].station && $scope.dataList[i].station != '-'){
                                    queryAirport.push($scope.dataList[i].station)
                                };
                            }
                            if($scope.dataList[i].releaseStatus == 'RELEASED'){
                                allRelease++;
                            }
                            if($scope.dataList[i].releaseStatus == 'UNRELEASED'){
                                allUnrelease++;
                                if($scope.dataList[i].isNoGo == 'y'){
                                    allWarn ++;
                                    continue;
                                }else if($scope.dataList[i].overTime){
                                    allWarn ++;
                                }
                            };

                            if($scope.dataList[i].maintenanceStatus.indexOf('Po') != -1){
                                if(!$scope.dataList[i].nowToOnBlockOverFifteen){
                                    //小于15分钟
                                    $scope.dataList[i].apu = ''
                                }else{
                                    // 大于15分钟
                                    if(!$scope.dataList[i].hasApu){
                                        //无记录
                                        $scope.dataList[i].apu = '未记录APU'
                                    }else{

                                        if($scope.dataList[i].apuOverTime || !$scope.dataList[i].apuClose){
                                            $scope.dataList[i].apu = 'APU超时'
                                        }
                                        if(!$scope.dataList[i].apuOverTime  && $scope.dataList[i].apuClose){
                                            $scope.dataList[i].apu = ''
                                        }
                                    }
                                }
                            }
                            if($scope.dataList[i].maintenanceStatus.indexOf('Pr') != -1){
                                if(!$scope.dataList[i].hasApu){
                                    $scope.dataList[i].apu = ''

                                }else{

                                    if($scope.dataList[i].apuAdvance) {
                                        $scope.dataList[i].apu = 'APU提前开启'
                                    }

                                    else{
                                        $scope.dataList[i].apu = ''

                                    }
                                }
                            }


                        };
                        if(firstFlag){
                            $scope.airportArr = queryAirport;
                        }
                        // console.log($scope.airportArr);
                        $scope.allRelease = allRelease;
                        $scope.allUnrelease = allUnrelease;
                        $scope.allWarn = allWarn;
                        firstFlag = false
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
            }
        }])
})()