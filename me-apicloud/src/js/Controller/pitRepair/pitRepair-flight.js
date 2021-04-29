module.exports = (function() {
	angular.module('myApp').controller('pitRepairFlightController', ['$scope', 'airport', 'configInfo', 'favoriteFlight', '$stateParams', '$location', 'flightInfo', '$rootScope', '$q', 'paramTransfer', '$timeout', 'filterFlightInfo', 'filterFaultFlightInfo', 'flightFaultInfo', '$filter','brand', 'umengEventIdTransform', 'server',
		function($scope, airport, configInfo, favoriteFlight, $stateParams, $location, flightInfo, $rootScope, $q, paramTransfer, $timeout, filterFlightInfo, filterFaultFlightInfo, flightFaultInfo, $filter,brand, umengEventIdTransform, server)
		{
			$rootScope.startLoading();
			var that = this;
			var scope = $scope;
			var lanConfig = require('../../../../i18n/lanConfig');
			$scope.searchVal = '';
			$scope.holderValue = '请输入飞机号';

			//返回
			$scope.goBack = function(){
				$rootScope.go('back');
			};
			$scope.keyEvent = function (event) {
				if (event.keyCode === 13) {
					$scope.search();
				}
			};
			var arr = [];

			$scope.search = function(){
				console.log($scope.searchVal);
				// $scope.dataList=$filter("filter")(arr,$scope.searchVal);
			}
			$scope.dataList = [];
			server.maocGetReq('assembly/getACInfoList', {}).then(function (data) {
				console.log(data,'12323');
				if (200 === data.status) {
					$scope.dataList = data.data.data;
					arr = data.data.data;
                    $rootScope.endLoading();
                    console.info($scope.dataList,'返回值')
				}
			}).catch(function (error) {
				console.log(error);
			});



			//当为true时，表示没有更多的数据。
			$scope.noMoreData = false;
			$scope.loadMore = false;

			$scope.filterData = filterFaultFlightInfo.filterParams;//angular.copy(filterFlightInfo.filterParams, {});

		}])
})()