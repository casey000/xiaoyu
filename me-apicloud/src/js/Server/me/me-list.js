module.exports = angular.module('myServers').service('meList',['server','favoriteFlight','mefilterFlightInfo',function(server, favoriteFlight,mefilterFlightInfo) {
	var that = this;
	var everyPageSize = 8;
	
	this.getAllFlightInfo = getAllFlightInfo;
	this.getFlightinfoWithParams = getFlightinfoWithParams;
	this.orderFlights = orderFlights;
	this.cleanFlights = cleanFlights;
	this.cleanSearchFlights = cleanSearchFlights;
	this.getNextPage = getNextPage;
	//this.getAllFavoriteFlights = getAllFavorFlights;
	this.filterFlight = filterFlight;
 	this.currentPage = 0;
	this.oneFlight = '';
    this.allFavorFlights = [];
    /*
     *	按照日期，航班号，机号获取所有实时航班动态。
     *	@[params] {object}
     *	例
     *	params = {
     *		time:1467171181211,
     *		flightNo:'6869',
     *		acReg:'7869'
     *	}
     *	[time]	航班日期,毫秒为单位的UNIX时间戳,必填
     *	{flightNo}	航班号,支持模糊查询。	选填
     *	{acReg}	机号,支持模糊查询。    选填
     */
	function getAllFlightInfo(params) {
        return favoriteFlight.getAllFavoriteFlightIds().then(function(data) {

            if(angular.isDate(params.time)) {
                params.time = params.time.valueOf();
            }

            if(new Date().getHours() < 10){
                params.time += 24 * 3600 * 1000;
            }
            params.refreshCache = true;
            that.flights = [];
            return server.maocGetReq('maintain/meJobList', params).then(function(data) {
                if(200 === data.status) {
                    that.flights = data.data.data || [];
                     orderFlights(that.flights, {});
                    that.currentPage = 0;
                    that.endDatetime = data.data.endDatetime;
                    that.beginDatetime = data.data.beginDatetime;
                    filterFlight();
                    return {
                        data: getNextPage(),
                        endDatetime: data.data.endDatetime,
                        beginDatetime: data.data.beginDatetime
                    };
                }else {
                    that.flights = [];
                    that.allFilterFlights = [];

                    return {
                        data: []
                    };
                }

            }).catch(function(error) {
                return error;
            });

        }).catch(function(error) {
            // console.log(error);
            // $scope.pullToRefreshActive = false;
            //$rootScope.endLoading();
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
	function getFlightinfoWithParams(params) {
		params.refreshCache = true;
		return server.maocGetReq('maintain/meJobList', params).then(function(data) {
			if(200 === data.status) {
				var jobList = data.data.data || [];
				
				return orderFlights(jobList);
			}			 
		});	
	}

	//排序方法
	function orderFlights(filterArray) {
		return filterArray;
		// console.log('处理前'+JSON.stringify(filterArray));
		// console.log('排序前'+filterArray.length);
       	 that.allFavorFlights = [];
       	 var result_array = [].concat(filterArray)
       	 for(var i = 0; i < result_array.length; i++){
       	 	favoriteFlight.isFavorite(result_array[i]);
			if (result_array[i].favorite) {
				//删除关注条目
				var temp = result_array.splice(i,1);
				that.allFavorFlights.push(temp[0]);
			}
       	 }

		 result_array.sort(function(item1, item2) {
		 	return item1.date - item2.date;
		 });

		 //对关注航班进行排序

        that.allFavorFlights.sort(function(item1, item2) {
			return item1.date - item2.date;
		});


        //将关注的条目放在数组最上面展示
        for(var j = that.allFavorFlights.length-1; j >= 0; j--){
        	result_array.unshift(that.allFavorFlights[j])
        }
        return result_array;
        // that.flights = filterArray;
        // console.log('排序组合之后后'+filterArray.length);
        //此处没有变化，为什么？

    };

	function cleanFlights() {
		that.showFlights = [];
		that.flights = [];
		this.page = 0;
	};

	function cleanSearchFlights() {
		that.searchFlights = [];
		if (that.searchParams) {
			delete that.searchParams;
		}
		
	};

	function getNextPage() {
		that.totalPageSize = Math.ceil(that.allFilterFlights.length / everyPageSize);
		if(that.currentPage >= that.totalPageSize) {
			return [];
		} else {
			var newPageData = that.allFilterFlights.slice(that.currentPage * everyPageSize, (that.currentPage + 1) * everyPageSize);
			that.currentPage += 1;
			return newPageData;
		}
	};

	function filterFlight() {
		filterArray = [];
		params = mefilterFlightInfo.filterParams;
		angular.copy(that.flights, filterArray);

        if (params) {
			if (params.filterAirPorts.length) {
				filterArray = that.flights.filter(function (item) {
					// if(item.station) {
					// 	return -1 != params.filterAirports.indexOf(item.station);
					// }
					if ((angular.isString(params.direction)&&params.direction) || item.station) {
						if ('departure' === params.direction) {
							// console.log('1');
							return (-1 != params.filterAirPorts.indexOf(item.departureAirport3Code) || -1 != params.filterAirPorts.indexOf(item.station));
						}else if ('arrival' === params.direction) {
                            // console.log('2');
                            return (-1 != params.filterAirPorts.indexOf(item.arrivalAirport3Code) || -1 != params.filterAirPorts.indexOf(item.station));
						}else{
                            // console.log('3');

                            return (-1 != params.filterAirPorts.indexOf(item.departureAirport3Code) || -1 != params.filterAirPorts.indexOf(item.arrivalAirport3Code)  || -1 != params.filterAirPorts.indexOf(item.station)) ;
						}	
					}else {
                        // 判断有错
							if (-1 != params.filterAirPorts.indexOf(item.departureAirport3Code)) {
								console.log('departureAirport3Code'+item.flightNo);
							}

							if (-1 != params.filterAirPorts.indexOf(item.arrivalAirport3Code)) {
                                console.log('arrivalAirport3Code'+item.flightNo);

                            }

							if (-1 != params.filterAirPorts.indexOf(item.station)) {
                                console.log('station');
                            }

                           return (-1 != params.filterAirPorts.indexOf(item.departureAirport3Code) || -1 != params.filterAirPorts.indexOf(item.arrivalAirport3Code)  || -1 != params.filterAirPorts.indexOf(item.station));
					}
				});	
			}

			//增加日期筛选
//			var beginTimeFilter = that.beginDatetime + params.filterBeginDate;
//			var endTimeFilter = that.endDatetime + params.filterEndDate;
//			filterArray = filterArray.filter(function (item) {
//				return item.flightDate ? (item.flightDate >= beginTimeFilter) && item.flightDate <= endTimeFilter : true;
//			});

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
        // console.log('过滤处理后'+JSON.stringify(filterArray));
        
        // console.log('排序处理后'+JSON.stringify(filterArray));
        that.allFilterFlights = orderFlights(filterArray);;
	}
	
}]);
