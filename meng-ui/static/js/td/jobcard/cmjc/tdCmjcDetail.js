var param;
var operation;
var PAGE_DATA = {};
var jc_pkid = null;//主表PKID
var pageCount;
var taskId;
var msgData;
var accountId;
var evaManId;

function i18nCallBack() {
    param = getParentParam_();
    pageCount = 1;
    operation = param.operation;
    taskId = param.taskId;
    msgData = param.msgData;
    accountId = param.accountId;

    if (msgData) {
        jc_pkid = param.recordId;
    } else {
        jc_pkid = param.pkid;
    }

    var quaCou = 0;
    InitFuncCodeRequest_({
        data: {pkid: jc_pkid, FunctionCode: "TD_JC_QUA_TURN"},
        async: false,
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                if (jdata.data != null) {
                    quaCou = jdata.data.COU;
                }
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
    if (quaCou == 0 || operation == 'view') {
        $("#turnBtn").hide();
    } else {
        $("#turnBtn").show();
    }

    if (operation == 'edit') {
        $("#ata").combobox({onlyview: true, editable: false});
    }

    if (taskId == 'task1530260246450') { //退回
        $("#submitBtn").hide();
        $("#closeBtn").hide();
    } else if (taskId == 'task1530258706259' || taskId == 'task1530258844362') { //审核与批准
        $("#submitBtn").hide();
        $("#closeBtn").hide();
    }

    InitFuncCodeRequest_({
        data: {
            domainCode: "TD_CMJC_PN_CHANGE,TD_ATA,TD_JC_STATE,TD_JC_MATER_SORT",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {

                //改装后件号是否变化
                PAGE_DATA['pnChange'] = DomainCodeToMap_(jdata.data["TD_CMJC_PN_CHANGE"]);
                //章节号
                PAGE_DATA['ata'] = DomainCodeToMap_(jdata.data["TD_ATA"]);
                //航材/工具
                PAGE_DATA['materSort'] = DomainCodeToMap_(jdata.data["TD_JC_MATER_SORT"]);


                //章节号
                $('#ata').combobox({
                    panelHeight: '135px',
                    data: jdata.data.TD_ATA,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    onChange: function () {
                        //获取选中的ATA
                        var ataValue = $('#ata').combobox('getValue');
                        if (ataValue == null || ataValue == "" || ataValue == undefined) {
                            return;
                        }
                        if (!jc_pkid) {
                            getSerialNo(ataValue);
                        }
                    }
                });

                //工卡状态
                $('#jcStatus').combobox({
                    panelHeight: '135px',
                    data: jdata.data.TD_JC_STATE,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });

                $('#jcNoB').textbox({
                    onChange: function (value) {
                        $('#jcNoB').textbox('setValue', $('#jcNoB').textbox('getValue').toUpperCase());
                    }
                });

                if (operation == 'view') {
                    $("#saveBtn").hide();
                    $("#editBtn").hide();
                    $("#submitBtn").hide();
                    $("#selectDataRecBtn").hide();
                    $("#addDataRecBtn").hide();
                }
                if (jc_pkid) {
                    InitDataForm(jc_pkid);
                    InitDataGrid(jc_pkid);
                    InitDataGrid1(jc_pkid);
                    InitDataGrid2(jc_pkid);
                } else {
                    InitDataGrid();
                    InitDataGrid1();
                    InitDataGrid2();
                }
                $("#planHours").textbox({
                    onChange: function (value) {
                        calculateSH(value);
                    }
                });

                if (operation == "view") {
                    $(".easyui-combobox").combobox({onlyview: true, editable: false});
                    $(".easyui-textbox").textbox({onlyview: true, editable: false});
                    $("#saveBtn").hide();
                    $("#submitBtn").hide();
                    $(".addBtn").hide();
                    $("#highlight").textbox({required: false, onlyview: true, editable: false})
                }
            }
        }
    })
}

//部件工卡参考资料
function InitDataGrid(pkid) {
    if ($.trim(pkid) == null || $.trim(pkid) == "") {
        pkid = 0;
    }
    var pageSize = Math.floor(($(document.body).height() - $("fieldset").height() - 185) / 50);
    $("#dg").MyDataGrid({
        identity: "dg",
        sortable: true,
        singleSelect: true,
        pageList: [pageSize],
        resize: function () {
            return tabs_standard_resize($("#tt"), 0.13, 0.0001, 5, 4);
        },
        queryParams: {pkid: pkid},
        columns: {
            param: {FunctionCode: 'TD_JC_ALL_SELECT_DATA_LIST'}
        },
        contextMenus: [
            {
                id: "m-delete",
                i18nText: "删除",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (!confirm("确认删除该记录？")) {
                        return;
                    }
                    InitFuncCodeRequest_({
                        data: {pkid: rowData.PKID, FunctionCode: 'TD_JC_ALL_DELETE_DATAREC'},
                        successCallBack: function (jdata) {
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                reloadRefData();
                            } else {
                                MsgAlert({content: jdata.msg, type: 'error'});
                            }
                        }
                    });
                }
            }
        ],
        onClickRow: function (rowIndex, rowData) {

        }
    });
}

