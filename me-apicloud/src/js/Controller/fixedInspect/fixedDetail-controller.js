module.exports = (function() {
	angular.module('myApp').controller('fixedDetailController', ['$scope', 'airport', 'configInfo', 'favoriteFlight', '$stateParams', '$location', 'flightInfo', '$rootScope', '$q', 'paramTransfer', '$timeout', 'filterFlightInfo', 'filterFaultFlightInfo', 'flightFaultInfo', '$filter','brand', 'umengEventIdTransform', 'server',
		function($scope, airport, configInfo, favoriteFlight, $stateParams, $location, flightInfo, $rootScope, $q, paramTransfer, $timeout, filterFlightInfo, filterFaultFlightInfo, flightFaultInfo, $filter,brand, umengEventIdTransform, server)
		{
			var that = this,total = 0;
			var scope = $scope;
			//当为true时，表示没有更多的数据。
			$scope.noMoreData = false;
			$scope.loadMore = false;
			// alert($stateParams.fixedId);
			if($stateParams.fixedId&&$stateParams.acReg){
				$scope.title = $stateParams.acReg;
				$rootScope.acReg = $stateParams.acReg;
			}else if(!$stateParams.fixedId&&$rootScope.acReg){
				$scope.title = $rootScope.acReg;
			}else{
				$scope.title=""
			}
			if($stateParams.fixedId){
				$scope.packageNumber = $stateParams.fixedId;
				$rootScope.packageNumber = $stateParams.fixedId;
			}else{
				$scope.packageNumber = $rootScope.packageNumber;
			};
			if($stateParams.fixedId&&$stateParams.fixModel){
				$scope.fixModel = $stateParams.fixModel;
				$rootScope.fixModel = $stateParams.fixModel;
			}else if(!$stateParams.fixedId&&$rootScope.fixModel){
				$scope.fixModel = $rootScope.fixModel;
			}else{
				$scope.fixModel = "";
			}
			if($stateParams.fixedId&&$stateParams.fixAcid){
				$scope.fixAcid = $stateParams.fixAcid;
				$rootScope.fixAcid = $stateParams.fixAcid;
			}else if(!$stateParams.fixedId&&$rootScope.fixAcid){
				$scope.fixAcid = $rootScope.fixAcid;
			}else{
				$scope.fixAcid = "";
			}
			if($stateParams.fixWorkId){
				$scope.fixWorkId = $stateParams.fixWorkId;
				$rootScope.fixWorkId = $stateParams.fixWorkId;
			}else{
				$scope.fixWorkId = $rootScope.fixWorkId;
			}
			if($stateParams.fixedFlightId){
				$scope.fixedFlightId = $stateParams.fixedFlightId;
				$rootScope.fixedFlightId = $stateParams.fixedFlightId;
			}else{
				$scope.fixedFlightId = $rootScope.fixedFlightId;
			}

			if($stateParams.fixStatus){
				$scope.fixStatus = $stateParams.fixStatus;
				$rootScope.fixStatus = $stateParams.fixStatus;
			}else{
				$scope.fixStatus = $rootScope.fixStatus;
			};

			if($stateParams.fixedFlightNo){
				$scope.fixedFlightNo = $stateParams.fixedFlightNo;
				$rootScope.fixedFlightNo = $stateParams.fixedFlightNo;
			}else{
				$scope.fixedFlightNo = $rootScope.fixedFlightNo;
			};

			if($stateParams.fixedJobDate){
				$scope.fixedJobDate = $stateParams.fixedJobDate;
				$rootScope.fixedJobDate = $stateParams.fixedJobDate;
			}else{
				$scope.fixedJobDate = $rootScope.fixedJobDate;
			};

			if($stateParams.fixedStation){
				$scope.fixedStation = $stateParams.fixedStation;
				$rootScope.fixedStation = $stateParams.fixedStation;
			}else{
				$scope.fixedStation = $rootScope.fixedStation;
			};

			if($stateParams.fixedDmStatus){
				$scope.fixedDmStatus = $stateParams.fixedDmStatus;
				$rootScope.fixedDmStatus = $stateParams.fixedDmStatus;
			}else{
				$scope.fixedDmStatus = $rootScope.fixedDmStatus;
			};
			if($stateParams.fixedRevtp){
				$scope.fixedRevtp = $stateParams.fixedRevtp;
				$rootScope.fixedRevtp = $stateParams.fixedRevtp;
			}else{
				$scope.fixedRevtp = $rootScope.fixedRevtp;
			};
			$scope.showAdd = true;
			if($scope.fixStatus == 'UNRELEASED'){
				$scope.showAdd = false;
			}
			var lanConfig = require('../../../../i18n/lanConfig');
			//返回
			$scope.goBack = function(){
				$rootScope.go('back');
			};
            $scope.localConfig = {
				'vc': lanConfig.vc,
				'rc': lanConfig.rc
			};
			var queryJSON ={
				pageSize: 20,
				pageIndex: 1,
				type:  "ROUTINE_TASK",
				workType:'NRC,DEFECT',
				packageNumber:$scope.packageNumber
			};
			$scope.dataList = [];
			NativeAppAPI.hideTabBar();
			$scope.init = function (){
				$rootScope.startLoading();
				server.maocGetReq('pcheck/listPcheckTask', queryJSON).then(function (data) {
					that.requesting = false;
					if (data.data.statusCode === 200) {
						that.total = data.data.total;
						angular.forEach(data.data.data,function (item,index) {
							if(item.status == "OPEN"){
								item.status = "已开启"
							}
							if(item.status == "ISSUED"){
								item.status = "已下发"
							}
							if(item.status == "COMPLETED"){
								item.status = "已完成"
							}
							if(item.status == "CANCELED"){
								item.status = "已取消"
							}
						});
						if (Math.ceil(that.total / queryJSON.pageSize) == queryJSON.pageIndex) {
							$scope.noMoreData = true;
						}
						$scope.dataList = data.data.data && $scope.dataList.concat(data.data.data) || [];

					}
					// if (data.data.dataSize == 0) {
					$rootScope.endLoading();
					// }
				}).catch(function (error) {
					$rootScope.endLoading();
				});
			};
			$scope.init();
			$scope.showDefect = function(){
				if($scope.fixStatus != "UNRELEASED"){
					alert("工包已关闭，不能添加故障");
					return;
				}
				var flight = {
					arrivalStationJob:{
						acReg:$scope.title,
						sta:$scope.fixedJobDate,
						jobId:$scope.fixWorkId,
						flightNo:$scope.fixedFlightNo,
						station:$scope.fixedStation,
						jobType:'Po/F',
					},
					acReg:$scope.title,
					sta:$scope.fixedJobDate,
					jobId:$scope.fixWorkId,
					flightNo:$scope.fixedFlightNo,
					flightId:$scope.fixedFlightId,
					station:$scope.fixedStation,
					flightDate:$scope.fixedJobDate,
					jobType:'Po/F',
					dmStatus:$scope.fixedDmStatus,
					fromPage:'fixed'
				};
				if($scope.fixedFlightId){
					$rootScope.go('faultFlight.newfault', '', {flight: flight,dmStatus:true})
				}else{
					alert('请先在PC端选择航班')
				}
                // alert('请在PC端进行新增故障')
			};
			$scope.getNextPage = function () {
				if (!$scope.noMoreData && !that.requesting) {
					if (Math.ceil(that.total / queryJSON.pageSize) > queryJSON.pageIndex) {
						queryJSON.pageIndex++;
						that.requesting = true; //防止在底部时同时执行nextPage
						$scope.init();
					} else {
						$scope.noMoreData = true;
					}
				}
			};
			$scope.toDetail = function(item){
				if(item.workType == 'NRC'){
					$rootScope.go('nrcDetail', '', {nrcId:item.cardId,status:item.status,processId:item.id})
				}
				if(item.workType == 'DEFECT'){
					$rootScope.go('searchFault.faultClose','',{defectId: item.cardId, pt: true, defectInfo: {}, fromSearch: true})
				}
			};
			$scope.toProcess = function(id,event){
                event.stopPropagation();
                $rootScope.go(
                    'nrcfeedbak',
                    '',
                    {
                        nrcInfo:{fromPage:'inspect'},
                        itemId:id
                    }
                );
            };
			$scope.isList = true;
			$scope.lanZh = server.lan === 'zh-cn';
			$scope.navIdx = 1;
			$scope.changeMainNav = function(index){
				if(!that.requesting){
					that.requesting = true; //防止在底部时同时执行nextPage
				}
				$scope.navIdx = index;
				$scope.noMoreData = false;
				queryJSON.pageIndex = 1;
				if(index == 1){
					queryJSON.type = "ROUTINE_TASK";
					$scope.dataList = [];
					$scope.init();
				}
				if(index == 2){
					queryJSON.type = "NON_ROUTINE_TASK";
					$scope.dataList = [];
					$scope.init();
				}
			};

			$scope.addNrc = function (){
				if($scope.fixStatus != "UNRELEASED"){
					alert("工包已关闭，不能添加nrc");
					return;
				}
				console.log('asdfsdfdsfdd:'+$scope.title)
				console.log('asdfsdfdsfdd:'+$scope.fixAcid)
				if($scope.fixedFlightId){
					$rootScope.go('addNrc','',{fixAcreg:$scope.title,fixModel:$scope.fixModel,fixAcid:$scope.fixAcid,fixWorkId:$scope.fixWorkId})
				}else{
					alert('请先在PC端选择航班')

				}
			};



		}])
})()