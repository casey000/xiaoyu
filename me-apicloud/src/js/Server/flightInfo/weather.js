module.exports = function (server) {

	/*
	*按照机场四字码搜索天气信息
	*参数 @[_4Code] 机场四字码。 必填
	*/
	this.getWeatherWith4Code = function(_4Code){
		return server.maocGetReq('flight/weatherReport',{airport:_4Code});
	};	 

	/*
	*按照航班号搜索天气信息
	*参数 @[flightNo] 航班号。 必填
	*/
	this.getWeatherWithFlightNo = function(flightNo){
		return server.maocGetReq('flight/weatherReport',{flightNo:flightNo});
	};
};