//部件工卡适用性
function InitDataGrid1(pkid) {
    if ($.trim(pkid) == null || $.trim(pkid) == "") {
        pkid = 0;
    }
    var pageSize = Math.floor(($(document.body).height() - $("fieldset").height() - 185) / 50);
    $("#dg1").MyDataGrid({
        identity: "dg1",
        sortable: true,
        singleSelect: true,
        pageList: [pageSize],
        resize: function () {
            return tabs_standard_resize($("#tt"), 0.13, 0.0001, 5, 4);
        },
        queryParams: {pkid: pkid},
        columns: {
            param: {FunctionCode: 'TD_JC_EFFECT_CM_LIST'},
            alter: {
                PN_CHANGE: {
                    formatter: function (value) {
                        return PAGE_DATA['pnChange'][value];
                    }
                }
            }
        },
        contextMenus: [
            {
                id: "m-edit",
                i18nText: "common:COMMON_OPERATION.EDIT",
                onclick: function () {
                    var rowData = getDG('dg1').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    saveCmjcApply("edit", rowData.PKID);
                }
            },
            {
                id: "m-delete",
                i18nText: "删除",
                onclick: function () {
                    var rowData = getDG('dg1').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (!confirm("确认删除该记录？")) {
                        return;
                    }
                    InitFuncCodeRequest_({
                        data: {pkid: rowData.PKID, FunctionCode: 'TD_CMJC_DELETE_APPLY'},
                        successCallBack: function (jdata) {
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                reloadCmjcApply();
                            } else {
                                MsgAlert({content: jdata.msg, type: 'error'});
                            }
                        }
                    });
                }
            }
        ],
        onClickRow: function (rowIndex, rowData) {

        }
    });
}

//航材、工具设备
function InitDataGrid2(pkid) {
    if ($.trim(pkid) == null || $.trim(pkid) == "") {
        pkid = 0;
    }
    var pageSize = Math.floor(($(document.body).height() - $("fieldset").height() - 185) / 50);
    $("#dg2").MyDataGrid({
        identity: "dg2",
        sortable: true,
        singleSelect: true,
        pageList: [pageSize],
        resize: function () {
            return tabs_standard_resize($("#tt"), 0.13, 0.0001, 5, 4);
        },
        queryParams: {pkid: pkid},
        columns: {
            param: {FunctionCode: 'TD_JC_MATER_CM_LIST'},
            alter: {
                MATER_SORT: {
                    formatter: function (value) {
                        return PAGE_DATA['materSort'][value];
                    }
                }
            }
        },
        contextMenus: [
            {
                id: "m-edit",
                i18nText: "common:COMMON_OPERATION.EDIT",
                onclick: function () {
                    var rowData = getDG('dg2').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    saveCmjcMater("edit", rowData.PKID);
                }
            },
            {
                id: "m-delete",
                i18nText: "删除",
                onclick: function () {
                    var rowData = getDG('dg2').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (!confirm("确认删除该记录？")) {
                        return;
                    }
                    InitFuncCodeRequest_({
                        data: {pkid: rowData.PKID, FunctionCode: 'TD_CMJC_DELETE_MATER'},
                        successCallBack: function (jdata) {
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                reloadMaterAndTool();
                            } else {
                                MsgAlert({content: jdata.msg, type: 'error'});
                            }
                        }
                    });
                }
            }
        ],
        onClickRow: function (rowIndex, rowData) {

        }
    });
}


