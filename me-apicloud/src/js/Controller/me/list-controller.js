module.exports = (function() {
	angular.module('myApp').controller('meListController', ['$rootScope', '$scope', '$filter', '$location','$stateParams', 
	'airport', 'server', 'paramTransfer', '$localForage', 'configInfo', 'mefilterFlightInfo', 'meList', '$state',
		function($rootScope, $scope, $filter, $location, $stateParams, airport, server, paramTransfer, $localForage, 
			configInfo, mefilterFlightInfo, meList, $state) {

            NativeAppAPI.hideTabBar();
            var lanConfig = require('../../../../i18n/lanConfig');
			var that = this;
			var scope = $scope;
			$scope.isList = true;
			//$scope.flightStatus = mefilterFlightInfo.filterParams.filterFlightStatus;
			//存储所有机场的{四字码:'中文名称'}的对象
			$scope._4codeCityName = airport._4codeCityName;
			$scope._acTypeForFlightNo = airport._acTypeForFlightNo;
			//当为true时，表示没有更多的数据。
			$scope.noMoreData = false;
			
			//$scope.flight.flgVr=$scope.flight.flgVr.replaceAll("V","备")
			if(Number($stateParams.time)) {
				$scope.flightDate = new Date(Number($stateParams.time));
				paramTransfer.set({
					time: $scope.flightDate.getTime()
				});
			}else{
				$scope.flightDate = new Date();
			}

			$scope.locationAirport = configInfo.airport;
			$scope.filterData = mefilterFlightInfo.filterParams;
			// var filterData = angular.copy(mefilterFlightInfo.filterParams,{});
			// $scope.filterAirports = filterData.filterAirPorts;
			// $scope.filterFlightnos = filterData.filterFlightNos;
			// $scope.filterAcregs = filterData.filterAcRegs;
			// $scope.direction = filterData.direction;
			// $scope.filterBeginDate = filterData.filterBeginDate;
			// $scope.filterEndDate = filterData.filterEndDate;

			/*
			 *	按照日期，航班号，机号获取所有实时航班动态。
			 *	@[params] {object}
			 *	例 
			 *	params = {
			 *		time:1467171181211,
			 *		flightNo:'6869',
			 *		acReg:'7869'
			 *	}
			 *	[time]	航班日期,毫秒为单位的UNIX时间戳。必填
			 *	{flightNo}	航班号,支持模糊查询。	选填
			 *	{acReg}	机号,支持模糊查询。    选填
			 */
			var timeBegin;
			$scope.getAllFlightInfo = function() {
				timeBegin = (new Date()).getTime();
				$scope.noMoreData = false;
				
				realGetAllFlightInfo();
			};

			function realGetAllFlightInfo() {
				var timeNow = new Date();
				var timeParam = $stateParams.time ? new Date(Number($stateParams.time)) : new Date();
				timeParam.setHours(timeNow.getHours());
				timeParam.setMinutes(timeNow.getMinutes());
				timeParam.setSeconds(timeNow.getSeconds());

				meList.getAllFlightInfo({
					time: timeParam.getTime()
				}).then(function(data) {
					// console.log(JSON.stringify(data));
					$scope.beginDatetime = data.beginDatetime;
					$scope.endDatetime = data.endDatetime;
					$scope.flights = angular.isArray(data.data) ? data.data : [];

					String.prototype.chose = function(){
						if(this[0]==='V'){
							return lanConfig.vcShort + this.slice(1,this.length);
						}else if(this[0]==='R'){
							return lanConfig.rcShort + this.slice(1,this.length);
						}
					}
					//下拉刷新完成
					$scope.pullToRefreshActive = false;

				}).catch(function(error) {
					console.log(error);
					//下拉刷新完成
					$scope.pullToRefreshActive = false;
					//$rootScope.endLoading();
				});
			}


			/*
			 *前一天的航班计划
			 *参数：无
			 */
			scope.preDay = function() {
				$rootScope.pageAnimationClass = '';
				meList.cleanFlights();
				$scope.flightDate = new Date($scope.flightDate.getTime() - 1000 * 24 * 60 * 60);
				$location.path('me/' + $scope.flightDate.getTime());
			};

			/*
			 *后一天的航班计划
			 *参数：无
			 */
			scope.nextDay = function() {
				$rootScope.pageAnimationClass = '';
				meList.cleanFlights();
				$scope.flightDate = new Date($scope.flightDate.getTime() + 1000 * 24 * 60 * 60);
				$location.path('me/' + $scope.flightDate.getTime());

			};
			/*
			 *设置日期
			 *
			 */

			scope.setDay = function(event) {
				meList.cleanFlights();
				if(!angular.isDate($scope.flightDate)) {
					$scope.flightDate = new Date();
				}
				$location.path('me/' + $scope.flightDate.getTime());
			}

			/*
			 *获取下页的数据
			 *
			 */
			scope.getNextPage = function() {
					var newPageData = meList.getNextPage();

					if(newPageData.length) {
						$scope.flights = $scope.flights.concat(newPageData);
						//meList.showFlights = $scope.flights;
						if(meList.currentPage == meList.totalPageSize){
							$scope.noMoreData = true;
						}
					} else {
						$scope.noMoreData = true;
						
					}
			}
			scope.slipAlert = function(){
				$rootScope.limitTipContent = lanConfig.slipAlert;
				$rootScope.shortLimitTip = true;
				$rootScope.limitTip = true;
			}
			function initTest() {
				$scope.getAllFlightInfo();

				var ua = navigator.userAgent.toLowerCase();
				if(ua.indexOf("mac os x") > 0){
					var reg = /os [\d._]*/gi ;
					var verinfo = ua.match(reg) ;
					var version = (verinfo+"").replace(/[^0-9|_.]/ig,"").replace(/_/ig,".");
					var arr=version.split(".");

					if (arr[0]>14) {
						$scope.isIos14 = true
					}else{
						$scope.isIos14 = false
					}
				}
				if(ua.indexOf('macintosh') > 0){
					$scope.isIos14 = true
				}


			};
			initTest();
			//android 返回键时调用
			window.goBack = function(){
				//$rootScope.go('index');
				$rootScope.goTopRootViewController();
			};

			scope.goUseSv = function (item,ev) {
                ev.stopPropagation();
				$rootScope.go('svList','',{taskInfo: item});
            };
			scope.goFollowMr = function (item,ev) {
                // $rootScope.errTip = '功能尚在开发中，敬请期待';
                ev.stopPropagation();
                $rootScope.go('followAircraftMaterial', '', {flightNo: item.flightNo,flightId:item.flightId })
            };
			scope.svTypes = [];
			scope.selectOption = function(obj){
				// console.log("点击弹窗的数据"+ JSON.stringify(obj));
				var paramObj = {};
				(obj.jobType == 'Pr/F' ||  obj.jobType == 'T/R' || obj.jobType == 'TBFTR') ? paramObj = obj.obj.departureStationJob : paramObj = obj.obj.arrivalStationJob;
                var params = {workOrderId:paramObj.jobId};

                server.maocGetReq('apuUse/selectApuUseInfoIsExistByWorkOrderId', params).then(function(data) {
                    if(200 === data.status) {
                        console.info(data.data.data[0],'data.data.data[0]');
                        // var boolMark = data.data.data[0] ? true : false;
                        // console.info(typeof (data.data.data[0]),'data.data.data[0]');
                        !data.data.data[0] ? $rootScope.go('addOrEditApu','',{apuInfo:paramObj,isFirst:true}) : $rootScope.go('apuList','',{workType:paramObj.jobType,jobId:paramObj.jobId,flightId:paramObj.flightId});

                    }else{
                        $rootScope.errTip = '错误，请联系管理员'
                    }
                });

            };

			scope.goUseApu = function (item,ev) {
                ev.stopPropagation();

				console.info(item,'item');
				if(item.jobType && item.jobType.toUpperCase() == 'O/G'){
                	console.info(item);
                    var params = {workOrderId:item.jobId};
                    server.maocGetReq('apuUse/selectApuUseInfoIsExistByWorkOrderId', params).then(function(data) {
                        if(200 === data.status) {
                            console.info(data.data.data[0],'data.data.data[0]');
                            // var boolMark = data.data.data[0] ? true : false;
                            // console.info(typeof (data.data.data[0]),'data.data.data[0]');
                            !data.data.data[0] ? $rootScope.go('addOrEditApu','',{apuInfo:item,isFirst:true}):$rootScope.go('apuList','',{workType:'O/G',jobId:item.jobId,flightId:item.flightId});
                        }else{
                            $rootScope.errTip = '错误，请联系管理员'
                        }
                    });

					return
                }
                if(item.arrivalStationJob.jobType && item.arrivalStationJob.jobType.toUpperCase() == 'PO/F' && item.departureStationJob && JSON.stringify(item.departureStationJob) == '{}'){
                    console.info(item);
                    item.arrivalStationJob.acType  = item.acType;
                    item.arrivalStationJob.flightId  = item.flightId;
                    var params = {workOrderId:item.arrivalStationJob.jobId};
                    server.maocGetReq('apuUse/selectApuUseInfoIsExistByWorkOrderId', params).then(function(data) {
                        if(200 === data.status) {
                            console.info(data.data.data[0],'data.data.data[0]');
                            // var boolMark = data.data.data[0] ? true : false;
                            // console.info(typeof (data.data.data[0]),'data.data.data[0]');
                            !data.data.data[0] ? $rootScope.go('addOrEditApu','',{apuInfo:item.arrivalStationJob,isFirst:true}):	$rootScope.go('apuList','',{workType:'Pr/F',jobId:item.arrivalStationJob.jobId,flightId:item.flightId});

                        }else{
                            $rootScope.errTip = '错误，请联系管理员'
                        }
                    });

                    return
                }

                if(item.departureStationJob.jobType && item.departureStationJob.jobType.toUpperCase() == 'T/R' && item.arrivalStationJob && JSON.stringify(item.arrivalStationJob) == '{}'){
                    console.info(item);
					// item.jobType = 'T/R';
					item.departureStationJob.acType  = item.acType;
					item.departureStationJob.flightId  = item.flightId;
                    var params = {workOrderId:item.departureStationJob.jobId};
                    server.maocGetReq('apuUse/selectApuUseInfoIsExistByWorkOrderId', params).then(function(data) {
                        if(200 === data.status) {
                            console.info(data.data.data[0],'data.data.data[0]');
                            // var boolMark = data.data.data[0] ? true : false;
                            // console.info(typeof (data.data.data[0]),'data.data.data[0]');

                            !data.data.data[0] ? $rootScope.go('addOrEditApu','',{apuInfo:item.departureStationJob,isFirst:true}):	$rootScope.go('apuList','',{workType:'T/R',jobId:item.departureStationJob.jobId,flightId:item.flightId});

                        }else{
                            $rootScope.errTip = '错误，请联系管理员'
                        }
                    });
                    return
                }

				//当离开的是滑回类型 且没有到达的数据的时候
				if(item.departureStationJob.jobType && item.departureStationJob.jobType.toUpperCase() == 'TBFTR' && item.arrivalStationJob && JSON.stringify(item.arrivalStationJob) == '{}'){
					console.info(item);
					// item.jobType = 'T/R';
					item.departureStationJob.acType  = item.acType;
					item.departureStationJob.flightId  = item.flightId;
					var params = {workOrderId:item.departureStationJob.jobId};
					server.maocGetReq('apuUse/selectApuUseInfoIsExistByWorkOrderId', params).then(function(data) {
						if(200 === data.status) {
							console.info(data.data.data[0],'data.data.data[0]');
							// var boolMark = data.data.data[0] ? true : false;
							// console.info(typeof (data.data.data[0]),'data.data.data[0]');

							!data.data.data[0] ? $rootScope.go('addOrEditApu','',{apuInfo:item.departureStationJob,isFirst:true}):	$rootScope.go('apuList','',{workType:'TBFTR',jobId:item.departureStationJob.jobId,flightId:item.flightId});

						}else{
							$rootScope.errTip = '错误，请联系管理员'
						}
					});
					return
				}

				//如果有离开信息，且类型为航前，且没有到达站的信息
                if(item.departureStationJob.jobType && item.departureStationJob.jobType.toUpperCase() == 'PR/F' && item.arrivalStationJob && JSON.stringify(item.arrivalStationJob) == '{}'){
                    console.info(item);
					item.departureStationJob.acType  = item.acType;
					item.departureStationJob.flightId  = item.flightId;
                    var params = {workOrderId:item.departureStationJob.jobId};
                    server.maocGetReq('apuUse/selectApuUseInfoIsExistByWorkOrderId', params).then(function(data) {
                        if(200 === data.status) {
                            console.info(data.data.data[0],'data.data.data[0]');
                            // var boolMark = data.data.data[0] ? true : false;
                            // console.info(typeof (data.data.data[0]),'data.data.data[0]');
                            !data.data.data[0] ? $rootScope.go('addOrEditApu','',{apuInfo:item.departureStationJob,isFirst:true}):	$rootScope.go('apuList','',{workType:'Pr/F',jobId:item.departureStationJob.jobId,flightId:item.flightId});

                        }else{
                            $rootScope.errTip = '错误，请联系管理员'
                        }
                    });

                    return
                }

                if(item.departureStationJob.jobType && item.departureStationJob.jobType.toUpperCase() == 'T/R' && item.arrivalStationJob.jobType && item.arrivalStationJob.jobType.toUpperCase() == 'PO/F'){
					item.departureStationJob.acType  = item.acType;
					item.departureStationJob.flightId  = item.flightId;
					item.arrivalStationJob.acType  = item.acType;
					item.arrivalStationJob.flightId  = item.flightId;
                	scope.svTypes = [
                        {
                            name:'T/R APU使用',
                            obj:item,
							jobType:'T/R'
                        },
                        {
                            name:'Po/F APU使用',
                            obj:item,
                            jobType:'Po/F'
                        }
                    ];
                    scope.showOptions = true;
                    console.info(item)

                }

				//当有离开的类型是滑回，且有到达的数据是航后()
				if(item.departureStationJob.jobType && item.departureStationJob.jobType.toUpperCase() == 'TBFTR' && item.arrivalStationJob.jobType && item.arrivalStationJob.jobType.toUpperCase() == 'PO/F'){
					item.departureStationJob.acType  = item.acType;
					item.departureStationJob.flightId  = item.flightId;
					item.arrivalStationJob.acType  = item.acType;
					item.arrivalStationJob.flightId  = item.flightId;
					scope.svTypes = [
						{
							name:'TBFTR APU使用',
							obj:item,
							jobType:'TBFTR'
						},
						{
							name:'Po/F APU使用',
							obj:item,
							jobType:'Po/F'
						}
					];
					scope.showOptions = true;
					console.info(item)

				}

                //当离开的信息是航前，且有航后的信息
                if(item.departureStationJob.jobType && item.departureStationJob.jobType.toUpperCase() == 'PR/F' && item.arrivalStationJob.jobType && item.arrivalStationJob.jobType.toUpperCase() == 'PO/F'){
					item.departureStationJob.acType  = item.acType;
					item.departureStationJob.flightId  = item.flightId;
					item.arrivalStationJob.acType  = item.acType;
					item.arrivalStationJob.flightId  = item.flightId;
                	scope.svTypes = [
                        {
                            name:'Pr/F APU使用',
                            obj:item,
                            jobType:'Pr/F'

                        },
                        {
                            name:'Po/F APU使用',
                            obj:item,
                            jobType:'Po/F'

                        }
                    ];
                    scope.showOptions = true;

                    console.info(item)
                }
            }
		}
	]);
})();