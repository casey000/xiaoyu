var param;
var jcPkid;
var type;
var PAGE_DATA = {};
var fleet;
var selectRow;
var ifDataForm = false;
// var ifClear = false;

function i18nCallBack() {
    param = getParentParam_();
    jcPkid = param.pkid;
    type = param.type;
    fleet = param.fleet;
    console.log(fleet);
    $('#jcPkid').val(param.pkid);
    $("#choosePn").hide();
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
                        clearForm();
                        if (item.VALUE == 'UNSPECIFIC') { //无指定
                            $("#choosePn").hide();
                            $("#pn").textbox('setValue', 'No Specific');
                            $("#pn").textbox({editable: false, onlyview: true});
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
                        //switchUnit(item.VALUE);
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
                //视情
                $('#importance').combobox({
                    panelHeight: '50px',
                    data: jdata.data.TD_JC_MAT_IMPORT,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                //数量按需
                $('#qtyReq').combobox({
                    panelHeight: '50px',
                    data: jdata.data.QUANTITY_IF_DEMAND,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    // onChange: function (newValue, oldValue) {
                    //     setQtyReq(newValue);
                    // }
                });
                // //数量
                // $('#qty').textbox({
                //     onChange: function (newValue, oldValue) {
                //         var qtyReq = $("#qtyReq").combobox('getValue');
                //         if (qtyReq == null || qtyReq == undefined || qtyReq == '') {
                //             MsgAlert({content: "请先选择数量按需，再输入数量！", type: 'error'});
                //             $("#qty").textbox('setValue', '');
                //
                //         }
                //     }
                // });
                //航次与无指定单位 TD_JC_MATER_MA_UNS_UNIT
                //工具与设备单位 TD_JC_MATER_TOOL_UNIT
                //单位
                $('#unit').combobox({
                    panelHeight: '100px',
                    data: jdata.data.TD_JC_MATER_MA_UNS_UNIT,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                    // onChange: function (newValue, oldValue) {
                    //     if (ifDataForm) {
                    //         return;
                    //     }
                    //     // var qtyReq = $("#qtyReq").combobox('getValue');
                    //     var qty = $("#qty").textbox('getValue');
                    //     // if (qtyReq == null || qtyReq == undefined || qtyReq == '') {
                    //     //     MsgAlert({content: "请先选择数量按需，再选择单位！", type: 'error'});
                    //     //     $("#unit").combobox('setValue', '');
                    //     //     return;
                    //     // }
                    //     if (qty == null || qty == undefined || qty == '') {
                    //         MsgAlert({content: "请先输入数量，再选择单位！", type: 'error'});
                    //         $("#unit").combobox('setValue', '');
                    //
                    //     }
                    // }
                });
                //件号
                // $('#pn').MyComboGrid({
                //     idField: 'PART_NO',  //实际选择值
                //     textField: 'PART_NO', //文本显示值
                //     panelHeight: '200px',
                //     // required: true,
                //     params: {FunctionCode: 'GET_PN_FROMMP'},
                //     columns: [[
                //         {field: 'PART_NO', title: '件号', width: 50},
                //         {field: 'PART_NAME', title: '件号名称', width: 50},
                //         {field: 'REPLACE_PN', title: '替代件号', width: 50}
                //     ]],
                //     onSelect: function (index, row) {
                //         selectRow = row;
                //         $("#pnName").textbox('setValue', row.PART_NAME);
                //         $("#replacePn").textbox('setValue', row.REPLACE_PN);
                //     },
                //     onHidePanel: function () {
                //         var t = $(this).combogrid('getValue');
                //         if (t != null && t != '' & t != undefined) {
                //             if (selectRow == null || t != selectRow.PART_NO) {//没有选择或者选项不相等时清除内容
                //                 // if(!ifClear){
                //                 //     return;
                //                 // }
                //                 // alert('请选择，不要直接输入！');
                //                 // $(this).combogrid({value: ''});
                //             }
                //         }
                //     }
                // })
            }

            if (type == "edit" || type == "view") {
                InitDataForm(param.pkid);
                if (type == "view") {
                    $('#saveBtn').hide();
                }
            }

            if ("A320" == fleet || "A330" == fleet) {
                $('#effectStr').textbox({value: '001999'});
            }
        }
    })
}

