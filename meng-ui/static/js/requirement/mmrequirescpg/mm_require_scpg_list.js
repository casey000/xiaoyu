var PAGE_DATA = {};
var processMark = {};
var identity = 'dg';

function i18nCallBack() {
    param = getParentParam_();
    InitDataGrid();
    InitFuncCodeRequest_({
        data: {domainCode: 'USER_NAME,PM_SITE_CODE,MM_PROCESS_MARK', FunctionCode: "ANALYSIS_DOMAIN_BYCODE"},
        successCallBack: function (jdata) {
            console.log(jdata.data);
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                processMark = DomainCodeToMap_(jdata.data["MM_PROCESS_MARK"]);
                PAGE_DATA['maintenanceStationName'] = DomainCodeToMap_(jdata.data["PM_SITE_CODE"]);
                PAGE_DATA['userName'] = DomainCodeToMap_(jdata.data["USER_NAME"]);
                $('#processMark').combobox({
                    panelHeight: '150',
                    data: jdata.data.MM_PROCESS_MARK,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                $('#sourceType').combobox({
                    panelHeight: '150',
                    data:
                        [{TEXT: "缺件申请", VALUE: "QJ"}, {TEXT: "生产维修需求", VALUE: "SC"}],
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });

    //绑定回车事件：输入件号后回车即可查询
    $('#partNo').textbox({
        inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
            keyup: function (event) {
                if (event.keyCode == 13) {
                    onSearch_();
                }
            }
        })
    });

    //绑定回车事件：输入飞机号后回车即可查询
    $('#acno').textbox({
        inputEvents: $.extend({}, $.fn.textbox.defaults.inputEvents, {
            keyup: function (event) {
                if (event.keyCode == 13) {
                    onSearch_();
                }
            }
        })
    });

}


//初始化列表
function InitDataGrid() {
    $("#dg").MyDataGrid({
        identity: identity,
        sortable: true,
        singleSelect: false,
        checkOnSelect: false,
        loadFilter: function (jdata) {
            jdata.rows = toUnderlineCaseArray(jdata.rows);
            return jdata;
        },
        queryParams: {
            xuqiu: "'SC'" //查询需求类型是生产维修需求
        },
        columns: {
            param: {FunctionCode: 'MM_REQUIRE_SCPG_LIST'},
            alter: {
                PROCESS_MARK: {
                    formatter: function (value, row, index) {
                        return processMark[value];
                    }
                },

                MAINTENANCE_STATION_NAME: {
                    formatter: function (value, row, index) {
                        return PAGE_DATA['maintenanceStationName'][value];
                    }
                },
                APPLY_MAN: {
                    formatter: function (value, row, index) {
                        return PAGE_DATA['userName'][value];
                    }
                }
            }
        },
        contextMenus: [
            {
                id: "", i18nText: "评估确认", auth: "MM_REQ_SC_CONF",//评估确认
                onclick: function () {
                    var rows = $('#dg').datagrid('getSelections');
                    if (rows.length > 1) {
                        MsgAlert({content: '只能选择一行数据进行评估确认', type: 'error'});
                    } else {
                        common_add_edit_({
                            identity: identity,
                            isEdit: 1,
                            width: 1230,
                            height: 500,
                            title: $.i18n.t('page:MM_REQUIRE_SCPG_LIST.EVALUATE_CONFIRM'),
                            url: "/views/mm/requirement/mmrequirescpg/mm_require_scpg_add_edit.shtml"
                        });
                    }
                }
            }
        ],
        validAuth: function (row, items) {
            if (row.ORDER_NO == null && row.PLAN_NO == null) {
                items["评估确认"].enable = true;
            } else {
                items["评估确认"].enable = false;
            }
            return items;
        }
    });
}

/** 刷新列表数据 */
function reload_() {
    $("#dg").datagrid("reload");
}

//一条或者多条评估确认
function evaluatConfirm_() {
    var rowData = getDG(identity).datagrid('getChecked');
    console.log(rowData);
    if (rowData.length == 0) {
        layer.msg($.i18n.t('msg_err:ERRMSG.COMMON.NO_SELECT_ROW_ERROR'), {icon: 5});
        return false;
    }
    if (rowData.length > 1) {
        for (var i = 0; i < rowData.length; i++) {
            if (!(rowData[i].ORDER_NO == null && rowData[i].PLAN_NO == null)) {
                MsgAlert({content: "存在已加入计划或合同的需求，不能再次评估确认", type: 'error'});
                return false;
            }
        }
    } else {
        if (!(rowData[0].ORDER_NO == null && rowData[0].PLAN_NO == null)) {
            MsgAlert({content: "存在已加入计划或合同的需求，不能再次评估确认", type: 'error'});
            return false;
        }
    }
    if (!rowData) {
        layer.msg($.i18n.t('msg_err:ERRMSG.COMMON.NO_SELECT_ROW_ERROR'), {icon: 5});
    } else {
        var requires = $("#dg").datagrid("getChecked");
        requires = JSON.stringify(toCamelCaseArray(requires));
        InitFuncCodeRequest_({
            data: {requires: requires, FunctionCode: "MM_REQUIRE_SCPG_MEVALUE"},
            successCallBack: function (jdata) {
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    reload_();
                    MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                } else {
                    MsgAlert({content: jdata.msg, type: 'error'});
                }
            }
        });
    }
}

function lock() {
    var rowData = getDG(identity).datagrid('getChecked');
    if (rowData.length == 0) {
        layer.msg($.i18n.t('msg_err:ERRMSG.COMMON.NO_SELECT_ROW_ERROR'), {icon: 5});
        return false;
    }
    console.log(rowData)
    if (rowData.length > 1) {
        layer.msg($.i18n.t('请单条进行锁定'), {icon: 5});
        return false;
    }
    ShowWindowIframe({
        identity: identity,
        isEdit: 1,
        width: 700,
        height: 250,
        title: $.i18n.t('锁定'),
        param: {data: {rowData}},
        url: "/views/mm/requirement/mmrequirescpg/mm_require_scpg_lock.shtml"
    });


}

