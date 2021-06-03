;(function($, window, document, undefined){
    $.extend({
        pnSelect: function(params){
            ShowWindowIframe({
                width: "1300",
                height: "700",
                title: "航材选择",
                param: params,
                url: "/views/defect/pnSelect.shtml"
            });    
        }
    })
})($, window, document)