//打开选择资料
function selectDataList() {

    var jcPkid = $("#pkid").val();
    if (jcPkid == null || jcPkid == "") {
        MsgAlert({content: "请先保存部件封面数据，在进行资料选择。", type: 'error'});
        return;
    }
    var title_ = $.i18n.t('选择参考资料');
    ShowWindowIframe({
        width: "800 ",
        height: "300",
        title: title_,
        param: {pkid: pkid, jcPkid: jcPkid, operation: operation},
        url: "/views/td/jobcard/cmjc/tdSelectDataList.shtml"
    });
}

//刷新
function reload_() {
    var pkid = $("#pkid").val();
    InitDataForm(pkid);
}

//部件适用性添加、编辑页面
function saveCmjcApply(operation, pkid) {
    var jcPkid = $("#pkid").val();
    if (jcPkid == null || jcPkid == "") {
        MsgAlert({content: "请先保存部件封面数据，在进行资料选择。", type: 'error'});
        return;
    }
    var title_ = $.i18n.t('新增部件工卡适用性');
    ShowWindowIframe({
        width: "680",
        height: "220",
        title: title_,
        param: {pkid: pkid, jcPkid: jcPkid, operation: operation},
        url: "/views/td/jobcard/cmjc/tdCmjcApplyAddOrEdit.shtml"
    });
}

//部件航材工具添加、编辑页面
function saveCmjcMater(operation, pkid) {
    var jcPkid = $("#pkid").val();
    if (jcPkid == null || jcPkid == "") {
        MsgAlert({content: "请先保存部件封面数据，在进行资料选择。", type: 'error'});
        return;
    }
    var title_ = $.i18n.t('新增航材与工具设备');
    ShowWindowIframe({
        width: "600",
        height: "270",
        title: title_,
        param: {pkid: pkid, jcPkid: jcPkid, operation: operation},
        url: "/views/td/jobcard/cmjc/tdCmjcMaterDetail.shtml"
    });
}

