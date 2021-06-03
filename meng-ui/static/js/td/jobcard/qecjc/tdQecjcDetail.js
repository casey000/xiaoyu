var param;
var operation;
var COMBOBOX_DATA = {};
var jc_pkid = null;//主表PKID
var pageCount = 1;
var fleet;
var CEP_CHECKOUT = "N";
var CEP_FILE_PATH = "";
var obj;

function i18nCallBack() {
    param = getParentParam_();
    operation = param.operation;
    jc_pkid = param.pkid;

    InitFuncCodeRequest_({
        data: {
            domainCode: "DA_FLEET,YESORNO,TD_JC_ALL_QECJC_CHECK_LEVEL,TD_JC_ALL_ENGINE_VPN,TD_JC_MATER_SORT,TD_JC_MATER_TYPE,TD_JC_MATER_UNIT,TD_JC_MATER_IMPORTANCE,TD_JC_EXTEND",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {

                //机队
                COMBOBOX_DATA['fleet'] = jdata.data.DA_FLEET;
                //是否必检
                COMBOBOX_DATA['ifRii'] = jdata.data.YESORNO;
                //检验等级
                COMBOBOX_DATA['checkLevel'] = jdata.data.TD_JC_ALL_QECJC_CHECK_LEVEL;
                //发动机型号
                COMBOBOX_DATA['engNo'] = jdata.data.TD_JC_ALL_ENGINE_VPN;

                //航材/工具
                COMBOBOX_DATA['materSort'] = DomainCodeToMap_(jdata.data["TD_JC_MATER_SORT"]);
                //航材类别
                COMBOBOX_DATA['materType'] = DomainCodeToMap_(jdata.data["TD_JC_MATER_TYPE"]);
                //数量按需
                COMBOBOX_DATA['qtyReq'] = DomainCodeToMap_(jdata.data["YESORNO"]);
                //单位
                COMBOBOX_DATA['unit'] = DomainCodeToMap_(jdata.data["TD_JC_MATER_UNIT"]);
                //适用情况（是否视情）
                COMBOBOX_DATA['importance'] = DomainCodeToMap_(jdata.data["TD_JC_MATER_IMPORTANCE"]);

                //发动机型号
                $('#engNo').combobox({
                    panelHeight: '160px',
                    data: jdata.data.TD_JC_ALL_ENGINE_VPN,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    onChange: function () {
                        //获取选中的机队
                        var engNoValue = $('#engNo').combobox('getValue');
                        if (engNoValue == null || engNoValue == "") {
                            return;
                        }
                        $('#jcNoA').textbox({value: "SFN-QECJC-" + engNoValue});
                        // $('#ver').textbox({value: '0'});
                    }
                });

                //是否必检
                $('#ifRii').combobox({
                    panelHeight: '50px',
                    data: jdata.data.YESORNO,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                    // value: 'Y'
                });

                //检验等级
                $('#checkLevel').combobox({
                    panelHeight: '135px',
                    data: jdata.data.TD_JC_ALL_QECJC_CHECK_LEVEL,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                    // value: 'Y'
                });

                //机队
                $('#fleet').combobox({
                    panelHeight: '135px',
                    data: jdata.data.DA_FLEET,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                    // value: 'Y'
                });

                if (operation == 'view') {
                    $("#saveBtn").hide();
                    $("#editBtn").hide();
                    $("#submitBtn").hide();
                    $("#ffSearch").hide();
                }
                if (param.pkid) {
                    InitDataForm(param.pkid);
                }
            }


            InitDataGrid();
        }
    })
}

//初始化表格
function InitDataGrid() {
    if ($.trim(jc_pkid) == null || $.trim(jc_pkid) == "") {
        jc_pkid = 0;
    }
    var pageSize = Math.floor(($(document.body).height() - $("fieldset").height() - 200) / 50);
    $("#dg").MyDataGrid({
        identity: "dg",
        sortable: true,
        singleSelect: true,
        pageList: [pageSize],
        resize: function () {
            return tabs_standard_resize($("#tt"), 0.13, 0.0001, 5, 4);
        },
        queryParams: {jcPkid: jc_pkid},
        columns: {
            param: {FunctionCode: 'TD_JC_MATER_LIST'},
            alter: {
                TEST_UPLOAD: {},
                MATER_SORT: {
                    formatter: function (value) {
                        return COMBOBOX_DATA['materSort'][value];
                    }
                },
                MATER_TYPE: {
                    formatter: function (value) {
                        return COMBOBOX_DATA['materType'][value];
                    }
                },
                QTY_REQ: {
                    formatter: function (value) {
                        return COMBOBOX_DATA['qtyReq'][value];
                    }
                },
                UNIT: {
                    formatter: function (value) {
                        return COMBOBOX_DATA['unit'][value];
                    }
                },
                IMPORTANCE: {
                    formatter: function (value) {
                        return COMBOBOX_DATA['importance'][value];
                    }
                }
            }
        },
        contextMenus: [
            {
                id: "m-edit",
                i18nText: "common:COMMON_OPERATION.EDIT",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    editMater("edit", rowData.PKID);
                }
            }, {
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
                        data: {pkid: rowData.PKID, FunctionCode: 'TD_JC_MATER_DELETE'},
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
        ],
        onClickRow: function (rowIndex, rowData) {

        }
    });
}


