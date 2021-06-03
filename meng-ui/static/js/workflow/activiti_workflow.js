/**
 * Created by tpeng on 2016/4/26.
 * Activiti 工作流程图显示插件
 * dependences : {common.js, easyui tooltip}
 */
(function($) {

    $.fn.DiagramWorkFlow = function(options) {
        var opts = $.extend({}, $.fn.DiagramWorkFlow.defaults, options);
        if(!validOptions(opts)){
            return this;
        }
        return this.each(function(){
            loadProcessImage(opts, $(this));
            loadProcessTrace(opts, $(this));
            loadProcessActivityIds(opts, $(this));
        });
    };

    $.fn.DiagramWorkFlow.defaults = {
        imageUrl: '', //流程图url
        traceUrl: '', //流程节点数据url {json}
        isRevert:false, //是否还原展示流程图，{还原Activiti裁剪后的流程图，即将偏移量x=x+minX,y=y+minY}
        offsetX:0, //偏移量X
        offsetY:0 //偏移量Y
    };

    function loadProcessActivityIds(opts, $flowRect){
        if(!opts.actInfos) return;
        var $divs_ = $("<div/>");
        $.each(opts.actInfos, function(k,info){
            // 矩形的div
            var $div = $('<div/>', {
                'class': 'activity-attr'
            }).css({
                position: 'absolute',
                left: info.x + opts.offsetX,
                top: info.y + opts.offsetY,
                width: info.width - 3,
                height:info.height - 3,
                opacity: 0.8
                //zIndex: 100,
            }).attr({
                'actId':info.actId, 'name':info.name
            });
            if(info.isCurr === false){
                $div.css({ border: '2px solid green', cursor : 'pointer' });
                $div.unbind('click').bind('click', function(){
                    if(typeof(opts.clickCallBack) == 'function'){
                        opts.clickCallBack(info);
                    }
                });
            }else{
                $div.css({ border: '2px solid red' });
            }
            $divs_.append($div);
        });
        $divs_.appendTo($flowRect);
    }

    function loadProcessTrace(opts, $flowRect){
        if(!opts.traceUrl) return;
        $.getJSON(opts.traceUrl, function(jdata){
            if(jdata.code != RESULT_CODE.SUCCESS_CODE){
                CLog("ALERT", "加载流程节点信息失败!" + jdata.msg);
                return;
            }
            var html = "";
            var minX = jdata.data['minX'];
            var minY = jdata.data['minY'];
            var actInfos = jdata.data['actInfos'];
            $flowRect.css({
                position: 'absolute',
                left: (opts.isRevert ? minX : 0) + opts.offsetX,
                top: (opts.isRevert ? minY : 0) + opts.offsetY
            });
            var $divs_ = $("<div/>");
            $.each(actInfos, function(k,info){
                // 矩形的div
                var $div = $('<div/>', {
                    'class': 'activity-attr'
                }).css({
                    position: 'absolute',
                    left: info.x + opts.offsetX,
                    top: info.y + opts.offsetY,
                    width: info.width - 3,
                    height:info.height - 3,
                    opacity: 0.8,
                    //zIndex: 100,
                    cursor : 'pointer'
                }).attr({
                    'actId':info.actId,' name':info.name
                });
                var tip = 'name : '+ info.name||'' + '<br/>'
                    + '任务类型 : '+ info.actType||'' + '<br/>'
                    + '节点说明 : '+ info.actDocumentation||'' + '<br/>'
                    + '描述 : '+ info.definitionDesc||'' + '<br/>';
                $div.tooltip({
                    position: 'right',
                    content: '<span style="color:#fff">'+tip+'</span>',
                    onShow: function(){
                        $(this).tooltip('tip').css({
                            backgroundColor: '#666',
                            borderColor: '#666'
                        });
                    }
                });
                if(info.isCurrAct){
                    $div.css({ border: '2px solid red' });
                }else{
                    $div.css({ border: '2px solid green' });
                }
                /*$div.hover(function(){
                    var h_ = '';
                    $.each(info,function(k1,v1){
                        h_ += k1+"="+v1+"<br/>";
                    });
                    $("#msg_").html(h_);
                },function(){
                    $("#msg_").html('');
                });*/
                $divs_.append($div);
            });
            //$('<div />',{'id':'processRect'})
            $divs_.appendTo($flowRect);
        });
    }

    function loadProcessImage(opts, $flowRect){
        $('<img />',{
            "src" : opts.imageUrl,
            "alt" : ''
        }).appendTo($flowRect);
    }

    function validOptions(opts){
        var m = ["imageUrl"];
        var isc = true;
        $.each(m, function(k,v){
            if(!(opts[v] && (typeof(opts[v]) != 'string' ||
                (typeof(opts[v]) == 'string' && opts[v] != "")))){
                CLog("ERROR", "options ["+v+"] is required!")
                isc = false;
            }
        });
        return isc;
    }

    function CLog(err,msg) {
        if (window.console && window.console.log)
            console.log(err + ":" + msg);
        else
            alert(msg);
    }

})(jQuery);


