var param;
var operation;
var jcPkid;
var param;
var pageCount;
var PAGE_DATA = {};
var lmjcPkid;
var CEP_CHECKOUT = "N";
var CEP_FILE_PATH = "";
var obj;
var jcType;
var taskId;
var msgData;
var accountId;
var ata = "N/A";


function i18nCallBack() {
    pageCount = 1;
    param = getParentParam_();
    operation = param.operation;
    jcType = param.jcType;
    taskId = param.taskId;

    msgData = param.msgData;
    accountId = param.accountId;

    if (msgData) {
        lmjcPkid = param.recordId;
    } else {
        lmjcPkid = param.pkid;
    }

    if (taskId == 'task1564655749342') { //退回
        $("#submitBtn").hide();
        $("#closeBtn").hide();
    } else if (taskId == 'task1564655659124' || taskId == 'task1564655708888') { //审核与批准
        $("#submitBtn").hide();
        $("#closeBtn").hide();
    }

    InitFuncCodeRequest_({
        data: {
            domainCode: "DA_FLEET,TD_LMJC_TYPE,TD_LMJC_FLEET_GROUP,TD_JC_SKILLS",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                $('#skills').combobox({
                    panelHeight: '70px',
                    data: jdata.data.TD_JC_SKILLS,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                if (operation == 'add') {
                    $('#fleet').combobox({
                        panelHeight: '100px',
                        data: jdata.data.DA_FLEET,
                        valueField: 'VALUE',
                        textField: 'TEXT',
                        onChange: function (newValue, oldValue) {
                            var lmjcPkid = $("#pkid").val();
                            if (lmjcPkid == null || lmjcPkid == '' || lmjcPkid == undefined) {
                                proJcNo();
                            }
                        }
                    });
                    $('#lmjcType').combobox({
                        panelHeight: '100px',
                        data: jdata.data.TD_LMJC_TYPE,
                        valueField: 'VALUE',
                        textField: 'TEXT',
                        onChange: function (value) {
                            var lmjcPkid = $("#pkid").val();
                            if (lmjcPkid == null || lmjcPkid == '' || lmjcPkid == undefined) {
                                if ($('#fleet').combobox('getValue') == null || $('#fleet').combobox('getValue') == "") {
                                    $('#lmjcType').textbox('setValue', '');
                                    MsgAlert({content: "请先选择【机队】！", type: 'error'});
                                } else {
                                    if (!lmjcPkid) {
                                        proJcNo();
                                    }
                                }
                            }
                        }
                    });
                } else {
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
                }
                $("#standHours").textbox({
                    onChange: function (value) {
                        var regex = new RegExp("[0-9]+([.]{1}[0-9]+){0,1}");//整数与小数
                        if (!regex.test(value)) {
                            MsgAlert({content: "标准工时仅支持整数与小数，请重新输入！", type: 'warn'});
                            $("#standHours").textbox('setValue', '');
                        }
                    }
                });
                //工卡类型
                PAGE_DATA['lmjcType'] = DomainCodeToMap_(jdata.data["TD_LMJC_TYPE"]);
            }
            if (operation == "view") {
                $(".easyui-combobox").combobox({onlyview: true, editable: false});
                $(".easyui-textbox").textbox({onlyview: true, editable: false});
                $("#saveBtn").hide();
                $("#submitBtn").hide();
                $("#edit").hide()
            }
            if (lmjcPkid) {
                //先初始化再赋值
                var fleet = param.fleet;
                $("#fleetGroup").MyComboGrid({
                    idField: 'FGID',  //实际选择值
                    textField: 'FLEET_GROUP', //文本显示值
                    editable: false,
                    required: true,
                    pagination: true,
                    tipPosition: 'top',
                    mode: 'remote',
                    params: {fleet: fleet, FunctionCode: 'TD_JC_LMJC_FLEET_GROUP'},
                    /*  url: Constant.API_URL + 'WS_USER',*/
                    multiple: false,
                    columns: [[
                        {field: 'FGID', title: '顺序号', width: 100, sortable: true},
                        {field: 'FLEET_GROUP', title: '飞机分组编号', width: 100, sortable: true},
                    ]]
                });
                InitDataForm(lmjcPkid);
            }

            //编辑时唯一性字段不能修改
            if (operation == "edit") {
                $("#fleet").combobox({disabled: true});      //设置下拉款为禁用
                $("#fleetGroup").combogrid({disabled: true});      //设置下拉款为禁用
                $("#lmjcType").combobox({disabled: true});      //设置下拉款为禁用
            }
        }
    })
}

//查询回填
function InitDataForm(pkid) {
    jcPkid = pkid;
    InitFuncCodeRequest_({
        data: {pkid: pkid, FunctionCode: "TD_JC_LMJC_BY_PKID"}, successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                ParseFormField_(jdata.data, $("#mform"), Constant.CAMEL_CASE);
                CEP_CHECKOUT = jdata.data.CEP_CHECKOUT;
                CEP_FILE_PATH = jdata.data.CEP_FILE_PATH;
                obj = jdata.data;
                $("#pkid").val(jdata.data.PKID);
                $("#mopNo").val(jdata.data.MOP_NO);
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}


//提交
function sub() {
    var pkid = $("#pkid").val();
    //获取工序文件与工序的检出状态
    InitFuncCodeRequest_({
        data: {pkid: pkid, FunctionCode: "TD_JC_LMJC_CEP_IFCHECK"},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                var msgArr = [];
                if (jdata.data.CEP_FILE_PATH == null || jdata.data.CEP_FILE_PATH == "") {
                    // MsgAlert({content: "当前没有工序文件，不能进行提交。", type: 'error'});
                    // return;
                    msgArr.push("当前没有工序文件，不能进行提交!");
                }
                if (jdata.data.CEP_CHECKOUT != "" && jdata.data.CEP_CHECKOUT == "Y") {
                    // MsgAlert({content: "当前文件已被检出，不能进行提交。", type: 'error'});
                    // return;
                    msgArr.push("当前文件已被检出，不能进行提交!");
                }
                if (msgArr.length > 0) {
                    hints(msgArr);
                } else {
                    if (!confirm("确认提交该记录？")) {
                        return;
                    }
                    checkQua();
                }
            }
        }
    });
}

// 保存
function save() {
    var isValidate = $("#mform").form('validate');
    if (!isValidate)
        return;
    var $form = $("#mform");
    var datas = $form.serializeObject();
    var fleet = datas.fleet;
    var lmjcType = datas.lmjcType;
    var jcNo = $("#jcNo").textbox('getValue');
    var lmjcPkid = $("#pkid").val();
    if (lmjcPkid == null || lmjcPkid == '' || lmjcPkid == undefined) {
        operation = 'add';
    } else {
        operation = 'edit';
    }


    if (operation == 'edit') {
        datas = $.extend(datas, {FunctionCode: 'TD_JC_LMJC_ADD'});
        InitFuncCodeRequest_({
            data: datas, successCallBack: function (jdata) {
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                    if (param.OWindow && typeof param.OWindow.reload_ == 'function') {
                        param.OWindow.reload_();
                    }
                    $("#pkid").val(jdata.data.pkid);
                    InitDataForm(jdata.data.pkid);
                } else {
                    MsgAlert({content: jdata.msg ? jdata.msg : jdata.data, type: 'error'});
                }
            }
        });
    }
    else {
        //唯一性判断
        InitFuncCodeRequest_({
            data: {fleet: fleet, lmjcType: lmjcType, jcNo, jcNo, FunctionCode: "TD_JC_LMJC_ADD_CHECK"},
            successCallBack: function (jdata) {
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    if (jdata.data.GESHU == 0) {
                        datas = $.extend(datas, {FunctionCode: 'TD_JC_LMJC_ADD'});
                        InitFuncCodeRequest_({
                            data: datas, successCallBack: function (jdata) {
                                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                    if (param.OWindow.onSearch_) {
                                        param.OWindow.onSearch_('dg', '#ffSearch');
                                    }
                                    MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                    $("#pkid").val(jdata.data.pkid);
                                    $("#fleet").combobox({required: false, editable: false, onlyview: true});
                                    $("#fleet").combobox('setValue', jdata.data.fleet);
                                    $("#lmjcType").combobox({required: false, editable: false, onlyview: true});
                                    $("#lmjcType").combobox('setValue', jdata.data.lmjcType);
                                    $("#ver").textbox('setValue', jdata.data.ver);
                                    InitDataForm(jdata.data.pkid);
                                } else {
                                    MsgAlert({content: jdata.msg ? jdata.msg : jdata.data, type: 'error'});
                                }
                            }
                        });
                    }
                    else {
                        MsgAlert({content: '工卡号重复！', type: 'error'});
                    }
                }
                else {
                    MsgAlert({content: jdata.msg, type: 'error'});
                }
            }
        });
    }

}

