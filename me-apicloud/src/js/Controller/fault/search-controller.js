module.exports = angular.module('myApp').controller('searchFaultController',
 ['$rootScope', '$scope', '$stateParams', 'server', '$localForage', 'configInfo', '$filter', 
 function($rootScope, $scope, $stateParams, server, $localForage, configInfo, $filter) {
	NativeAppAPI.hideTabBar();
	var that = this;
	$rootScope.endLoading();
	var pageSize = 20;
     // $scope.searchDate = new Date();
     $scope.searchTxt = $stateParams.searchTxt || '';

	/*
	 *点击搜索按钮搜索
	 */
	$scope.clickBtnSearch = function(materialsearchTxt){
		that.currentPage = 1;		
		$scope.noMoreData = false;
		$scope.balanceInfo = [];
		var param = {
			pageSize: pageSize,
			pageIndex: 1,
			inputValue: materialsearchTxt || '',
            dateFound: new Date($filter('date')($scope.searchDate,'yyyy-MM-dd')).getTime() || 0
        }
		that.curParam = param;
		
		if(!that.requesting){
			that.requesting = true; //防止在底部时同时执行nextPage
			$scope.searchBalanceInfo(param);
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
				$scope.searchBalanceInfo(that.curParam);
			}else{
				$scope.noMoreData = true;
			}
			
		}
	}
	/**
	 * 搜索航材
	 * @param 用户输入(PN or PN名称)
	 * 
	 */
	$scope.searchBalanceInfo = function(param){
			$rootScope.startLoading();

			server.maocPostReq('defect/getDefectListInfo', param).then(function(data) {
				that.requesting = false;
				if(200 === data.status) {					
					that.total = data.data.total;
					$scope.balanceInfo = data.data.data && $scope.balanceInfo.concat(data.data.data) || [];
					
					if(Math.ceil(that.total / pageSize) == param.pageIndex){
						$scope.noMoreData = true;
					}
				}

				$rootScope.endLoading();
			}).catch(function(error) {
				console.log(error);
				$rootScope.endLoading();
			});	

			that.requesting = false;
	};
	//输入搜索条件后回车返回搜索结果
	$scope.enter = function(ev,materialsearchTxt){
		if(ev.keyCode == 13){
			ev.preventDefault();
			$scope.clickBtnSearch(materialsearchTxt);
		}
	};

	 $scope.clickBtnSearch($scope.searchTxt); //进入页面后默认查询当天数据

	 $scope.goBack = function(){
		 $localForage.removeItem('fromSearchFault').then(function() {
			 console.log('fromSearchFault is cleared!');
			 if ($stateParams.fromIndex) {
                 $rootScope.go('index');
             }
			 else {
                 $rootScope.go('back');
             }
		 })
	 }
	 //Android返回键单独处理
	 if($rootScope.android){
		 api.removeEventListener({
			 name: 'angularKeyback'
		 });

		 api.addEventListener({
			 name: 'angularKeyback'
		 }, function(ret, err){
			 $scope.goBack();
		 });
	 }
 }
]);