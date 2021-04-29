module.exports = function($scope, airport,configInfo,favoriteFlight,$routeParams,$location,flightInfo, $rootScope, $q, umengEventIdTransform){
	umengEventIdTransform.umengSaveCoustomEvent(umengEventIdTransform.custom_Event.clickFlightFocusButton, {userCode: configInfo.user})
	var that = this;
	$scope._4codeCityName = airport._4codeCityName;
	$scope.isFavorite = true;
	$rootScope.isSearchFavorite = true;//标记是否为收藏和搜索页面，详情页返回时用到
	$rootScope.isFlightDetail = false; //详情页返回时显示界面缓存用
	//点击收藏或者取消收藏
	 $scope.favorite = function($event,flight) {
	 	if(flight.favorite){
	 		favoriteFlight.removeFavoriteFlight(flight.flightId).then(function(data){
	    	if (data) {
	    		//$event.next().removeClass('swipe-left');
	    		//$event.parent().next().removeClass('swipe-left');
	    		$event.parent().addClass('del-card');
	    		setTimeout(function(){
	    			$event.parent().remove();
	    		},500);
	    		delete flight.favorite;	 
	    	}else {
	    		alert('取消关注失败');	
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
	    	}else {
	    		alert('添加关注失败');
	    	}
		    }).catch(function (error) {
		    	 console.log(error);
		    });	
	 	}
	};

	function getAllFavorFlights(){
		flightInfo.getAllFavoriteFlights().then(function(data){
			if (angular.isArray(data)) {
				data.forEach( function(element, index) {
					element.favorite = true;
				});
				$scope.flights = data;
			}else {
				$scope.flights = [];				
			}
		}).catch(function(data){

		});
		//$rootScope.endLoading();
	};

	getAllFavorFlights();
	//返回
	$scope.goBack = function(){
		$rootScope.go('back', 'slideRight');
		$rootScope.isSearchFavorite = false;
	}
	window.goBack = $scope.goBack;

}