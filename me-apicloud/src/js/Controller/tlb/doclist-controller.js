module.exports = angular.module('myApp').controller('docNoListController',
	['$rootScope', '$scope', '$stateParams', 'server', '$localForage', 'configInfo', '$filter',
		function($rootScope, $scope, $stateParams, server, $localForage, configInfo, $filter) {
			var that = this;
			var pageSize = 20;
			$rootScope.endLoading();

			$scope.formData = $stateParams.formData;
			$scope.ctrlDocType = $stateParams.formData.tlbDTO.ctrlDocType;
			$scope.finderInfo = $stateParams.finderInfo;
			$scope.riiSingerInfo = $stateParams.riiSingerInfo;
			$scope.MECHSiner = $stateParams.MECHSiner;
            $scope.oilEwisInfo = $stateParams.oilEwisInfo;
            $scope.zoneInfo = $stateParams.zoneInfo;

			/*
			 *点击搜索按钮搜索
			 */
			$scope.clickBtnSearch = function(searchTxt){
				that.currentPage = 1;
				$scope.noMoreData = false;
				$scope.balanceInfo = [];
				var param = {
					pageSize: pageSize,
					pageIndex: 1,
					inputValue: searchTxt || '',
					docType: $scope.ctrlDocType
				}
				that.curParam = param;

				if(!that.requesting){
					that.requesting = true; //防止在底部时同时执行nextPage
					$scope.searchDocList(param);
				}

			}

			/*
			 *获取下页的数据
			 */
			$scope.getNextPage = function() {
				if(!$scope.noMoreData && !that.requesting) {
					that.curParam.pageIndex = ++that.currentPage;

					if(Math.ceil(that.total / pageSize) >= that.curParam.pageIndex){
						that.requesting = true; //防止在底部时同时执行nextPage
						$scope.searchDocList(that.curParam);
					}else{
						$scope.noMoreData = true;
					}

				}
			}
			/**
			 * 搜索DOC相关信息
			 * @param 用户输入(飞机号等信息)
			 *
			 */
			$scope.searchDocList = function(param){
				//if(param.inputValue){
				$rootScope.startLoading();
				//defect/getDefectListInfo
				server.maocGetReq('TLB/findControlDoc', param).then(function(data) {
					that.requesting = false;
					if(200 === data.status) {
						that.total = data.data.total;
						$scope.balanceInfo = data.data.data && $scope.balanceInfo.concat(data.data.data) || [];

						if(Math.ceil(that.total / pageSize) == param.pageIndex){
							$scope.noMoreData = true;
						}
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
				that.requesting = false;
				//}

			};
			//输入搜索条件后回车返回搜索结果
			$scope.enter = function(ev,materialsearchTxt){
				if(ev.keyCode == 13){
					ev.preventDefault();
					$scope.clickBtnSearch(materialsearchTxt);
				}
			};

			$scope.clickBtnSearch(); //进入页面后默认查询当天数据

			$scope.goTlbDetail = function(oneInfo){
				$scope.formData.tlbDTO.ctrlDocNo = oneInfo.docNo;
				$scope.formData.tlbDTO.ctrlDocId = oneInfo.id;

				$rootScope.go(
					'tlbDetail',
					'slideRight',
					{
						tlbNumber: $scope.tlbNumber,
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