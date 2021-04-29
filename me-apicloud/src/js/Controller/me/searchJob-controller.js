module.exports = function ($rootScope, $scope, server, $stateParam, meList) {
	$scope.isSearch = true;
	$rootScope.isSearchFavorite = true; //标记是否为收藏和搜索页面，详情页返回时用到
	$rootScope.isMeStatus = false; //详情页返回时显示界面缓存用
	$rootScope.endLoading();
    var scope = $scope;

	var lanConfig = require('../../../../i18n/lanConfig');
	$scope.holderValue = lanConfig.inputLimit3;
	
	//$scope.searchDate = new Date(Number($stateParam.time));
	
	$scope.searchDate = (meList.searchParams&&meList.searchParams.time&&new Date(new Number(meList.searchParams.time)))
	 || new Date(Number($stateParam.time))
	 || new Date();
	$scope.searchTxt = meList.searchParams&&meList.searchParams.w||'';

	function initSearchView () {
		if (meList.searchParams) {
			//$scope.flights = meList.searchFlights;
			$scope.search(meList.searchParams);
		}
        var ua = navigator.userAgent.toLowerCase();
        if(ua.indexOf("mac os x") > 0){
            var reg = /os [\d._]*/gi ;
            var verinfo = ua.match(reg) ;
            var version = (verinfo+"").replace(/[^0-9|_.]/ig,"").replace(/_/ig,".");
            var arr=version.split(".");

            if (arr[0]>14) {
                $scope.isIos14 = true
            }else{
                $scope.isIos14 = false
            }
        }
        if(ua.indexOf('macintosh') > 0){
            $scope.isIos14 = true
        }

    };
	
	$scope.search = function(params) {
		$rootScope.startLoading();
		!angular.isDate(params.time)?'':params.time = params.time.getTime();
		// params.time = params.time.getTime();
		meList.searchParams = params;
		searchFlight(params);		
	};

	initSearchView();

	function searchFlight(params){
		meList.getFlightinfoWithParams(params).then(function(data){			

			$scope.flights = data;
			//结束加载
			$rootScope.endLoading();
			
		}).catch(function (error) {
			$scope.flights = [];
			console.log(error);
			//结束加载
			$rootScope.endLoading();
		});
	};
	
	$scope.enterSearch = function(ev){
		var keyCode = window.event?ev.keyCode:ev.which;
		if(keyCode == 13){
			ev.preventDefault();
			// $scope.search({
			// 	time: $scope.searchDate,
			// 	w: angular.uppercase($scope.searchTxt)
			// });
			$scope.searchAction();
		}
	};



	$scope.setSearchDate = function(event){
		console.log("searchDate");
		if (!angular.isDate($scope.searchDate)) {
			$scope.searchDate = new Date();
		}
	};

	$scope.searchAction = function() {
		var reg = /^[bB]{1}[0-9]{4}/;
		var searchTxt = $scope.searchTxt;
		if (reg.test(searchTxt)) {
			var b = searchTxt.substr(0,1);
			-1!==b.indexOf('b')?(
				searchSubmit(searchTxt.replace('b','B-'))
				):(
				searchSubmit(searchTxt.replace('B','B-'))
			)

		}else
			searchSubmit($scope.searchTxt);
		
	}

	function searchSubmit(txt){
		$scope.search({
				time: $scope.searchDate,
				w: angular.uppercase(txt)
			});
	}

    $scope.goUseSv = function (item,ev) {
        ev.stopPropagation();
        $rootScope.go('svList','',{taskInfo: item});
    };
    scope.svTypes = [];
    scope.goFollowMr = function (item,ev) {
        // $rootScope.errTip = '功能尚在开发中，敬请期待';
        ev.stopPropagation();
        $rootScope.go('followAircraftMaterial', '', {flightNo: item.flightNo,flightId:item.flightId })
    };

    scope.selectOption = function(obj){
        var paramObj = {};
        (obj.jobType == 'Pr/F' ||  obj.jobType == 'T/R' || obj.jobType == 'TBFTR') ? paramObj = obj.obj.departureStationJob : paramObj = obj.obj.arrivalStationJob;
        var params = {workOrderId:paramObj.jobId};

        server.maocGetReq('apuUse/selectApuUseInfoIsExistByWorkOrderId', params).then(function(data) {
            if(200 === data.status) {
                console.info(data.data.data[0],'data.data.data[0]');
                // var boolMark = data.data.data[0] ? true : false;
                // console.info(typeof (data.data.data[0]),'data.data.data[0]');
                !data.data.data[0] ? $rootScope.go('addOrEditApu','',{apuInfo:paramObj,isFirst:true}) : $rootScope.go('apuList','',{workType:paramObj.jobType,jobId:paramObj.jobId,flightId:paramObj.flightId});

            }else{
                $rootScope.errTip = '错误，请联系管理员'
            }
        });

    };
    scope.goUseApu = function (item,ev) {
        ev.stopPropagation();

        console.info(item,'item');
        if(item.jobType && item.jobType.toUpperCase() == 'O/G'){
            console.info(item);
            var params = {workOrderId:item.jobId};
            server.maocGetReq('apuUse/selectApuUseInfoIsExistByWorkOrderId', params).then(function(data) {
                if(200 === data.status) {
                    console.info(data.data.data[0],'data.data.data[0]');
                    // var boolMark = data.data.data[0] ? true : false;
                    // console.info(typeof (data.data.data[0]),'data.data.data[0]');
                    !data.data.data[0] ? $rootScope.go('addOrEditApu','',{apuInfo:item,isFirst:true}):$rootScope.go('apuList','',{workType:'O/G',jobId:item.jobId,flightId:item.flightId});
                }else{
                    $rootScope.errTip = '错误，请联系管理员'
                }
            });

            return
        }
        if(item.arrivalStationJob.jobType && item.arrivalStationJob.jobType.toUpperCase() == 'PO/F' && item.departureStationJob && JSON.stringify(item.departureStationJob) == '{}'){
            console.info(item);
            item.arrivalStationJob.acType  = item.acType;
            item.arrivalStationJob.flightId  = item.flightId;
            var params = {workOrderId:item.arrivalStationJob.jobId};
            server.maocGetReq('apuUse/selectApuUseInfoIsExistByWorkOrderId', params).then(function(data) {
                if(200 === data.status) {
                    console.info(data.data.data[0],'data.data.data[0]');
                    // var boolMark = data.data.data[0] ? true : false;
                    // console.info(typeof (data.data.data[0]),'data.data.data[0]');
                    !data.data.data[0] ? $rootScope.go('addOrEditApu','',{apuInfo:item.arrivalStationJob,isFirst:true}):	$rootScope.go('apuList','',{workType:'Pr/F',jobId:item.arrivalStationJob.jobId,flightId:item.flightId});

                }else{
                    $rootScope.errTip = '错误，请联系管理员'
                }
            });

            return
        }

        if(item.departureStationJob.jobType && item.departureStationJob.jobType.toUpperCase() == 'T/R' && item.arrivalStationJob && JSON.stringify(item.arrivalStationJob) == '{}'){
            console.info(item);
            // item.jobType = 'T/R';
            item.departureStationJob.acType  = item.acType;
            item.departureStationJob.flightId  = item.flightId;
            var params = {workOrderId:item.departureStationJob.jobId};
            server.maocGetReq('apuUse/selectApuUseInfoIsExistByWorkOrderId', params).then(function(data) {
                if(200 === data.status) {
                    console.info(data.data.data[0],'data.data.data[0]');
                    // var boolMark = data.data.data[0] ? true : false;
                    // console.info(typeof (data.data.data[0]),'data.data.data[0]');

                    !data.data.data[0] ? $rootScope.go('addOrEditApu','',{apuInfo:item.departureStationJob,isFirst:true}):	$rootScope.go('apuList','',{workType:'T/R',jobId:item.departureStationJob.jobId,flightId:item.flightId});

                }else{
                    $rootScope.errTip = '错误，请联系管理员'
                }
            });
            return
        }

        //当离开的是滑回类型 且没有到达的数据的时候
        if(item.departureStationJob.jobType && item.departureStationJob.jobType.toUpperCase() == 'TBFTR' && item.arrivalStationJob && JSON.stringify(item.arrivalStationJob) == '{}'){
            console.info(item);
            // item.jobType = 'T/R';
            item.departureStationJob.acType  = item.acType;
            item.departureStationJob.flightId  = item.flightId;
            var params = {workOrderId:item.departureStationJob.jobId};
            server.maocGetReq('apuUse/selectApuUseInfoIsExistByWorkOrderId', params).then(function(data) {
                if(200 === data.status) {
                    console.info(data.data.data[0],'data.data.data[0]');
                    // var boolMark = data.data.data[0] ? true : false;
                    // console.info(typeof (data.data.data[0]),'data.data.data[0]');

                    !data.data.data[0] ? $rootScope.go('addOrEditApu','',{apuInfo:item.departureStationJob,isFirst:true}):	$rootScope.go('apuList','',{workType:'TBFTR',jobId:item.departureStationJob.jobId,flightId:item.flightId});

                }else{
                    $rootScope.errTip = '错误，请联系管理员'
                }
            });
            return
        }

        if(item.departureStationJob.jobType && item.departureStationJob.jobType.toUpperCase() == 'PR/F' && item.arrivalStationJob && JSON.stringify(item.arrivalStationJob) == '{}'){
            console.info(item);
            item.departureStationJob.acType  = item.acType;
            item.departureStationJob.flightId  = item.flightId;
            var params = {workOrderId:item.departureStationJob.jobId};
            server.maocGetReq('apuUse/selectApuUseInfoIsExistByWorkOrderId', params).then(function(data) {
                if(200 === data.status) {
                    console.info(data.data.data[0],'data.data.data[0]');
                    // var boolMark = data.data.data[0] ? true : false;
                    // console.info(typeof (data.data.data[0]),'data.data.data[0]');
                    !data.data.data[0] ? $rootScope.go('addOrEditApu','',{apuInfo:item.departureStationJob,isFirst:true}):	$rootScope.go('apuList','',{workType:'Pr/F',jobId:item.departureStationJob.jobId,flightId:item.flightId});

                }else{
                    $rootScope.errTip = '错误，请联系管理员'
                }
            });

            return
        }

        if(item.departureStationJob.jobType && item.departureStationJob.jobType.toUpperCase() == 'T/R' && item.arrivalStationJob.jobType && item.arrivalStationJob.jobType.toUpperCase() == 'PO/F'){
            item.departureStationJob.acType  = item.acType;
            item.departureStationJob.flightId  = item.flightId;
            item.arrivalStationJob.acType  = item.acType;
            item.arrivalStationJob.flightId  = item.flightId;
            scope.svTypes = [
                {
                    name:'T/R APU使用',
                    obj:item,
                    jobType:'T/R'
                },
                {
                    name:'Po/F APU使用',
                    obj:item,
                    jobType:'Po/F'
                }
            ];
            scope.showOptions = true;
            console.info(item)

        }

        //当有离开的类型是滑回，且有到达的数据是航后()
        if(item.departureStationJob.jobType && item.departureStationJob.jobType.toUpperCase() == 'TBFTR' && item.arrivalStationJob.jobType && item.arrivalStationJob.jobType.toUpperCase() == 'PO/F'){
            item.departureStationJob.acType  = item.acType;
            item.departureStationJob.flightId  = item.flightId;
            item.arrivalStationJob.acType  = item.acType;
            item.arrivalStationJob.flightId  = item.flightId;
            scope.svTypes = [
                {
                    name:'TBFTR APU使用',
                    obj:item,
                    jobType:'TBFTR'
                },
                {
                    name:'Po/F APU使用',
                    obj:item,
                    jobType:'Po/F'
                }
            ];
            scope.showOptions = true;
            console.info(item)

        }

        if(item.departureStationJob.jobType && item.departureStationJob.jobType.toUpperCase() == 'PR/F' && item.arrivalStationJob.jobType && item.arrivalStationJob.jobType.toUpperCase() == 'PO/F'){
            item.departureStationJob.acType  = item.acType;
            item.departureStationJob.flightId  = item.flightId;
            item.arrivalStationJob.acType  = item.acType;
            item.arrivalStationJob.flightId  = item.flightId;
            scope.svTypes = [
                {
                    name:'Pr/F APU使用',
                    obj:item,
                    jobType:'Pr/F'

                },
                {
                    name:'Po/F APU使用',
                    obj:item,
                    jobType:'Po/F'

                }
            ];
            scope.showOptions = true;

            console.info(item)
        }
    }

	//返回
	$scope.goBack = function(){
		$rootScope.go('me', 'slideRight', {time: $stateParam.time});
		meList.cleanSearchFlights();
		$rootScope.isSearchFavorite = false;
		$rootScope.operate = false;
	}
	window.goBack = $scope.goBack;
}