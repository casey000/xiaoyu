var PAGE_DATA = {};
var param;
var user;

function i18nCallBack() {
    param = getParentParam_();

    user = getLoginInfo();
    //绑定回车查询事件
    bindFormonSearch_('#ffSearch', function () {
        searchData()
    });

    InitFuncCodeRequest_({
        data: {
            domainCode: "TD_JC_STATE,TD_JC_STATUS,TD_JC_SMJC_WRITER",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                PAGE_DATA['jcStatus'] = DomainCodeToMap_(jdata.data["TD_JC_STATE"]);//工卡状态、使用、不适用
                PAGE_DATA['status'] = DomainCodeToMap_(jdata.data["TD_JC_STATUS"]);//状态

                //工卡状态、使用、不适用
                $('#jcStatus').combobox({
                    panelHeight: '140px',
                    data: jdata.data.TD_JC_STATE,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });

                //状态
                $('#status').combobox({
                    panelHeight: '140px',
                    data: jdata.data.TD_JC_STATUS,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });

                // 对工卡编写发布页面做特殊处理
                $('#status').combobox({
                    value: "ISSUE",
                    onlyview: true,
                    editable: false
                });

                //编写人
                $('#writer').combobox({
                    panelHeight: '100px',
                    data: jdata.data.TD_JC_SMJC_WRITER,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    value: user.accountId
                });

                InitDataGrid();
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

function InitDataGrid() {
    $("#dg").MyDataGrid({
        identity: 'dg',
        sortable: true,
        singleSelect: true,
        pageSize: 15,
        queryParams: {status: "ISSUE"},
        columns: {
            param: {FunctionCode: 'TD_CMJC_LIST'},
            alter: {
                STATUS: {
                    formatter: function (value) {
                        return PAGE_DATA['status'][value];
                    }
                },
                JC_STATUS: {
                    formatter: function (value) {
                        return PAGE_DATA['jcStatus'][value];
                    }
                },
                WRITE_DATE: {
                    type: 'datetime'
                },
                REVIEWED_DATE: {
                    type: 'datetime'
                },
                APPROVED_DATE: {
                    type: 'datetime'
                },
                PUBLIC_DATE: {
                    type: 'datetime'
                }
            }
        },
        onLoadSuccess: function () {

        },
        validAuth: function (row, items) {

            // if (row.STATUS != 'EDIT' && row.STATUS != 'EDITED') {//只有在编写中才可以删除
            items['发布'].enable = true;
            // items['退回'].enable = true;
            items['PDF预览'].enable = true;
            // }

            return items;
        },
        contextMenus: [

            {
                id: "", i18nText: "发布",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (confirm("是否确认发布？")) {
                        InitFuncCodeRequest_({
                            data: {FunctionCode: 'TD_JC_ALL_CMJC_PUBLISH', pkid: rowData.PKID},
                            successCallBack: function (jdata) {
                                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                    MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                    reload_("dg");
                                } else {
                                    MsgAlert({content: jdata.msg, type: 'error'});
                                }
                            }
                        });
                    }
                }
            },
            // {
            //     id: "", i18nText: "退回",
            //     onclick: function () {
            //         var rowData = getDG('dg').datagrid('getSelected');
            //         if (!rowData.PKID) {
            //             MsgAlert({content: "请选择数据！", type: 'error'});
            //             return;
            //         }
            //         if (confirm("是否退回？")) {
            //             //打开注销或恢复页面
            //             var title_ = $.i18n.t('部件工卡发布退回');
            //             ShowWindowIframe({
            //                 width: "680",
            //                 height: "80",
            //                 title: title_,
            //                 param: {pkid: rowData.PKID},
            //                 url: "/views/td/jobcard/cmjc/tdCmjcPublishBack.shtml"
            //             });
            //         }
            //     }
            // },
            {
                id: "", i18nText: "PDF预览",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (rowData.PDF_PATH == null || rowData.PDF_PATH == "") {
                        MsgAlert({content: "工卡PDF存档不存在，请联系管理员。", type: 'error'});
                        return;
                    }
                    var data = $.extend(toCamelCase(rowData), {FunctionCode: 'TD_JC_PREVIEW'});
                    ajaxLoading();
                    InitFuncCodeRequest_({
                        data: data, successCallBack: function (jdata) {
                            ajaxLoadEnd();
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                if (jdata.data.length > 0) {
                                    var url = jdata.data;
                                    jcPreview(url);
                                }
                            } else {
                                MsgAlert({content: jdata.msg, type: 'error'});
                            }
                        }
                    });
                }
            }
        ],
        toolbar: [
            // {
            //     key: "COMMON_ADD",
            //     text: "批量发布",
            //     handler: function () {
            //         var rowData = getDG('dg').datagrid('getChecked');
            //         if (rowData.length == 0) {
            //             MsgAlert({content: "请选择数据！", type: 'error'});
            //             return;
            //         }
            //         if (confirm("是否批量发布？")) {
            //             $.each(rowData, function (index, obj) {
            //                 InitFuncCodeRequest_({
            //                     data: {FunctionCode: 'TD_JC_ALL_CMJC_PUBLISH', pkid: obj.PKID},
            //                     successCallBack: function (jdata) {
            //                         if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
            //                             MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
            //                             reload_("dg");
            //                         } else {
            //                             MsgAlert({content: jdata.msg, type: 'error'});
            //                         }
            //                     }
            //                 });
            //             })
            //         }
            //     }
            // }
            // ,
            // {
            //     key: "COMMON_ADD",
            //     text: "批量定时发布",
            //     handler: function () {
            //         //alert(1);
            //         var rowData = getDG('dg').datagrid('getChecked');
            //
            //         if (rowData.length == 0) {
            //             MsgAlert({content: "请选择数据！", type: 'error'});
            //             return;
            //         }
            //
            //         var flag = true;
            //         $.each(rowData, function (index, obj) {
            //             if (obj.PULIC_TIME_DATE != null && obj.PULIC_TIME_DATE != "") {
            //                 MsgAlert({content: "该数据已设置过定时任务!", type: 'error'});
            //                 flag = false;
            //
            //             }
            //         });
            //         if (flag == true) {
            //             var ids = "";
            //             $.each(rowData, function (index, obj) {
            //                 if (index == rowData.length - 1) {
            //                     ids += obj.PKID;
            //                 }
            //                 else {
            //                     ids += obj.PKID + ",";
            //                 }
            //             });
            //             ShowWindowIframe({
            //                 width: "465",
            //                 height: "350",
            //                 title: "定时发布",
            //                 param: {pkid: ids, type: "Multiple"},
            //                 url: "/views/td/jobcard/commonjc/TdJcTimerPublish.shtml"
            //             });
            //
            //         }
            //     }
            // }
        ],
        onClickRow: function (rowIndex, rowData) {
        },
        onDblClickRow: function (index, field, value) {
            openDetai("view", value.PKID);
        }
    });
}

//刷新
function reload_() {
    $("#dg").datagrid("reload");
}

//打开资料类型详细页面
function openDetai(operation, pkid) {
    var title_ = $.i18n.t('部件工卡详情');
    ShowWindowIframe({
        width: "1000",
        height: "498",
        title: title_,
        param: {operation: operation, pkid: pkid},
        url: "/views/td/jobcard/cmjc/tdCmjcDetail.shtml"
    });
}

//查询
function searchData() {
    onSearch_('dg', '#ffSearch');
}

//重置
function doClear_() {
    $("#ffSearch").form('clear');
    $('#status').combobox({
        value: "ISSUE"
    });
    searchData();
}

function jcPreview(url) {
    var title_ = $.i18n.t('部件工卡预览');
    ShowWindowIframe({
        width: "850",
        height: "650",
        title: title_,
        param: {url: url},
        url: "/views/td/jobcard/smjc/smjcedit/jobcardPreview.shtml"
    });
}