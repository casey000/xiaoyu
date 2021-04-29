module.exports = (function () {
	angular.module('myApp').controller('cityWeatherReportController',['$scope','server','$stateParams','$rootScope','airport',function($scope, server,$stateParams,$rootScope,airport){
		$scope.currentCity = (server.lan === 'zh-cn' ? airport._4codeCityName[$stateParams.cityReport] : $stateParams.cityReport + ' ') || '';

		var lanConfig = require('../../../../i18n/lanConfig');
		$scope.type = {
			'live': lanConfig.live,
			'forecast': lanConfig.forecast
		};

		/*
		*	根据airtport4Code获取航班的天气信息
		*	@param {string} airtport4Code。 要查询的航班的airtport4Code 【必填】
		*/
		getFlightWeatherInfoByAirport4Code = function(airtport4Code){
			
			 $scope.flightWeather =  [];
			 server.maocGetReq('weather/weatherReportByAirport4code/'+airtport4Code).then(function(data){
			 	if (data.status === 200) {
			 		$scope.flightWeather = data.data.data||[];
			 	}
			 	$rootScope.endLoading();
			 }).catch(function(data){
			 	console.log(data);
			 	$rootScope.endLoading();
			 });
			 
		};
		getFlightWeatherInfoByAirport4Code($stateParams.cityReport);
	}])
})();