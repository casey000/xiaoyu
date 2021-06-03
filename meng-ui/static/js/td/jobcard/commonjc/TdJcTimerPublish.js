var param;
var COMBOBOX_DATA = {};
var jc_pkid;
var type;

function i18nCallBack() {
    param = getParentParam_();
    type = param.type;
    //初始化当前操作人
    var userInfo = getLoginInfo();
    $('#publicByStr').textbox("setValue", userInfo.userName);

}

// 保存
function save() {
    var isValidate = $("#mform").form('validate');
    if (!isValidate)
        return;

    var v = $("#publicTimeDateStr").datebox("getValue");

    var $form = $("#mform");
    var datas = $form.serializeObject();

    if (type == 'Multiple') {

        if (confirm("是否保存？")) {
            var idArr = param.pkid.split(",");
            $.each(idArr, function (index, obj) {
                datas = $.extend(datas, {FunctionCode: 'TD_JC_TIMER_PUBLISH', publicTimeDateStr: v, pkid: obj});
                InitFuncCodeRequest_({
                    data: datas, successCallBack: function (jdata) {
                        if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                            param.OWindow.MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                            CloseWindowIframe();
                        } else {
                            MsgAlert({content: jdata.msg ? jdata.msg : jdata.data, type: 'error'});
                        }
                    }
                });
            })

        }
    } else {
        datas = $.extend(datas, {FunctionCode: 'TD_JC_TIMER_PUBLISH', publicTimeDateStr: v, pkid: param.pkid});
        if (confirm("是否保存？")) {
            InitFuncCodeRequest_({
                data: datas, successCallBack: function (jdata) {
                    if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                        param.OWindow.MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                        if (param.OWindow.onSearch_) {
                            param.OWindow.onSearch_('dg1', '#ffSearch');
                        }
                        CloseWindowIframe();
                    } else {
                        MsgAlert({content: jdata.msg ? jdata.msg : jdata.data, type: 'error'});
                    }
                }
            });
        }
    }

}
