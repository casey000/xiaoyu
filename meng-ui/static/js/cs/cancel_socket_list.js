$(function () {

    var options = {
        view: "V_CANCEL_STOCK",
        // 初始化查询参数
        defaultParam: {
            'qname': [],
            'qoperator': [],
            'qvalue': []
        },
        qcOptions: {
            qcBoxId: "qc_box"
        },
        gridOptions: {
            gridId: "common_list_grid",
            allColModels: {
                'add': {
                    name: 'A',
                    colNameEn: 'A',
                    isOpts: true,
                    width: 25,
                    formatter: function (cellValue, options, rowObj) {

                        var ele = '<div id="add_' + rowObj.id + '"  class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit icon-add z_bianji" title="Add"></div>';
                        $('#add_' + rowObj.id).die().live('click', function () {
                            add(rowObj.id, rowObj)
                        });
                        return ele;


                    }
                },

                'del': {
                    name: 'D',
                    colNameEn: 'D',
                    isOpts: true,
                    width: 25,
                    formatter: function (cellValue, options, rowObj) {
                        var ele = '<div id="delete_ner' + rowObj.id + '"  class="uui-corner-all clever-jqgrid-action clever-jqgrid-edit edit icon-Empty z_shanchu" title="Delete"></div>';
                        $('#delete_ner' + rowObj.id).die().live('click', function () {
                            deleteCancelStock(rowObj.id, rowObj);
                        });
                        return ele;

                    }
                },

                'edit': {
                    name: 'E',
                    colNameEn: 'E',
                    isOpts: true,
                    width: 25,
                    formatter: function (cellValue, options, rowObj) {

                        var ele = '<div id="edit_' + rowObj.id + '"  class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit icon-edit z_bianji" title="Edit"></div>';
                        $('#edit_' + rowObj.id).die().live('click', function () {
                            edit(rowObj.id, rowObj)
                        });
                        return ele;


                    }
                },

                "ccNo": {
                    name: 'ccNo',
                    formatter: function (cellValue, options, rowObj) {
                        if (rowObj.ccNo == null) {
                            return "<span>null</span>";
                        } else {
                            var ele = '<span id="nrcno_' + rowObj.id + '" title="' + rowObj.ccNo + '" style="cursor: pointer;color: #f60; ">' + rowObj.ccNo + '</span>';
                            $('#nrcno_' + rowObj.id).die().live('click', function () {
                                cc_sse(rowObj.id, rowObj);
                            });
                            return ele;
                        }
                    }
                }
            },
            jqGridSettings: {
                height: 500,
                multiselect: true
            },
            optsFirst: true,
            optsCols: optsCols,
        },
    };

    $(document).sfaQuery(options);

    $('#batch_update_exec_date').click(function () {
        var curWidth = ($(window).width() * 0.85).toString();
        var curheight = $(window).height().toString();
        ShowWindowIframe({
            width: curWidth,
            height: curheight,
            title: "",
            param: {defect_info: {}},
            url: "/views/cs/edit_cancel_socket.shtml",
        });
    });

    function add(id, result) {
        debugger
        var curWidth = ($(window).width() * 0.85).toString();
        var curheight = $(window).height().toString();
        var param = {
            'id': result.id,
            'pn': result.pn,
            'sn': result.sn,
            'cancelStockQty': result.cancelStockQty,
            'airMaterialState': result.airMaterialState,
            'cancelStockType': result.cancelStockType,
            'toStation': result.toStation,
            'description': result.description,
            'transport': result.description,

            'mrNo': result.mrNo,
            'cancelStockNo': result.cancelStockNo,
            'ccNo': result.ccNo,
            'qty': result.qty,
            'unit': result.unit,
            'ccNo': result.ccNo,

            'cancelStockId': "",
            'cancelStockStatus': "",
        };
        ShowWindowIframe({
            width: curWidth,
            height: curheight,
            title: "",
            param: param,
            url: "/views/cs/add_withdrawal_application.shtml",
        });
    }

    function edit(id, result) {
        debugger
        var curWidth = ($(window).width() * 0.85).toString();
        var curheight = $(window).height().toString();
        var param = {
            'id': result.id,
        };

        ShowWindowIframe({
            width: curWidth,
            height: curheight,
            title: "",
            param: param,
            url: "/views/cs/edit_withdrawal_application.shtml",
        });
    }


    function cc_sse(id, obj) {
        var curWidth = ($(window).width() * 0.85).toString();
        var curheight = $(window).height().toString();
        ShowWindowIframe({
            width: curWidth,
            height: curheight,
            title: "",
            param: {id: id, type: "see", defect_info: {}},
            url: "/views/cs/edit_cancel_socket.shtml",
        });
    }

    function deleteCancelStock(id) {
        debugger
        if (confirm("确定删除吗")) {
            $.ajax({
                type: "GET",
                url: "/api/v1/cancelSock/delete/" + id,
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                success: function (data) {
                    if (data.code == 200) {
                        alert("删除成功！");
                        Refresh();
                    } else {
                        alert(data.msg);
                    }
                },
                error: function () {
                    window.alert("失败！");
                }
            });
        }
    }


});

function Refresh() {
    $(".qc_btn_srh").click();
}

// function addData() {
//     alert("请添加数据");
// }
function addData(id, result) {
    debugger
    var curWidth = ($(window).width() * 0.85).toString();
    var curheight = $(window).height().toString();
    // var param = {
    //     'id': result.id,
    // };

    ShowWindowIframe({
        width: curWidth,
        height: curheight,
        title: "",
        // param: param,
        url: "/views/cs/add_withdrawal_application.shtml",
    });
}