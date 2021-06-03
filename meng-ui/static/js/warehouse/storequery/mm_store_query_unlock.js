var param = '';

function i18nCallBack() {

    param = getParentParam_();
    console.log(param.PKID);
    InitEditForm_();
}


function InitEditForm_() {
    var $form = $("#mform");
    $form.form({
        onSubmit: function () {
            var isValidate = $(this).form('validate');
            if (!isValidate) {
                return false;
            }
            var data = $form.serializeObject();


            data["pkid"] = param.PKID;
            data = $.extend({}, data, {
                FunctionCode: ('MM_INVENTORY_UNLOCK_ADD')
            });

            InitFuncCodeRequest_({
                data: data,
                successCallBack: function (jdata) {
                    if (jdata.code == RESULT_CODE.SUCCESS_CODE) {

                        param.OWindow.reload();
                        param.OWindow.MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                        CloseWindowIframe();
                    } else {
                        MsgAlert({content: jdata.msg, type: 'error'});
                    }
                }
            });
            return false;
        }
    });
}


function reload_dg() {
    $("#dg").datagrid("reload");
    param.OWindow.reload_();
}

function reload_dg1() {
    $("#dg1").datagrid("reload");
    param.OWindow.reload_();
}
