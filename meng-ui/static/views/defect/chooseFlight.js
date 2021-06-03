/*************************************************************************
 *  航班选择
 *
 *  传入params参数格式：
 *      @Params {success: function, fullData: boolean, filter: {}}
 *      success->成功回调函数, fullData->是否获取全量数据
 *  航班选择成功后调用params.success方法,携带返回数据格式:
 *      {
 *          AC: 飞机号,
 *          FLIGHT_NO: 航班号,
 *          MODEL: 机型,
 *          ACID: acId,
 *          STATION: station
 *      };
 *      
 *  实例: 
 *      $.chooseFlight({
 *          filter: {
 *              ac: "B-2017",           //{String}
 *              station: "SXZ",         //{String}
 *              dateRange: 1,           //{Number} 1->"one day", 2->"two day"
 *              date: "2018-03-20",     //{String} "yyyy-MM-hh"
 *              time: "10:00"           //{String} "hh:mm"
 *          },
 *          fullData: true,
 *          succes: function(data){}
 *      })
 ************************************************************************/
;(function($, window, document, undefined){
    $.extend({
        chooseFlight: function(params){
            ShowWindowIframe({
                width: "1200",
                height: "700",
                title: "航班选择",
                param: params,
                url: "/views/defect/chooseFlight.shtml"
            });    
        }
    })
})($, window, document)