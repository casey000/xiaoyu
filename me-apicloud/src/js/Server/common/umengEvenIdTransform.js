/**
 * Created by it on 17/4/5.
 */
module.exports = angular.module('myServers').service('umengEventIdTransform', [function() {


    var get_maocEvents = [
            //航班动态查询
             {
                 path:'flight/flightInfo',
                 umengEventId: 'flight_flightInfo',                      //按航班日期查询所有航班动态
                 params: []
             },
             {
                 path:'flight/flightDetails',
                umengEventId: 'flight_flightDetails',                       //查询航班动态详情
                params: ['flightId']
             },
            {
                path:'flight/flightCrewInfo',
                umengEventId: 'flight_flightCrewInfo',                      //查询航班机组信息
                params: ['flightId']
            },
            {
                path:'weather/weatherReportByAirport4code',
                umengEventId: 'weather_weatherReportByAirport4code',         //气象报文查询接口(机场四字码)
                params: ['airport4code']
            },
            {
                path:'weather/weatherReportByFlightId',
                umengEventId: 'weather_weatherReportByFlightId',             //气象报文查询接口(航班ID)
                params: ['flightId']
            },
             {
                path:'weather/weatherReportByFlightNo',
                umengEventId: 'weather_weatherReportByFlightNo',               //气象报文查询接口(航班号)
                params: ['flightNo']
            },
             {
                path:'flight/focusOnflightListInfo',
                umengEventId: 'flight_focusOnflightListInfo',                //查询我所关注的所有航班动态
                params: []
            },
             {
                path:'flight/flightIdListByUserFocus',
                umengEventId: 'flight_flightIdListByUserFocus',              //查询我所关注的所有航班ID
                params: []
            },
            {
                path:'flight/searchflightInfo',
                umengEventId: 'flight_searchflightInfo',                     //模糊搜索航班动态接口
                params: []
            },

            //MR模块
             {
                path:'mr/getMe2MRInfo',
                umengEventId: 'mr_getMe2MRInfo',                        //MR列表查询接口
                params: []
            },
             {
                path:'mr/getMe2MRDetailById',
                umengEventId: 'mr_getMe2MRDetailById',                     //MR详情查询接口
                params: []
            },
             {
                path:'mr/getMe2MRMaximoInventoryBalanceInfo',
                umengEventId: 'mr_getMe2MRMaximoInventoryBalanceInfo',   //航材PN查询接口
                params: []
            },
             {
                path:'mr/getMe2MRBarcode',
                umengEventId: 'mr_getMe2MRBarcode',                        //MR 扫描条码接口
                params: []
            },
            //工具查询模块
            {
                path:'me/tool/inventory',
                umengEventId: 'me_tool_inventory',                       //工具库存查询接口
                params: []
            },
            {
                path:'me/tool/lending',
                umengEventId: 'me_tool_lending',                         //工具借用情况查询接口
                params: []
            },
            {
                path:'me/tool/myLending',
                umengEventId: 'me_tool_myLending',                         //我的工具借用情况查询接口
                params: []
            },


            //维修任务模块
             {
                path:'maintain/ddCount',
                umengEventId: 'maintain_ddCount',                          //查询飞机DD数量
                params: ['acReg']
            },
            {
                path:'maintain/acStatus',
                umengEventId: 'maintain_acStatus',                       //故障状态清单查询接口
                params: ['acReg']
            },
            {
                path:'maintain/meReleaseLicenseNo',
                umengEventId: 'maintain_meReleaseLicenseNo',             //查询放行执照编号接口
                params: []
            },
            {
                path:'maintain/meJobList',
                umengEventId: 'maintain_meJobList',                      //查询维修任务列表接口
                params: ['time', 'searchKey']
            },
            {
                path:'maintain/toBaseDetailInfo',
                umengEventId: 'maintain_toBaseDetailInfo',                 //查询TO排故类工卡故障解决步骤接口
                params: ['cardNo']
            },
            {
                path:'maintain/meJobDetails',
                umengEventId: 'maintain_meJobDetails',                     //机务放行任务详细信息查询接口
                params: ['acReg']
            },
            {
                path:'maintain/meDDInfo',
                umengEventId: 'maintain_meDDInfo',                       //DD查询接口
                params: ['flowInstanceId']
            },
            {
                path:'maintain/getMe2FlbStaLine',
                umengEventId: 'maintain_getMe2FlbStaLine',               //FLB查询接口
                params: ['lineJobId']
            }
        ],
        post_maocEvents = {
            //航班动态查询
            'flight/focusOnFlight':                             'flight_focusOnFlight',                   //关注指定航班动态
            'flight/unfocusFlight':                             'flight_unfocusFlight',                   //取消关注指定航班动态

            //MR模块
            'mr/addME2MR':                                      'mr_addME2MR',                            //MR新增_更新接口

            //维修任务模块
            'maintain/meReleaseLicenseNo':                      'maintain_meReleaseLicenseNo',            //保存_更新放行执照编号接口
            'maintain/releaseME2Flb':                           'maintain_releaseME2Flb',                 //Release执行放行工单提交接口
            'maintain/rejectMaintenanceTask':                   'maintain_rejectMaintenanceTask',			//机务工作任务状态接口_reject
        };

    this.custom_Event = {
        flightInterfaceSwitchToOld:'flight_interface_switch_old',        //航班动态页面老页面切换
        flightInterfaceSwitchToNew:'flight_interface_switch_new',        //航班动态页面新页面切换
        clickFlightFocusButton:'flight_focus_button',                     //点击航班收藏按钮
        clickFlightFilterButton:'flight_filter_button',                     //点击航班筛选按钮
        clickFlightSearchButton:'flight_search_button'                     //点击航班搜索按钮
    };

    this.umengSaveGetEvent = function (path,param){
        var evntId = 'get_undefined_event';
        var eventParam = {'undefined_event_path':path};
        var umengEvents = get_maocEvents.filter(function (item, index) {
            return (0 == path.indexOf(item.path));
        });

        if(umengEvents.length){
            umengEventObj = umengEvents[0];
            evntId = umengEventObj.umengEventId;
            eventParam = param||{};
        }
        this.umengSaveCoustomEvent(evntId, eventParam);
    };

    this.umengSavePostEvent = function (path, param) {
        var evntId = post_maocEvents[path];
        var eventParam = param||{};
        if(!evntId){
            evntId = 'post_undefined_event';
            eventParam = {'undefined_event_path':path};
        }
        this.umengSaveCoustomEvent(evntId, eventParam);
    };

    //umengEventIdTransform.umengSaveCoustomEvent(umengEventIdTransform.custom_Event.flightInterfaceSwitchToOld,{userCode:commonF.userCode});
    this.umengSaveCoustomEvent = function (customEventId, customEventParam) {
        if (window.webkit && window.webkit.messageHandlers.webAppEvent){
            window.webkit.messageHandlers.webAppEvent.postMessage({event:customEventId,param:customEventParam});
        }else{
            MobclickAgent.onEventWithParameters(customEventId,customEventParam);
        }
    };
}]);