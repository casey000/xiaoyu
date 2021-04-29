module.exports = (function() {
	angular.module('myApp').controller('faultFlightController', ['$scope', 'airport', 'configInfo', 'favoriteFlight', '$stateParams', '$location', 'flightInfo', '$rootScope', '$q', 'paramTransfer', '$timeout', 'filterFlightInfo', 'filterFaultFlightInfo', 'flightFaultInfo', '$filter','brand', 'umengEventIdTransform', 'server',
		function($scope, airport, configInfo, favoriteFlight, $stateParams, $location, flightInfo, $rootScope, $q, paramTransfer, $timeout, filterFlightInfo, filterFaultFlightInfo, flightFaultInfo, $filter,brand, umengEventIdTransform, server)
		{
			$rootScope.startLoading();
			var that = this;
			var scope = $scope;
			var lanConfig = require('../../../../i18n/lanConfig');

			$scope.localConfig = {
				'vc': lanConfig.vc,
				'rc': lanConfig.rc
			};

			$scope.isNewFault = true;
			if($scope.isNewFault == true) {
				NativeAppAPI.hideTabBar();
			}
			else {
				NativeAppAPI.showTabBar();
			}

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

			/*
			 *	获取当前所有收藏航班的flightId,便于显示航班的收藏状态。
			 */
			$scope.getAllFlightInfo = function() {
				$scope.noMoreData = false;
				favoriteFlight.getAllFavoriteFlightIds().then(function(data) {
					$scope.favoriteFlightIds = favoriteFlight.focusFlightIds;
					realGetAllFlightInfo();

				}).catch(function(error) {

					$scope.pullToRefreshActive = false;
					$rootScope.endLoading();
				});
			};

			/*
			 *	获取当前时间所有的航班状态列表。并按照当前筛选条件显示
			 */
			function realGetAllFlightInfo() {
				var timeNow = new Date();
				var timeParam = $scope.flightDate;

				//由于flightDate停留在请求时刻的时分秒，所以需要将时分秒切换为当前访问的时分秒
				timeParam.setHours(timeNow.getHours());
				timeParam.setMinutes(timeNow.getMinutes());
				timeParam.setSeconds(timeNow.getSeconds());

				flightFaultInfo.getAllFlightInfo({
					time: timeParam.getTime()
				}, $stateParams.isNewFault).then(function(data) {

					$scope.beginDatetime = data.beginDatetime;
					$scope.endDatetime = data.endDatetime;
					$scope.flights = angular.isArray(data.data) ? data.data : [];
					// 所有关注航班数组
					$scope.allFavorFlights = flightFaultInfo.allFavorFlights;

					/*航班数量统计*/
					$scope.flightCounts = flightFaultInfo.flightCounts;
					$scope.filterFlightCounts = flightFaultInfo.filterFlightCounts;

					//下拉刷新完成
					$scope.pullToRefreshActive = false;
				}).catch(function(error) {


					//下拉刷新完成
					$scope.pullToRefreshActive = false;
				});

			}


			$rootScope.flei_click=function(data){
				console.log(JSON.stringify(data));
				if(data.departureStationJob){
					if(data.departureStationJob.jobStatus==2){
						alert('航班已放行，禁止操作。如需操作，请联系航班放行人员，取消放行后操作。');
						return
					}
				}

				$rootScope.go('faultFlight.newfault', '', {flight: data, tr: true, dmStatus:true});
			}
			$rootScope.right_click=function(data){
				if(data.departureStationJob) {
					if (data.arrivalStationJob.jobStatus == 2) {
						alert('航班已放行，禁止操作。如需操作，请联系航班放行人员，取消放行后操作。');
						return
					}
				}
			   $rootScope.go('faultFlight.newfault', '', {flight: data,dmStatus:true});
			}


			/*
			 *前一天的航班计划
			 *参数：无
			 */
			$scope.preDay = function() {
				$scope.flightDate = new Date($scope.flightDate.getTime() - 1000 * 24 * 60 * 60);
				$scope.setDay();
			};

			/*
			 *后一天的航班计划
			 *参数：无
			 */
			$scope.nextDay = function() {

				$scope.flightDate = new Date($scope.flightDate.getTime() + 1000 * 24 * 60 * 60);
				$scope.setDay();
			};

			/*
			 *设置日期
			 *
			 */
			$scope.setDay = function() {
				$rootScope.startLoading();
				$scope.filterFlightCounts = null;
				$scope.flightCounts = null;
				if(!angular.isDate($scope.flightDate)) {
					$scope.flightDate = new Date();
				}
				paramTransfer.set({flightTime:$scope.flightDate});
				$scope.flights = null;
				$scope.allFavorFlights = null;
				$scope.getAllFlightInfo();
			}

			/*
			 *获取下页的数据
			 *
			 */
			$scope.getNextPage = function() {

				if($scope.flights){
					var newPageData = flightFaultInfo.getNextPage();
					if(newPageData.length) {
						$scope.loadMore = true;
						$scope.flights = $scope.flights.concat(newPageData);
					} else {
						$scope.noMoreData = true;
					}
				}
			}

			/*
			 *	点击收藏和取消收藏
			 */
			$scope.favorite = function($event, flight) {
				if(typeof flight.flightId == 'undefined'){
					alert('该类型航班不能收藏!')
					return;
				}

				if(flight.favorite) {
					$event.next().children().removeClass('swipe-left');
					$event.parent().next().removeClass('swipe-left');
					delete flight.favorite;
					favoriteFlight.removeFavoriteFlight(flight.flightId).then(function(data) {
						if(data) {
							var index = $scope.allFavorFlights.indexOf(flight);
							$scope.allFavorFlights.splice(index,1);
							delete flight.favorite;
						} else {
							// flight.favorite = true;
						}
					}).catch(function(error) {

					});
				} else {
					$event.next().children().removeClass('swipe-left');
					$event.parent().next().removeClass('swipe-left');
					flight.favorite = true;
					favoriteFlight.addFavoriteFlight(flight.flightId).then(function(data) {
						if(data) {
							$scope.allFavorFlights.push(flight);
						} else {
							delete flight.favorite;
						}
					}).catch(function(error) {
						console.log(error);
					});
				}
			}

			/*
			 *切换‘全部，未飞，起飞，到达，异常航班’
			 */
			$scope.changeFilterFlightStatus = function(filterStaus) {
				if(filterStaus != filterFaultFlightInfo.filterParams.filterFlightStatus) {
					filterFaultFlightInfo.setFilterFlightStatus(filterStaus);
					flightFaultInfo.changeFlightStatus();
					flightFaultInfo.currentPage = 0;
					$scope.noMoreData = false;
					$scope.flights = flightFaultInfo.getNextPage();
				}
			}

			/*
			 *	初始化当前航班状态显示
			 */
			function initTest() {
				$scope.flightDate = (paramTransfer.get()&&paramTransfer.get()['flightTime'])||new Date();
				paramTransfer.set({
					flightTime: $scope.flightDate
				});
				$scope.getAllFlightInfo();
			};
			initTest();


			// 關注頁面數據初始化
			$rootScope.isSearchFavorite = true;//标记是否为收藏和搜索页面，详情页返回时用到
			$rootScope.isFlightDetail = false; //详情页返回时显示界面缓存用
			//点击收藏或者取消收藏
			$scope.favoriteChanged = function($event,flight) {
				// var favoriteFlightIndex = $scope.favoriteFlightIds.indexOf(flight.flightId);
				if(flight.favorite){
					favoriteFlight.removeFavoriteFlight(flight.flightId).then(function(data){
						if (data) {
							//$event.next().removeClass('swipe-left');
							//$event.parent().next().removeClass('swipe-left');

							$event.parent().addClass('del-card');
							setTimeout(function(){
								$event.parent().remove();
								var index = $scope.allFavorFlights.indexOf(flight);
								$scope.allFavorFlights.splice(index,1);
							},500);

							delete flight.favorite;
						}else {
							alert(lanConfig.favoriteErr);
						}
					}).catch(function (error) {
						console.log(error);
					});
				}
			};
			$scope.toMyFavorite = function(){
				$scope.activeSwitch=1;
				$scope.isList=false;
				$scope.isFavorite=true
				umengEventIdTransform.umengSaveCoustomEvent(umengEventIdTransform.custom_Event.clickFlightFocusButton, {userCode: configInfo.user})
			}

			$scope.goFlightDetail = function(event,flight){
				if(angular.element(event.target).hasClass('go-fault')){
					return;
				}

				$rootScope.go('flightStatus.flightDetail', 'slideLeft', {
					flightId: flight.flightId,
					openInFlightInfo:true,
                    	isNewFault: true
                })
			}
			//点击航前航后
			$scope.goNewFault = function(event, flight){
				event.stopImmediatePropagation();
				$rootScope.go('newfault', 'sideLeft', flight);
			};


		}])
})()