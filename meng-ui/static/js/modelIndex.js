/**
 * @author 蓝瑞源软件有限公司
 * @Version: 1.0
 * @DateTime: 2014-04-29
 * 主页右键功能
 */

$(function(){
    var data = "";
    if(typeof(QtClient) != "undefined"){
        $.ajax({
            type: "get",
            url: "/modelProperty/queryEnv",
            contentType: "application/json;charset=utf-8",
            async:false,
            success: function (result) {
                data= result.data;
            },
            error: function (data) {
                alert("AJAX服务器返回错误！");
            }
        });
        QtClient.init({
            env : data.modelProperty.env,
            port :data.modelProperty.port,
            service:data.modelProperty.service,
            onRefreshTicket : function(){
                var ticketValue = "";
                $.ajax({
                    type: "get",
                    url: "/modelProperty/queryEnv",
                    contentType: "application/json;charset=utf-8",
                    async:false,
                    success: function (result) {
                        ticketValue= result.data.token;
                    },
                    error: function (data) {
                        alert("AJAX服务器返回错误！");
                    }
                });
                return ticketValue;
            },
            onWebSocketFail : function(msg){
                //asms.alert('提示',msg,'error');
            }
        });
    }
})


