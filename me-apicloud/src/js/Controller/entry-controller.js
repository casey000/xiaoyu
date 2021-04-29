
module.exports = function($window, $scope,$location, $rootScope, server, airport, configInfo,mefilterFlightInfo) {
    $rootScope.endLoading();

    (function onLoad(){
        var v = OPENAPI.getVersion();
        // alert($api.getStorage('appVersion'))
        // alert(v)

        if($api.getStorage('appVersion') != v){
            $rootScope.appVer = v;
            var obj = $api.getStorage('updateInfo');
            $rootScope.updateTip = obj.updateInfo;
            $api.setStorage('appVersion',v);
        };
        $rootScope.watchUpdate = function () {
            if($api.getStorage('updateInfo').pdfUrl){
                NativeAppAPI.openPdfWithUrl({url:$api.getStorage('updateInfo').pdfUrl,source:'fromUpadate'});
            }
        }
        // var apiExist = setInterval(function(){
        //     if( typeof api != 'undefined' ){
        //         api.addEventListener({
        //             name: 'pitflight-viewappear'
        //         }, function(ret, err){
        //             $rootScope.go('pitRepairFlight', 'slideLeft');
        //         });
        //         window.clearInterval(apiExist);
        //     }
        // }, 20);
    })();

    window.goBack = function(){
        if(window.WebViewJavascriptBridge){
            window.WebViewJavascriptBridge.callHandler(
                'goExit'                    
                , {}            
                , function(responseData) {      
                    
                }
            );
        }
    }

    /* 手机浏览器打开 */
    $scope.openInBrowser = function(type){
        var url = {
            // "toolboxremote": "http://sfmanual.sf-express.com:8081/toolboxremote.html",
            "toolboxremote": "http://olm.sf-express.com:8081/ToolboxRemote.html",
            "manual": "http://sfmanual.sf-express.com:8081/manual",
            "tdms": "http://tdms.sf-express.com",
            "focmel": "http://foc.sf-express.com/UIUpgraded/ShowFiles.aspx?fileFlag=1"
        }
        OPENAPI.openInBrowser(url[type])
    }
    
    
    $scope.reload = function(){
        
        $rootScope.loadAuthorityIng = true;
        server.maocGetReq('defect/getDefectDeferedTaskCount').then(function(data) {
            if( data.status === 200) {
                var total = data.data.data[0];
                var apiExis = setInterval(function(){
                    if( typeof api != 'undefined' ){
                        api.sendEvent({
                            name: 'updateMyTaskNum',
                            extra: {
                                total: total,
                            }
                        });
                        window.clearInterval(apiExis);
                    }
                }, 20);
            }
        }).catch(function(error) {

        });
        server.getAuthority().then(function(data) {
            if(data && 200 === data.status && data.data.authorities && data.data.authorities instanceof Array) {
                $rootScope.loadAuthorityIng = false;
                data.data.authorities.forEach(function(item, index) {
                    $rootScope[item] = true;
                    
                });
                var authorityDelete = [];
                configInfo.authorities.forEach(function (item, index) {
                    if(-1 == data.data.authorities.indexOf(item)){
                        authorityDelete.push(item);
                    }
                });
                authorityDelete.forEach(function (item, index) {
                    $rootScope[item] = false;
                });
                configInfo.setAuthorities(data.data.authorities);
                configInfo.setUser(data.data.user_name);
            }
            $scope.pullToRefreshActive = false;
        }).catch(function(error) {
            console.log(error);
            $scope.pullToRefreshActive = false;
        });
    }
    $scope.goFlightInfo = function (path, pageAnimationClass) {
        //$location.path(path);
        $rootScope.pageAnimationClass = pageAnimationClass;
        $state.go('flightStatus');
        
    };

    //触发扫码调用时则直接调用，海风封装好的调用iOS原生的方法，scanLineCode
    //iOS执行后将结果后调用方法setQrCode回调，则只需要实现回调方法即可，回调方法通过
    //调用全局方法，而全局方法在该类中实现，则可以通过函数传值
    $scope.scanLineCode = function () {
        // NativeAppAPI.scanLineCode({'callBackfunction':"setQrCode"});
        NativeAppAPI.openDamageScanner({'callBackfunction':"setQrCode"});
    };

    $scope.scanUploadCode = function() {
        NativeAppAPI.openUploadCode({'callBackfunction':"setQrCode"});
    };

    // 二维码扫描成功
    window.getMeCardNo = function (respose) {
        // go('damageDetail','slideLeft',{acNumber:'DRS-201711-048'})
        $rootScope.go('searchDamageByHand.damageDetail','slideLeft',{acNumber:respose});
        // alert(respose);
    };

    //iOS扫描条形码界面。点击手动查询按钮回调此函数
    window.goToSearchByHandPage = function () {
        // $state.go('searchDamageByHand','slideLeft');
        // alert('已返回到html');
        // $rootScope.go('searchDamageByHand','slideLeft');
        $rootScope.go('searchDamageByHand');
    }

    // var strUrl=window.location.href;
    //
    // $scope.$watch(strUrl,function(){
		// alert(strUrl);
    // });
    // go('transferReceiving', 'slideLeft')
    $scope.receivingGoods = function(){
        var current3CodeKey = $api.getStorage('usercode') + 'selairport3code';
        var current3Code = $api.getStorage(current3CodeKey);
        if (typeof (current3Code) != 'undefined') {
            $rootScope.go('transferReceiving', '',{station:current3Code})
        }else{
            NativeAppAPI.openStationSetPage();
            var time = window.setInterval(function () {
                console.log(api,'api');
                if (typeof api !== 'undefined') {
                    api.addEventListener({
                        name: 'goToMaintainPage'
                    }, function(ret, err){
                        $rootScope.go('transferReceiving', '',{station:$api.getStorage(current3CodeKey)})

                        api.removeEventListener({
                            name: 'goToMaintainPage'
                        });
                    });
                    window.clearInterval(time);
                }
            },20);
        }
    };
    $scope.dispatchGoods = function(){
        var current3CodeKey = $api.getStorage('usercode') + 'selairport3code';
        var current3Code = $api.getStorage(current3CodeKey);
        if (typeof (current3Code) != 'undefined') {
            $rootScope.go('HomeDispatchList', '',{station:current3Code})
        }else{
            NativeAppAPI.openStationSetPage();
            var time = window.setInterval(function () {
                console.log(api,'api');
                if (typeof api !== 'undefined') {
                    api.addEventListener({
                        name: 'goToMaintainPage'
                    }, function(ret, err){
                        $rootScope.go('HomeDispatchList', '',{station:$api.getStorage(current3CodeKey)})

                        api.removeEventListener({
                            name: 'goToMaintainPage'
                        });
                    });
                    window.clearInterval(time);
                }
            },20);
        }

    }

    $scope.mrNewSearchGoods = function(){
        var current3CodeKey = $api.getStorage('usercode') + 'selairport3code';
        var current3Code = $api.getStorage(current3CodeKey);
        if (typeof (current3Code) != 'undefined') {
            $rootScope.go('mrNewSearch')
        }else{
            NativeAppAPI.openStationSetPage();
            var time = window.setInterval(function () {
                console.log(api,'api');
                if (typeof api !== 'undefined') {
                    api.addEventListener({
                        name: 'goToMaintainPage'
                    }, function(ret, err){
                        // var current3CodeKey = $api.getStorage('usercode') + 'selairport3code';
                        // var current3Code = $api.getStorage(current3CodeKey);
                        // if (typeof (current3Code) != 'undefined') {
                        //     //按照mefilterFlightInfo方法指定的参数形式
                        //     var filterParams = {
                        //         filterAirPorts:[current3Code],
                        //         filterFlightNos:[],
                        //         filterAcRegs:[],
                        //         direction:'',
                        //         filterFlightStatus:0
                        //     };
                        //     mefilterFlightInfo.setFilters(angular.copy(filterParams,{}));
                        // }
                        // $rootScope.go('me', 'slideLeft', {time: $rootScope.preTimeParse});

                        $rootScope.go('mrNewSearch')

                        api.removeEventListener({
                            name: 'goToMaintainPage'
                        });
                    });
                    window.clearInterval(time);
                }
            },20);
        }

    }

	$scope.goToRepairPage = function () {

        var filterData = angular.copy(mefilterFlightInfo.filterParams,{});
        var filterAirports = filterData.filterAirPorts;
        var hasEnterMaintainPageKey = $api.getStorage('usercode') + 'hasEnterMaintainPageKey';
        var hasEnterMaintainPage = $api.getStorage(hasEnterMaintainPageKey);

        if (filterAirports.length > 0 || (typeof (hasEnterMaintainPage) != 'undefined' && hasEnterMaintainPage == 'true')) {
            $rootScope.go('me', 'slideLeft', {time: $rootScope.preTimeParse});
			hasEnterMaintainPage = true;
            $api.setStorage(hasEnterMaintainPageKey, hasEnterMaintainPage);
        }
		else {
            //判断设置页中的航站有无设置
            var current3CodeKey = $api.getStorage('usercode') + 'selairport3code';
            var current3Code = $api.getStorage(current3CodeKey);
            if (typeof (current3Code) != 'undefined') {
                //按照mefilterFlightInfo方法指定的参数形式
                var filterParams = {
                    filterAirPorts:[current3Code],
                    filterFlightNos:[],
                    filterAcRegs:[],
                    direction:'',
                    filterFlightStatus:0
                };
                mefilterFlightInfo.setFilters(angular.copy(filterParams,{}));
                hasEnterMaintainPage = true;
                $api.setStorage(hasEnterMaintainPageKey, hasEnterMaintainPage);
                $rootScope.go('me', 'slideLeft', {time: $rootScope.preTimeParse});
            }
            else {
                NativeAppAPI.openStationSetPage();
                hasEnterMaintainPage = true;
                $api.setStorage(hasEnterMaintainPageKey, hasEnterMaintainPage);
                //注册通知，接收跳过消息
                var time = window.setInterval(function () {
                    console.log(api,'api');
                    if (typeof api !== 'undefined') {
                        api.addEventListener({
                            name: 'goToMaintainPage'
                        }, function(ret, err){
                            var current3CodeKey = $api.getStorage('usercode') + 'selairport3code';
                            var current3Code = $api.getStorage(current3CodeKey);
                            if (typeof (current3Code) != 'undefined') {
                                //按照mefilterFlightInfo方法指定的参数形式
                                var filterParams = {
                                    filterAirPorts:[current3Code],
                                    filterFlightNos:[],
                                    filterAcRegs:[],
                                    direction:'',
                                    filterFlightStatus:0
                                };
                                mefilterFlightInfo.setFilters(angular.copy(filterParams,{}));
                            }
                            $rootScope.go('me', 'slideLeft', {time: $rootScope.preTimeParse});
                            api.removeEventListener({
                                name: 'goToMaintainPage'
                            });
                        });
                        window.clearInterval(time);
                    }
                },20);
			}
        }

    }



};