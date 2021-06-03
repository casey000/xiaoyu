var param;
var operation;
var pkid;

function i18nCallBack() {
    param = getParentParam_();
    operation = param.operation;
    pkid = param.pkid;
    InitFuncCodeRequest_({
        data: {
            domainCode: "",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                InitDataForm(pkid);
            }
        }
    })
}

//查询回填
function InitDataForm(pkid) {
    InitFuncCodeRequest_({
        data: {pkid: pkid, FunctionCode: "TD_JC_LMJC_BY_PKID"}, successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                ParseFormField_(jdata.data, $("#mform"), Constant.CAMEL_CASE);

            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

// 保存1
function save() {
    var isValidate = $("#mform").form('validate');
    if (!isValidate)
        return;
    var $form = $("#mform");
    var datas = $form.serializeObject();
    datas = $.extend({}, datas, {FunctionCode: 'TD_JC_LMJC_ENLABLE_SETTING'});
    InitFuncCodeRequest_({
        data: datas, successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                if (param.OWindow.onSearch_) {
                    param.OWindow.onSearch_('dg', '#ffSearch');
                }
                param.OWindow.MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                CloseWindowIframe();
            } else {
                MsgAlert({content: jdata.msg ? jdata.msg : jdata.data, type: 'error'});
            }
        }
    });
}