// 编辑工序
function editProcedure() {
    var title_ = $.i18n.t('编辑工序选项');
    var pkid = $("#pkid").val();
    var fleet = $("#fleet").combobox('getValue');
    var checkout = $("#cepCheckout").val();
    var cepFilePath = $("#cepFilePath").val();
    if ($.trim(pkid) == '') {
        alert("请先保存工卡封面，再进行工序编辑。");
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
            pageCounter: pageCount,
            jcType: jcType
        },
        url: "/views/td/jobcard/lmjc/tdJcSelectCep.shtml"
    });
}

function cepView(data) {
    $("#cepCheckout").val('N');
    $("#cepFilePath").val(data.jcCepPath);
}

function reload_() {
    // param.OWindow.reload_();
    var pkid = $("#pkid").val();
    InitDataForm(pkid);
}

function previewPDF() {
    var pkid = $("#pkid").val();
    InitFuncCodeRequest_({
        data: {pkid, FunctionCode: "TD_JC_PREVIEW"},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                if (jdata.data.length > 0) {
                    var url = jdata.data;
                    var title_ = $.i18n.t('航线工卡预览');
                    ShowWindowIframe({
                        width: "850",
                        height: "650",
                        title: title_,
                        param: {url: url},
                        url: "/views/td/jobcard/smjc/smjcedit/jobcardPreview.shtml"
                    });
                }
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

function proJcNo() {
    $("#jcNo").val("");
    //型号
    var fleet = $("#fleet").combobox('getValue');
    //章节
    var lmjcType = $("#lmjcType").combobox('getValue');
    //流水号(通过型号+工卡类型去数据库找最新的并在原有版本上加1)
    var sn;
    if (fleet != "" && lmjcType != "") {
        InitFuncCodeRequest_({
            data: {fleet: fleet, lmjcType: lmjcType, FunctionCode: "TD_LMJC_GET_SN"},
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
                    $("#jcNo").textbox('setValue', 'LMJC' + '-' + fleet + '-' + lmjcType + "-" + sn);
                }
            }
        });
    } else if (fleet != "" && lmjcType == "") { //机队不为空,工卡类型为空
        $("#jcNo").textbox('setValue', 'LMJC' + '-' + fleet);
    } else if (fleet == "" && lmjcType != "") { //机队为空,工卡类型不为空
        MsgAlert({content: "请先选择机队！", type: 'error'});
        $("#lmjcType").combobox('setValue', '');
        $("#jcNo").textbox('setValue', '');
    } else { //两者皆为空
        $("#jcNo").textbox('setValue', '');
    }
}

//选择单机
function singlePreviewPDF() {

    var mopNo = $("#mopNo").val();
    var msgArr = [];
    if(mopNo != null && mopNo != undefined && mopNo != ''){
        // MsgAlert({content: "ME系统PDF路径有值，不能做单机预览！", type: 'error'});
        // return;
        msgArr.push("ME系统PDF路径有值，不能做单机预览");
    }
    if (CEP_FILE_PATH == null || CEP_FILE_PATH == "") {
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
                jcId: lmjcPkid,
                fleet: param.fleet,
                action: "EMSINGLEPREVIEW"
            },
            url: "/views/td/jobcard/tdAcnoChoose.shtml"
        });
    }
}