//刷新
function reload_() {
    $("#dg").datagrid("reload");
}


//正则验证表达检测
function regexps() {
    var value = $("#jcNoB").textbox('getValue');
    var exp = new RegExp("^[A-Z]{1}$");
    if (!exp.test(value)) {
        MsgAlert({content: "流水号由A-Z的1位英文大写字母组成。", type: 'error'});
        $("#jcNoB").textbox('setValue', "");
        return false;
    } else {
        return true;
    }
}

//回填
function InitDataForm(pkid) {
    InitFuncCodeRequest_({
        data: {pkid: pkid, FunctionCode: "TD_JC_ALL_CMJC_PKID"}, successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                ParseFormField_(jdata.data, $("#mform"), Constant.CAMEL_CASE);

                //截取流水号 3U-QECJC-0332章-A-0
                var jcNob = jdata.data.JC_NO.substring((("SFN-QECJC-" + jdata.data.ENG_NO + "-").length), (("SFN-QECJC-" + jdata.data.ENG_NO + "-").length) + 1);
                $("#engNo").combobox({onlyview: true, editable: false, value: jdata.data.ENG_NO});
                $("#jcNoA").textbox({onlyview: true, editable: false});
                $("#jcNoB").textbox({onlyview: true, editable: false, value: "" + jcNob});
                // $("#ver").textbox({onlyview: true, editable: false});

                //设置机队不可编辑
                $("#fleet").combobox({onlyview: true, editable: false, value: jdata.data.FLEET});
                obj = jdata.data;
                //init fleet
                fleet = jdata.data.FLEET;

                CEP_CHECKOUT = jdata.data.CEP_CHECKOUT;
                CEP_FILE_PATH = jdata.data.CEP_FILE_PATH;

            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

function submitWorkflow() {

    if (jc_pkid == null || jc_pkid == "") {
        MsgAlert({content: "请先保存部件封面数据，在进行资料选择。", type: 'error'});
        return;
    }

    if (CEP_FILE_PATH == null || CEP_FILE_PATH == "") {
        MsgAlert({content: "当前没有工序文件，不能进行提交。", type: 'error'});
        return;
    }
    if (CEP_CHECKOUT != "" && CEP_CHECKOUT == "Y") {
        MsgAlert({content: "当前文件已被检出，不能进行提交。", type: 'error'});
        return;
    }

    $.messager.confirm('', '是否确认提交？', function (r) {
        if (r) {
            datas = $.extend({}, {}, {FunctionCode: 'TD_JC_ALL_QECJC_STATUS', pkid: jc_pkid});
            InitFuncCodeRequest_({
                data: datas, successCallBack: function (jdata) {
                    console.log(jdata);
                    if (jdata.data != null) {
                        common_add_edit_({
                            identity: '', isEdit: '', width: 520, height: 300, title: $.i18n.t('选择审批人'),
                            param: {
                                roleId: '',
                                otherParam: jc_pkid,
                                FunctionCode_: 'TD_JC_ALL_QECJC_SUBMIT',
                                successCallback: reload_
                            },
                            url: "/views/em/workflow/work_flow_account_select.shtml"
                        });
                    } else {
                        MsgAlert({content: "该数据已被提交过了。", type: 'error'});
                    }
                }
            });
        }
    });
}

// 保存
function save() {
    var isValidate = $("#mform").form('validate');
    if (!isValidate)
        return;

    //流水号检测
    if (regexps() == false) {
        return;
    }

    var $form = $("#mform");
    var datas = $form.serializeObject();
    //获取工卡号
    var jcNo = $("#jcNoA").textbox('getValue') + "-" + $("#jcNoB").textbox('getValue');

    //内控版本
    var ver = $("#ver").val();
    var fleet_ = $('#fleet').combobox("getValue");
    datas = $.extend(datas, {FunctionCode: 'TD_JC_ALL_QECJC_ADD', jcNo: jcNo, type: operation});
    if (confirm("是否保存？")) {
        //唯一检测
        if (param.operation == "save") {
            InitFuncCodeRequest_({
                data: {jcNo: jcNo, ver: ver, FunctionCode: "TD_JC_ALL_QECJC_CHECK"}, successCallBack: function (jdata) {
                    if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                        if (jdata.data != null) {
                            MsgAlert({content: "保存失败,请检查[工卡号、内控版本]是否重复。", type: 'error'});

                        } else {
                            InitFuncCodeRequest_({
                                data: datas, successCallBack: function (jdata) {
                                    if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                        jc_pkid = jdata.data;
                                        fleet = fleet_;
                                        MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                        //保存主表后初始化附表
                                        InitDataForm(jc_pkid);
                                        InitDataGrid();
                                        if (param.OWindow.onSearch_) {
                                            param.OWindow.onSearch_('dg', '#ffSearch');
                                        }
                                    } else {
                                        MsgAlert({content: jdata.msg ? jdata.msg : jdata.data, type: 'error'});
                                    }
                                }
                            });
                        }
                    } else {
                        MsgAlert({content: "检查唯一性失败", type: 'error'});

                    }
                }
            });
        } else {
            InitFuncCodeRequest_({
                data: datas, successCallBack: function (jdata) {
                    if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                        jc_pkid = jdata.data;
                        fleet = fleet_;
                        MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                        InitDataForm(jc_pkid);
                        InitDataGrid();
                        if (param.OWindow.onSearch_) {
                            param.OWindow.onSearch_('dg', '#ffSearch');
                        }
                    } else {
                        MsgAlert({content: jdata.msg ? jdata.msg : jdata.data, type: 'error'});
                    }
                }
            });
        }
    }
}

