;(function($, window, document, undefined){
    $.extend({
        mrSelect: function(params){
            ShowWindowIframe({
                width: "1200",
                height: "700",
                title: "航材选择",
                param: params,
                url: "/views/cs/mrSelect.shtml"
            });
        }
    })
})($, window, document)