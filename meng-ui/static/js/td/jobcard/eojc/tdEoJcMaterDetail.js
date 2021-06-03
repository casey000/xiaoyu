var param;
var jcPkid;
var type;
var PAGE_DATA = {};
var matPkid;
var config;
var configPkid;

function i18nCallBack() {
    param = getParentParam_();
    jcPkid = param.pkid;
    type = param.type;
    matPkid = param.materPkid;
    config = param.config;
    configPkid = param.configPkid;
    InitFuncCodeRequest_({
        data: {
            domainCode: "TD_JC_MATER_SORT,TD_JC_MATER_TYPE,TD_JC_MATER_IMPORTANCE,TD_JC_MATER_UNIT,YESORNO",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                //航材工具
                $('#materSort').combobox({
                    panelHeight: '80px',
                    data: jdata.data.TD_JC_MATER_SORT,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    onChange: function (newValue, oldValue) {
                        setMaterType(newValue);
                    }
                });
                //航材类型
                $('#materType').combobox({
                    panelHeight: '80px',
                    data: jdata.data.TD_JC_MATER_TYPE,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });

                //视情
                $('#importance').combobox({
                    panelHeight: '50px',
                    data: jdata.data.TD_JC_MATER_IMPORTANCE,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });

                //数量按需
                $('#qtyReq').combobox({
                    panelHeight: '50px',
                    data: jdata.data.YESORNO,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    onChange: function (newValue, oldValue) {
                        setQtyReq(newValue);
                    }
                });
                //单位
                $('#unit').combobox({
                    panelHeight: '100px',
                    data: jdata.data.TD_JC_MATER_UNIT,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
            }
            if (type == "add") {
                $('#jcPkid').val(param.pkid);
            } else if (type == "view" && param.pkid) {
                $('#saveBtn').hide();
            } else {
                $('#jcPkid').val(param.pkid);
                InitDataForm(matPkid);
            }
        }
    })
}

function InitDataForm(pkid) {
    InitFuncCodeRequest_({
        data: {pkid: pkid, FunctionCode: "TD_JC_MATER_BY_PKID"}, successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                ParseFormField_(jdata.data, $("#mform"), Constant.CAMEL_CASE);
                $('#materSort').combobox({value: jdata.data.MATER_SORT});
                $('#materType').combobox({value: jdata.data.MATER_TYPE});
                $('#importance').combobox({value: jdata.data.IMPORTANCE});
                $('#qtyReq').combobox({value: jdata.data.QTY_REQ});
                $('#unit').combobox({value: jdata.data.UNIT});

                $("#configHidden").val(configPkid);
                $("#config").textbox('setValue', config);
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

//构型和适用性增加
function searchConfigList() {
    var title_ = $.i18n.t('适用性');
    ShowWindowIframe({
        width: "400",
        height: "350",
        title: title_,
        param: {jcPkid: jcPkid},
        url: "/views/td/jobcard/eojc/tdEojcEditEffect.shtml"
    });
}


function setConfigValues(ids, name) {
    $("#configHidden").val(ids);
    $("#config").textbox({value: name});
}

function setQtyReq(val) {
    if (val == 'Y') {
        $('#qty').textbox({value: '0', required: true, editable: false, onlyview: true});
    } else {
        $('#qty').textbox({value: '', required: true, editable: true, onlyview: false});
    }
}

function setMaterType(val) {
    if (val == 'TE') {
        $('#materType').textbox({value: '', required: false, editable: false, onlyview: true});
    } else {
        $('#materType').textbox({value: '', required: true, editable: true, onlyview: false});
    }
}

// 保存
function save() {
    var isValidate = $("#mform").form('validate');
    if (!isValidate)
        return;
    var $form = $("#mform");
    var datas = $form.serializeObject();
    datas = $.extend({type: type, ids: $("#configHidden").val()}, datas, {FunctionCode: 'TD_JC_ALL_EOJC_ADD_MATER'});
    InitFuncCodeRequest_({
        data: datas, successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                param.OWindow.reload_('dg');
                param.OWindow.MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                CloseWindowIframe();
            } else {
                MsgAlert({content: jdata.msg ? jdata.msg : jdata.data, type: 'error'});
            }
        }
    });
}