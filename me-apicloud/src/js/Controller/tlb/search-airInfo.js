module.exports = angular.module('myApp').controller('searchAirInfoController',
	['$rootScope', '$scope', '$stateParams', 'server', '$localForage', 'configInfo', '$filter',
		function($rootScope, $scope, $stateParams, server, $localForage, configInfo, $filter) {
			var that = this;
			//$rootScope.endLoading();
			$scope.formData = $stateParams.formData;
			$scope.tlbNumber = $stateParams.formData.tlbDTO.tlbNo;
			$scope.finderInfo = $stateParams.finderInfo;
			$scope.riiSingerInfo = $stateParams.riiSingerInfo;
			$scope.MECHSiner = $stateParams.MECHSiner;
            $scope.oilEwisInfo = $stateParams.oilEwisInfo;
            $scope.zoneInfo = $stateParams.zoneInfo;
			var pageSize = 20;
			$scope.searchDate = new Date();
			$scope.today = new Date();

			/*
			 *点击搜索按钮搜索
			 */
			$scope.clickBtnSearch = function(searchTxt){
				that.currentPage = 1;
				$scope.noMoreData = false;
				$scope.flights = [];
				var param = {
					pageSize: pageSize,
					pageIndex: 1,
					inputValue: searchTxt || '',
					dateFound: new Date($filter('date')($scope.searchDate,'yyyy-MM-dd')).getTime() || new Date($filter('date')($scope.today,'yyyy-MM-dd')).getTime()
				}
				that.curParam = param;

				if(!that.requesting){
					that.requesting = true; //防止在底部时同时执行nextPage
					$scope.searchFlights(param);
				}

			}

			/*
			 *获取下页的数据
			 */
			$scope.getNextPage = function() {
				if(!that.requesting){
					$scope.searchFlights(that.curParam);
				}
				//if(!$scope.noMoreData && !that.requesting) {
				//	that.curParam.pageIndex = ++that.currentPage;
				//
				//	if(Math.ceil(that.total / pageSize) >= that.curParam.pageIndex){
				//		that.requesting = true; //防止在底部时同时执行nextPage
				//		$scope.searchFlights(that.curParam);
				//	}else{
				//		$scope.noMoreData = true;
				//	}
				//
				//}
			}
			/**
			 * 搜索航材
			 * @param 用户输入(PN or PN名称)
			 *
			 */
			$scope.searchFlights = function(param){
				//if(param.inputValue){
				$rootScope.startLoading();
				//defect/getDefectListInfo
				server.maocGetReq('TBM/findStaTask', param).then(function(data) {
					that.requesting = false;
					if(200 === data.status) {
						that.total = data.data.total;
						$scope.flights = data.data.data && $scope.flights.concat(data.data.data) || [];

						//if(Math.ceil(that.total / pageSize) == param.pageIndex){
						//	$scope.noMoreData = true;
						//}
					}
					//if(data.data.dataSize==0){
					$rootScope.endLoading();
					//}

				}).catch(function(error) {
					console.log(error);
					$rootScope.endLoading();
				});
				//}else{
				//$scope.holderValue = lanConfig.paramLimit;
				//that.requesting = false;
				//}

			};
			//输入搜索条件后回车返回搜索结果
			$scope.enter = function(ev, searchTxt){
				if(ev.keyCode == 13){
					ev.preventDefault();
					$scope.clickBtnSearch(searchTxt);
				}
			};

			$scope.clickBtnSearch(); //进入页面后默认查询当天数据

            //根据航班状态获取航班号，以保证新建故障显示航班后，与故障建完后的航班号一致
            $scope.getFlightNo = function (oneAirInfo, type) {

            	var checkType = type == 'pof' ? oneAirInfo.pofCheckType : oneAirInfo.checkType;
            	var jobdate = $filter('date')(new Date(oneAirInfo.jobDate), "yyyy/MM/dd HH:mm:ss")

                var params = {acReg:oneAirInfo.acReg,
                    checkType: checkType,
                    flightNo:oneAirInfo.flight || 'N/A',
                    jobDate:jobdate
                };
                $rootScope.startLoading();
                server.maocGetReq('Pend/getFlbFlightLog',params).then(function (result) {
                    console.log(JSON.stringify(result));
                    $rootScope.endLoading();
                    if (result.status == 200) {
                        var newFlightNo = result.data.data[0].preFlightNo;
                        var minorModel=result.data.data[0].minorModel;
						$scope.zoneInfo.zone_model=result.data.data[0].model
                        $scope.goTlbDetail(oneAirInfo,type,newFlightNo,minorModel);
                    }
                }).catch(function (error) {
                    $rootScope.endLoading();
                });
            };

			$scope.goTlbDetail = function(oneAirInfo, type,flightNo,minorModel){

				$scope.formData.tlbDTO.flightNo = flightNo || 'N/A';
				$scope.formData.tlbDTO.acReg = oneAirInfo.acReg;
				$scope.formData.tlbDTO.minorModel = minorModel;
				$scope.formData.tlbDTO.flightId = oneAirInfo.flightId || null;

				if(type != 'pof'&& type != 'O/G'){
					$scope.formData.tlbDTO.staFound = oneAirInfo.fromStation || oneAirInfo.station;
                     $scope.formData.actionDTO.staAction = oneAirInfo.fromStation || oneAirInfo.station;
                     $scope.formData.actionDTO.lineJobId = oneAirInfo.id;
                     $scope.formData.tlbDTO.dmStatus = oneAirInfo.dmStatus;
                }else if(type != 'pof'&& type == 'O/G'){
					$scope.formData.tlbDTO.staFound = oneAirInfo.fromStation || oneAirInfo.station;
					$scope.formData.actionDTO.staAction = oneAirInfo.toStation || oneAirInfo.station;
					$scope.formData.actionDTO.lineJobId = oneAirInfo.id;
					$scope.formData.tlbDTO.dmStatus = oneAirInfo.dmStatus;
				}
				else {
					$scope.formData.tlbDTO.staFound = oneAirInfo.toStation;
                     $scope.formData.actionDTO.staAction = oneAirInfo.toStation;
                     $scope.formData.actionDTO.lineJobId = oneAirInfo.pofId;
                     $scope.formData.tlbDTO.dmStatus = oneAirInfo.dmStatus;
                }

				$rootScope.go(
					'tlbDetail',
					'slideRight',
					{
						//tlbNumber: $scope.tlbNumber,
						formData: $scope.formData,
						getOtherInfo: true,
						finderInfo: $scope.finderInfo,
						riiSingerInfo: $scope.riiSingerInfo,
						MECHSiner: $scope.MECHSiner,
						zoneInfo: $scope.zoneInfo,
                        oilEwisInfo: $scope.oilEwisInfo
					}
				);
			}

		}
	]);