var param;
var pkids = '';

function i18nCallBack() {
    param = getParentParam_();
    $("#approvedBy").MyComboGrid({
        idField: 'ACCOUNT_ID',  //实际选择值
        textField: 'USER_NAME', //文本显示值
        panelHeight: '220px',
        width: 200,
        params: {roleId: param.roleId, FunctionCode: 'FLOW_WORK_ACCOUNT'},
        columns: [[
            {field: 'ACCOUNT_NUMBER', title: '工号', width: 50},
            {field: 'USER_NAME', title: '审批人', width: 50}
        ]]
    });
}

function sure() {
    var isValidate = $("#mform").form('validate');
    if (!isValidate)
        return;

    pkids = param.pkid + '';
    if (pkids.endsWith(",")) {
        pkids = pkids.substring(0, pkids.length - 1);
    }

    var pkArr = pkids.split(",");

    for (var i = 0; i < pkArr.length; i++) {
        if (pkArr[i] != '') {
            InitFuncCodeRequest_({
                data: {
                    pkid: pkArr[i],
                    approvedBy: $("#approvedBy").combogrid("getValue"),
                    FunctionCode: "TD_JC_TOJC_SUBMIT"
                },
                successCallBack: function (jdata) {
                    if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                        if (param.OWindow.onSearch_) {
                            param.OWindow.onSearch_('dg', '#ffSearch');
                        }
                        if (param.OWindow.reload_) {
                            param.OWindow.reload_();
                        }
                        param.OWindow.MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                        CloseWindowIframe();
                    } else {
                        MsgAlert({content: jdata.msg, type: 'error'})
                    }
                }
            });
        }
    }

}