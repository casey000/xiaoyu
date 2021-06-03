var PAGE_DATA = {};
var COMBOBOX_DATA = {};
var user;
var eflag = '';
var ifQua = '';
var jcType = '';
var name = getLoginInfo().userName;
var accountId = getLoginInfo().accountId;
var ata = "N/A";
var searchFlag = true;

function i18nCallBack() {
    user = getLoginInfo();
    //绑定回车查询事件
    bindFormonSearch_('#ffSearch', function () {
        searchData()
    });

    InitFuncCodeRequest_({
        data: {
            domainCode: "DA_FLEET,TD_LMJC_TYPE,YESORNO,TD_MJC_STATUS,TD_JC_SMJC_WRITER",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            //有效性1
            $('#fleet').combobox({
                panelHeight: '100px',
                data: jdata.data.DA_FLEET,
                valueField: 'VALUE',
                textField: 'TEXT'
            });
            $('#lmjcType').combobox({
                panelHeight: '100px',
                data: jdata.data.TD_LMJC_TYPE,
                valueField: 'VALUE',
                textField: 'TEXT'
            });
            $('#status').combobox({
                panelHeight: '180px',
                data: jdata.data.TD_MJC_STATUS,
                valueField: 'VALUE',
                textField: 'TEXT',
                value: 'EDIT'
            });
            $("#status").combobox('setValue', 'EDIT');
            $('#quaManName').textbox("setValue", name);
            // 因为后台获取到的是 对象 我们需要显示对象的text（因为对象中有value，还有text）
            PAGE_DATA['lmjcType'] = DomainCodeToMap_(jdata.data["TD_LMJC_TYPE"]);
            PAGE_DATA['status'] = DomainCodeToMap_(jdata.data["TD_MJC_STATUS"]);
            //工序是否检出
            PAGE_DATA['cepCheckout'] = DomainCodeToMap_(jdata.data["YESORNO"]);

            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                InitDataGrid();
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

function InitDataGrid() {
    var quaManName = $("#quaManName").textbox("getValue");
    $("#dg").MyDataGrid({
        identity: 'dg',
        sortable: true,
        singleSelect: true,
        pageSize: 15,
        columns: {
            param: {FunctionCode: 'TD_JC_ALL_LMJC_LIST'},
            alter: {
                LMJC_TYPE: {
                    formatter: function (value) {
                        return PAGE_DATA['lmjcType'][value];
                    }
                },
                STATUS: {
                    formatter: function (value) {
                        return PAGE_DATA['status'][value];
                    }
                },
                CEP_CHECKOUT: {
                    formatter: function (value) {
                        return PAGE_DATA['cepCheckout'][value];
                    }
                },
                CREATE_DATE: {
                    type: 'date'
                },
                MODIFY_DATE: {
                    type: 'date'
                },
                WRITE_LIMIT: {
                    type: 'date'
                },
                WRITE_DATE: {
                    type: 'date'
                },
                REVIEWED_DATE: {
                    type: 'date'
                },
                APPROVED_DATE: {
                    type: 'date'
                },
                WRITE_QUA_DATE: {
                    type: 'date'
                }

            }
        },
        onLoadSuccess: function () {
            if (searchFlag) {
                onSearchFor('dg');
                searchFlag = false;
            }
        },
        validAuth: function (row, items) {
            if (row.STATUS != "EDIT" || getLoginInfo().accountId != row.WRITER) {
                items["编辑"].enable = false;
            }
            items['工卡转发'].enable = false;
            if (row.STATUS == "EDIT" || row.STATUS == "EDITED") {
                items['工卡转发'].enable = true;
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
            if (row.STATUS == "ISSUE" || row.STATUS == "ISSUED") {
                items["流程图"].enable = false;
            }
            if (row.STATUS == "ISSUED" || row.STATUS == "ARCHIVED") {
                items["启用设置"].enable = false;
            }
            return items;
        },
        contextMenus: [
            {
                id: "m-edit", i18nText: "编辑",
                auth: "TD_LMJC_LIST_EDIT",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    var msgArr = [];
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (rowData.QUA_MAN_ID != accountId) {
                        // MsgAlert({content: "您不是此条记录的当前操作人，不允许操作！", type: 'error'});
                        // return;
                        msgArr.push("您不是此条记录的当前操作人，不允许操作！");
                    }
                    if (msgArr.length > 0) {
                        hints(msgArr);
                    } else {
                        openDetai('edit', rowData.PKID, rowData.FLEET, rowData.JC_TYPE);
                    }
                }
            },
            {
                id: "m-copy",
                i18nText: "工卡转发",
                auth: "TD_LMJC_RETRANS",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    var msgArr = [];
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (rowData.QUA_MAN_ID != accountId) {
                        // MsgAlert({content: "您不是此条记录的当前操作人，不允许操作！", type: 'error'});
                        // return;
                        msgArr.push("您不是此条记录的当前操作人，不允许操作！");
                    }
                    if (msgArr.length > 0) {
                        hints(msgArr);
                    } else {
                        transTdJc(rowData);
                    }
                }
            },
            {
                id: "m-submit", i18nText: "提交",
                auth: "TD_LMJC_SUBMIT",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    var msgArr = [];
                    if (rowData.QUA_MAN_ID != accountId) {
                        // MsgAlert({content: "您不是此条记录的当前操作人，不允许操作！", type: 'error'});
                        // return;
                        msgArr.push("您不是此条记录的当前操作人，不允许操作");
                    }
                    if (rowData.CEP_FILE_PATH == null || rowData.CEP_FILE_PATH == "") {
                        // MsgAlert({content: "当前没有工序文件，不能进行提交。", type: 'error'});
                        // return;
                        msgArr.push("当前没有工序文件，不能进行提交");
                    }
                    if (rowData.CEP_CHECKOUT != "" && rowData.CEP_CHECKOUT == "Y") {
                        // MsgAlert({content: "当前文件已被检出，不能进行提交。", type: 'error'});
                        // return;
                        msgArr.push("当前文件已被检出，不能进行提交");
                    }
                    if (msgArr.length > 0) {
                        hints(msgArr);
                    } else {
                        checkQua(rowData);
                    }
                }
            },
            {
                i18nText: "流程退回", auth: "",
                onclick: function () {
                    var row = $('#dg').datagrid('getSelected');
                    var evapkid = row.PKID;
                    var msgArr = [];
                    if (row.WRITER != accountId && row.QUA_WRITER_ID != accountId) { //待修改
                        // MsgAlert({content: "您不是此条记录的OWNER或者处理人，不允许驳回！", type: 'error'});
                        // return;
                        msgArr.push("您不是此条记录的OWNER或者处理人，不允许驳回！");
                    }
                    //初始转发只能对状态为审核中,批准中且未有转发或转发已经转回的记录进行此操作
                    if ('EDIT' == row.STATUS || 'ISSUE' == row.STATUS || 'ISSUED' == row.STATUS || 'ARCHIVED' == row.STATUS) {
                        // MsgAlert({content: '只有流程中状态的数据才能退回！', type: 'error'});
                        // return;
                        msgArr.push("只有流程中状态的数据才能退回！");
                    }
                    if (msgArr.length > 0) {
                        hints(msgArr);
                    } else {
                        turnEvalAct(row);
                    }
                }
            },
            {
                id: "m-delete", i18nText: "删除",
                auth: "TD_LMJC_DELETE",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    var msgArr = [];
                    if (rowData.STATUS != 'EDIT') {
                        // MsgAlert({content: '该状态下不可删除!'});
                        // return;
                        msgArr.push("该状态下不可删除!");
                    }
                    if (rowData.QUA_MAN_ID != accountId) {
                        // MsgAlert({content: "您不是此条记录的当前操作人，不允许操作！", type: 'error'});
                        // return;
                        msgArr.push("您不是此条记录的当前操作人，不允许操作！");
                    }
                    if (msgArr.length > 0) {
                        hints(msgArr);
                    } else {
                        if (!confirm("该操作将会删除所有有关记录,确认删除？")) {
                            return;
                        }
                        InitFuncCodeRequest_({
                            data: {pkid: rowData.PKID, FunctionCode: 'TD_JC_LMJC_DELETE'},
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
                }
            },
            {
                id: "m-reversion", i18nText: "改版",
                auth: "TD_LMJC_AMEND",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    var msgArr = [];
                    if (rowData.QUA_MAN_ID != accountId) {
                        // MsgAlert({content: "您不是此条记录的当前操作人，不允许操作！", type: 'error'});
                        // return;
                        msgArr.push("您不是此条记录的当前操作人，不允许操作！");
                    }
                    if (rowData.STATUS != 'ISSUED') {
                        // MsgAlert({content: '该状态下不可改版!'});
                        // return;
                        msgArr.push("该状态下不可改版!");
                    }
                    if (msgArr.length > 0) {
                        hints(msgArr);
                    } else {
                        if (!confirm("确认改版?")) {
                            return;
                        }
                        var ver = rowData.VER + 1;
                        InitFuncCodeRequest_({
                            data: {jcNo: rowData.JC_NO, ver: ver, FunctionCode: "TD_JC_LMJC_REVISION_CHECK"},
                            successCallBack: function (jdata) {
                                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                    if (jdata.data.NUB == 0) {
                                        InitFuncCodeRequest_({
                                            data: {pkid: rowData.PKID, FunctionCode: "TD_JC_LMJC_REVISION"},
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
                                    else {
                                        MsgAlert({content: '该工卡已经改版!', type: 'error'});
                                    }
                                }
                                else {
                                    MsgAlert({content: jdata.msg, type: 'error'});
                                }
                            }
                        });
                    }
                }
            },
            {
                id: "m-enabledSettings", i18nText: "启用设置",
                auth: "TD_LMJC_START_CONFIG",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    ShowWindowIframe({
                        width: "450",
                        height: "350",
                        title: "启用设置",
                        param: {pkid: rowData.PKID},
                        url: "/views/td/jobcard/lmjc/tdLmjcEnabledSetting.shtml"
                    });
                }
            },
            {
                id: "m-pdf", i18nText: "PDF预览",
                auth: "TD_LMJC_PDF_PREVIEW",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    ajaxLoading();
                    InitFuncCodeRequest_({
                        data: {pkid: rowData.PKID, FunctionCode: "TD_JC_PREVIEW"},
                        successCallBack: function (jdata) {
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
            },
            {
                id: "m-singelPreviewpdf",
                i18nText: "单机预览",
                auth: "TD_LMJC_SINGLE_PDF_PREVIEW",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    var msgArr = [];
                    if (rowData.MOP_NO != null && rowData.MOP_NO != "" && rowData.MOP_NO != undefined) {
                        // MsgAlert({content: "ME系统PDF路径有值，不能做单机预览！", type: 'error'});
                        // return;
                        msgArr.push("ME系统PDF路径有值，不能做单机预览");
                    }
                    if (rowData.CEP_FILE_PATH == null || rowData.CEP_FILE_PATH == "") {
                        // MsgAlert({content: "当前未查询到工序文件，无法预览。", type: 'error'});
                        // return;
                        msgArr.push("当前未查询到工序文件，无法预览");
                    }
                    if (msgArr.length > 0) {
                        hints(msgArr);
                    } else {
                        ShowWindowIframe({
                            width: "460",
                            height: "500",
                            param: {
                                jcId: rowData.PKID,
                                fleet: rowData.FLEET,
                                action: "EMSINGLEPREVIEW"
                            },
                            url: "/views/td/jobcard/tdAcnoChoose.shtml"
                        });
                    }
                }
            },
            {
                id: "m-flow", i18nText: "流程图",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});

                    }
                    var userInfo = getLoginInfo();
                    if (rowData.STATUS == "RATIFY" || rowData.STATUS == "AUDIT" || rowData.STATUS == "TURNBACK") {
                        //获取当前在流程中的流程图，需要使用 pkid进行关联
                        InitFuncCodeRequest_({
                            data: {
                                FunctionCode: 'TD_JC_ALL_PROCESS',
                                objNo: rowData.PKID,
                                objKey: "TD_JC_ALL"
                            },
                            successCallBack: function (jdata) {
                                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                    ShowWindowIframe({
                                        width: "850",
                                        height: "650",
                                        title: "查看流程图",
                                        param: {
                                            PROC_DEF_ID: jdata.data.PROC_DEF_ID,
                                            PROC_INST_ID: jdata.data.PROC_INST_ID,
                                            BUSINESS_KEY: jdata.data.BUSINESS_KEY
                                        },
                                        url: "/views/ws/work_flow/flow_definition/flow_diagram_view.shtml"
                                    });
                                }
                            }
                        });
                    }
                }
            },
            {
                id: "m-track", i18nText: "办理轨迹",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    tranHis(rowData.PKID);
                }
            },
            {
                id: "m-previewArbortext",
                i18nText: "Arbortext预览",
                auth: "",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (rowData.CEP_FILE_PATH == undefined || rowData.CEP_FILE_PATH == null || rowData.CEP_FILE_PATH == '') {
                        MsgAlert({content: "当前未查询到工序文件，无法预览!", type: 'error'});
                        return;
                    }
                    var userInfo = getLoginInfo();
                    var cepPath = "";
                    //获取最新的工序文件
                    InitFuncCodeRequest_({
                        data: {jcPkid: rowData.PKID, FunctionCode: 'TD_JC_GET_LATEST_CEP_BY_JCID'},
                        async: false,
                        successCallBack: function (jdata) {
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                if (jdata.data != null) {
                                    cepPath = jdata.data.CEP_PATH;
                                } else {
                                    MsgAlert({content: "当前未查询到工序文件，无法预览!", type: 'error'});
                                }
                            } else {
                                MsgAlert({content: jdata.msg ? jdata.msg : jdata.data, type: 'error'});
                            }
                        }
                    });
                    var i = cepPath.lastIndexOf("/");
                    var fileName = cepPath.slice(i + 1).replace(".xml", "");
                    var protocol = window.location.protocol;
                    var newProtocol = protocol.substring(0, protocol.length - 1);
                    var ip = window.location.hostname;
                    var pathName = window.location.pathname;
                    var port = window.location.port;
                    var controllerName = "jobcardcepcon/downcepfile";
                    var userName = "";
                    if (userInfo == null || userInfo == undefined || userInfo == '') {
                        userName = rowData.WRITER;
                    } else {
                        userName = userInfo.userName;
                    }
                    var openMode = "0";
                    var type = "JOBCARD";
                    var includeGnbr = "true";
                    var companyCode = "SFN";
                    var manual = "BULK";
                    var command = cepPath + ";" + fileName + ";"
                        + newProtocol + ";" + ip + ";" + port + ";" + controllerName + ";"
                        + userName + ";" + openMode + ";" + type + ";" + includeGnbr
                        + ";" + rowData.REFDATA_TYPE + ";" + rowData.REF_DATA + ";" + companyCode
                        + ";" + rowData.FLEET + ";" + rowData.PKID + ";" + manual;
                    console.log(command);
                    window.location.href = "openEditor:" + command;
                }
            }
        ],
        toolbar: [
            //     {
            //     id: 'btnAdd',
            //     text: $.i18n.t('批量提交'),
            //     iconCls: 'icon-ok',
            //     handler: function () {
            //         batchSubmit();
            //     }
            // }, '-',
            {
                id: 'btnAdd',
                text: $.i18n.t('新卡'),
                iconCls: 'icon-add',
                handler: function () {
                    editDetailData('add')
                }
            },
            {
                id: 'btnReload',
                text: $.i18n.t('刷新'),
                iconCls: 'icon-reload',
                handler: function () {
                    reload_();
                }
            },
            {
                id: 'btnExport',
                text: $.i18n.t('导出excel'),
                iconCls: 'icon-page_excel',
                handler: function () {
                    excelExport('dg', '航线工卡清单', '');
                }
            }
        ],
        onDblClickRow: function (index, field, value) {
            openDetai("view", value.PKID, value.FLEET, value.JC_TYPE);
        }
    });
}


