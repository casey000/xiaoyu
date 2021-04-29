module.exports = angular.module('myApp').controller('searchToolController', 
	['$rootScope', '$scope', 'server', 'configInfo', 'airport',
	function($rootScope, $scope, server, configInfo, airport) {
		NativeAppAPI.hideTabBar();
		var that = this;
		var pageSize = 20;
		
		$rootScope.endLoading();
		$scope.type = 'stock';

		var lanConfig = require('../../../../i18n/lanConfig');
		$scope.holderValue = lanConfig.inputLimitPn;
		
		/**
		 * 搜索条件输入
		 * @param 用户输入(PN or PN名称)
		 * 
		 */
	    var search = function(param) {
				$rootScope.startLoading();
				var requestURL = 'me/tool/inventory'; //默认是库存
				if($scope.type == 'lend'){
					requestURL = 'me/tool/lending';
				}
				server.maocGetReq(requestURL, param).then(function(data) {
					$scope.requesting = false;
					if(200 === data.status) {
						
						if($scope.type == 'lend'){
							angular.extend($scope.lend,{
								total: data.data.total
							});
							$scope.lendList = data.data.data && $scope.lendList.concat(data.data.data) || [];
							if(Math.ceil(data.data.total / pageSize) == param.pageIndex) {
								$scope.lend.noMoreData = true;
							}
						}else{
							angular.extend($scope.stock, {
								total: data.data.total
							});
							$scope.stockList = data.data.data && $scope.stockList.concat(data.data.data) || [];
							if(Math.ceil(data.data.total / pageSize) == param.pageIndex) {
								$scope.stock.noMoreData = true;
							}
						}

						if(data.data.dataSize == 0) {
							$rootScope.endLoading();
						}
					}
					

				}).catch(function(error) {
					//console.log(error);
					$rootScope.endLoading();
				});
		};
		/*
		 *点击搜索按钮搜索
		 */
		$scope.clickBtnSearch = function(searchTxt) {
			var param = {
					pageSize: pageSize,
					pageIndex: 1,
					w: searchTxt,
					sort: 'station,nameZhcn',
					order: 'asc,asc',
					currentStation: airport._4codeTo3code[configInfo.airport()] || ''
					
			    };

			if(!$scope.requesting && searchTxt && searchTxt.length>=2){
				//搜索后隐藏‘请按关键字提示进行搜索’的提示图片
					$scope.stockSearch = true;
					$scope.lendSearch = true;
				if($scope.type == 'lend'){
					$scope.lendList = [];
	
					$scope.lend = {
						currentPage: 1,
						noMoreData: false
					};
					param['mode.status'] = 'not';
					param['query.status'] = '100';
					
					
				}else{
					$scope.stockList = [];
					$scope.stock = {
						currentPage: 1,
						noMoreData: false
					};
					// param['query.status'] = '100,107';//100:serviceable,107:reserved
					
				}				
				$scope.curParam = param;
				 //requesting防止点击多次多次加载
				$scope.requesting = true; //是否正在请求数据
				search(param);
			}			
	
		};
		/*
		 *获取下页的数据
		 */
		$scope.getNextPage = function() {
			
			var curInfo = $scope.stock;
			$scope.curParam.w = $scope.searchTxt;
			if($scope.type == 'lend'){
				curInfo = $scope.lend;
				$scope.curParam['mode.status'] = 'not';
				$scope.curParam['query.status'] = '100';
			}
			// else{
			// 	$scope.curParam['mode.status'] = 'in';
			// 	$scope.curParam['query.status'] = '100,107';
			// }
			if(!curInfo.noMoreData && !curInfo.firstPage && !$scope.requesting) {
				
				
				$scope.curParam.pageIndex = ++curInfo.currentPage;
				if(Math.ceil(curInfo.total / pageSize) >= $scope.curParam.pageIndex) {
					$scope.requesting = true; //是否正在请求数据
					search($scope.curParam);
				} else {
					curInfo.noMoreData = true;
				}

			}
		};
		
		//输入搜索条件后回车返回搜索结果
		$scope.enter = function(ev, searchTxt) {
			if(ev.keyCode == 13) {
				ev.preventDefault();
				$scope.clickBtnSearch(searchTxt);
			}
		};
		$scope.rember = function(searchTxt){
			if($scope.type == 'stock'){
				$scope.oldStockSearchTxt = searchTxt;
			}else{
				$scope.oldLendSearchTxt = searchTxt;
			}
			
		}
		//获取个人借的记录数
		server.maocGetReq('me/tool/myLending',{onlyCount: true}).then(function(data) {
			if(200 === data.status) {
				$scope.myLendingCount = data.data.data[0];
			}
		}).catch(function(error) {
			$rootScope.endLoading();
		});
	}
]);