//回填
function InitDataForm(pkid) {
    InitFuncCodeRequest_({
        data: {pkid: pkid, FunctionCode: "TD_JC_ALL_CMJC_PKID"}, successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {

                ParseFormField_(jdata.data, $("#mform"), Constant.CAMEL_CASE);
                //回显工卡号
                var cmjcNo = jdata.data.JC_NO;
                evaManId = jdata.data.WRITER;
                var num = cmjcNo.split("-").length - 1;
                if (num == 3) {
                    var cmJcNoPre = cmjcNo.substring(0, cmjcNo.lastIndexOf("-"));
                    $("#jcNoA").textbox('setValue', cmJcNoPre);
                    var cmJcNoSuffix = cmjcNo.substring(cmjcNo.lastIndexOf("-") + 1, cmjcNo.length);
                    $("#jcNoB").textbox('setValue', cmJcNoSuffix);
                } else if (num == 2) {
                    $("#jcNoA").textbox('setValue', cmjcNo);
                }
                $("#pkid").val(jdata.data.PKID);
                $("#cepPkid").val(jdata.data.CEP_PKID);
                $("#cepCheckout").val(jdata.data.CEP_CHECKOUT);
                $("#cepFilePath").val(jdata.data.CEP_FILE_PATH);
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

//提交
function submitWorkflow() {

    var jcPkid = $("#pkid").val();
    if (jcPkid == null || jcPkid == "") {
        MsgAlert({content: "请先保存部件封面数据，在进行资料选择。", type: 'error'});
        return;
    }
    checkQua();
}

// 保存
function save() {

    var jcNo;
    var isValidate = $("#mform").form('validate');
    if (!isValidate)
        return;
    //流水号检测
    // if (regexps() == false) {
    //     return;
    // }
    var $form = $("#mform");
    var datas = $form.serializeObject();
    //获取工卡号
    var jcNoPre = $("#jcNoA").textbox('getValue');
    var jcNoSuffix = $("#jcNoB").textbox('getValue');
    if (jcNoSuffix == null || jcNoSuffix == '' || jcNoSuffix == undefined) {
        jcNo = jcNoPre;
    } else {
        jcNo = jcNoPre + "-" + jcNoSuffix;
    }
    $("#jcNo").val(jcNo);
    //内控版本
    var ver = $("#ver").val();

    if ("edit" == operation) { //编辑
        datas = $.extend(datas, {FunctionCode: 'TD_JC_ALL_CMJC_ADD', jcNo: jcNo, type: operation});
        InitFuncCodeRequest_({
            data: datas, successCallBack: function (jdata) {
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                    if (param.OWindow && typeof param.OWindow.reload_ == 'function') {
                        param.OWindow.reload_();
                    }
                    $("#pkid").val(jdata.data.pkid);
                } else {
                    MsgAlert({content: jdata.msg ? jdata.msg : jdata.data, type: 'error'});
                }
            }
        });
    } else { //添加,唯一性判断
        InitFuncCodeRequest_({
            data: {jcNo, jcNo, FunctionCode: "TD_JC_CMJC_ADD_CHECK"},
            successCallBack: function (jdata) {
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    if (jdata.data.GESHU == 0) {
                        datas = $.extend(datas, {FunctionCode: 'TD_JC_ALL_CMJC_ADD', jcNo: jcNo, type: operation});
                        InitFuncCodeRequest_({
                            data: datas, successCallBack: function (jdata) {
                                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                    MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                    if (param.OWindow && typeof param.OWindow.reload_ == 'function') {
                                        param.OWindow.reload_();
                                    }
                                    $("#pkid").val(jdata.data.pkid);
                                    $("#ver").textbox('setValue', jdata.data.ver);
                                } else {
                                    MsgAlert({content: jdata.msg ? jdata.msg : jdata.data, type: 'error'});
                                }
                            }
                        });
                    } else {
                        MsgAlert({content: '工卡号重复！', type: 'error'});
                    }
                } else {
                    MsgAlert({content: jdata.msg, type: 'error'});
                }
            }
        })
    }
}

// 编辑工序
function editProcedure() {

    var jcPkid = $("#pkid").val();
    if ($.trim(jcPkid) == '') {
        alert("请先保存工卡封面，再进行工序编辑。");
        return;
    }
    var title_ = $.i18n.t('编辑工序选项');
    var fleet = $("#fleet").val();
    var checkout = $("#cepCheckout").val();
    var cepFilePath = $("#cepFilePath").val();

    ShowWindowIframe({
        width: "500",
        height: "200",
        title: title_,
        param: {
            jcPkid: jcPkid,
            fleet: fleet,
            cepcheckout: checkout,
            cepfilepath: cepFilePath,
            pageCounter: pageCount
        },
        url: "/views/td/jobcard/cmjc/tdJcSelectCep.shtml"
    });
}

// function cepView(data) {
//     $("#cepCheckout").val('N');
//     $("#cepFilePath").val(data.jcCepPath);
// }

function getSerialNo(ata) {
    var sn;
    InitFuncCodeRequest_({
        data: {ata: ata, FunctionCode: "TD_CMJC_GET_SN"},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                sn = jdata.data.NUM;
                if (sn < 10) {
                    sn = "000" + sn;
                } else if (sn >= 10 && sn < 100) {
                    sn = "00" + sn;
                } else if (sn >= 100 && sn < 1000) {
                    sn = sn;
                }
                $("#jcNoA").textbox('setValue', 'CMJC' + '-' + ata + "-" + sn);
            }
        }
    });
}

//刷新部件参考资料表
function reloadRefData() {
    $("#dg").datagrid("reload");
}

//刷新部件适用性表
function reloadCmjcApply() {
    $("#dg1").datagrid("reload");
}

//刷新部件航材、工具表
function reloadMaterAndTool() {
    $("#dg2").datagrid("reload");
}

