var param;
var pkid;
var jcPkid;
var operation;
var PAGE_DATA = {};
var selectRow;
var ifDataForm = false;

function i18nCallBack() {
    param = getParentParam_();
    pkid = param.pkid;
    jcPkid = param.jcPkid;
    operation = param.operation;
    InitFuncCodeRequest_({
        data: {
            domainCode: "TD_JC_MATER_SORT,TD_JC_MATER_TYPE,TD_JC_MAT_IMPORT,TD_JC_MATER_UNIT,YESORNO,TD_JC_MATER_MA_UNS_UNIT,TD_JC_MATER_TOOL_UNIT,QUANTITY_IF_DEMAND",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                //航材工具
                $('#materSort').combobox({
                    panelHeight: '70px',
                    data: jdata.data.TD_JC_MATER_SORT,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    onSelect: function (item) {
                        if (item.VALUE == 'UNSPECIFIC') { //无指定
                            // $("#pn").combogrid({editable: false, onlyview: true});
                            // $("#pn").combogrid('setValue', 'No Specific');
                            $("#choosePn").hide();
                            $("#pn").textbox('setValue', 'No Specific');
                            $("#pn").textbox({editable: false, onlyview: true});
                            $("#pnName").textbox('setValue', '');
                            $("#replacePn").textbox('setValue', '');
                            $("#unit").combobox({editable: true});
                            MsgAlert({content: "无件号航材将不参与MR推送!!!", type: 'warn'});
                        } else { //航材 OR 工具/设备
                            var pnValue = $("#pn").textbox('getValue');
                            if (item.VALUE == 'MA') { //航材
                                $("#choosePn").show();
                                if (pnValue == null || pnValue == undefined || pnValue == '') {
                                    $("#pn").textbox({editable: false, required: true});
                                    $("#unit").combobox({editable: false, required: true})
                                } else if (pnValue == 'No Specific') {
                                    $("#pn").textbox({editable: false, required: true});
                                    $("#pn").textbox('setValue', '');
                                    $("#unit").combobox({editable: false, required: true})
                                } else {
                                    $("#pn").textbox({editable: false, required: true});
                                    $("#pn").textbox('setValue', pnValue);
                                    $("#unit").combobox({editable: false, required: true})
                                }
                            } else { //工具/设备
                                $("#choosePn").show();
                                if (pnValue == null || pnValue == undefined || pnValue == '') {
                                    $("#pn").textbox({editable: true, required: false, onlyview: false});
                                    $("#unit").combobox({editable: true, required: true})
                                } else if (pnValue == 'No Specific') {
                                    $("#pn").textbox({editable: true, onlyview: false});
                                    $("#pn").textbox('setValue', '');
                                    $("#unit").combobox({editable: true, required: true})
                                } else {
                                    $("#pn").textbox({editable: true, required: false});
                                    $("#pn").textbox('setValue', pnValue);
                                    $("#unit").combobox({editable: true, required: true})
                                }
                            }
                            if ("No Specific" == pnValue && item.VALUE == "MA") {
                                $("#pn").textbox({value: '', required: true, editable: false, onlyview: false});
                            } else if ("No Specific" == pnValue && item.VALUE == "TEORDEVICE") {
                                $("#pn").textbox({value: '', required: false, editable: true, onlyview: false});
                            }
                        }
                        if (item.VALUE == 'MA' || item.VALUE == 'UNSPECIFIC') {
                            $('#unit').combobox({
                                panelHeight: '100px',
                                data: jdata.data.TD_JC_MATER_MA_UNS_UNIT,
                                valueField: 'VALUE',
                                textField: 'TEXT'
                            })
                        } else {
                            $('#unit').combobox({
                                panelHeight: '100px',
                                data: jdata.data.TD_JC_MATER_TOOL_UNIT,
                                valueField: 'VALUE',
                                textField: 'TEXT'
                            })
                        }
                    }

                });
                //航次与无指定单位 TD_JC_MATER_MA_UNS_UNIT
                //工具与设备单位 TD_JC_MATER_TOOL_UNIT
                //单位
                $('#unit').combobox({
                    panelHeight: '100px',
                    data: jdata.data.TD_JC_MATER_MA_UNS_UNIT,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
            }

            if (operation == "edit" || operation == "view") {
                InitDataForm(param.pkid);
                if (operation == "view") {
                    $('#saveBtn').hide();
                }
            }
        }
    })
}

function InitDataForm(pkid) {
    InitFuncCodeRequest_({
        data: {pkid: pkid, FunctionCode: "TD_JC_MATER_BY_PKID"}, successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                $("#pkid").val(jdata.data.PKID);
                ParseFormField_(jdata.data, $("#mform"), Constant.CAMEL_CASE);
                $('#materSort').combobox({value: jdata.data.MATER_SORT});
                $('#unit').combobox({value: jdata.data.UNIT});
                ifDataForm = false;

                if ("TEORDEVICE" == jdata.data.MATER_SORT) {
                    $("#choosePn").show();
                    $("#pn").textbox({editable: true, onlyview: false});
                } else if ("MA" == jdata.data.MATER_SORT) {
                    $("#choosePn").show();
                    $("#pn").textbox({editable: false, onlyview: false});
                } else {
                    $("#choosePn").hide();
                    $("#pn").textbox({editable: false, onlyview: true});
                }

            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
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
    datas = $.extend(datas, {FunctionCode: 'TD_CMJC_MATER_ADD', operation: operation, jcPkid: jcPkid});
    InitFuncCodeRequest_({
        data: datas, successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                param.OWindow.MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                if (param.OWindow && typeof param.OWindow.reloadMaterAndTool == 'function') {
                    param.OWindow.reloadMaterAndTool();
                }
                CloseWindowIframe();
            } else {
                MsgAlert({content: jdata.msg ? jdata.msg : jdata.data, type: 'error'});
            }
        }
    });
}

//航材适用性选择
function searchMaterList() {
    if (fleet == "A320" || fleet == "A330") {
        return;
    }

    var title_ = $.i18n.t('航材适用性');
    ShowWindowIframe({
        width: "550",
        height: "350",
        title: title_,
        param: {fleet: param.fleet, acno: $("#materHidden").val()},
        url: "/views/td/jobcard/mater/tdJcMaterEffect.shtml"
    });
}


function setMaterValues(ids, name) {
    $("#materHidden").val(ids);
    $("#effectStr").textbox({value: name});
}

function switchUnit(materSoft) {
    if (materSoft == 'MA' || materSoft == 'UNSPECIFIC') {
        $('#unit').combobox({
            panelHeight: '100px',
            data: TD_JC_MATER_MA_UNS_UNIT,
            valueField: 'VALUE',
            textField: 'TEXT'
        })
    } else {
        $('#unit').combobox({
            panelHeight: '100px',
            data: TD_JC_MATER_TOOL_UNIT,
            valueField: 'VALUE',
            textField: 'TEXT'
        })
    }
}

//从件号主数据中选取件号
function choosePnData() {
    var title_ = $.i18n.t('件号主数据');
    ShowWindowIframe({
        width: "800",
        height: "350",
        title: title_,
        url: "/views/td/jobcard/smjc/smjcedit/pnMainDataSearch.shtml"
    });
}

//回填件号，替代件号，与件号名称
function backfillPnInfo(pnNo, replacePn, pnName, unit) {
    $("#pn").textbox('setValue', pnNo);
    $("#replacePn").textbox('setValue', replacePn);
    $("#pnName").textbox('setValue', pnName);
    $("#unit").combobox('setValue', unit);
}