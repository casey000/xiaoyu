var loginInfo;
$(function () {
    loginInfo = getLoginInfo();
    var options = {
        view: "V_NRC_BASE",
        qcOptions: {
            qcBoxId: "qc_box"
        },
        gridOptions: {
            gridId: "common_list_grid",
            allColModels: {
                'edit': {
                    name: 'E',
                    colNameEn: 'E',
                    isOpts: true,
                    width: 25,
                    formatter: function (cellValue, options, rowObj) {

                    }
                },
                'del': {
                    name: 'D',
                    colNameEn: 'D',
                    isOpts: true,
                    width: 25,
                    formatter: function (cellValue, options, rowObj) {

                    }
                },
                jqGridSettings: {
                    height: 500,
                    multiselect: true
                },

                optsFirst: true,
                optsCols: optsCols,

            }
        },

    };

    $(document).sfaQuery(options);


    // 增加按钮
    $("#add_btn").click(function () {

        var curWidth = ($(window).width() * 0.6).toString();   //测试定检弹窗
        var curheight = $(window).height().toString();
        ShowWindowIframe({
            width: curWidth,
            height: curheight,
            title: "",
            param: {},
            url: "/views/fixed/fixed_inspection.shtml"
        });
    });
});