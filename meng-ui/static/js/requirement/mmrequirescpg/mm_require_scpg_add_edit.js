var isEdit_;
var param = {};
var partNo;

function i18nCallBack() {
    param = getParentParam_();
    isEdit_ = param && param.REQUIRE_NO;

    $("#finalPartNumber").MyComboGrid({
        idField: 'VALUE',  //实际选择值
        textField: 'VALUE', //文本显示值
        width: 90,
        params: {FunctionCode: 'MM_PARTNUMBER_JIANHAO'},
        columns: [[
            {field: 'VALUE', title: '物料号', width: 60, sortable: true},
            {field: 'TEXT', title: '中文描述', width: 60, sortable: true}
        ]],
        onSelect: function (data, row) {
            console.log(row);
            partNoQty();
            $('#finalRequireUnit').combobox({editable: true, onlyview: false, required: true, value: row.BASE_UNIT});
        }
    });

    InitFuncCodeRequest_({
        data: {
            domainCode: 'USER_NAME,PM_SITE_CODE,PM_MT_MODE,MM_SOURCE_TYPE,MM_PROCESS_MARK,PM_MAINTENANCE_BASE_NO,MM_DIC_PART_ATTR,MM_DIC_BASE_UNIT,MM_REQUIRE_LEVEL,MM_PROCESS_METHOD',
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                $('#sourceType').combobox({
                    panelHeight: 150,
                    data: jdata.data.MM_SOURCE_TYPE,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });

                $('#applyMan').combobox({
                    panelHeight: 150,
                    data: jdata.data.USER_NAME,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });


                $('#processMark').combobox({
                    panelHeight: '100px',
                    data: jdata.data.MM_PROCESS_MARK,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    onSelect: function () {
                        if ($(this).combobox('getValue') == 'MZ' || $(this).combobox('getValue') == 'CLOSE') {
                            $('#kcQty').numberbox({editable: false, onlyview: true, value: ''});
                        } else {
                            partNoQty();
                        }
                    }
                });

                $('#finalRequireUnit').combobox({
                    panelHeight: '100px',
                    data: jdata.data.MM_DIC_BASE_UNIT,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });

                $('#materialType').combobox({
                    panelHeight: '150px',
                    data: jdata.data.MM_DIC_PART_ATTR,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });

                $('#requireUnit').combobox({
                    panelHeight: '100px',
                    data: jdata.data.MM_DIC_BASE_UNIT,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });

                $('#requireLevel').combobox({
                    panelHeight: '100px',
                    data: jdata.data.MM_REQUIRE_LEVEL,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });

                $('#processMethod').combobox({
                    panelHeight: '100px',
                    data: jdata.data.MM_PROCESS_METHOD,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });

                $('#maintenanceBaseName').combobox({
                    panelHeight: '100px',
                    data: jdata.data.PM_MAINTENANCE_BASE_NO,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                $('#mtMode').combobox({
                    panelHeight: '100px',
                    data: jdata.data.PM_MT_MODE,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                $('#maintenanceStationName').combobox({
                    panelHeight: '100px',
                    data: jdata.data.PM_SITE_CODE,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });


            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });

    //初始化表单
    InitFuncCodeRequest_({
        async: false,
        data: {requireNo: param.REQUIRE_NO, FunctionCode: "MM_REQUIRE_SCPG_GET"},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                ParseFormField_(jdata.data, null, Constant.CAMEL_CASE);
                $('#partNo').combobox({editable: false, onlyview: true, value: jdata.data.PART_NO});
                partNo = jdata.data.PART_NO;
                $('#processMark').combobox({value: jdata.data.PROCESS_MARK});
                $('#processMethod').combobox({value: jdata.data.PROCESS_METHOD});
                $('#materialType').combobox({editable: false, onlyview: true, value: jdata.data.MATERIAL_TYPE});
                $('#requireLevel').combobox({editable: false, onlyview: true, value: jdata.data.REQUIRE_LEVEL});
                $('#processMark').combobox({value: jdata.data.PROCESS_MARK});
                $('#maintenanceBaseName').combobox({
                    editable: false,
                    onlyview: true,
                    value: jdata.data.MAINTENANCE_BASE_NAME
                });
                $('#requireUnit').combobox({editable: false, onlyview: true, value: jdata.data.REQUIRE_UNIT});
                $('#sourceType').combobox({editable: false, onlyview: true, value: jdata.data.SOURCE_TYPE});
                $('#requireDeadline').datebox({value: jdata.data.REQUIRE_DEADLINE});
                $('#requireGetreadyDate').datebox({value: jdata.data.REQUIRE_GETREADY_DATE});
                $('#applyDate').datebox({value: jdata.data.APPLY_DATE});
                $('#applyMan').combobox({value: jdata.data.APPLY_MAN});
                $('#confirmDate').datebox({value: jdata.data.CONFIRM_DATE});
                $('#mtMode').combobox({value: jdata.data.MT_MODE});
                $("#inputDate").datetimebox({value: formatterDate(new Date())});
                $("#inputer").textbox({value: getLoginInfo().userName});
                if (jdata.data.JS_MARK == 'Y') {
                    $(':checkbox[name=jsj]').prop('checked', true);
                    $('#jsMark').val('Y');
                }
                if (jdata.data.POOLING_MARK == 'Y') {
                    $(':checkbox[name=gxj]').prop('checked', true);
                    $('#poolingMark').val('Y');
                }
                if (jdata.data.AG_MARK == 'Y') {
                    $(':checkbox[name=xyj]').prop('checked', true);
                    $('#agMark').val('Y');
                }
                if (jdata.data.FINAL_PART_NUMBER) {
                    $('#finalPartNumber').combogrid('setValue', jdata.data.FINAL_PART_NUMBER);
                } else {
                    $('#finalPartNumber').combogrid('setValue', jdata.data.PART_NO);
                }

                if (jdata.data.FINAL_REQUIRE_UNIT) {
                    $('#finalRequireUnit').combobox({value: jdata.data.FINAL_REQUIRE_UNIT});
                } else {
                    $('#finalRequireUnit').combobox({value: jdata.data.REQUIRE_UNIT});
                }
                partNoQty();
                InitEditForm_();
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
    InitFuncCodeRequest_({
        async: false,
        data: {partNo: partNo, FunctionCode: "MM_REQUIRE_SCPG_GET_PARTID"},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                var partId = jdata.data.PART_ID;
                InitFuncCodeRequest_({
                    async: false,
                    data: {partId: partId, FunctionCode: "MM_REQUIRE_SCPG_GET_PARTNO"},
                    successCallBack: function (jdata) {
                        if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                            var replacePartNo = "";
                            var arr = jdata.data;
                            for (j = 0; j < arr.length; j++) {
                                replacePartNo += arr[j].PART_NO + ";";
                            }
                            $('#replacePartNo').combobox({value: replacePartNo});
                        } else {
                            MsgAlert({content: jdata.msg, type: 'error'});
                        }
                    }
                });

            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });

    //不可编辑部分生产维修需求评估反馈管理
    disableEditForm_();
    $('#applyMan').combobox({editable: true, onlyview: false});
}

//提交表单
function InitEditForm_() {
    var $form = $("#mform");
    $form.form({
        onSubmit: function () {
            var isValidate = $(this).form('validate');
            if (!isValidate) {
                return false;
            }
            var data = $form.serializeObject();
            data = $.extend({}, data, {FunctionCode: 'MM_REQUIRE_SCPG_EVALUE'});
            InitFuncCodeRequest_({
                data: data,
                successCallBack: function (jdata) {
                    if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                        param.OWindow.reload_();
                        MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
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

//不可编辑部分生产维修需求评估反馈管理
function disableEditForm_() {
    $("* tr[item]").each(function (k, item) {
        $(item).find("input[textboxname]").each(function () {
            if ($(this).hasClass("combobox-f")) {
                $(this).combobox({editable: false, onlyview: true, required: false});
            } else if ($(this).hasClass("datetimebox-f")) {
                $(this).datetimebox({editable: false, onlyview: true, required: false});
            } else {
                $(this).textbox({editable: false, onlyview: true, required: false});
            }
        });
    });
}

//关闭按钮
function closeAdd() {
    $.messager.confirm('', '是否保存', function (r) {
        if (r) {
            $("#mform").submit();
        } else {
            CloseWindowIframe();
            param.OWindow.reload_();
        }
    });
}

/**
 * 查询该件号的库存可用数量并减去已经评估确认但没有发料的数量，即库存数量减去生产预留数量,
 * 只有在需求状态为‘不满足’时才显示，如果状态是‘满足’、‘关闭’等状态则不显示数值；
 */
function partNoQty() {
//            checkFinalPartNumber();//检查是否是互换件号
    var finalPartNumber = $('#finalPartNumber').combogrid('getValue');
    var processMark = $('#processMark').combobox('getValue');
    var requireNo = $('#requireNo').textbox('getValue');
    InitFuncCodeRequest_({
        data: {finalPartNumber: finalPartNumber, requireNo: requireNo, FunctionCode: "MM_REQUIRE_SCPG_QTY"},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                var storeQty = 0;
                var evaluateQty = 0;
                if (jdata.data.INVENTORY_USE_QTY) {
                    storeQty = jdata.data.INVENTORY_USE_QTY.data == null ? 0 : jdata.data.INVENTORY_USE_QTY.data.STORE_QTY;
                }
                if (jdata.data.EVALUATE_CONFIRM_QTY) {
                    evaluateQty = jdata.data.EVALUATE_CONFIRM_QTY.data == null ? 0 : jdata.data.EVALUATE_CONFIRM_QTY.data.FINAL_REQUIRE_QTY;
                }
                if (storeQty != 0) {
                    $('#kcQty').numberbox({editable: false, onlyview: true, value: storeQty - evaluateQty});
                } else {
                    $('#kcQty').numberbox({editable: false, onlyview: true, value: ''});
                }

                if (processMark == 'MZ' || processMark == 'CLOSE') {
                    $('#kcQty').numberbox({editable: false, onlyview: true, value: ''});
                }
            }
        }
    });
}

//确认件号必须是互换件号，否则不允许输入
function checkFinalPartNumber() {
    var finalPartNumber = $('#finalPartNumber').combogrid('getValue');
    InitFuncCodeRequest_({
        data: {partNo: finalPartNumber, FunctionCode: "MM_CHECK_PART_NO"},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                if (jdata.data.COUNT == 0) {
                    MsgAlert({content: '确认件号不存在互换关系，不允许输入', type: 'error'});
                    $('#finalPartNumber').combogrid({value: ''});
                }
                /*else{
                                            $('#finalPartNumber').combobox({value: jdata.data.PART_NO});
                                        }*/
            }
        }
    });
}

//锁定按钮
function lockAdd() {

    var $form = $("#mform");
    var data = toUnderlineCase($form.serializeObject());

    var rowData = [];
    rowData.push(data);

    console.log(rowData);

    ShowWindowIframe({
        identity: "dg",
        isEdit: 1,
        width: 700,
        height: 250,
        title: $.i18n.t('锁定'),
        param: {data: {rowData}},
        url: "/views/mm/requirement/mmrequirescpg/mm_require_scpg_lock.shtml"
    });

}



