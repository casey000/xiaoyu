module.exports = function ($scope, server, airport, paramTransfer, $routeParams,$route, $location, $rootScope) {
    NativeAppAPI.hideTabBar();
    var lanConfig = require('../../../../i18n/lanConfig');
    $scope.localConfig = {
    	'vc': lanConfig.vc,
		'rc': lanConfig.rc,
		'landing': lanConfig.landing,
		'takeOff': lanConfig.takeOff,
		'delay': lanConfig.delay,
		'min': lanConfig.minute
	};
    $scope.lanZh = server.lan === 'zh-cn';
    $scope._4codeCityName = airport._4codeCityName;

    $scope.getAirportByLan = function (airport) {
		if ($scope.lanZh) {
			return $scope._4codeCityName[airport] || airport;
		} else {
			return airport;
		}
    };

	//由DD返回时，下面两个参数为空，但必须要有
	if($routeParams.flightId){
		localStorage.setItem('flightId', $routeParams.flightId);
	}else{
		$routeParams.flightId = localStorage.getItem('flightId');
	}
	$scope.flightId = $routeParams.flightId;
	$scope.openInFlightInfo = $routeParams.openInFlightInfo;
	$scope.openInNewPage = $routeParams.openInNewPage;
	var param = $routeParams.flightId || $routeParams.cityReport;

	$scope.time = $routeParams.time;
	//$scope.currentCity = $scope._4codeCityName[$routeParams.cityReport||''];
	var that = this;
	//调用消息详情
	$scope.infoDetail = function(){

		// NativeAppAPI.openFlightStatusDetail({'flightNo': $scope.flightInfo.flightNo, 'flightId': param });
        $rootScope.go('messageDetail','',{ 'flightId':param , 'flightNo':$scope.flightInfo.flightNo,'acReg':$scope.flightInfo.acReg});
	};

	//封装返回方法
	$scope.gobackToFlightStatus = function () {
		var isFault = $routeParams.isNewFault ;
		if (isFault !== true) {
            NativeAppAPI.showTabBar();
        }
		$rootScope.go('back');
    };

    /**
     * 调用apicloud方法返回页面， 关闭window flight-detail
     */

    $scope.gobackToFlightTimes = function () {
        $rootScope.go('back');
        // NativeAppAPI.gobackToFlightTimes();
    };

	
	function initFlightDetail () {
		that.getFlightDetailInfo(param);
		that.getFlightCrewInfo(param);
		that.getFlightWeatherInfoByFlightId(param);
	}

	/*
	*	acReg 查询前端航班的维修信息。不是维修的详情信息
	*	@param [string] acReg 【必填】
	*/

	this.getDDInfo = function (acReg){
		if (acReg.indexOf('B-') == -1) {
			$scope.acReg = acReg.replace('B','B-');
		}
		server.maocGetReq('maintainDefect/maintainAcInfo',{acNo: $scope.acReg}).then(function(data) {
			if(200 === data.status) {
				if(data.data.dataSize == 0){
					$scope.ddLen = 0;
                    $scope.pendLen = 0;
                    $scope.allLen = $scope.ddLen + $scope.pendLen;
                    return;
				}

				var acStatus = data.data.data[0];
                $scope.nrcList = acStatus.nrcList || [];
                var nrcAppend = [];
                $scope.nrcList.length > 0 && angular.forEach($scope.nrcList,function (item,index) {
                    if((!item.sourceFrom || (item.sourceFrom && item.sourceFrom.toUpperCase() != "ASMS" && item.runType == 1 && item.isSuspending == 'y') )&& item.relateCard){
                    	item.isNrc = true
                        nrcAppend.push(item);
                    }

                });
                acStatus.pendList ? acStatus.pendList = acStatus.pendList.concat(nrcAppend):acStatus.pendList = [];
                $scope.acStatus = acStatus;
				$scope.ddLen = acStatus.ddList ? acStatus.ddList.length :0;
				$scope.pendLen = acStatus.pendList.length;

				$scope.allLen = $scope.ddLen + $scope.pendLen;

				if($scope.acStatus.length == 0){
					$rootScope.backRouter = false;
				}
				$rootScope.endLoading();
			}else if(data.status == 400 && data.data.error_code){
				$scope.ddLen = 0;
				$scope.pendLen = 0;
			}

		}).catch(function(error) {
			console.log(error);
			$rootScope.endLoading();
		});
	};

	/*
	*	根据flightId 查询航班的机组信息
	*	@param [string] flightId。 要查询的航班的flightId 【必填】 
	*/
	this.getFlightCrewInfo = function (flightId) {
		 $scope.crewInfos = [];
		 server.maocGetReq('flight/flightCrewInfo/'+flightId).then(function(data){
		 	if (data.status === 200) {
		 		$scope.crewInfos = data.data.data||[];
		 	}
		 }).catch(function(data){
			 $rootScope.endLoading();
		 });
	};

	/*
	*	根据flightId 查询前端航班基础信息
	*	@param [string] flightId。 要查询的航班的flightId 【必填】 
	*/
	this.getPreFlightInfo = function (flightId){
		 $scope.preFlightInfo = {};
		 server.maocGetReq('flight/preFlightSummary/'+flightId).then(function(data){
		 	if (data.status === 200) {
		 		$scope.preFlightInfo = data.data.data[0];
		 	}
		 	$rootScope.endLoading();
		 }).catch(function(data){
		 	$rootScope.endLoading();
		 });
	};
	
	/*
	*	获取航班详情。
	*	@param [string] flightId。 要查询的航班的flightId 【必填】 
	*/
	this.getFlightDetailInfo = function (flightId) {
		 $scope.flightInfo = {};
		 $scope.preFlightInfo = {};
		 server.maocGetReq('flight/flightDetails/'+flightId).then(function(data){
		 	if (data.status === 200) {
		 		$scope.flightInfo = data.data.data[0].curFlightDetails;
		 		$scope.preFlightInfo = data.data.data[0].preFlightSummary;
				$scope.acReg = $scope.flightInfo.acReg;
				if ($scope.acReg && $scope.acReg.length) {
					that.getDDInfo($scope.acReg);
				}
		 	}

		 }).catch(function(data){
		 	$rootScope.endLoading();
		 });
	};


	/*
	*	根据flightId获取航班的天气信息
	*	@param {string} flightId。 要查询的航班的flightId 【必填】
	*/
	this.getFlightWeatherInfoByFlightId = function(flightId){
		 $scope.flightWeather =  [];
		 server.maocGetReq('weather/weatherReportByFlightId/'+flightId).then(function(data){
		 	if (data.status === 200) {
		 		$scope.flightWeather = data.data.data||[];
		 		/**
		 		 * 天气信息不完整时处理，
		 		 * 没有天气时，把获得的航站信息加到天气列表中
		 		 * 有一个天气时，把另一个航站信息添加到天气列表中
		 		 * */
		 		if(!$scope.flightWeather.length){
		 			$scope.flightWeather.push({
		 				airport4Code: $scope.flightInfo.departureAirport
		 			},{
		 				airport4Code: $scope.flightInfo.arrivalAirport
		 			});
		 		}else if($scope.flightWeather.length==1){
		 			if($scope.flightWeather[0].airport4Code != $scope.flightInfo.departureAirport){
		 				$scope.flightWeather.unshift({
			 				airport4Code: $scope.flightInfo.departureAirport
			 			});
		 			}else{
		 				$scope.flightWeather.push({
			 				airport4Code: $scope.flightInfo.arrivalAirport
			 			});
		 			}
		 		}
		 	}
		 	$rootScope.endLoading();
		 }).catch(function(data){
		 	$rootScope.endLoading();
		 });
	}
	initFlightDetail();
}