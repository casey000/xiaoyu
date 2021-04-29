module.exports = (function() {
	angular.module('myApp').controller('faultSearchFlightController', ['$scope', 'airport', 'paramTransfer', 'flightFaultInfo', 'favoriteFlight', '$rootScope', 'configInfo', '$stateParams', 'umengEventIdTransform',
		function ($scope, airport, paramTransfer, flightFaultInfo, favoriteFlight, $rootScope, configInfo,$stateParams, umengEventIdTransform) {
			umengEventIdTransform.umengSaveCoustomEvent(umengEventIdTransform.custom_Event.clickFlightSearchButton, {userCode: configInfo.user})
			var lanConfig = require('../../../../i18n/lanConfig');
			// NativeAppAPI.hideTabBar();
			$scope.isSearch = true;
			$scope.isNewBrand = true;
			$scope.isNewFault = $stateParams.isNewFault; //是否为新建故障进入
			$rootScope.isSearchFavorite = true; //标记是否为收藏和搜索页面，详情页返回时用到
			$rootScope.isFlightDetail = false; //详情页返回时显示界面缓存用
			$rootScope.endLoading();
			$scope.holderValue = lanConfig.inputLimit2;
			$scope._4codeCityName = airport._4codeCityName;
			$scope.searchDate = (flightFaultInfo.searchParams&&flightFaultInfo.searchParams.flightTime&&new Date(new Number(flightFaultInfo.searchParams.flightTime)))||(paramTransfer.get().flightTime instanceof Date && paramTransfer.get().flightTime)
				||new Date();
			$scope.searchTxt = flightFaultInfo.searchParams&&flightFaultInfo.searchParams.searchValue||'';

			$scope.search = search;

			function search (params) {
				flightFaultInfo.searchParams = params;
				searchFlight(params);

			}

			function searchFlight(params){
				var searchTime = new Date(params.time);
				searchTime.setHours(23);
				searchTime.setMinutes(59);
				searchTime.setSeconds(59);
				flightFaultInfo.getFlightinfoWithParams({w:params.searchValue,t:searchTime.getTime()}, $stateParams.isNewFault).then(function(data){
					$scope.beginDatetime = data.beginDatetime;
					$scope.endDatetime = data.endDatetime;
					$scope.flights = angular.isArray(data.data) ? data.data : [];
					//结束加载
					$rootScope.endLoading();

				}).catch(function (error) {
					$scope.flights = [];
					console.log(error);
					//结束加载
					$rootScope.endLoading();
				});
			};

			function initSearchView () {
				if (flightFaultInfo.searchFlights&&flightFaultInfo.searchFlights.length) {
					$scope.beginDatetime = flightFaultInfo.searchBeginDatetime;
					$scope.endDatetime = flightFaultInfo.searchEndDatetime;
					$scope.flights = flightFaultInfo.searchFlights;
				}
			};
			//点击收藏
			$scope.favorite = function($event,flight) {

				if(flight.favorite){
					favoriteFlight.removeFavoriteFlight(flight.flightId).then(function(data){
						if (data) {
							$event.next().removeClass('swipe-left');
							$event.parent().next().removeClass('swipe-left');
							delete flight.favorite;
						}
					}).catch(function (error) {
						console.log(error);
					});
				}else{
					favoriteFlight.addFavoriteFlight(flight.flightId).then(function(data){
						if (data) {
							$event.next().removeClass('swipe-left');
							$event.parent().next().removeClass('swipe-left');
							flight.favorite = true;
						}
					}).catch(function (error) {
						console.log(error);
					});
				}
			}

			//输入搜索条件后回车返回搜索结果
			$scope.enter = function(ev,searchTxt){
				var keyCode = window.event?ev.keyCode:ev.which;
				if(keyCode == 13){
					ev.preventDefault();
					$scope.searchAction(searchTxt);
				};
			};

			$scope.searchAction = function() {

				if (!$scope.searchTxt) {
					$scope.holderValue = lanConfig.inputLimitNoEmpty;
					return;
				}
				var reg = /^[0-9a-zA-Z]+$/;
				var reg2 = /^[\u4e00-\u9fa5]+$/;
				if ((reg.test($scope.searchTxt) || reg2.test($scope.searchTxt)) && $scope.searchTxt.length>=2) {
					searchSubmit();
				}
			};

			function searchSubmit() {
				$rootScope.startLoading();
				search(
					{
						time: $scope.searchDate,
						searchValue: $scope.searchTxt
					}
				)
			}

			function cleanSearchData() {
				flightFaultInfo.searchParams	= {};
				flightFaultInfo.searchFlights = [];
			}

			$scope.setSearchDate = function(event){
				if (!angular.isDate($scope.searchDate)) {
					$scope.searchDate = new Date();
				}
			}

			initSearchView();
			//返回
			$scope.goBack = function(){
				cleanSearchData();
				$rootScope.go('back');
				$rootScope.isSearchFavorite = false;
				$rootScope.operate = false;
			}
			window.goBack = $scope.goBack;
		}])
})()