//刷新
function reload_() {
    $("#dg").datagrid("reload");
}

//新增
function editDetailData(operation) {
    openDetai(operation, '', '', '');
}

//打开资料类型详细页面
function openDetai(operation, pkid, fleet, jcType) {
    var title_ = $.i18n.t('航线工卡编写');
    ShowWindowIframe({
        width: "1020",
        height: "260",
        title: title_,
        param: {operation: operation, pkid: pkid, fleet: fleet, jcType: jcType},
        url: " /views/td/jobcard/lmjc/tdLmjcEditDetail.shtml"
    });
}

//查询
function searchData() {
    onSearch_('dg', '#ffSearch');
}

//重置
function doClear_() {
    $("#ffSearch").form('clear');
}

//批量提交
function batchSubmit() {
    var rowData = getDG('dg').datagrid('getChecked');
    if (rowData.length == 0) {
        MsgAlert({content: "请选择数据！", type: 'error'});
        return;
    }
    var flag = true;
    $.each(rowData, function (index, obj) {
        if (obj.STATUS != "EDIT" && obj.STATUS != "EDITED") {
            MsgAlert({content: "批量提交只能提交 【编写中】、【修订完成】的数据。", type: 'error'});
            flag = false;

        }
    });
    if (flag == true) {
        if (confirm("是否批量提交？")) {
            var ids = "";
            $.each(rowData, function (index, obj) {
                if (index == rowData.length - 1) {
                    ids += obj.PKID;
                }
                else {
                    ids += obj.PKID + ",";
                }
            });

            common_add_edit_({
                identity: '', isEdit: '', width: 520, height: 300, title: $.i18n.t('选择审批人'),
                param: {
                    roleId: '',
                    otherParam: ids,
                    FunctionCode_: 'TD_JC_LMJC_SUBMIT',
                    successCallback: reload_
                },
                url: "/views/td/jobcard/cmjc/td_Cmjc_work_flow_account_select.shtml"
            });
        }
    }

}


