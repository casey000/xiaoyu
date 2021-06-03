var PAGE_DATA = {};
var user;
var name = getLoginInfo().userName;
var accountId = getLoginInfo().accountId;

function i18nCallBack() {

    $('#tt').tabs('close', '虚拟LLP');
    $('#tt').tabs('close', '热部件软时限');
    $('#tt').tabs('close', 'LLP延寿量');
    user = getLoginInfo();

    InitGatewayRequest_({
        type: "get",
        async: false,
        path: "/meng-engine/baseOwn/getEngTypeNew",
        successCallBack: function (jdata) {
            if (jdata.success == true) {
                $('#engType1').combobox({
                    data: jdata.obj,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    panelHeight: '150px',
                });

                $('#engType3').combobox({
                    data: jdata.obj,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    panelHeight: '150px',
                });

                $('#engType4').combobox({
                    data: jdata.obj,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    panelHeight: '150px',
                });

                $('#engType7').combobox({
                    data: jdata.obj,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    panelHeight: '150px',
                });

                $('#engType8').combobox({
                    data: jdata.obj,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    panelHeight: '150px',
                });

                $('#engType9').combobox({
                    data: jdata.obj,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    panelHeight: '150px',
                });
            } else {
                MsgAlert({content: '获取发动机型号列表失败', type: 'error'});
            }
        }
    });

    InitFuncCodeRequest_({
        data: {
            domainCode: "ENG_RX_REPAIRPLAN_STATUS,DA_ACREG_MODEL_SERIES",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                PAGE_DATA['auditStatus'] = DomainCodeToMap_(jdata.data["ENG_RX_REPAIRPLAN_STATUS"]);
                //机型
                $('#acType').combobox({
                    panelHeight: '100px',
                    data: jdata.data.DA_ACREG_MODEL_SERIES,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });

    InitDataGrid1();
    InitDataGrid3();
    InitDataGrid4();
    InitDataGrid7();
    InitDataGrid8();
    InitDataGrid9();
}

//查询
function searchData(grid, search) {
    if(grid =='dg1'){
        InitDataGrid1();
    }else if (grid =='dg3'){
        InitDataGrid3();
    }else if (grid =='dg4'){
        InitDataGrid4();
    }else if (grid =='dg7'){
        InitDataGrid7();
    }else if (grid =='dg8'){
        InitDataGrid8();
    }else if (grid =='dg9'){
        InitDataGrid9();
    }
}

//刷新
function reload_(grid) {
    if(grid =='dg1'){
        InitDataGrid1();
    }else if (grid =='dg3'){
        InitDataGrid3();
    }else if (grid =='dg4'){
        InitDataGrid4();
    }else if (grid =='dg7'){
        InitDataGrid7();
    }else if (grid =='dg8'){
        InitDataGrid8();
    }else if (grid =='dg9'){
        InitDataGrid9();
    }
}

//重置
function doClear_(search, grid) {
    $(search).form('clear');
}

function InitDataGrid1() {
    var queryParams = $("#ffSearch1").serializeObject();
    $("#dg1").GatewayDataGrid({
        identity: 'dg1',
        idField: "pkid",
        queryParams: queryParams,
        pagination: true,
        path: "/meng-engine/rxArgEngtype/listByPage",
        columns: {
            param: {FunctionCode: 'ENG_RX_ARG_ENGTYPE'},
            alter: {
                modifyDate: {
                    type: 'date'
                },
            }
        },
        contextMenus: [
            {
                id: "m-edit",
                i18nText: "编辑",
                auth: "ENG_RX_ARG2",
                onclick: function () {
                    var rowData = getDG('dg1').datagrid('getSelected');

                    if (!rowData.pkid) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    editEngTypeData('edit',rowData);

                }
            },
            {
                id: "m-delete",
                i18nText: "删除",
                auth: "ENG_RX_ARG3",
                onclick: function () {
                    var rowData = getDG('dg1').datagrid('getSelected');
                    if (!rowData.pkid) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (!confirm("确认删除该记录？")) {
                        return;
                    }

                    InitGatewayRequest_({
                        type: "get",
                        async: false,
                        path: "/meng-engine/rxArgEngtype/deleteByPrimaryKey/"+rowData.pkid,
                        successCallBack: function (jdata) {
                            if (jdata.success == true) {
                                MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                reload_('dg1');
                            } else {
                                MsgAlert({content: '操作失败', type: 'error'});
                            }
                        }});
                }
            },
            {
                id: "m-edit",
                i18nText: "查看",
                onclick: function () {
                    var rowData = getDG('dg1').datagrid('getSelected');
                    editEngTypeData("view", rowData);

                }
            }
        ],
        validAuth: function (row, items) {
            if(row.modifyUser != user.accountId) {
                items['编辑'].enable = false;
                items['删除'].enable = false;
            }
            return items;
        },
        onClickRow: function (rowIndex, rowData) {
        },
        onDblClickRow: function (index, field, value) {
            editEngTypeData("view", value);
        },
        resize: function () {
            return tabs_standard_resize($('#tt'), 30)
        }
    });
}

function editEngTypeData(operation, rowData) {
    var title_ = $.i18n.t('发动机型号参数设置');
    ShowWindowIframe({
        width: "690",
        height: "370",
        title: title_,
        param: {rowData: rowData, operation: operation},
        url: "/views/engine/rx/arg/eng_rx_arg_engtype_edit.shtml"
    });
}

function InitDataGrid3() {
    var queryParams = $("#ffSearch3").serializeObject();
    $("#dg3").GatewayDataGrid({
        identity: 'dg3',
        idField: "pkid",
        queryParams: queryParams,
        pagination: true,
        path: "/meng-engine/rxArgHp/listByPage",
        columns: {
            param: {FunctionCode: 'ENG_RX_ARG_HP'},
            alter: {
                modifyDate: {
                    type: 'date'
                },
            }
        },
        contextMenus: [
            {
                id: "m-edit",
                i18nText: "编辑",
                onclick: function () {
                    var rowData = getDG('dg3').datagrid('getSelected');

                    if (!rowData.pkid) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    editHpData('edit',rowData);

                }
            },
            {
                id: "m-delete",
                i18nText: "删除",
                onclick: function () {
                    var rowData = getDG('dg3').datagrid('getSelected');
                    if (!rowData.pkid) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (!confirm("确认删除该记录？")) {
                        return;
                    }

                    InitGatewayRequest_({
                        type: "get",
                        async: false,
                        path: "/meng-engine/rxArgHp/deleteByPrimaryKey/"+rowData.pkid,
                        successCallBack: function (jdata) {
                            if (jdata.success == true) {
                                MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                reload_('dg3');
                            } else {
                                MsgAlert({content: '操作失败', type: 'error'});
                            }
                        }});
                }
            },
            {
                id: "m-edit",
                i18nText: "查看",
                onclick: function () {
                    var rowData = getDG('dg3').datagrid('getSelected');
                    editHpData("view", rowData);

                }
            }
        ],
        validAuth: function (row, items) {
            if(row.modifyUser != user.accountId) {
                items['编辑'].enable = false;
                items['删除'].enable = false;
            }
            return items;
        },
        onClickRow: function (rowIndex, rowData) {
        },
        onDblClickRow: function (index, field, value) {
            editHpData("view", value);
        },
        resize: function () {
            return tabs_standard_resize($('#tt'), 30)
        }
    });
}

function editHpData(operation, rowData) {
    var title_ = $.i18n.t('热部件软时限设置');
    ShowWindowIframe({
        width: "690",
        height: "370",
        title: title_,
        param: {rowData: rowData, operation: operation},
        url: "/views/engine/rx/arg/eng_rx_arg_hp_edit.shtml"
    });
}

function InitDataGrid4() {
    var queryParams = $("#ffSearch4").serializeObject();
    $("#dg4").GatewayDataGrid({
        identity: 'dg4',
        idField: "pkid",
        queryParams: queryParams,
        pagination: true,
        path: "/meng-engine/rxArgLlp/listByPage",
        columns: {
            param: {FunctionCode: 'ENG_RX_ARG_LLP'},
            alter: {
                modifyDate: {
                    type: 'date'
                },
            }
        },
        contextMenus: [
            {
                id: "m-edit",
                i18nText: "编辑",
                onclick: function () {
                    var rowData = getDG('dg4').datagrid('getSelected');

                    if (!rowData.pkid) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    editLlpData('edit',rowData);

                }
            },
            {
                id: "m-delete",
                i18nText: "删除",
                onclick: function () {
                    var rowData = getDG('dg4').datagrid('getSelected');
                    if (!rowData.pkid) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (!confirm("确认删除该记录？")) {
                        return;
                    }

                    InitGatewayRequest_({
                        type: "get",
                        async: false,
                        path: "/meng-engine/rxArgLlp/deleteByPrimaryKey/"+rowData.pkid,
                        successCallBack: function (jdata) {
                            if (jdata.success == true) {
                                MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                reload_('dg4');
                            } else {
                                MsgAlert({content: '操作失败', type: 'error'});
                            }
                        }});
                }
            },
            {
                id: "m-edit",
                i18nText: "查看",
                onclick: function () {
                    var rowData = getDG('dg4').datagrid('getSelected');
                    editLlpData("view", rowData);

                }
            }
        ],
        validAuth: function (row, items) {
            if(row.modifyUser != user.accountId) {
                items['编辑'].enable = false;
                items['删除'].enable = false;
            }
            return items;
        },
        onClickRow: function (rowIndex, rowData) {
        },
        onDblClickRow: function (index, field, value) {
            editLlpData("view", value);
        },
        resize: function () {
            return tabs_standard_resize($('#tt'), 30)
        }
    });
}

function editLlpData(operation, rowData) {
    var title_ = $.i18n.t('LLP延寿量设置');
    ShowWindowIframe({
        width: "690",
        height: "370",
        title: title_,
        param: {rowData: rowData, operation: operation},
        url: "/views/engine/rx/arg/eng_rx_arg_llp_edit.shtml"
    });
}

function InitDataGrid7() {
    var queryParams = $("#ffSearch7").serializeObject();
    $("#dg7").GatewayDataGrid({
        identity: 'dg7',
        idField: "pkid",
        queryParams: queryParams,
        pagination: true,
        path: "/meng-engine/rxArgVirllp/listByPage",
        columns: {
            param: {FunctionCode: 'ENG_RX_ARG_VIRLLP'},
            alter: {
                modifyDate: {
                    type: 'date'
                },
            }
        },
        contextMenus: [
            {
                id: "m-edit",
                i18nText: "编辑",
                onclick: function () {
                    var rowData = getDG('dg7').datagrid('getSelected');

                    if (!rowData.pkid) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    editVirllpData('edit',rowData);

                }
            },
            {
                id: "m-delete",
                i18nText: "删除",
                onclick: function () {
                    var rowData = getDG('dg7').datagrid('getSelected');
                    if (!rowData.pkid) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (!confirm("确认删除该记录？")) {
                        return;
                    }

                    InitGatewayRequest_({
                        type: "get",
                        async: false,
                        path: "/meng-engine/rxArgVirllp/deleteByPrimaryKey/"+rowData.pkid,
                        successCallBack: function (jdata) {
                            if (jdata.success == true) {
                                MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                reload_('dg7');
                            } else {
                                MsgAlert({content: '操作失败', type: 'error'});
                            }
                        }});
                }
            },
            {
                id: "m-edit",
                i18nText: "查看",
                onclick: function () {
                    var rowData = getDG('dg7').datagrid('getSelected');
                    editVirllpData("view", rowData);

                }
            }
        ],
        validAuth: function (row, items) {
            if(row.modifyUser != user.accountId) {
                items['编辑'].enable = false;
                items['删除'].enable = false;
            }
            return items;
        },
        onClickRow: function (rowIndex, rowData) {
        },
        onDblClickRow: function (index, field, value) {
            editVirllpData("view", value);
        },
        resize: function () {
            return tabs_standard_resize($('#tt'), 30)
        }
    });
}

function editVirllpData(operation, rowData) {
    var title_ = $.i18n.t('虚拟LLP维护');
    ShowWindowIframe({
        width: "690",
        height: "370",
        title: title_,
        param: {rowData: rowData, operation: operation},
        url: "/views/engine/rx/arg/eng_rx_arg_virllp_edit.shtml"
    });
}

function InitDataGrid8() {
    var queryParams = $("#ffSearch8").serializeObject();
    $("#dg8").GatewayDataGrid({
        identity: 'dg8',
        idField: "pkid",
        queryParams: queryParams,
        pagination: true,
        path: "/meng-engine/rxArgMonitor/listByPage",
        columns: {
            param: {FunctionCode: 'ENG_RX_ARG_MONITOR'},
            alter: {
                modifyDate: {
                    type: 'date'
                },
                arg1:{
                    formatter: function (value, row, index) {
                        if ("Y" == value) {
                            return "启用";
                        }else if("N" == value) {
                            return "禁用";
                        }
                        return value;
                    }
                }
            }
        },
        contextMenus: [
            {
                id: "m-edit",
                i18nText: "编辑",
                auth: "ENG_RX_ARG5",
                onclick: function () {
                    var rowData = getDG('dg8').datagrid('getSelected');

                    if (!rowData.pkid) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    editMonitorData('edit',rowData);

                }
            },
            {
                id: "m-delete",
                i18nText: "删除",
                auth: "ENG_RX_ARG6",
                onclick: function () {
                    var rowData = getDG('dg8').datagrid('getSelected');
                    if (!rowData.pkid) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (!confirm("确认删除该记录？")) {
                        return;
                    }

                    InitGatewayRequest_({
                        type: "get",
                        async: false,
                        path: "/meng-engine/rxArgMonitor/deleteByPrimaryKey/"+rowData.pkid,
                        successCallBack: function (jdata) {
                            if (jdata.success == true) {
                                MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                reload_('dg8');
                            } else {
                                MsgAlert({content: '操作失败', type: 'error'});
                            }
                        }});
                }
            },
            {
                id: "m-edit",
                i18nText: "查看",
                onclick: function () {
                    var rowData = getDG('dg8').datagrid('getSelected');
                    editMonitorData("view", rowData);

                }
            }
        ],
        validAuth: function (row, items) {
            if(row.modifyUser != user.accountId) {
                items['编辑'].enable = false;
                items['删除'].enable = false;
            }
            return items;
        },
        onClickRow: function (rowIndex, rowData) {
        },
        onDblClickRow: function (index, field, value) {
            editMonitorData("view", value);
        },
        resize: function () {
            return tabs_standard_resize($('#tt'), 30)
        }
    });
}

function editMonitorData(operation, rowData) {
    var title_ = $.i18n.t('预警设置维护');
    ShowWindowIframe({
        width: "690",
        height: "370",
        title: title_,
        param: {rowData: rowData, operation: operation},
        url: "/views/engine/rx/arg/eng_rx_arg_monitor_edit.shtml"
    });
}

function InitDataGrid9() {
    var queryParams = $("#ffSearch9").serializeObject();
    $("#dg9").GatewayDataGrid({
        identity: 'dg9',
        idField: "pkid",
        queryParams: queryParams,
        pagination: true,
        path: "/meng-engine/rxArgTemplate/listByPage",
        columns: {
            param: {FunctionCode: 'ENG_RX_ARG_TEMPLATE'},
            alter: {
                createDate: {
                    type: 'date'
                },
                auditDate: {
                    type: 'date'
                },
                modifyDate: {
                    type: 'date'
                },
                status: {
                    formatter: function (value, row, index) {
                        return PAGE_DATA['auditStatus'] [value];
                    }
                }
            }
        },
        contextMenus: [
            {
                id: "m-edit",
                i18nText: "编辑",
                auth: "ENG_RX_ARG5",
                onclick: function () {
                    var rowData = getDG('dg9').datagrid('getSelected');

                    if (!rowData.pkid) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    editTemplateData('edit',rowData);

                }
            },
            {
                id: "m-delete",
                i18nText: "删除",
                auth: "ENG_RX_ARG6",
                onclick: function () {
                    var rowData = getDG('dg9').datagrid('getSelected');
                    if (!rowData.pkid) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (!confirm("确认删除该记录？")) {
                        return;
                    }

                    InitGatewayRequest_({
                        type: "get",
                        async: false,
                        path: "/meng-engine/rxArgTemplate/deleteByPrimaryKey/"+rowData.pkid,
                        successCallBack: function (jdata) {
                            if (jdata.success == true) {
                                MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                reload_('dg9');
                            } else {
                                MsgAlert({content: '操作失败', type: 'error'});
                            }
                        }});
                }
            },{
                id: "m-rev",
                i18nText: "改版",
                auth: "ENG_RX_ARG5",
                onclick: function () {
                    var row = $('#dg9').datagrid('getSelected');
                    if (!row.pkid) {
                        MsgAlert({content: '请选择记录！', type: 'error'});
                        return;
                    }

                    if (!confirm("确认改版该记录？")) {
                        return;
                    }

                    InitGatewayRequest_({
                        async: false,
                        data: {"pkid": row.pkid},
                        path: "/meng-engine/rxArgTemplate/revTemplate",
                        successCallBack: function (jdata) {
                            if (jdata.success == true) {
                                MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                reload_('dg9');
                            } else {
                                MsgAlert({content: jdata.errorMessage, type: 'error'});
                            }
                        }
                    });
                }
            },
            {
                id: "m-revise",
                i18nText: "提交",
                auth: "ENG_RX_ARG5",
                onclick: function () {
                    var rowData = getDG('dg9').datagrid('getSelected');
                    if (!rowData.pkid) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    submitArgTemplate(rowData.pkid);
                }
            }, {
                id: "m-flowTjt", i18nText: "办理轨迹", auth: "",
                onclick: function () {
                    var rowData = getDG('dg9').datagrid('getSelected');
                    if (!rowData.pkid) {
                        MsgAlert({content: "请选择数据！", type: 'error'});

                    }
                    ShowWindowIframe({
                        width: 1100,
                        height: 400,
                        title: $.i18n.t('审批轨迹'),
                        param: {objNo: rowData.pkid, objKey: "ENG_RX_ARG_TEMPLATE"},
                        url: '/views/flow/work_flow_history_task_list.shtml'
                    });
                }
            },
            {
                id: "m-edit",
                i18nText: "查看",
                onclick: function () {
                    var rowData = getDG('dg9').datagrid('getSelected');
                    editTemplateData("view", rowData);

                }
            }
        ],
        validAuth: function (row, items) {

            if (row.status != 1) {
                items['提交'].enable = false;
                items['删除'].enable = false;
            }

            if (row.status != 1 && row.status != 5) {
                items['编辑'].enable = false;
            }
            if (row.status == 1) {
                items['办理轨迹'].enable = false;

            }
            if (row.status != 3) {
                items['改版'].enable = false;
            }

            if(row.modifyUser != user.accountId) {
                items['编辑'].enable = false;
                items['提交'].enable = false;
                items['删除'].enable = false;
                items['改版'].enable = false;
            }
            return items;
        },
        onClickRow: function (rowIndex, rowData) {
        },
        onDblClickRow: function (index, field, value) {
            editTemplateData("view", value);
        },
        resize: function () {
            return tabs_standard_resize($('#tt'), 30)
        }
    });
}

function editTemplateData(operation, rowData) {
    var title_ = $.i18n.t('送修要求模板');
    ShowWindowIframe({
        width: "690",
        height: "370",
        title: title_,
        param: {rowData: rowData, operation: operation},
        url: "/views/engine/rx/arg/eng_rx_arg_template_edit.shtml"
    });
}

function submitArgTemplate(pkid){
    common_add_edit_({
        identity: '',
        isEdit: '',
        width: 520,
        height: 300,
        title: $.i18n.t('选择审批人'),
        param: {
            operation: "flow",
            roleId: '',
            otherParam: '',
            PKID: pkid,
            FunctionCode_: 'ENG_RX_ARG_TEMPLATE_SUBMIT',
            successCallback: reload_
        },
        url: "/views/flow/work_flow_account_select.shtml"
    });
}