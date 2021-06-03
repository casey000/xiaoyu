var param;
var currentJcNoSeq = null;
var ver;

function i18nCallBack() {
    param = getParentParam_();
    ver = param.ver;
    InitDataForm(param.pkid);

}

function InitDataForm(pkid) {
    InitFuncCodeRequest_({
        data: {pkid: pkid, FunctionCode: "TD_JC_SMJC_BY_PKID"}, successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                ParseFormField_(jdata.data, $("#mform"), Constant.CAMEL_CASE);

                var jcNo = jdata.data.JC_NO;
                var jcNoArr = jcNo.split("-");
                var jcNoLength = jcNoArr.length;
                var jcNoCur = "";
                for (i = 0; i < jcNoLength - 1; i++) {
                    jcNoCur += jcNoArr[i] + "-";
                }
                currentJcNoSeq = jcNoArr[jcNoLength - 1];
                $('#jcNoAuto').textbox("setValue", jcNoCur);
                $('#jcNoAuto').textbox({required: true, editable: false, onlyview: true});
                $('#jcNoSeq').textbox({required: true, editable: true, onlyview: false});
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

function startCopy() {
    var isValidate = $("#mform").form('validate');
    if (!isValidate) {
        return;
    }
    /*if(!regexps())
     return;*/
    if (currentJcNoSeq == null) {
        MsgAlert({content: "请填写拆分工卡的流水号!", type: 'error'});
        return;
    }
    if (currentJcNoSeq == $('#jcNoSeq').textbox('getValue')) {
        MsgAlert({content: "工卡流水号不能相同!", type: 'error'});
        return;
    }
    if (!confirm("是否开始拆分工卡?")) {
        return;
    }


    var jcNo = $("#jcNoAuto").textbox('getValue') + $("#jcNoSeq").textbox('getValue');

    InitFuncCodeRequest_({
        data: {jcNo: jcNo, ver: ver, FunctionCode: "TD_JC_ALL_REPEAT_CHECK"}, successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                if (jdata.data != null) {
                    MsgAlert({content: "【工卡号】重复，请修改拆分卡流水号。", type: 'error'});

                } else {
                    InitFuncCodeRequest_({
                        data: {pkid: param.pkid, jcNo: jcNo, FunctionCode: "TD_JC_SMJC_COPY"},
                        successCallBack: function (jdata) {
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                if (param.OWindow.onSearch_) {
                                    param.OWindow.onSearch_('dg1', '#ffSearch1');
                                }
                                param.OWindow.MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                CloseWindowIframe();

                            } else {
                                MsgAlert({content: jdata.msg, type: 'error'});
                            }
                        }
                    });
                }
            } else {
                MsgAlert({content: "检查唯一性失败", type: 'error'});

            }
        }
    });


}

//正则验证表达检测
function regexps() {
    var value = $("#jcNoSeq").textbox('getValue');
    var exp = new RegExp("^[0-9]{1}$");
    if (!exp.test(value)) {
        MsgAlert({content: "流水号由A-Z的1位英文大写字母组成。", type: 'error'});
        $("#jcNoSeq").textbox('setValue', "");
        return false;
    } else {
        return true;
    }
}