//打开航材详情页
function addMater(operation) {
    var pkid = jc_pkid;

    if (jc_pkid == null || jc_pkid == "") {
        MsgAlert({content: "请先保存部件封面数据，在进行资料选择。", type: 'error'});
        return;
    }
    var title_ = $.i18n.t('航材工具详情');
    ShowWindowIframe({
        width: "600",
        height: "220",
        title: title_,
        param: {pkid: pkid, fleet: fleet, type: operation},
        url: "/views/td/jobcard/mater/tdJcMaterDetail.shtml"
    });
}

function editMater(operation, materPkid) {
    var title_ = $.i18n.t('航材工具详情');
    ShowWindowIframe({
        width: "600",
        height: "220",
        title: title_,
        param: {pkid: materPkid, fleet: fleet, type: operation},
        url: "/views/td/jobcard/mater/tdJcMaterDetail.shtml"
    });
}

function batchDelete() {
    var selectRows = $("#dg").datagrid('getChecked');
    var selectCount = selectRows.length;
    if (selectCount === 0) {
        MsgAlert({content: '请选择要删除的记录！', type: 'error'});
        return;
    }
    if (!confirm("确认删除选中的记录？")) {
        return;
    }
    var pkids = '';

    $.each(selectRows, function (k, item) {
        pkids += item.PKID + ',';
    });

    pkids = pkids.substring(0, pkids.length - 1);
    InitFuncCodeRequest_({
        data: {pkids: pkids, FunctionCode: 'TD_JC_MATER_DELETE_BATCH'},
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

function closeW() {
    if (confirm("是否关闭该页面？")) {
        CloseWindowIframe();
    }
}


function editProcedure() {
    var title_ = $.i18n.t('编辑工序选项');
    var pkid = $("#pkid").val();
    var fleet = $("#fleet").combobox('getValue');
    var checkout = $("#cepCheckout").val();
    var cepFilePath = $("#cepFilePath").val();
    // var refType = null;//QEC没有手册，没有参考类型
    // var refData = null;//QEC没有手册，没有参考资料
    // var jobcardVer = null;//QEC没有手册，没有工卡版本
    if (jc_pkid == null || jc_pkid == "") {
        MsgAlert({content: "请先保存部件封面数据，在进行资料选择。", type: 'error'});
        return;
    }

    ShowWindowIframe({
        width: "500",
        height: "200",
        title: title_,
        param: {
            jcPkid: pkid,
            fleet: fleet,
            cepcheckout: checkout,
            cepfilepath: cepFilePath,
            // refType: refType,
            // refData: refData,
            // jobcardVer:jobcardVer,
            pageCounter: pageCount
        },
        url: "/views/td/jobcard/qecjc/TdQecJcSelectCep.shtml"
    });
}

function previewPDF() {
    if (jc_pkid == null || jc_pkid == "") {
        MsgAlert({content: "请先保存部件封面数据，在进行资料选择。", type: 'error'});
        return;
    }
    if (obj.CEP_FILE_PATH == null || obj.CEP_FILE_PATH == "") {
        MsgAlert({content: "当前未查询到工序文件，无法预览。", type: 'error'});
        return;
    }
    var data = $.extend({pkid: jc_pkid}, {FunctionCode: 'TD_JC_PREVIEW'});
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

function cepView(data) {
    $("#cepCheckout").val('N');
    $("#cepPkid").val(data.pkid);
    $("#cepFilePath").val(data.jcCepPath);
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