function jcPreview(url) {
    var title_ = $.i18n.t('航线工卡预览');
    ShowWindowIframe({
        width: "850",
        height: "650",
        title: title_,
        param: {url: url},
        url: "/views/td/jobcard/smjc/smjcedit/jobcardPreview.shtml"
    });
}


function checkQua(rowData) {
    InitFuncCodeRequest_({
        data: {pkid: rowData.PKID, taskType: "LMJC", FunctionCode: 'TD_JC_CHECK_QUA'},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                eflag = jdata.data.eflag;
                ifQua = jdata.data.ifQua;
                var tips = '';
                if (eflag == "NO") {
                    tips = "当前用户没有该工卡的资质，请提交给有资质的用户！";
                }
                if (eflag == "ALL") {
                    var datas = $.extend({}, {}, {FunctionCode: 'TD_JC_ALL_LMJC_STATUS', pkid: rowData.PKID});
                    InitFuncCodeRequest_({
                        data: datas, successCallBack: function (jdata) {
                            if (jdata.data == null) {
                                common_add_edit_({
                                    identity: '', isEdit: '', width: 520, height: 300, title: $.i18n.t('选择审批人'),
                                    param: {
                                        roleId: '',
                                        otherParam: rowData.PKID,
                                        FunctionCode_: 'TD_JC_LMJC_SUBMIT',
                                        successCallback: reload_,
                                        flowKey: "TdLmjcService"
                                    },
                                    url: "/views/em/workflow/work_flow_account_select.shtml"
                                });
                            } else {
                                MsgAlert({content: "该数据已被提交过了。", type: 'error'});
                            }
                        }
                    });
                } else {
                    $.messager.confirm('', tips, function (r) {
                        if (r) {
                            ShowWindowIframe({
                                width: 550,
                                height: 250,
                                title: "联合评估",
                                param: {
                                    pkid: rowData.PKID,
                                    ata: ata,
                                    fleet: rowData.FLEET,
                                    cflag: "commit",
                                    fluflag: "list",
                                    taskType: "LMJC",
                                    accountId: accountId,
                                    ifQua: ifQua,
                                    eflag: eflag
                                },
                                url: '/views/td/jobcard/smjc/smjcedit/tdJcTrans.shtml'
                            });
                        }
                    });
                }
            } else {
                MsgAlert({content: $.i18n.t(jdata.msg), type: 'error'});
            }
        }
    });
}