function checkQua() {
    var jcPkid = $('#pkid').val();
    var fleet = $("#fleet").combobox('getValue');
    InitFuncCodeRequest_({
        data: {pkid: jcPkid, taskType: "LMJC", FunctionCode: 'TD_JC_CHECK_QUA'},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                eflag = jdata.data.eflag;

                ifQua = jdata.data.ifQua;
                var tips = '';
                if (eflag == "NO") {
                    tips = "当前用户没有该工卡的资质，请提交给有资质的用户！";
                }
                if (eflag == "ALL") {
                    var datas = $.extend({}, {}, {FunctionCode: 'TD_JC_ALL_LMJC_STATUS', pkid: jcPkid});
                    InitFuncCodeRequest_({
                        data: datas, successCallBack: function (jdata) {
                            if (jdata.data == null) {
                                common_add_edit_({
                                    identity: '', isEdit: '', width: 520, height: 300, title: $.i18n.t('选择审批人'),
                                    param: {
                                        roleId: '',
                                        otherParam: jcPkid,
                                        msgData: msgData,
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
                                    pkid: jcPkid,
                                    ata: ata,
                                    fleet: fleet,
                                    cflag: "commit",
                                    fluflag: "edit",
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

function hints(mgs) {
    ShowWindowIframe({
        width: 320,
        height: 300,
        param: {mgs: mgs},
        title: "工卡提示",
        url: "/views/td/jobcard/commonjc/TdHints.shtml"
    });
}
