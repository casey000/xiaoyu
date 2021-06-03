
;(function($, window, document, undefined){
    $.extend({
        selectStore: function(params){
            ShowWindowIframe({
                width: "1200",
                height: "700",
                title: "库存库",
                param: params,
                url: "/views/common/select_store_mr.shtml"
            });    
        }
    })
})($, window, document)