function InitDataForm(pkid) {
    InitFuncCodeRequest_({
        data: {pkid: pkid, FunctionCode: "TD_JC_MATER_BY_PKID"}, successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                ifDataForm = true;
                ParseFormField_(jdata.data, $("#mform"), Constant.CAMEL_CASE);
                $('#materSort').combobox({value: jdata.data.MATER_SORT});
                /*$('#materType').combobox({value: jdata.data.MATER_TYPE});*/
                $('#importance').combobox({value: jdata.data.IMPORTANCE});
                $('#qtyReq').combobox({value: jdata.data.QTY_REQ});
                $('#unit').combobox({value: jdata.data.UNIT});
                ifDataForm = false;

                if ("A350" == fleet) {
                    InitFuncCodeRequest_({
                        data: {materId: pkid, FunctionCode: "TD_JC_SMJC_GET_MATER_ARR"},
                        successCallBack: function (jdata) {
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                $('#materHidden').val(jdata.data.ACNO);
                            } else {
                                MsgAlert({content: jdata.msg, type: 'error'});
                            }
                        }
                    });
                }

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

                InitFuncCodeRequest_({
                    data: {
                        domainCode: "TD_JC_MATER_MA_UNS_UNIT,TD_JC_MATER_TOOL_UNIT",
                        FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
                    },
                    successCallBack: function (jdata1) {

                        if (jdata1.code == RESULT_CODE.SUCCESS_CODE) {
                            if (jdata.data.MATER_SORT == 'MA' || jdata.data.MATER_SORT == 'UNSPECIFIC') {
                                $('#unit').combobox({
                                    panelHeight: '100px',
                                    data: jdata1.data.TD_JC_MATER_MA_UNS_UNIT,
                                    valueField: 'VALUE',
                                    textField: 'TEXT'
                                })
                            } else {
                                $('#unit').combobox({
                                    panelHeight: '100px',
                                    data: jdata1.data.TD_JC_MATER_TOOL_UNIT,
                                    valueField: 'VALUE',
                                    textField: 'TEXT'
                                })
                            }
                        }

                    }
                })

            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

// function setQtyReq(val) {
//     if (val == 'Y') {
//         $('#qty').textbox({value: '0', required: true, editable: false, onlyview: true});
//         $("#unit").combobox({value: '', required: false, editable: false, onlyview: true});
//     } else {
//         $('#qty').textbox({value: '', required: true, editable: true, onlyview: false});
//         $("#unit").combobox({value: '', required: true, editable: true, onlyview: false});
//     }
// }

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
    var qtyReq = $("#qtyReq").combobox('getValue');//获取数量是否按需
    var qty = $("#qty").textbox('getValue');//数量
    if ("N" == qtyReq) {
        if (qty == 0 || qty == null || qty == undefined || qty == "") {
            MsgAlert({content: "数量非按需，数量不允许为空和0!!", type: 'error'});
            return;
        }
    }
    var $form = $("#mform");
    var datas = $form.serializeObject();
    var acNoArrStr = $("#materHidden").val();
    datas = $.extend({type: type, acNoArrStr: acNoArrStr}, datas, {FunctionCode: 'TD_JC_MATER_ADD'});
    InitFuncCodeRequest_({
        data: datas, successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                if (param.OWindow.reloadMaterAndTool) {
                    param.OWindow.reloadMaterAndTool();
                }
                param.OWindow.MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
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
    var materSort = $("#materSort").combobox('getValue');
    var materType = "";
    if ("MA" == materSort) { //航材
        materType = "NORMAL";
    } else if ("TEORDEVICE" == materSort) { //工具
        materType = "TOOL";
    }
    ShowWindowIframe({
        width: "800",
        height: "350",
        title: title_,
        param: {materType: materType},
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


function clearForm(){
    $('#importance').textbox('setValue','');
    $('#pn').textbox('setValue','');
    $('#replacePn').textbox('setValue','');
    $('#pnName').textbox('setValue','');
    $('#qty').numberbox('setValue','');
    $('#unit').combobox('setValue','');
    $('#qtyReq').combobox('setValue','');
    $('#memo').textbox('setValue','');
}