var param = '';

function i18nCallBack() {

    param = getParentParam_();
    console.log(param.PKID)

    InitFuncCodeRequest_({

        data: {
            domainCode: "USER_NAME",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {

                $('#lockMan').combobox({
                    data: jdata.data['USER_NAME'],
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });

                $("#partNo").MyComboGrid({
                    idField: 'TEXT',  //实际选择值
                    textField: 'TEXT', //文本显示值
                    width: 150,
                    params: {FunctionCode: 'MM_PN_ID'},
                    columns: [[
                        {field: 'TEXT', title: '物料号', width: 60, sortable: true}
                    ]]
                });

                $('#partNo').combogrid({value: param.data.rowdata.PART_NO});

                $('#unit').textbox({value: param.data.rowdata.STORE_UNIT});

                $('#lockMan').combobox('setValue', getLoginInfo().userId);

                $('#lockDate').datebox({value: formatterDate(new Date())});

            }
            else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });


    // InitFuncCodeRequest_({
    //     async: false,
    //     data: {pkid: param.PKID, FunctionCode: "PM_NODE_GET_ONE"},
    //     successCallBack: function (jdata) {
    //         if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
    //             $('#node1').textbox({value: jdata.data.NODE});
    //         }
    //     }
    // });
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
                FunctionCode: ('MM_INVENTORY_LOCK_ADD')
            });

            InitFuncCodeRequest_({
                data: data,
                successCallBack: function (jdata) {
                    if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                        CloseWindowIframe();
                        param.OWindow.reload_();
                        param.OWindow.MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});

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
