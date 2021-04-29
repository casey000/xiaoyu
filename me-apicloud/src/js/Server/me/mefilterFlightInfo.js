module.exports = angular.module('myServers').service('mefilterFlightInfo',['$localForage','localStorage','configInfo','airport',function($localForage,localStorage,configInfo,airport) {
	var that = this;
	// var everyPageSize = 8;
	that.initFilterParams = initFilterParams;
	var filterParams = {
		filterAirPorts:[],
		filterFlightNos:[],
		filterAcRegs:[],
		direction:'',
		// filterBeginDate:0,
		// filterEndDate:0,
		filterFlightStatus:0	//0:全部，1:未飞，2:起飞，3:到达，4:异常
	};
	that.resetChoice = false;
	// var locationAirport = airport._4codeTo3code[configInfo.airport()];

	mefilterParamsDatabase = $localForage.createInstance({
		name: 'mefilterParams'
	});

	that.setFilters = setFilters;
	that.setFilterFlightStatus = setFilterFlightStatus;

	//0:全部，1:未飞，2:起飞，3:到达，4:异常
	function setFilterFlightStatus (flightStatus) {
		 that.filterParams.filterFlightStatus = flightStatus;
	}
	
	function setFilters(newfilterParams) {
		// var filterFlightStatus = that.filterParams.filterFlightStatus;
		// that.filterParams = newfilterParams;
		// that.filterParams.filterFlightStatus = filterFlightStatus;

		that.filterParams.filterAirPorts.length = 0; angular.copy(newfilterParams.filterAirPorts||[],that.filterParams.filterAirPorts);
		that.filterParams.filterFlightNos.length = 0; angular.copy(newfilterParams.filterFlightNos||[],that.filterParams.filterFlightNos);
		that.filterParams.filterAcRegs.length = 0; angular.copy(newfilterParams.filterAcRegs||[],that.filterParams.filterAcRegs);

		that.filterParams.direction = newfilterParams.direction;
		// that.filterParams.filterBeginDate = newfilterParams.filterBeginDate;
		// that.filterParams.filterEndDate = newfilterParams.filterEndDate;

		mefilterParamsDatabase.setItem('mefilterParams',that.filterParams).then(function(){
			console.log('存储筛选数据成功');
		}).catch(function(error){
			console.log(error);
		})
		//存储到本地
	}

	function initFilterParams() {
		//从本地获取存储的参数。
		return mefilterParamsDatabase.getItem('mefilterParams').then(function(data){
			that.filterParams = data|| filterParams;
			that.filterParams.filterFlightStatus = 0;
			// if(!that.resetChoice && !that.filterParams.filterAirPorts.length && !that.filterParams.filterFlightNos.length && !that.filterParams.filterAcRegs.length){
			// 	that.filterParams.filterAirPorts.push(airport._4codeTo3code[configInfo.airport()]);
			// 	console.log('默认选本场');
			// }
			console.log(that.filterParams.filterAirPorts);
		}).catch(function(error){
			console.log(error);
			return
		})
	}
	

	// initFilterParams();
}]);