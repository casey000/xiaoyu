var PAGE_DATA = {};

function i18nCallBack() {
    //绑定回车查询事件
    bindFormonSearch_('#ffSearch', function () {
        searchData()
    });

    //数据字典初始化
    InitFuncCodeRequest_({
        data: {
            domainCode: "TD_JC_STATUS,DA_FLEET,TD_JC_YOJC_WRITER,YESORNO",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                PAGE_DATA['status'] = DomainCodeToMap_(jdata.data["TD_JC_STATUS"]);
                PAGE_DATA['fleet'] = DomainCodeToMap_(jdata.data["DA_FLEET"]);
                PAGE_DATA['ifRii'] = DomainCodeToMap_(jdata.data["YESORNO"]);


                //机队
                $("#fleet").combobox({
                    panelHeight: '140px',
                    data: jdata.data.DA_FLEET,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });

                //工卡流程状态
                $("#status").combobox({
                    panelHeight: '140px',
                    data: jdata.data.TD_JC_STATUS,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });

                //编写人
                $("#writer").combobox({
                    panelHeight: '140px',
                    data: jdata.data.TD_JC_YOJC_WRITER,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });

                //TO编号


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
        columns: {
            param: {FunctionCode: 'TD_JC_TOJC_LIST'},
            alter: {
                STATUS: {
                    formatter: function (value) {
                        return PAGE_DATA['status'][value];
                    }
                },
                IF_RII: {
                    formatter: function (value) {
                        return PAGE_DATA['ifRii'][value];
                    }
                },
                FLEET: {
                    formatter: function (value) {
                        return PAGE_DATA['fleet'][value];
                    }
                },
                IF_UPLOAD: {
                    formatter: function (value) {
                        return PAGE_DATA['ifUpload'][value];
                    }
                },
                CREATE_DATE: {
                    type: 'datetime'
                },
                MODIFY_DATE: {
                    type: 'datetime'
                }
            }
        },
        onLoadSuccess: function () {
        },
        validAuth: function (row, items) {
            if (row.STATUS != "EDIT" || getLoginInfo().accountId != row.WRITER) {
                items["修订"].enable = false;
            }
            if (row.STATUS != "EDIT") {
                items["提交"].enable = false;
            }
            if (row.STATUS != "EDIT") {
                items["删除"].enable = false;
            }
            if (row.STATUS != "ISSUED") {
                items["改版"].enable = false;
            }
            if (row.STATUS != "EDIT") {
                items["转发"].enable = false;
            }
            return items;
        },
        contextMenus: [
            {
                id: "m-edit", i18nText: "修订", auth: "",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (rowData.STATUS != 'EDIT') {
                        MsgAlert({content: '只有"编写中"状态可修订', type: 'error'});
                        return;
                    }
                    if (getLoginInfo().accountId != rowData.WRITER) {
                        MsgAlert({content: "没有修订权限！", type: 'error'});
                        return;
                    }
                    openDetail('edit', rowData.PKID);
                }
            },
            {
                id: "m-submit", i18nText: "提交", auth: "",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (rowData.STATUS != 'EDIT') {
                        MsgAlert({content: "该状态下不可提交!", type: "error"});
                        return;
                    }
                    var title_ = $.i18n.t('提交');
                    ShowWindowIframe({
                        width: "550",
                        height: "200",
                        title: title_,
                        param: {pkid: rowData.PKID},
                        url: "/views/td/jobcard/tojc/tojcedit/tdTojcEditSubmit.shtml"
                    });
                }
            },
            {
                id: "m-delete", i18nText: "删除", auth: "",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (rowData.STATUS != 'EDIT') {
                        MsgAlert({content: '该状态下不可删除!'});
                        return;
                    }
                    if (!confirm("该操作将会删除所有有关记录,确认删除？")) {
                        return;
                    }
                    InitFuncCodeRequest_({
                        data: {pkid: rowData.PKID, FunctionCode: 'TD_JC_TOJC_DELETE'},
                        successCallBack: function (jdata) {
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                reload_();
                            } else {
                                MsgAlert({content: jdata.msg, type: 'error'});
                            }
                        }
                    });
                }
            },
            {
                id: "", i18nText: "改版", auth: "",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (rowData.STATUS != 'ISSUED') {
                        MsgAlert({content: '该状态下不可改版!'});
                        return;
                    }
                    if (!confirm("确认改版?")) {
                        return;
                    }
                    InitFuncCodeRequest_({
                        data: {pkid: rowData.PKID, FunctionCode: "TD_JC_TOJC_REVISON"},
                        successCallBack: function (jdata) {
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                reload_();
                            } else {
                                MsgAlert({content: jdata.msg, type: 'error'});
                            }
                        }
                    });
                }
            },
            {
                id: "", i18nText: "转发", auth: "",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (rowData.WRITER != getLoginInfo().accountId) {
                        MsgAlert({content: "没有操作权限!", type: "error"});
                        return;
                    }
                    var title_ = $.i18n.t('转发');
                    ShowWindowIframe({
                        width: "550",
                        height: "200",
                        title: title_,
                        param: {pkid: rowData.PKID},
                        url: "/views/td/jobcard/tojc/tojcedit/tdTojcEditForOther.shtml"
                    });
                }
            },
            {
                id: "", i18nText: "PDF预览", auth: "",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});

                    }

                }
            },
            {
                id: "m-delete", i18nText: "PC端预览", auth: "",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});

                    }

                }
            },
            {
                id: "", i18nText: "流程图", auth: "",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    InitFuncCodeRequest_({
                        data: {pkid: rowData.PKID, userId: getLoginInfo().accountId, FunctionCode: "TD_TOJC_FLOW"},
                        successCallBack: function (jdata) {
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                if (!jdata.data || !jdata.data.PROC_DEF_ID) {
                                    MsgAlert({content: "该记录没有流程信息!", type: "error"});
                                    return;
                                }
                                ShowWindowIframe({
                                    width: 800,
                                    height: 600,
                                    title: $.i18n.t('流程图'),
                                    param: {
                                        PROC_DEF_ID: jdata.data.PROC_DEF_ID,
                                        PROC_INST_ID: jdata.data.PROC_INST_ID,
                                        BUSINESS_KEY: jdata.data.BUSINESS_KEY
                                    },
                                    url: '/views/ws/work_flow/flow_definition/flow_diagram_view.shtml'
                                });
                            } else {
                                MsgAlert({content: jdata.msg, type: "error"});
                            }
                        }
                    });

                }
            },
            {
                id: "", i18nText: "办理轨迹", auth: "",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (rowData.STATUS == 'EDIT') {
                        MsgAlert({content: "该记录还未提交", type: "error"});
                        return;
                    }
                    ShowWindowIframe({
                        width: 1100,
                        height: 400,
                        title: $.i18n.t('审批轨迹'),
                        param: {objNo: rowData.PKID, objKey: "TD_JC_ALL"},
                        url: '/views/em/workflow/work_flow_history_task_list.shtml'
                    });


                }
            }
        ],
        toolbar: [{
            id: 'btnAdd',
            text: $.i18n.t('批量提交'),
            iconCls: 'icon-ok',
            handler: function () {
                batchSubmit();
            }
        }, '-', {
            id: 'btnAdd',
            text: $.i18n.t('增加'),
            iconCls: 'icon-add',
            handler: function () {
                openDetail('add');
            }
        }, '-', {
            id: 'btnReload',
            text: $.i18n.t('刷新'),
            iconCls: 'icon-reload',
            handler: function () {
                $("#dg").datagrid("reload");
            }
        }],
        onClickRow: function (rowIndex, rowData) {
        },
        onDblClickRow: function (index, field, value) {
            openDetail("view", value.PKID);
        }
    });
}

