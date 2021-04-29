
module.exports = function($rootScope, $scope, $location,$localForage,$stateParams,configInfo,$filter,airport,paramTransfer,mefilterFlightInfo,meList) {

    $rootScope.endLoading();
    $scope._4codeCityName = airport._4codeCityName;
    $scope._acTypeForFlightNo = airport._acTypeForFlightNo;
    $scope._4codeTo3code = airport._4codeTo3code;
    $scope._3codeCityName = airport._3codeCityName;
    //当为true时，表示没有更多的数据。
    // $scope.noMoreData = false;

    var lanConfig = require('../../../../i18n/lanConfig');
    $scope.lanConfig = {
        'inputAirport': lanConfig.inputAirport,
        'inputFlightNo': lanConfig.inputFlightNo,
        'inputAcReg': lanConfig.inputAcReg
    };
    $scope.searchPlaceholder = $scope.lanConfig.inputAirport;

    if(Number($stateParams.time)) {
        $scope.flightDate = new Date(Number($stateParams.time));
        paramTransfer.set({
            time: $scope.flightDate.getTime()
        });
    }
    $scope.locationAirport = $scope._4codeTo3code[configInfo.airport()];

    $scope.filterFlight = function (params) {
        mefilterFlightInfo.setFilters(angular.copy(params,{}));

    };

    function initAllFilerInfos() {
        $scope.airports = [];
        $scope.flightNos = [];
        $scope.acRegs = [];
        var savedAirpors = [];
        var savedAcregs = [];

        meList.flights.forEach( function(item) {

            var arrivalAirport = {airport4Code:item.arrivalAirport3Code, airportName:$scope._3codeCityName[item.arrivalAirport3Code]};
            var departureAirport = {airport4Code:item.departureAirport3Code, airportName:$scope._3codeCityName[item.departureAirport3Code]};
            if(-1 == savedAirpors.indexOf(item.arrivalAirport3Code) && typeof item.arrivalAirport3Code != 'undefined'){
                savedAirpors.push(item.arrivalAirport3Code);
                $scope.airports.push(arrivalAirport);
            }

            if(-1 == savedAirpors.indexOf(item.departureAirport3Code) && typeof item.arrivalAirport3Code != 'undefined'){
                savedAirpors.push(item.departureAirport3Code);
                $scope.airports.push(departureAirport);
            }

            if (item.station) {
                -1 == savedAirpors.indexOf(item.station)?(
                    savedAirpors.push(item.station),
                    $scope.airports.push({airport4Code:item.station, airportName:$scope._3codeCityName[item.station]})
                ):'';
            }

            -1 != $scope.flightNos.indexOf(item.flightNo)?'':$scope.flightNos.push(item.flightNo);

            if (angular.isDefined(item.acType) || item.acType) {
                // -1 != $scope.acRegs.indexOf(item.acReg)?'':$scope.acRegs.push(item.acReg);
                var acTypeReg = {acTypeName:item.acType, acRegName:item.acReg};
                if(-1 == savedAcregs.indexOf(item.acReg)){
                    savedAcregs.push(item.acReg);
                    $scope.acRegs.push(acTypeReg);
                }
            }else if (item.acReg){
                var acRegLong = item.acReg.replace('-','');
                var acRegToType = {acTypeName:$scope._acTypeForFlightNo[acRegLong], acRegName:item.acReg};
                if(-1 == savedAcregs.indexOf(item.acReg) && $scope._acTypeForFlightNo[acRegLong]){
                    savedAcregs.push(item.acReg);
                    $scope.acRegs.push(acRegToType);
                }
            }
        });

        initFilterArray();//获取初始化数据

        //将上次筛选的条件加入到下次筛选中
        $scope.filterAirports.forEach(function (item) {
            if(-1 == savedAirpors.indexOf(item)) {
                savedAirpors.push(item);
                $scope.airports.push({airport4Code: item, airportName: $scope._3codeCityName[item]});
            }
        });

        $scope.filterFlightnos.forEach(function (item) {
            if(-1 == $scope.flightNos.indexOf(item)){
                $scope.flightNos.push(item);
            }
        });

        $scope.filterAcregs.forEach(function (item) {
            if(-1 == savedAcregs.indexOf(item) || !savedAcregs.length){
                savedAcregs.push(item);
                $scope.acRegs.push({
                    acTypeName: $scope._acTypeForFlightNo[item.replace('-','')],

                    acRegName: item
                });
            }
        });
        initAcregs737();

        savedAirpors.sort();
        savedAcregs.sort();
        $scope.airports.sort(function (item1, item2) {
            if (item1.airport4Code && item2.airport4Code) {
                return item1.airport4Code.localeCompare(item2.airport4Code);
            }
        })
        // $scope.airports.sort();

        //本场排序
        var indexOfLocationAirport = savedAirpors.indexOf($scope.locationAirport);
        if (-1 != indexOfLocationAirport){
            savedAirpors.splice(indexOfLocationAirport,1);
            $scope.airports.splice(indexOfLocationAirport,1);
        }
        savedAirpors.unshift($scope.locationAirport);
        $scope.airports.unshift({airport4Code:$scope.locationAirport, airportName:$scope._3codeCityName[$scope.locationAirport]});


        $scope.flightNos.sort(function(item1,item2){
            return item1.localeCompare(item2);
        });
        $scope.acRegs.sort(function(item1,item2){
            return item1.acRegName.localeCompare(item2.acRegName);
        });
    };
    initAllFilerInfos();

    $scope.datetimePick = function (t) {
        var startDate = $scope.startDate;
        var endDate = $scope.endDate;
        var beginDatetime = meList.beginDatetime;
        var endDatetime = meList.endDatetime;
        if (t == startDate){
            if (angular.isDate(startDate)) {
                if (startDate.getTime() >= endDate.getTime() || endDate.getTime() - startDate.getTime()< 1*60*60*1000){
                    $rootScope.limitTip = true;
                    $rootScope.shortLimitTip = false;
                    $rootScope.limitTipContent = lanConfig.timeLimitEarly;
                    startDate = new Date(endDate.getTime() - 1*60*60*1000);
                    $scope.startDate = startDate;
                }
                else if (startDate.getTime() < beginDatetime) {
                    $rootScope.limitTip = true;
                    $rootScope.shortLimitTip = false;
                    $rootScope.limitTipContent = lanConfig.timeLimitNotIncluded;
                    startDate = new Date(beginDatetime);
                    $scope.startDate = startDate;
                }
            }
            else if (!angular.isDate(startDate)) {
                $scope.startDate = new Date(beginDatetime);
            }
        }else if (t == endDate){
            if (angular.isDate(endDate)) {
                if (startDate.getTime() >= endDate.getTime() || endDate.getTime() - startDate.getTime()< 1*60*60*1000){
                    $rootScope.limitTip = true;
                    $rootScope.shortLimitTip = false;
                    $rootScope.limitTipContent = lanConfig.timeLimitLate;
                    endDate = new Date(startDate.getTime() + 1*60*60*1000);
                    $scope.endDate = endDate;
                }
                else if (endDate.getTime() > endDatetime) {
                    $rootScope.limitTip = true;
                    $rootScope.shortLimitTip = false;
                    $rootScope.limitTipContent = lanConfig.timeLimitNotIncluded;
                    endDate = new Date(endDatetime);
                    $scope.endDate = endDate;
                }
            }
            else if (!angular.isDate(endDate)) {
                $scope.endDate = new Date(endDatetime);
            }
        }

    };

    $scope.cancelAction = function () {
        initFilterArray();
        initAcregs737();
        goBack();
        $rootScope.operate = false;
    };

    $scope.directionSwitch = function (event) {
        $scope.directionName = event.target.value;
        $scope.direction = $scope.directionName === 'noDirection' ? '' : $scope.directionName;
        console.log($scope.direction);
    };

    $scope.acTypeToReg = function (event) {
        var acTypeTabName = event.target.innerText;
        $scope.filterArray = [];
        $scope.acRegsArray = [];
        angular.copy($scope.acRegs,$scope.filterArray);

        if (-1!==acTypeTabName.indexOf('737')) {
            $scope.filterArray = $scope.filterArray.filter(function (item) {
                return (typeof item.acTypeName == 'undefined') ? false : -1 != item.acTypeName.indexOf('B73');
            });
            $scope.filterArray.forEach(function (item) {
                $scope.acRegsArray.push(item.acRegName);
            });
        }

        if (-1!==acTypeTabName.indexOf('757')) {
            $scope.filterArray = $scope.filterArray.filter(function (item) {
                return (typeof item.acTypeName == 'undefined') ? false : -1 != item.acTypeName.indexOf('B75');
            });
            $scope.filterArray.forEach(function (item) {
                $scope.acRegsArray.push(item.acRegName);
            });
        }

        if (-1!==acTypeTabName.indexOf('767')) {
            $scope.filterArray = $scope.filterArray.filter(function (item) {
                return (typeof item.acTypeName == 'undefined') ? false : -1 != item.acTypeName.indexOf('B76');
            });
            $scope.filterArray.forEach(function (item) {
                $scope.acRegsArray.push(item.acRegName);
            });
        }

        if (-1!==acTypeTabName.indexOf('747')) {
            $scope.filterArray = $scope.filterArray.filter(function (item) {
                return (typeof item.acTypeName == 'undefined') ? false : -1 != item.acTypeName.indexOf('B74');
            });
            $scope.filterArray.forEach(function (item) {
                $scope.acRegsArray.push(item.acRegName);
            });
        }
    };

    function initFilterArray() {

        $scope.activeTab = 1;
        $scope.acTypeTab = 1;
        $scope.searchText = '';
        var filterData = angular.copy(mefilterFlightInfo.filterParams,{});
        $scope.startDate = new Date((meList.beginDatetime+parseInt(filterData.filterBeginDate))||meList.beginDatetime);
        $scope.endDate = new Date((meList.endDatetime+parseInt(filterData.filterEndDate))||meList.endDatetime);
        $scope.startDateLimit = $filter('date')(meList.beginDatetime, 'yyyy-MM-ddTHH:mm');
        $scope.endDateLimit = $filter('date')(meList.endDatetime, 'yyyy-MM-ddTHH:mm');
        //初始化数组
        $scope.filterAirports = filterData.filterAirPorts;
        $scope.filterFlightnos = filterData.filterFlightNos;
        $scope.filterAcregs = filterData.filterAcRegs;
        $scope.direction = filterData.direction;
        $scope.filterBeginDate = filterData.filterBeginDate;
        $scope.filterEndDate = filterData.filterEndDate;

    }

    function initAcregs737(){
        $scope.filterArray = [];
        $scope.acRegsArray = [];
        angular.copy($scope.acRegs,$scope.filterArray);
        $scope.filterArray = $scope.filterArray.filter(function (item) {
            return (typeof item.acTypeName == 'undefined') ? false : -1 != item.acTypeName.indexOf('B73');
        })
        $scope.filterArray.forEach(function (item) {
            $scope.acRegsArray.push(item.acRegName);
        })
        // $scope.filterArray.sort(function(item1,item2){
        // 	return item1.acRegName.localeCompare(item2.acRegName)
        // });
        $scope.acRegsArray.sort(function(item1,item2){
            return item1.localeCompare(item2);
        });
    }

    //点击返回
    //返回
    $scope.goBack = function(){
        $rootScope.go('back');
    };
    window.goBack = $scope.goBack;
};

