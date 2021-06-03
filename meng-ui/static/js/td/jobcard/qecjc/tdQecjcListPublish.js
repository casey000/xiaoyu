var PAGE_DATA = {};
var param;


function i18nCallBack() {
    param = getParentParam_();

    //绑定回车查询事件
    bindFormonSearch_('#ffSearch', function () {
        searchData()
    });

    InitFuncCodeRequest_({
        data: {
            domainCode: "DA_FLEET,TD_JC_STATUS",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                PAGE_DATA['fleet'] = DomainCodeToMap_(jdata.data["DA_FLEET"]);//机队
                PAGE_DATA['status'] = DomainCodeToMap_(jdata.data["TD_JC_STATUS"]);//状态

                //机队
                $('#fleet').combobox({
                    panelHeight: '140px',
                    data: jdata.data.DA_FLEET,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });

                $('#status').combobox({
                    panelHeight: '140px',
                    data: jdata.data.TD_JC_STATUS,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });

                $('#status').combobox({
                    value: "ISSUE",
                    onlyview: true,
                    editable: false
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
        queryParams: {status: "ISSUE"},
        pageSize: 15,
        columns: {
            param: {FunctionCode: 'TD_JC_ALL_QECJC_LIST'},
            alter: {
                STATUS: {
                    formatter: function (value) {
                        return PAGE_DATA['status'][value];
                    }
                },
                FLEET: {
                    formatter: function (value) {
                        return PAGE_DATA['fleet'][value];
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
            items['退回'].enable = true;
            items['定时发布'].enable = true;
            items['PDF预览'].enable = true;
            // }

            return items;
        },
        contextMenus: [

            {
                id: "", i18nText: "发布", auth: "TD_JC_QECJC_PUBLISH_HANDLE",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (confirm("是否确认发布？")) {
                        InitFuncCodeRequest_({
                            data: {FunctionCode: 'TD_JC_ALL_QECJC_PUBLISH', pkid: rowData.PKID},
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
            {
                id: "", i18nText: "退回", auth: "TD_JC_QECJC_PUBLISH_TURNBACK",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (confirm("是否退回？")) {
                        //打开注销或恢复页面
                        var title_ = $.i18n.t('部件工卡发布退回');
                        ShowWindowIframe({
                            width: "680",
                            height: "80",
                            title: title_,
                            param: {pkid: rowData.PKID},
                            url: "/views/td/jobcard/cmjc/tdCmjcPublishBack.shtml"
                        });
                    }
                }
            },
            {
                id: "m-publishontime",
                i18nText: "定时发布",
                auth: "TD_JC_QECJC_PUBLISH_HANDLE",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (rowData.PULIC_TIME_DATE != null && rowData.PULIC_TIME_DATE != "") {
                        MsgAlert({content: "该数据已设置过定时任务!", type: 'error'});
                        return;
                    }
                    ShowWindowIframe({
                        width: "465",
                        height: "350",
                        title: "定时发布",
                        param: {pkid: rowData.PKID, type: "Single"},
                        url: "/views/td/jobcard/commonjc/TdJcTimerPublish.shtml"
                    });
                    //alert("定时发布");
                    // datas = $.extend({}, {}, {FunctionCode: 'TD_JC_ALL_CMJC_STATUS', pkid: rowData.PKID});
                    // InitFuncCodeRequest_({
                    //     data: datas, successCallBack: function (jdata) {
                    //         console.log(jdata);
                    //         if (jdata.data != null) {
                    //             common_add_edit_({
                    //                 identity: '', isEdit: '', width: 520, height: 300, title: $.i18n.t('选择审批人'),
                    //                 param: {
                    //                     roleId: '',
                    //                     otherParam: rowData.PKID,
                    //                     FunctionCode_: 'TD_JC_ALL_CMJC_SUBMIT',
                    //                     successCallback: reload_
                    //                 },
                    //                 url: "/views/em/workflow/work_flow_account_select.shtml"
                    //             });
                    //         } else {
                    //             MsgAlert({content: "该数据已被提交过了。", type: 'error'});
                    //         }
                    //     }
                    // });

                }
            },
            {
                id: "", i18nText: "PDF预览", auth: "TD_JC_QECJC_PUBLISH_VIEW",
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
                    InitFuncCodeRequest_({
                        data: data, successCallBack: function (jdata) {
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
            {
                key: "COMMON_ADD",
                text: "批量发布",
                auth: "TD_JC_QECJC_PUBLISH_HANDLE",
                handler: function () {
                    var rowData = getDG('dg').datagrid('getChecked');
                    if (rowData.length == 0) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (confirm("是否批量发布？")) {
                        $.each(rowData, function (index, obj) {
                            InitFuncCodeRequest_({
                                data: {FunctionCode: 'TD_JC_ALL_QECJC_PUBLISH', pkid: obj.PKID},
                                successCallBack: function (jdata) {
                                    if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                        MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                        reload_("dg");
                                    } else {
                                        MsgAlert({content: jdata.msg, type: 'error'});
                                    }
                                }
                            });
                        })
                    }
                }
            },
            {
                key: "COMMON_ADD",
                text: "批量定时发布",
                auth: "TD_JC_QECJC_PUBLISH_HANDLE",
                handler: function () {
                    //alert("批量定时发布");
                    var rowData = getDG('dg').datagrid('getChecked');

                    if (rowData.length == 0) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }

                    var flag = true;
                    $.each(rowData, function (index, obj) {
                        if (obj.PULIC_TIME_DATE != null && obj.PULIC_TIME_DATE != "") {
                            MsgAlert({content: "该数据已设置过定时任务!", type: 'error'});
                            flag = false;

                        }
                    });
                    if (flag == true) {
                        var ids = "";
                        $.each(rowData, function (index, obj) {
                            if (index == rowData.length - 1) {
                                ids += obj.PKID;
                            }
                            else {
                                ids += obj.PKID + ",";
                            }
                        });
                        ShowWindowIframe({
                            width: "465",
                            height: "350",
                            title: "定时发布",
                            param: {pkid: ids, type: "Multiple"},
                            url: "/views/td/jobcard/commonjc/TdJcTimerPublish.shtml"
                        });

                    }
                }
            }
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
        height: "650",
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
    var title_ = $.i18n.t('QEC工卡预览');
    ShowWindowIframe({
        width: "850",
        height: "650",
        title: title_,
        param: {url: url},
        url: "/views/td/jobcard/smjc/smjcedit/jobcardPreview.shtml"
    });
}