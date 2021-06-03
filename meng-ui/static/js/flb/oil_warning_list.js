var loginInfo;
$(function () {
    loginInfo = getLoginInfo();
    var options = {
        view: "V_TROUBLE_FOLLOW_UP",
        qcOptions: {
            qcBoxId: "qc_box",
            allConds: {
                "tail": {
                    click: function (cell) {
                        // $('#ACQueryWindow').window('open');
                        openDetai("view", 'B-1145');
                    }
                },
                "station": {
                    click: function (cell) {
                        ShowWindowIframe({
                            width: "500",
                            height: "300",
                            title: '航站查询',
                            param: {},
                            url: "/views/tbm/flb/station_query.shtml"
                        });
                    }
                }
            }
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


                        var ele = '<div id="rowData_' + rowObj.acId + '" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit icon-edit" title="Edit"></div>';
                        $('#rowData_' + rowObj.acId).live('click', function () {
                            nrc_edit(rowObj.acId, rowObj)
                        });
                        return ele;

                    }
                },
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


    // 增加按钮
    $("#add_btn").click(function () {

        var curWidth = ($(window).width() * 0.6).toString();
        var curheight = $(window).height().toString();
        ShowWindowIframe({
            width: curWidth,
            height: curheight,
            title: "",
            param: {nrcid: ""},
            url: "/views/nrc/nrc_toAdd.shtml"
        });
    });


});

function queryFltno(row) {
    console.log(row)
}
function openDetai(operation, acReg) {
    var curWidth = ($(window).width() * 0.6).toString();
    var curheight = "650";
    ShowWindowIframe({
        width: curWidth,
        height: curheight,
        title: "Flight list",
        param: {operation: 'view', acReg: acReg},
        url: "/views/common/select_fltno_list.shtml"
    });
    // $("#ACDg").MyDataGrid({
    //     identity: 'ACDg',
    //     sortable: true,
    //     singleSelect: true,
    //     pagination: true,     //开启分页
    //     fitColumns: true,
    //     striped: false,
    //     showHeader: false,
    //     columns: {
    //         param: {FunctionCode: 'FLB_AC_LIST'},
    //         alter: {}
    //     },
    //     onLoadSuccess: function () {
    //     },
    //     contextMenus: [],
    //     toolbar: [],
    //     onClickRow: function (rowIndex, rowData) {
    //     },
    //     onDblClickRow: function () {
    //         let row = $('#ACDg').datagrid('getSelected'); //获取所选行的数据
    //         $("#tail").attr("value", row.tail); //给station控件赋值
    //         $('#ACQueryWindow').window('close'); //关闭弹窗
    //     }
    // });
}


function nrc_edit(id, rowData, back) {
    console.log(rowData)
    // var unCurAssignee = rowData.curAssignee != loginInfo.accountId ? "hide" : "show";
    // var _params = {};
    // _params['nrcId'] = rowData['nrcId'];
    // _params['taskId'] = rowData['taskId'];
    // _params['flowDefId'] = rowData['flowDefId'];
    // _params['procDefId'] = rowData['procDefId'];
    // _params['processId'] = rowData['nrcProcessId'];
    // _params['unCurAssignee'] = unCurAssignee;
    //
    // var url = '/api/v1/plugins/PROCESS_GET_FORM';
    // var _data = {
    //     FunctionCode: "PROCESS_GET_FORM",
    //     taskId: _params['taskId'],
    //     flowDefId: _params['flowDefId']
    // };
    // if (back) {
    //     var curWidth = ($(window).width() * 0.6).toString();
    //     var curheight = $(window).height().toString();
    //     ShowWindowIframe({
    //         width: curWidth,
    //         height: curheight,
    //         title: "",
    //         param: {nrcid: id},
    //         url: "/views/NRC/nrc_toAdd.shtml"
    //     });
    // } else {
    //     $.ajax({
    //         type: "POST",
    //         url: url,
    //         data: _data,
    //         success: function (data) {
    //             open_task_page(data, _params);
    //         },
    //         error: function () {
    //             window.alert("获取数据失败！");
    //         }
    //     });
    // }
    /*


    */
}




