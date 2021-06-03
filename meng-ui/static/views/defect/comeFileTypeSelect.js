;(function($, window, document, undefined){
    $.extend({
        comeFileTypeSelect: function(params){
            ShowWindowIframe({
                width: "1300",
                height: "750",
                title: "来源文件类型选择",
                param: params,
                url: "/views/defect/select_type_number_tlb.shtml"
            });
        }
    })
})($, window, document)