module.exports = function ($scope, airport, paramTransfer, flightInfo,filterFlightInfo, favoriteFlight, $rootScope,configInfo,$stateParams,$filter, umengEventIdTransform) {
    umengEventIdTransform.umengSaveCoustomEvent(umengEventIdTransform.custom_Event.clickFlightFilterButton, {userCode: configInfo.user})
    var lanConfig = require('../../../../i18n/lanConfig');

    NativeAppAPI.hideTabBar();
    $rootScope.endLoading();
    $scope._4codeCityName = airport._4codeCityName;
    $scope._acTypeForFlightNo = airport._acTypeForFlightNo;
    $scope.lanConfig = {
        'inputAirport': lanConfig.inputAirport,
        'inputFlightNo': lanConfig.inputFlightNo,
        'inputAcReg': lanConfig.inputAcReg,
        'inputAbnormal': lanConfig.inputAbnormal,
        'inputReason': lanConfig.inputReason,

    };
    $scope.searchPlaceholder = $scope.lanConfig.inputAirport;

    $scope.locationAirport = configInfo.airport();
    if (Number($stateParams.time)) {
        $scope.flightDate = new Date(Number($stateParams.time));
        paramTransfer.set({time:$scope.flightDate.getTime()});
    }

    $scope.filterFlight = function (params) {
        filterFlightInfo.setFilters(angular.copy(params,{}));
    };


    function initAllFilerInfos(){
        $scope.airports = [];
        $scope.flightNos = [];
        $scope.acRegs = [];
        $scope.abnormalFlightNos= [];
        $scope.delayReasons = [];


        var savedAirpors = [];
        var savedAcregs = [];
        // console.log('flights2===='+ JSON.stringify(flightInfo.flights));

        flightInfo.flights.forEach( function(item) {

            var arrivalAirport = {airport4Code:item.arrivalAirport, airportName:$scope._4codeCityName[item.arrivalAirport]};
            var departureAirport = {airport4Code:item.departureAirport, airportName:$scope._4codeCityName[item.departureAirport]};
            if(-1 == savedAirpors.indexOf(item.arrivalAirport)){
                savedAirpors.push(item.arrivalAirport);
                $scope.airports.push(arrivalAirport);
            }

            if(-1 == savedAirpors.indexOf(item.departureAirport)){
                savedAirpors.push(item.departureAirport);
                $scope.airports.push(departureAirport);
            }

            -1 != $scope.flightNos.indexOf(item.flightNo)?'':$scope.flightNos.push(item.flightNo);

            //延误原因
            if(item.abnormalType){
                -1 != $scope.delayReasons.indexOf(item.abnormalType) ? '' : $scope.delayReasons.push(item.abnormalType);
            }

            //TOBT大于COBT 15min
            if((item.tobt)&&(item.cobt)&&((item.tobt) - (item.cobt) > 900000)){
                -1 != $scope.abnormalFlightNos.indexOf(item.flightNo)?'':$scope.abnormalFlightNos.push(item.flightNo);
            };
//           if(((item.tobt)&&(item.cobt)&&((item.tobt) - (item.cobt) >= 900000))&&(-1 == $scope.abnormalFlightNos.indexOf(item.flightNo))){
//               $scope.abnormalFlightNos.push(item.flightNo);
//           };

            if (angular.isDefined(item.acReg)) {
                // -1 != $scope.acRegs.indexOf(item.acReg)?'':$scope.acRegs.push(item.acReg);
                var acTypeReg = {acTypeName:item.acType, acRegName:item.acReg};
                if(-1 == savedAcregs.indexOf(item.acReg)){
                    savedAcregs.push(item.acReg);
                    $scope.acRegs.push(acTypeReg);
                }
            }
        });

        initFilterArray();//获取初始化数据

        //将上次筛选的条件加入到下次筛选中
        $scope.filterAirports.forEach(function (item) {
            if(-1 == savedAirpors.indexOf(item)){
                savedAirpors.push(item);
                $scope.airports.push({airport4Code:item, airportName:$scope._4codeCityName[item]});
            }
        });

        $scope.filterFlightnos.forEach(function (item) {
            if(-1 == $scope.flightNos.indexOf(item)){
                $scope.flightNos.push(item);
            }
        });
        $scope.filterAbnormal.forEach(function (item) {
            if(-1 == $scope.abnormalFlightNos.indexOf(item)){
                $scope.abnormalFlightNos.push(item);
            }
        });

        $scope.filterDelayReasons.forEach(function (item) {
            if(-1 == $scope.delayReasons.indexOf(item)){
                $scope.delayReasons.push(item);
            }
        });
        $scope.filterAcregs.forEach(function (item) {
            if(-1 == savedAcregs.indexOf(item) || !savedAcregs.length){
                savedAcregs.push(item);
                $scope.acRegs.push({
                    acTypeName: $scope._acTypeForFlightNo[item],

                    acRegName: item
                });
            }
        });
        initAcregs737();

        savedAirpors.sort();
        savedAcregs.sort();
        $scope.airports.sort(function (item1, item2) {
            return item1.airport4Code.localeCompare(item2.airport4Code);
        })

        //本场排序
        var indexOfLocationAirport = savedAirpors.indexOf($scope.locationAirport);
        if (-1 != indexOfLocationAirport){
            savedAirpors.splice(indexOfLocationAirport,1);
            $scope.airports.splice(indexOfLocationAirport,1);
        }
        savedAirpors.unshift($scope.locationAirport);
        $scope.airports.unshift({airport4Code:$scope.locationAirport, airportName:$scope._4codeCityName[$scope.locationAirport]});


        $scope.flightNos.sort(function(item1,item2){
            return item1.localeCompare(item2);
        });
        $scope.acRegs.sort(function(item1,item2){
            return item1.acRegName.localeCompare(item2.acRegName);
        });
        //初始化时增加对时间选择器的判断
        initDatetime();

    };

    initAllFilerInfos();

    function initFilterArray() {

        $scope.activeTab = 1;
        $scope.acTypeTab = 1;
        $scope.searchText = '';
        var filterData = angular.copy(filterFlightInfo.filterParams,{});
        $scope.startDate = new Date((flightInfo.beginDatetime+parseInt(filterData.filterBeginDate))||flightInfo.beginDatetime);
        $scope.endDate = new Date((flightInfo.endDatetime+parseInt(filterData.filterEndDate))||flightInfo.endDatetime);
        $scope.startDateLimit = $filter('date')(flightInfo.beginDatetime, 'yyyy-MM-ddTHH:mm');
        $scope.endDateLimit = $filter('date')(flightInfo.endDatetime, 'yyyy-MM-ddTHH:mm');
        //初始化数组
        $scope.filterAirports = filterData.filterAirPorts;
        $scope.filterFlightnos = filterData.filterFlightNos;
        $scope.filterAcregs = filterData.filterAcRegs;
        $scope.direction = filterData.direction;
        $scope.filterAbnormal = filterData.filterAbnormal || [];
        $scope.filterDelayReasons = filterData.filterDelayReasons||[];


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

    function initDatetime(){
        var startDate = $scope.startDate;
        var endDate = $scope.endDate;
        var beginDatetime = flightInfo.beginDatetime;
        var endDatetime = flightInfo.endDatetime;

        var isBeginDateChanged = angular.element(document.getElementsByClassName('isBeginDateChanged'));
        var filterBeginDate = startDate.getTime()-beginDatetime;
        filterBeginDate!=0 ? isBeginDateChanged.addClass('isDateChanged') : isBeginDateChanged.removeClass('isDateChanged');
        var isEndDateChanged = angular.element(document.getElementsByClassName('isEndDateChanged'));
        var filterEndDate = endDate.getTime()-endDatetime;
        filterEndDate!=0 ? isEndDateChanged.addClass('isDateChanged') : isEndDateChanged.removeClass('isDateChanged');
    }

    $scope.cancelAction = function () {
        initFilterArray();
        initAcregs737();
        NativeAppAPI.showTabBar();
        goBack();
        $rootScope.operate = false;
    };

    $scope.directionSwitch = function (event) {
        $scope.directionName = event.target.value;
        $scope.direction = $scope.directionName === 'noDirection' ? '' : $scope.directionName;
    };


    $scope.datetimePick = function (t) {
        var startDate = $scope.startDate;
        var endDate = $scope.endDate;
        var beginDatetime = flightInfo.beginDatetime;
        var endDatetime = flightInfo.endDatetime;
        if (t == startDate){
            if (angular.isDate(startDate)) {
                if (startDate.getTime() >= endDate.getTime() || endDate.getTime() - startDate.getTime()< 1*60*60*1000){
                    $rootScope.limitTip = true;
                    $rootScope.limitTipContent = lanConfig.timeLimitEarly;
                    startDate = new Date(endDate.getTime() - 1*60*60*1000);
                    $scope.startDate = startDate;
                }
                else if (startDate.getTime() < beginDatetime) {
                    $rootScope.limitTip = true;
                    $rootScope.limitTipContent = lanConfig.timeLimitNotIncluded;
                    startDate = new Date(beginDatetime);
                    $scope.startDate = startDate;
                }
            }
            else if (!angular.isDate(startDate)) {
                $scope.startDate = new Date(beginDatetime);
            }
            // var filterBeginDate = startDate<=beginDatetime ? 0 : startDate - beginDatetime;
            // filterBeginDate!=0
            // ? angular.element(document.getElementsByClassName('isBeginDateChanged')).addClass('isDateChanged')
            // : angular.element(document.getElementsByClassName('isBeginDateChanged')).removeClass('isDateChanged');
        }
        if (t == endDate){
            if (angular.isDate(endDate)) {
                if (startDate.getTime() >= endDate.getTime() || endDate.getTime() - startDate.getTime()< 1*60*60*1000){
                    $rootScope.limitTip = true;
                    $rootScope.limitTipContent = lanConfig.timeLimitLate;
                    endDate = new Date(startDate.getTime() + 1*60*60*1000);
                    $scope.endDate = endDate;
                }
                else if (endDate.getTime() > endDatetime) {
                    $rootScope.limitTip = true;
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

    //返回
    $scope.goBack = function(){
        $rootScope.go('back');
    };
    window.goBack = $scope.goBack;

};