//刷新
function reload_() {
    $("#dg").datagrid("reload");
}


//修订
function openDetail(operation, pkid) {
    var title_ = $.i18n.t('TO工卡编写');
    ShowWindowIframe({
        width: "810",
        height: "520",
        title: title_,
        param: {operation: operation, pkid: pkid},
        url: "/views/td/jobcard/tojc/tojcedit/tdTojcEditDetail.shtml"
    });
}


//批量提交
function batchSubmit() {
    var selectRows = getDG("dg").datagrid("getChecked");
    var selectCount = selectRows.length;
    if (selectCount === 0) {
        MsgAlert({content: '请选择要提交的记录！', type: 'error'});
        return;
    }
    var pkids = '';
    var flag = false;
    $.each(selectRows, function (k, item) {
        if (item.STATUS != 'EDIT') {
            MsgAlert({content: "选择记录中有不能提交的记录", type: "error"});
            flag = true;
            return false;
        }
    });
    if (!flag) {
        $.each(selectRows, function (k, item) {
            pkids += item.PKID + ',';
        });
    } else {
        return;
    }
    alert(pkids);
    var title_ = $.i18n.t('提交');
    ShowWindowIframe({
        width: "550",
        height: "200",
        title: title_,
        param: {pkid: pkids},
        url: "/views/td/jobcard/tojc/tojcedit/tdTojcEditSubmit.shtml"
    });


}

//查询
function searchData() {
    onSearch_('dg', '#ffSearch');
}

//重置
function doClear_() {
    $("#ffSearch").form('clear');
    searchData();
}