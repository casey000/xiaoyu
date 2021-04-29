module.exports = (function() {
	angular.module('myApp').controller('fixedInspectController', ['$scope', 'airport', 'configInfo', 'favoriteFlight', '$stateParams', '$location', 'flightInfo', '$rootScope', '$q', 'paramTransfer', '$timeout', 'filterFlightInfo', 'filterFaultFlightInfo', 'flightFaultInfo', '$filter','brand', 'umengEventIdTransform', 'server',
		function($scope, airport, configInfo, favoriteFlight, $stateParams, $location, flightInfo, $rootScope, $q, paramTransfer, $timeout, filterFlightInfo, filterFaultFlightInfo, flightFaultInfo, $filter,brand, umengEventIdTransform, server)
		{
			$rootScope.startLoading();
			var that = this;
			var scope = $scope;
			var lanConfig = require('../../../../i18n/lanConfig');
			//返回
			$scope.goBack = function(){
				$rootScope.go('back');
			};
			$scope.dataList = [];
			server.maocGetReq('pcheck/getPcheckList', {}).then(function (data) {
				if (200 === data.status) {
					$scope.dataList = data.data.data || [];
					angular.forEach($scope.dataList,function (item,index) {
						if(item.revtp == "D"){
							item.revtp = "定检"
						}
						if(item.revtp == "Z"){
							item.revtp = "专项"
						}
						if(item.revtp == "F"){
							item.revtp = "封存"
						}
					});
                    $rootScope.endLoading();
				}
			}).catch(function (error) {
				console.log(error);
			});
			$scope.isNewFault = true;
			if($scope.isNewFault == true) {
				NativeAppAPI.hideTabBar();
			}
			else {
				NativeAppAPI.showTabBar();
			}
			$scope.initPage = function(){

			};
			$scope.initPage();
			$scope.isList = true;
			$scope.lanZh = server.lan === 'zh-cn';
			$scope.isFavorite = false;
			$scope.isNewBrand = true;//brand.isNewBrand;
			$scope.brandContext = $scope.isNewBrand ? lanConfig.brandOld : lanConfig.brandNew ;
			$scope.flightStatus = 0;
			//存储所有机场的{四字码:'中文名称'}的对象
			$scope._4codeCityName = airport._4codeCityName;

			//当为true时，表示没有更多的数据。
			$scope.noMoreData = false;
			$scope.loadMore = false;

			$scope.filterData = filterFaultFlightInfo.filterParams;//angular.copy(filterFlightInfo.filterParams, {});

		}])
})()