function turnTdJc(rowData) {
    var evaManId = rowData.WRITER;
    var pkid = rowData.PKID;
    var cflag = "turn";
    ShowWindowIframe({
        width: 550,
        height: 250,
        title: "驳回",
        param: {
            accId: evaManId,
            pkid: pkid,
            cflag: cflag,
            fluflag: "list",
            ata: ata,
            fleet: rowData.FLEET,
            ifQua: "N",
            taskType: "LMJC",
            accountId: accountId
        },
        url: '/views/td/jobcard/smjc/smjcedit/tdJcTrans.shtml'
    });
}

function transTdJc(rowData) {
    var evaManId = rowData.WRITER;
    var pkid = rowData.PKID;
    var cflag = "zf";
    ShowWindowIframe({
        width: 550,
        height: 250,
        title: "转发",
        param: {
            accId: evaManId,
            pkid: pkid,
            cflag: cflag,
            fluflag: "list",
            taskType: "LMJC",
            ata: ata,
            fleet: rowData.FLEET,
            accountId: accountId
        },
        url: '/views/td/jobcard/smjc/smjcedit/tdJcTrans.shtml'
    });
}

function tranHis(pkid) {
    var title_ = $.i18n.t('办理轨迹列表');
    ShowWindowIframe({
        width: "790",
        height: "519",
        title: title_,
        param: {pkid: pkid},
        url: "/views/td/jobcard/smjc/smjcedit/tdJcTransList.shtml"
    });
}

