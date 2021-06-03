;(function ($, window, document, undefined) {
    $.extend({
        nrc_listno: function (params) {
            var curWidth = ($(window).width()).toString();
            var curheight = $(window).height().toString();
            ShowWindowIframe({
                width: curWidth,
                height: curheight,
                title: "",
                param: params,
                url: "/views/nrc/nrc_listno.shtml"
            });
        }
    })
})($, window, document);