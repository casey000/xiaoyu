;(function ($, window, document, undefined) {
    $.extend({
        upload_component: function (params) {
            var curWidth = ($(window).width()).toString();
            var curheight = $(window).height().toString();
            ShowWindowIframe({
                width: "670px",
                height: "500px",
                title: "",
                param: params,
                url: "/views/nrc/upload_component.shtml"
            });
        }
    })
})($, window, document);