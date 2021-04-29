module.exports = function ($scope, airport, paramTransfer, flightInfo, favoriteFlight, $rootScope, configInfo,$stateParams, umengEventIdTransform) {
	umengEventIdTransform.umengSaveCoustomEvent(umengEventIdTransform.custom_Event.clickFlightSearchButton, {userCode: configInfo.user})
	NativeAppAPI.hideTabBar();
	$rootScope.endLoading();
	var lanConfig = require('../../../../i18n/lanConfig');

	$scope.isSearch = true;
	$scope.isFlightSearch = true;
	$scope.isNewBrand = true;
	$scope.isNewFault = false;//$stateParams.isNewFault; //是否为新建故障进入
	$rootScope.isSearchFavorite = true; //标记是否为收藏和搜索页面，详情页返回时用到
	$rootScope.isFlightDetail = false; //详情页返回时显示界面缓存用
	$scope.lanZh = server.lan === 'zh-cn';

    $scope.holderValue = lanConfig.inputLimit2;
	$scope._4codeCityName = airport._4codeCityName;
	$scope.searchDate = (flightInfo.searchParams&&flightInfo.searchParams.flightTime&&new Date(new Number(flightInfo.searchParams.flightTime)))||(paramTransfer.get().flightTime instanceof Date && paramTransfer.get().flightTime)
	||new Date();
	$scope.searchTxt = flightInfo.searchParams&&flightInfo.searchParams.searchValue||'';

	$scope.search = search;

	function search (params) {
		flightInfo.searchParams = params;
		searchFlight(params);
		
	}
	var apiExist = setInterval(function(){
		if( typeof api != 'undefined' ){
			api.addEventListener({
				name: 'updateFlight'
			}, function(ret, err){
				$scope.getAllFlightInfo()
			});
			window.clearInterval(apiExist);
		}
	}, 20);
	$scope.getAllFlightInfo = function() {
		$scope.pullToRefreshActive = true;

		$scope.searchAction();


	};
	function searchFlight(params){
		var searchTime = new Date(params.time);
		searchTime.setHours(23);
		searchTime.setMinutes(59);
		searchTime.setSeconds(59);
		flightInfo.getFlightinfoWithParams({w:params.searchValue,t:searchTime.getTime()}, $stateParams.isNewFault).then(function(data){
			$scope.beginDatetime = data.beginDatetime;
			$scope.endDatetime = data.endDatetime;
			$scope.flights = angular.isArray(data.data) ? data.data : [];
			//结束加载
			$rootScope.endLoading();
			$scope.pullToRefreshActive = false;

		}).catch(function (error) {
			$scope.flights = [];
			console.log(error);
			$scope.pullToRefreshActive = false;
			//结束加载
			$rootScope.endLoading();
		});
	};

	function initSearchView () {
		if (flightInfo.searchFlights&&flightInfo.searchFlights.length) {
			$scope.beginDatetime = flightInfo.searchBeginDatetime;
			$scope.endDatetime = flightInfo.searchEndDatetime;
			$scope.flights = flightInfo.searchFlights;
		}	 
	}

	$scope.clickFunc = function (flight) {
		setTimeout(function (){
			$rootScope.go('flightStatus.flightDetail', 'slideLeft', {
				flightId: flight.flightId,
				openInFlightInfo:true
			})
		},200)
	}
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
		flightInfo.searchParams	= {};
		flightInfo.searchFlights = [];
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

	$scope.backToList = function () {
        NativeAppAPI.showTabBar();
        $rootScope.go('back','slideRight');
    }
}