function reload_all() {
    $("#dg").datagrid("reload");
}

function turnEvalAct(row) {
    var pkid = row.PKID;
    var objNo = pkid;
    var objKey = "TD_JC_ALL";
    var taskId = "";
    var procInstId = "";
    $.messager.confirm('提示?', "是否确认退回?", function (r) {
        if (r) {
            MaskUtil.mask("请求处理中...");
            InitFuncCodeRequest_({
                data: {
                    FunctionCode: 'WS_FLOW_EXECUTION_QUERY',
                    objNo: objNo,
                    objKey: objKey
                },
                async: false,
                successCallBack: function (jdata) {
                    if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                        taskId = jdata.data["TASK_ID"];
                        procInstId = jdata.data["PROC_INST_ID_"];
                        InitFuncCodeRequest_({
                            data: {pkid: pkid, procInstId: procInstId, FunctionCode: 'TD_LMJC_TURN_ACT'},
                            async: false,
                            successCallBack: function (jdata) {
                                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                    MaskUtil.unmask();
                                    reload_();
                                    MsgAlert({content: '操作成功!'});
                                } else {
                                    MaskUtil.unmask();
                                    MsgAlert({content: jdata.msg ? jdata.msg : jdata.data, type: 'error'});
                                }
                            }
                        });
                    }
                }
            });
        }
    });
}

function hints(mgs) {
    ShowWindowIframe({
        width: 320,
        height: 300,
        param: {mgs: mgs},
        title: "工卡提示",
        url: "/views/td/jobcard/commonjc/TdHints.shtml"
    });
}

//查询方法
function onSearchFor(identity, fromId, breforSearch) {
    fromId = fromId || "#ffSearch";
    var dgopt = getDgOpts(identity);
    var $dg = $(dgopt.owner);
    var url = dgopt.url;
    if ($dg && url) {
        var queryParams = $(fromId).serializeObject();
        queryParams = $.extend({}, dgopt.queryParams, dgopt._params, queryParams);
        if (typeof(breforSearch) == 'function') {
            breforSearch(queryParams);
        }
        clearAdvancedQueryData(queryParams);
        if (dgopt.treeField) {
            $dg.treegrid('load', queryParams);
        } else {
            $dg.datagrid('load', queryParams);
        }
    }
}