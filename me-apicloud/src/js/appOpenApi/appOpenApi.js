var NativeAppAPI = {
    scanLineCode : function (param) {
        OPENAPI.openScanner(param);
    },

    tokenExpired : function (param) {
        OPENAPI.tokenExpired();
    },
    closemyPub : function (param) {
        OPENAPI.closemyPub();
    },
    closeRestMakeUp : function (param) {
        OPENAPI.closeRestMakeUp();
    },
    navigationGoback : function (param) {
        if(window.webkit && window.webkit.messageHandlers.navigationGoback) {
            window.webkit.messageHandlers.navigationGoback.postMessage(param);
        }else if(typeof window.WebViewJavascriptBridge != 'undefined'){//判断
            window.WebViewJavascriptBridge.callHandler(
                'goExit'
                , {'param': 'value'}
                , function(responseData) {

                }
            );
        }
    },

    /*
    * 参数形式
    * {
    *   event:eventId,
    *   param:{paramKey1:paramVaule1}
    * }
    * {event} 是事件ID, 该ID为字符串类型，在友盟注册的应用可以添加。是必选参数
    * [param] 是该事件的额外参数，最多自能包含10个自动。如果没有额外参数，该字段可以不添加
    *比如
    * {
    * event:'nightMode'
    * }
    * 则是统计用户是否设置为夜间模式
    * */
    webAppEvent : function (event) {
        if(window.webkit && window.webkit.messageHandlers.webAppEvent) {
            window.webkit.messageHandlers.webAppEvent.postMessage(event);
        }else{
            MobclickAgent.onEvent(eventName);
        }
    },

    addCalendarEvent : function (newEvent) {
        if(window.webkit && window.webkit.messageHandlers.addCalendarEvent) {
            window.webkit.messageHandlers.addCalendarEvent.postMessage(newEvent);
        }else if(typeof window.WebViewJavascriptBridge != 'undefined'){
            window.WebViewJavascriptBridge.callHandler(
                'addCalendarEvent'
                , newEvent
                , function(responseData) {

                }
            );
        }
    },

    deleteCalendarEvent : function (eventId) {
        if(window.webkit && window.webkit.messageHandlers.addCalendarEvent) {
            window.webkit.messageHandlers.deleteCalendarEvent.postMessage(eventId);
        }else if(typeof window.WebViewJavascriptBridge != 'undefined'){
            window.WebViewJavascriptBridge.callHandler(
                'deleteCalendarEvent'
                , eventId
                , function(responseData) {

                }
            );
        }
    },

    openFlightDetail : function (flightId) {
        if(window.webkit && window.webkit.messageHandlers.openFlightDetail) {
            window.webkit.messageHandlers.openFlightDetail.postMessage({'flightId':flightId});
        }else if(typeof window.WebViewJavascriptBridge != 'undefined'){
            window.WebViewJavascriptBridge.callHandler(
                'openFlightDetail'
                , {'flightId':flightId}
                , function(responseData) {

                }
            );
        }
    },

    addBadge:function (badge) {
        if(window.webkit && window.webkit.messageHandlers.addBadge) {
            window.webkit.messageHandlers.addBadge.postMessage(badge);
        }else if(typeof window.WebViewJavascriptBridge != 'undefined'){
            window.WebViewJavascriptBridge.callHandler(
                'addBadge'
                , {'badge':badge}
                , function(responseData) {

                }
            );
        }
    },
    //badge     [数字类型]          为角标数
    //tabIndex  [数字类型]          为第几个tab设置角标。tab从0开始计数
    addBadgeAtTabIndex:function (badge,tabIndex) {
        if(window.webkit && window.webkit.messageHandlers.addBadgeAtTabIndex) {
            window.webkit.messageHandlers.addBadgeAtTabIndex.postMessage({'badge':badge, 'tabIndex':tabIndex});
        }else{
            console.log('设置角标--'+ badge + '--' + tabIndex);
        }
    },
    //jumpPath 格式: AppName://模块名字/额外参数(additionalParam)
    //title : 跳转页面的标题。如果未传递该参数，则表示无原生的顶端的返回按钮。
    interfaceJump:function (jumpPath,title,isUIWebView) {
        if(window.webkit) {
            if(window.webkit.messageHandlers.interfaceJump){
                window.webkit.messageHandlers.interfaceJump.postMessage({'jumpPath':jumpPath,'title':title,'isUIWebView':isUIWebView||0});
            }else if(window.webkit.messageHandlers.openFlightDetail){
                var index = jumpPath.lastIndexOf('/');
                var flightId = jumpPath.substr(index+1);
                window.webkit.messageHandlers.openFlightDetail.postMessage({'flightId':flightId});
            }
        }else if(typeof window.WebViewJavascriptBridge != 'undefined'){
            window.WebViewJavascriptBridge.callHandler(
                'interfaceJump'
                , {'jumpPath':jumpPath}
                , function(responseData) {

                }
            );
        }
    },
    focAuthJump:function (jumpPath,title) {
        if(window.webkit && window.webkit.messageHandlers.focAuthJump) {
                window.webkit.messageHandlers.focAuthJump.postMessage({'jumpPath':jumpPath,'title':title});
        }
    },
    changeStatusBarColor:function (r, g ,b) {
        if(window.webkit) {
            if(window.webkit.messageHandlers.changeStatusBarColor){
                window.webkit.messageHandlers.changeStatusBarColor.postMessage({'r':r,'g':g,'b':b});
            }
        }
    },

    // showTabBar:function () {
    //     if(window.webkit) {
    //         if(window.webkit.messageHandlers.showTabBar){
    //             window.webkit.messageHandlers.showTabBar.postMessage({});
    //         }
    //     }
    // },
    //
    // hideTabBar:function () {
    //     if(window.webkit) {
    //         if (window.webkit.messageHandlers.hideTabBar) {
    //             window.webkit.messageHandlers.hideTabBar.postMessage({});
    //         }
    //     }
    // },

    setNightMode:function(beNightMode){
    	if(window.webkit) {
            if (window.webkit.messageHandlers.setNightMode) {
                window.webkit.messageHandlers.setNightMode.postMessage({nightMode:beNightMode});
            }
        }
    },


    /*
     * 参数形式
     * {
     *   title:"标题栏名称",
     *   data:"Base64的数据串"
     * }
     * */
    openNewPageWithData:function (dataAndTitle) {
        OPENAPI.openPdfWithData(dataAndTitle);
    },
    openPdfWithUrl:function (param) {
        OPENAPI.openPdfWithUrl(param);
    },
    openPdfWithFileName: function(param) {
        OPENAPI.openPdfWithFileName(param);
    },
    openDamagePdf: function(param) {
        OPENAPI.openDamagePdf(param);
    },
    closeDamagePdf: function() {
        OPENAPI.closeDamagePdf();
    },
    startAudioCapture:function () {
        OPENAPI.startAudioCapture();
    },

    stopAudioCapture:function () {

        OPENAPI.stopAudioCapture();
    },

    audioPlayerStart:function (audioBase64Data) {

        OPENAPI.audioPlayerStart({'audioBase64Data':audioBase64Data});

    },

    audioPlayerStop:function () {

        OPENAPI.audioPlayerStop();
    },

    showTabBar:function () {
        OPENAPI.showTabBar();
    },

    hideTabBar:function () {
        OPENAPI.hideTabBar()
    },

    gobackToFlightTimes:function () {

        OPENAPI.gobackToFlightTimes();
    },
    damageDetailGoBack:function () {
        OPENAPI.damageDetailGoBack();
    },
    openDamageScanner:function () {
        OPENAPI.openDamageScanner();
    },

    openUploadCode:function () {
        OPENAPI.openUploadCode();
    },
//  航班动态关注后调用接口
    readMessageDetailSuccess:function () {
        OPENAPI.readMessageDetailSuccess();
    },
//关注航班成功后调用
    focusFlight:function () {
        OPENAPI.focusFlight();
    },
    searchByHandGoBack:function () {
        OPENAPI.searchByHandGoBack();
    },

//   打开航班详情页
    openFlightStatusDetail:function (param) {
        OPENAPI.openFlightStatusDetail(param);
    },
//   打开航站设置页
    openStationSetPage:function (param) {
        OPENAPI.openStationSetPage(param);
    },

    //nrc详情页统计
    openNrcdetail:function () {
        OPENAPI.openNrcdetail()
    },
    closeNrcdetail:function () {
        OPENAPI.closeNrcdetail()
    },

    //故障概要统计
    openDefectOutline:function () {
        OPENAPI.openDefectOutline()
    },
    closeDefectOutline:function () {
        OPENAPI.closeDefectOutline()
    },

    //tmc详情统计
    openTMCdetail:function () {
        OPENAPI.openTMCdetail()
    },
    closeTMCdetail:function () {
        OPENAPI.closeTMCdetail()
    },

    //航线经验详情统计
    openlineExpdetail:function () {
        OPENAPI.openlineExpdetail()
    },
    closelineExpdetail:function () {
        OPENAPI.closelineExpdetail()
    },

    //看板使用统计
    openBoard:function () {
        OPENAPI.openBoard()
    },
    closeBoard:function () {
        OPENAPI.closeBoard()
    },

    baikeSearch:function () {
        OPENAPI.baikeSearch()
    },
    defectHandleSearch:function () {
        OPENAPI.defectHandleSearch()
    },
    relatedDocCheck:function () {
        OPENAPI.relatedDocCheck()
    },
};
