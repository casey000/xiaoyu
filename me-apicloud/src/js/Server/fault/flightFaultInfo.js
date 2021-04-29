module.exports = angular.module('myServers').service('flightFaultInfo',['server','favoriteFlight','filterFaultFlightInfo',function(server, favoriteFlight,filterFlightInfo) {
	var that = this;
	var everyPageSize = 20;

	this.getAllFlightInfo = getAllFlightInfo;
	this.getFlightinfoWithParams = getFlightinfoWithParams;
	this.orderFlights = orderFlights;
	this.cleanFlights = cleanFlights;
	this.cleanSearchFlights = cleanSearchFlights;
	this.getNextPage = getNextPage;
	this.getAllFavoriteFlights = getAllFavorFlights;
	this.filterFlight = filterFlight;
	this.changeFlightStatus = changeFlightStatus;
	this.countAllFilertFlights = countAllFlights;
	this.allFavorFlights = [];
	this.currentPage = 0;
	this.filterFlightCounts = {
		filterTotalFlights : 0,				//筛选后 的总航班数
		filterStandbyNum   : 0,				//筛选后 未飞的航班数
		filterTakeoffNum   : 0,				//筛选后 起飞的航班数
		filterLandedNum    : 0,				//筛选后 到达的航班数
		filterAbnormalNum  : 0,				//筛选后 异常的航班数
	};

	this.flightCounts = {
		totalFlights : 0,				//总航班数
		standbyNum   : 0,				//未飞的航班数
		takeoffNum   : 0,				//起飞的航班数
		landedNum    : 0,				//到达的航班数
		abnormalNum  : 0,				//异常的航班数
	};
	/*
	 *	按照日期，航班号，机号获取所有实时航班动态。
	 *	@[params] {object}
	 *	例
	 *	params = {
	 *		time:1467171181211,
	 *		flightNo:'6869',
	 *		acReg:'7869'
	 *	}
	 *	[time]	航班日期,毫秒为单位的UNIX时间戳。必填
	 *	{flightNo}	航班号,支持模糊查询。	选填
	 *	{acReg}	机号,支持模糊查询。    选填
	 */
	function getAllFlightInfo(params, isNewFault) {
		console.log("进来4");
		if(angular.isDate(params.time)) {
			params.time = params.time.valueOf();
		}

		var interfaceUrl = 'maintain/meJobList';
		that.flights = [];
		return server.maocGetReq(interfaceUrl, params).then(function(data) {
			if(200 === data.status) {
				that.flights = data.data.data || [];
				orderFlights(that.flights);
				that.currentPage = 0;
				that.endDatetime = data.data.endDatetime;
				that.beginDatetime = data.data.beginDatetime;
				filterFlight();
				countAllFlights();

				return {
					data: getNextPage(),
					endDatetime: data.data.endDatetime,
					beginDatetime: data.data.beginDatetime
				};
			}else {
				that.flights = [];
				that.allFilterFlights = [];
				this.allFavorFlights = [];
				that.filterArray = [];
				countAllFlights();
				return {
					data: []
				};
			}

		}).catch(function(error) {
			return error;
		});
	}

	/*
	 *	按照日期，或者机场三字码，或者机场四字码，或者机场中文名称，
	 *	和航班号，注册号 查询 航班动态。
	 *	@[params] {object}
	 *	params = {
	 *		time:1467171181211,
	 *		searchKey:'Airport3Code',//按照机场三字码搜索
	 *		searchValue:'345',
	 *		direction:''
	 *	}
	 *	[time]	航班日期,毫秒为单位的UNIX时间戳 例如1467171181211。必填
	 *	[searchKey] 指明按照什么搜索--（都支持模糊搜索）
	 *			Airport3Code:表明按照机场三字码搜索，
	 *			Airport4Code: 表明按照机场四字码搜索，
	 *			AirportName:  表明按照机场名称搜索,
	 *			FlightNo: 表明按照航班号搜索。
	 *			AcReg: 表明按照机号搜索。
	 *	[searchValue] 要搜索的内容
	 *	{direction}	出港值为departure。进港值为arrival,不填表示出发和到达都查
	 */
	function getFlightinfoWithParams(params, isNewFault) {
		var interfaceUrl = 'maintain/meJobList';
		params.refreshCache = true;

		if(isNewFault) {
			params.time = params.t;
			delete params.t;
		}

		return server.maocGetReq(interfaceUrl, params).then(function(data) {
			if(200 === data.status) {
				that.searchFlights = data.data.data || [];
				that.searchEndDatetime = data.data.endDatetime;
				that.searchBeginDatetime = data.data.beginDatetime;
			}
			orderFlights(that.searchFlights);
			return {
				data: that.searchFlights,
				endDatetime: data.data.endDatetime,
				beginDatetime: data.data.beginDatetime
			};

		}).catch(function(error) {
			return error;
		});
	}

	/*
	 *对返回的数据进行排序
	 * 进港按到达时间排序
	 * @param filterArray
	 * desc=true时降序排列，不传默认升序排列
	 * */
	function orderFlights(filterArray, desc) {
		return filterArray;
		console.log("-----------------------分割线---------------");
		console.log(JSON.stringify(filterArray));
		console.log("-----------------------分割线---------------");
		that.allFavorFlights = [];
		filterArray.forEach(function(element, index) {
			if( filterFlightInfo.filterParams.direction.length && 'arrival' === filterFlightInfo.filterParams.direction) {
				element.predicate1 = element.ata || element.eta || element.sta;
			} else {
				element.predicate1 = element.atd || element.etd || element.std;
			}
			favoriteFlight.isFavorite(element);
			if (element.favorite) {
				that.allFavorFlights.push(element);
			}
		});

		filterArray.sort(function(item1, item2) {
			if(!desc){
				return item1.predicate1 - item2.predicate1;
			}else{
				return item2.predicate1 - item1.predicate1;
			}

		});
	};

	function cleanFlights() {
		that.showFlights = [];
		that.flights = [];
		this.page = 0;
		filterFlightInfo.filterParams.filterFlightStatus = 0;
	};

	function cleanSearchFlights() {
		that.searchFlights = [];
		if (that.searchParams) {
			delete that.searchParams;
		}

	};

	function getNextPage() {
		totalPageSize = Math.ceil(that.alterShowFlights.length / everyPageSize);
		if(that.currentPage >= totalPageSize) {
			return [];
		} else {
			var newPageData = that.alterShowFlights.slice(that.currentPage * everyPageSize, (that.currentPage + 1) * everyPageSize);
			that.currentPage += 1;
			return newPageData;
		}
	};

	function getAllFavorFlights(argument) {
		return server.maocGetReq('flight/focusOnflightListInfo', {}).then(function(data) {
			if(data.status == 200) {
				that.focusFlightIds = data.data.data || [];
			} else {
				that.focusFlightIds = [];
			}
			orderFlights(that.focusFlightIds, true);
			return that.focusFlightIds;
		}).catch(function(error) {
			console.log(error);
		})
	};

	function filterFlight() {
		filterArray = [];
		var params = filterFlightInfo.filterParams;
		angular.copy(that.flights, filterArray);
		if (params) {
			if (params.filterAirPorts.length) {
				filterArray = that.flights.filter(function (item) {
					if (angular.isString(params.direction)&&params.direction.length) {
						if ('departure' === params.direction) {
							return -1 != params.filterAirPorts.indexOf(item.departureAirport3Code);
						}else if ('arrival' === params.direction) {
							return -1 != params.filterAirPorts.indexOf(item.arrivalAirport3Code);
						}else{
							return (-1 != params.filterAirPorts.indexOf(item.departureAirport3Code) || -1 != params.filterAirPorts.indexOf(item.arrivalAirport3Code));
						}
					}else {
						return (-1 != params.filterAirPorts.indexOf(item.departureAirport3Code) || -1 != params.filterAirPorts.indexOf(item.arrivalAirport3Code));
					}
				});
			}

			//增加日期筛选
			//var beginTimeFilter = that.beginDatetime + params.filterBeginDate;
			//var endTimeFilter = that.endDatetime + params.filterEndDate;
			//filterArray = filterArray.filter(function (item) {
			//	return item.std >= beginTimeFilter;
			//});
			//filterArray = filterArray.filter(function (item) {
			//	return item.std <= endTimeFilter;
			//});

			if (params.filterFlightNos.length) {
				filterArray = filterArray.filter(function (item) {
					return  -1 !=  params.filterFlightNos.indexOf(item.flightNo);
				});
			}

			if (params.filterAcRegs.length) {
				filterArray = filterArray.filter(function (item) {
					return  -1 !=  params.filterAcRegs.indexOf(item.acReg);
				});
			}
		}
		orderFlights(filterArray);//排序
		that.allFilterFlights = filterArray;
		countAllFlights();//分类计数
		changeFlightStatus();//更换状态栏
	}

	function countAllFlights() {
		/*航班数量统计*/
		that.flightCounts = {
			totalFlights : 0,				//总航班数
			standbyNum   : 0,				//未飞的航班数
			takeoffNum   : 0,				//起飞的航班数
			landedNum    : 0,				//到达的航班数
			abnormalNum  : 0,				//异常的航班数
		};
		that.flightCounts.totalFlights = that.flights.length;
		that.flights.forEach(function (item) {
			if (typeof item.flgCs != "undefined" || typeof item.flgDelay != 'undefined' || typeof item.flgVr != 'undefined') {
				that.flightCounts.abnormalNum++
			}
			switch (item.flyStatus) {
				case 'STAND_BY': //返回未飞
					if( typeof item.flgCs == "undefined" ){
						that.flightCounts.standbyNum++;
					}
					break;
				case 'TAKE_OFF': //返回起飞
					that.flightCounts.takeoffNum++;
					break;
				case 'LANDED': //返回到达
					that.flightCounts.landedNum++;
					break;
				default:
					break;
			}

		});

		that.allFilterStandByFlights= [];
		that.allFilterTakeOffFlights= [];
		that.allFilterLandedFlights= [];
		that.allFilterAbnormalFlights= [];

		that.allFilterFlights.forEach(function (item) {
			if (typeof item.flgCs != "undefined" || typeof item.flgDelay != 'undefined' || typeof item.flgVr != 'undefined') {
				that.allFilterAbnormalFlights.push(item);
			}
			switch (item.flyStatus) {
				case 'STAND_BY': //未飞
					if( typeof item.flgCs == "undefined" ){
						that.allFilterStandByFlights.push(item);
					}
					break;
				case 'TAKE_OFF': //起飞
					that.allFilterTakeOffFlights.push(item);
					break;
				case 'LANDED': //到达
					that.allFilterLandedFlights.push(item);
					break;
				default:
					// statements_def
					break;
			}

		});
		that.filterFlightCounts.filterTotalFlights = that.allFilterFlights.length;
		that.filterFlightCounts.filterTakeoffNum = that.allFilterTakeOffFlights.length;
		that.filterFlightCounts.filterLandedNum = that.allFilterLandedFlights.length;
		that.filterFlightCounts.filterStandbyNum = that.allFilterStandByFlights.length;
		that.filterFlightCounts.filterAbnormalNum = that.allFilterAbnormalFlights.length;
	}

	function changeFlightStatus() {
		var params = filterFlightInfo.filterParams;
		if(params.filterFlightStatus == 4){
			that.alterShowFlights = that.allFilterAbnormalFlights;
		}else{
			switch (params.filterFlightStatus) {
				case 1: //返回未飞
					that.alterShowFlights = that.allFilterStandByFlights;
					break;
				case 2: //返回起飞
					that.alterShowFlights = that.allFilterTakeOffFlights;
					break;
				case 3: //返回到达
					that.alterShowFlights = that.allFilterLandedFlights;
					break;
				default:
					// statements_def
					that.alterShowFlights = that.allFilterFlights;
					break;
			}
		}
	}
}]);
