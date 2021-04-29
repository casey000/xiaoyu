module.exports =  angular.module('myServers').service('favoriteFlight',['server',function(server){
	
	var that = this;
	
	/*
	*将某个航班添加入收藏
	*@param {String} [flightID] 被收藏的某个航班的flightId
	*/
	this.addFavoriteFlight = function(flightID){
		if (flightID) {
			return server.maocPostReq('flight/focusOnFlight',{flightId:flightID}).then(function(data){
				var beSucces = 0;
				if (data.status == 200) {
					that.focusFlightIds.push(flightID);
					beSucces = 1;
                    NativeAppAPI.focusFlight();
                }
				return beSucces;
			}).catch(function(error){
				console.log(error);
			});	
		}
	};

	/*
	*将某个航班移除收藏
	*@param {String} [flightID] 被一处收藏的某个航班的flightId
	*/
	this.removeFavoriteFlight = function(flightID){
		if (flightID) {
			return server.maocPostReq('flight/unfocusFlight',{flightId:flightID}).then(function(data){
				var beSucces = 0;
				if (data.status == 200) {
					var index = that.focusFlightIds.indexOf(flightID);
					if (-1 != index) {
						that.focusFlightIds.splice(index, 1);
					}
					beSucces = 1;
                    NativeAppAPI.focusFlight();
                }
				return beSucces;
			}).catch(function(error){
				console.log(error);
			});	
		}
	};

	/*
	*判断某个航班是否为收藏的航班
	*@param {String} [flightId] 被查询的航班的flightId
	*@param {Function} [onSuccess] 查询的成功的回调函数。回调函数的只有一个。就是被搜查的结果
	*/
	this.isFavorite = function(flight){
		flight.favorite = this.focusFlightIds?(this.focusFlightIds.indexOf(flight.flightId) != -1):0;
	};

	/*
	*获取所有的收藏的航班
	*
	*/
	this.getAllFavoriteFlights = function () {
		return server.maocGetReq('flight/focusOnflightListInfo',{}).then(function (data) {
			 var responseData = [];
			 if (data.status == 200) {
			 	responseData = data.data.data||[];
			 }
			 return responseData;
		}).catch(function(error){
			console.log(error);		
			
		})	 
	};

	/*
	*获取所有的收藏的航班flightId
	*
	*/
	this.getAllFavoriteFlightIds = function () {
		return server.maocGetReq('flight/flightIdListByUserFocus',{}).then(function (data) {
			 if (data.status == 200) {
			 	that.focusFlightIds = data.data.data||[];
			 }else {
			 	that.focusFlightIds = [];
			 }
		}).catch(function(error){
			console.log(error);		
			
		})	 
	};

 }]);
