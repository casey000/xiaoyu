var PAGE_DATA = {};
var param;
var user;
var eflag = '';
var ifQua = '';
var jcType = '';
var name = getLoginInfo().userName;
var accountId = getLoginInfo().accountId;
var fleet = "CM";

function i18nCallBack() {
    param = getParentParam_();
    user = getLoginInfo();


    //绑定回车查询事件
    bindFormonSearch_('#ffSearch', function () {
        searchData()
    });

    InitFuncCodeRequest_({
        data: {
            domainCode: "TD_JC_STATE,TD_CMJC_STATUS,TD_JC_CMJC_WRITER,TD_ATA",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                PAGE_DATA['jcStatus'] = DomainCodeToMap_(jdata.data["TD_JC_STATE"]);//工卡状态、使用、不适用
                PAGE_DATA['status'] = DomainCodeToMap_(jdata.data["TD_CMJC_STATUS"]);//状态


                //工卡状态、使用、不适用
                $('#jcStatus').combobox({
                    panelHeight: '140px',
                    data: jdata.data.TD_JC_STATE,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                });

                //状态
                $('#status').combobox({
                    panelHeight: '120px',
                    data: jdata.data.TD_CMJC_STATUS,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    value: 'EDIT'
                });

                //章节号
                $('#ata').combobox({
                    panelHeight: '120px',
                    data: jdata.data.TD_ATA,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                });

                $('#quaManName').textbox("setValue", name);
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
        queryParams: {quaManName: quaManName, status: 'EDIT'},
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
                    type: 'date'
                },
                REVIEWED_DATE: {
                    type: 'date'
                },
                APPROVED_DATE: {
                    type: 'date'
                },
                PUBLIC_DATE: {
                    type: 'date'
                }
            }
        },
        onLoadSuccess: function () {

        },
        contextMenus: [
            {
                id: "m-edit",
                i18nText: "编辑",
                auth: "TD_CMJC_LIST_EDIT",
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
                        openDetai('edit', rowData.PKID);
                    }
                }
            },
            {
                id: "m-copy",
                i18nText: "工卡转发",
                auth: "TD_CMJC_RETRANS",
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
                id: "",
                i18nText: "提交",
                auth: "TD_CMJC_SUBMIT",
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
                        hints(msgArr)
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
                id: "m-turn",
                i18nText: "联合评估驳回",
                auth: "",
                onclick: function () {
                    var row = $('#dg').datagrid('getSelected');
                    var jcPkid = row.PKID;
                    if (row.QUA_MAN_ID != accountId) {
                        MsgAlert({content: "您不是此条记录的当前操作人，不允许操作！", type: 'error'});
                        return;
                    }
                    var quacou = 0;
                    InitFuncCodeRequest_({
                        data: {jcPkid: jcPkid, FunctionCode: 'TD_JC_QUA_COU'},
                        async: false,
                        successCallBack: function (jdata) {
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                if (jdata.data != null) {
                                    quacou = jdata.data.COU;
                                }
                            } else {
                                MsgAlert({content: jdata.msg ? jdata.msg : jdata.data, type: 'error'});
                            }
                        }
                    });
                    if (quacou == 0) {
                        MsgAlert({content: "没有联合评估记录，不能驳回！", type: 'error'});
                        return;
                    }
                    //初始转发只能对状态为评估中且未有转发或转发已经转回的记录进行此操作
                    if (row.STATUS != 'EDIT' && row.STATUS != 'EDITED') {
                        MsgAlert({content: '状态不是编写中/修订完成，不允许驳回！', type: 'error'});
                        return;
                    }
                    turnTdJc(row);
                }
            },
            {
                id: "",
                i18nText: "删除",
                auth: "TD_CMJC_DELETE",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (rowData.QUA_MAN_ID != accountId) {
                        MsgAlert({content: "您不是此条记录的当前操作人，不允许操作！", type: 'error'});
                        return;
                    }
                    if (confirm("是否确认删除？")) {
                        InitFuncCodeRequest_({
                            data: {FunctionCode: 'TD_JC_ALL_DELETE_CMJC', pkid: rowData.PKID},
                            successCallBack: function (jdata) {
                                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                    MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                    reload_();
                                }
                            }
                        });
                    }
                }
            },
            {
                id: "",
                i18nText: "改版",
                auth: " TD_CMJC_AMEND",
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
                    if (msgArr.length > 0) {
                        hints(msgArr);
                    } else {
                        //对已发布的数据进行改版，并且新增一条编写中的数据
                        var jcNo = rowData.JC_NO.substring(0, rowData.JC_NO.lastIndexOf("-") + 1) + (rowData.VER + 1);
                        InitFuncCodeRequest_({
                            data: {jcNo: jcNo, ver: rowData.VER + 1, FunctionCode: "TD_JC_ALL_CMJC_BEFOR_AMEND"},
                            successCallBack: function (jdata) {
                                if (jdata.data.length == 0) {
                                    if (confirm("是否确认改版？")) {
                                        InitFuncCodeRequest_({
                                            data: {pkid: rowData.PKID, FunctionCode: "TD_JC_ALL_CMJC_AMEND"},
                                            successCallBack: function (jdata) {
                                                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                                    reload_();
                                                    MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                                    CloseWindowIframe();
                                                }
                                            }
                                        });
                                    }
                                } else {
                                    MsgAlert({content: "该数据已改版过了。", type: 'error'});
                                }
                            }
                        });
                    }
                }
            },
            {
                id: "m-pdfPreview",
                i18nText: "PDF预览",
                auth: "TD_CMJC_PDF_PREVIEW",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
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
            },
            {
                id: "m-wfchart",
                i18nText: "流程图",
                // auth: "",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }

                    var userInfo = getLoginInfo();

                    if (rowData.STATUS == "PROOF" || rowData.STATUS == "RATIFY" || rowData.STATUS == "AUDIT") {
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
                    } else if (rowData.STATUS == "ARCHIVED" || rowData.STATUS == "ISSUED" || rowData.STATUS == "ISSUE" || rowData.STATUS == "PRINT" || rowData.STATUS == "PRINT") {
                        //获取整个流程最新的流程图有多个流程实例，使用最新的流程
                        InitFuncCodeRequest_({
                            data: {
                                FunctionCode: 'TD_CMJC_GET_PROC_DEF_ID',
                                flow_key: "tdJcCmjcFlow",//流程定义Key/流程Key
                            },
                            successCallBack: function (jdata) {
                                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                    ShowWindowIframe({
                                        width: "850",
                                        height: "650",
                                        title: "查看流程图",
                                        param: {PROC_DEF_ID: jdata.data.PROC_DEF_ID},
                                        url: "/views/ws/work_flow/flow_definition/flow_definition_diagram_view.shtml"
                                    });
                                }
                            }
                        });
                    }

                }
            },
            {
                id: "",
                i18nText: "办理轨迹",
                // auth: "",
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
        validAuth: function (row, items) {

            var user = getLoginInfo();
            // if (row.WRITER == user.accountId || user.accountId == '1') {
            if (row.STATUS != "EDIT") {
                items['提交'].enable = false;
            }
            if (row.STATUS != 'EDIT') {
                items['编辑'].enable = false;
                items['删除'].enable = false;
            }

            items['工卡转发'].enable = false;
            if (row.STATUS == "EDIT") {
                items['工卡转发'].enable = true;
            }

            items['改版'].enable = false;
            if (row.STATUS == 'ISSUED') {
                items['改版'].enable = true;
            }

            // items['工卡转发'].enable = false;
            // if (row.STATUS == "EDIT" || row.STATUS == "EDITED") {
            //     items['工卡转发'].enable = true;
            // }

            items['流程图'].enable = false;
            if (row.STATUS == "RATIFY" || row.STATUS == "AUDIT" || row.STATUS == "ISSUED" || row.STATUS == "ISSUE" || row.STATUS == "PRINT" || row.STATUS == "ARCHIVED") {
                items['流程图'].enable = true;
            }

            return items;
        },
        toolbar: [
            {
                key: "COMMON_ADD",
                text: $.i18n.t('common:COMMON_OPERATION.ADD'),
                // auth: "TD_JC_CMJC_ADD",
                handler: function () {
                    openDetai("add", "");//打开新增页面
                }
            },
            {
                key: "COMMON_RELOAD",
                text: $.i18n.t('common:COMMON_OPERATION.RELOAD'),
                handler: function () {
                    reload_();
                }
            },
            {
                id: 'btnExport',
                text: $.i18n.t('导出excel'),
                iconCls: 'icon-page_excel',
                handler: function () {
                    excelExport('dg', '部件修理工卡清单', '');
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
        height: "690",
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
    searchData();
}

function jcPreview(url) {
    var title_ = $.i18n.t('部件修理工卡预览');
    ShowWindowIframe({
        width: "850",
        height: "650",
        title: title_,
        param: {url: url},
        url: "/views/td/jobcard/cmjc/jobcardPreview.shtml"
    });
}


function checkQua(rowData) {
    InitFuncCodeRequest_({
        data: {pkid: rowData.PKID, taskType: "CMJC", FunctionCode: 'TD_JC_CHECK_QUA'},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                eflag = jdata.data.eflag;
                ifQua = jdata.data.ifQua;
                var tips = '';
                if (eflag == "NO") {
                    tips = "当前用户没有该工卡的资质，请提交给有资质的用户！";
                }
                if (eflag == "ALL") {
                    datas = $.extend({}, {}, {FunctionCode: 'TD_CMJC_IF_SUBMIT', pkid: rowData.PKID});
                    InitFuncCodeRequest_({
                        data: datas, successCallBack: function (jdata) {
                            if (jdata.data == null) {
                                common_add_edit_({
                                    identity: '', isEdit: '', width: 520, height: 300, title: $.i18n.t('选择审批人'),
                                    param: {
                                        roleId: '',
                                        otherParam: rowData.PKID,
                                        FunctionCode_: 'TD_JC_ALL_CMJC_SUBMIT',
                                        successCallback: reload_,
                                        flowKey: "tdJcCmjcFlow"
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
                                    ata: rowData.ATA,
                                    fleet: fleet,
                                    cflag: "commit",
                                    fluflag: "list",
                                    taskType: "CMJC",
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
            ata: rowData.ATA,
            fleet: fleet,
            ifQua: "N",
            taskType: "CMJC",
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
            taskType: "CMJC",
            ata: rowData.ATA,
            fleet: fleet,
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
                            data: {pkid: pkid, procInstId: procInstId, FunctionCode: 'TD_CMJC_TURN_ACT'},
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