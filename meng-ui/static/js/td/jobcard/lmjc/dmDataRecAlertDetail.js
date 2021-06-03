var param;
var operation;

//d
function i18nCallBack() {
    param = getParentParam_();
    operation = param.operation;
    InitFuncCodeRequest_({
        data: {
            domainCode: "DM_DATA_TYPE,DA_FLEET",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {

                $('#fleet').combobox({
                    panelHeight: '60px',
                    data: jdata.data.DA_FLEET,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });

                $("#acno").MyComboGrid({
                    panelWidth: 420,
                    width: 482,
                    idField: 'ACNO',  //实际选择值
                    textField: 'ACNO', //文本显示值
                    editable: false,
                    required: true,
                    pagination: true,
                    tipPosition: 'top',
                    mode: 'remote',
                    params: {FunctionCode: 'DA_ACREG_TD_JC_LMJC'},
                    url: Constant.API_URL + 'DA_ACREG_TD_JC_LMJC',
                    multiple: true,
                    columns: [[
                        {field: 'ACNO', title: '机号', width: 100, sortable: true},
                        {field: 'MSN', title: 'MSN号', width: 100, sortable: true},
                        {field: 'LINE_NO', title: 'L_NO', width: 100, sortable: true}
                    ]]
                });
                /*
                                    PAGE_DATA['fleet'] = DomainCodeToMap_(jdata.data["DA_FLEET"]);
                                    PAGE_DATA['dataType'] = DomainCodeToMap_(jdata.data["DM_DATA_TYPE"]);
                                    PAGE_DATA['orgId'] = DomainCodeToMap_(jdata.data["DM_RECEIVE_ORG"]);*/
            }
            //初始化列表
            if (param.pkid) {
                InitDataForm(param.pkid);
            }
        }
    })
}

//查询回填
function InitDataForm(pkid) {
    InitFuncCodeRequest_({
        data: {pkid: pkid, FunctionCode: "TD_JC_LMJC_ACCONFIG_BY_PKID"}, successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                ParseFormField_(jdata.data, $("#mform"), Constant.CAMEL_CASE);
                $('#fleet').combobox({value: jdata.data.FLEET});
                $('#acno').combogrid({value: jdata.data.ACNO});
                $('#fleetGroup').textbox({value: jdata.data.FLEET_GROUP});
                $('#memo').textbox({value: jdata.data.MEMO});
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
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
    var ACNOS = '';


    if (datas.acno && Object.prototype.toString.call(datas.acno) == '[object Array]') {
        $.each(datas.acno, function (k, v) {
            ACNOS += v + ',';
        });
        ACNOS = ACNOS.substring(0, ACNOS.length - 1);
        datas.acno = ACNOS;
    }
    datas = $.extend({acno: ACNOS}, datas, {FunctionCode: 'TD_JC_LMJC_ACCONFIG_ADD'});
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
    /*   //机号重复添加检查1
       InitFuncCodeRequest_({
           data: {acno:ACNOS,FunctionCode: "TD_JC_LMJC_ACCONFIG_CHECK"},
           successCallBack: function (jdata) {
               if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                   if (jdata.data.NUB == 0) {
                       alert(jdata.data.NUB+ACNOS);

                   }
                   else {
                       MsgAlert({content: '该机号组合已经添加!', type: 'error'});
                   }
               }
               else {
                   MsgAlert({content: jdata.msg, type: 'error'});
               }
           }
       });*/
}