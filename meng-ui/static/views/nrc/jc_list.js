;(function ($, window, document, undefined) {
    $.extend({
        jc_list: function (params) {
            var curWidth = ($(window).width()).toString();
            var curheight = $(window).height().toString();
            ShowWindowIframe({
                width: curWidth,
                height: curheight,
                title: "",
                param: params,
                url: "/views/nrc/jc_list.shtml"
            });
        }
    })
})($, window, document);