//计算标准工时
function calculateSH(value) {

    var regex = new RegExp("[0-9]+([.]{1}[0-9]+){0,1}");
    if (regex.test(value)) {
        var standHours = value * 2;
        $("#standHours").textbox('setValue', standHours);
    }
}

//预览PDF
function previewPDF() {
    var jcPkid = $("#pkid").val();
    if (jcPkid == null || jcPkid == "") {
        MsgAlert({content: "请先保存部件封面数据，在进行资料选择。", type: 'error'});
        return;
    }
    var data = $.extend({pkid: jcPkid}, {FunctionCode: 'TD_JC_PREVIEW'});
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

function cepView(data) {
    $("#cepCheckout").val('N');
    $("#cepPkid").val(data.pkid);
    $("#cepFilePath").val(data.jcCepPath);
}


function checkQua() {
    var jcPkid = $('#pkid').val();
    var ata = $("#ata").combobox('getValue');
    var fleet = "CM";
    InitFuncCodeRequest_({
        data: {pkid: jcPkid, taskType: "CMJC", FunctionCode: 'TD_JC_CHECK_QUA'},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                eflag = jdata.data.eflag;
                ifQua = jdata.data.ifQua;
                var tips = '';
                if (eflag == "NO") {
                    tips = "当前用户没有该工卡的资质，请提交给有资质的用户！";
                }
                if (eflag == "ALL") {
                    //获取工序文件与工序的检出状态
                    InitFuncCodeRequest_({
                        data: {pkid: jcPkid, FunctionCode: "TD_CMJC_CEP_IFCHECK"},
                        successCallBack: function (jdata) {
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                if (jdata.data.CEP_FILE_PATH == null || jdata.data.CEP_FILE_PATH == "") {
                                    MsgAlert({content: "当前没有工序文件，不能进行提交。", type: 'error'});
                                    return;
                                }
                                if (jdata.data.CEP_CHECKOUT != "" && jdata.data.CEP_CHECKOUT == "Y") {
                                    MsgAlert({content: "当前文件已被检出，不能进行提交。", type: 'error'});
                                    return;
                                }
                                if (!confirm("确认提交该记录？")) {
                                    return;
                                }

                                var datas = $.extend({}, {}, {FunctionCode: 'TD_CMJC_IF_SUBMIT', pkid: jcPkid});
                                InitFuncCodeRequest_({
                                    data: datas, successCallBack: function (jdata) {
                                        if (jdata.data == null) {
                                            common_add_edit_({
                                                identity: '',
                                                isEdit: '',
                                                width: 520,
                                                height: 300,
                                                title: $.i18n.t('选择审批人'),
                                                param: {
                                                    roleId: '',
                                                    otherParam: jcPkid,
                                                    msgData: msgData,
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
                                    pkid: jcPkid,
                                    ata: ata,
                                    fleet: fleet,
                                    cflag: "commit",
                                    fluflag: "edit",
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

function turnTdJc() {
    var jcPkid = $('#pkid').val();
    var ata = $("#ata").combobox('getValue');
    var fleet = "CM";
    var cflag = "turn";
    ShowWindowIframe({
        width: 550,
        height: 250,
        title: "驳回",
        param: {
            accId: evaManId,
            pkid: jcPkid,
            cflag: cflag,
            ata: ata,
            fleet: fleet,
            ifQua: "N",
            taskType: "CMJC",
            accountId: accountId
        },
        url: '/views/td/jobcard/smjc/smjcedit/tdJcTrans.shtml'
    });
}

//显示所有修订内容（不包含当前版本）
function showAllModifyContent() {
    var jcPkid = $("#pkid").val();
    ShowWindowIframe({
        width: 600,
        height: 600,
        param: {jcPkid: jcPkid},
        title: "修订内容详情",
        url: "/views/td/jobcard/commonjc/TdJcModifyContentHints.shtml"
    });
}

//显示所有改版记录（不包含当前版本）
function showAllRevRecord() {
    var jcPkid = $("#pkid").val();
    ShowWindowIframe({
        width: 600,
        height: 600,
        param: {jcPkid: jcPkid},
        title: "改版记录详情",
        url: "/views/td/jobcard/commonjc/TdJcRevRecordHints.shtml"
    });
}