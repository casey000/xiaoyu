/*
 * Copyright 2019 SF Airlines Co., Ltd. All rights reserved.
 * 本文件仅限于顺丰航空有限公司内部传阅，禁止外泄以及用于其他的商业目的。
 */
var param;
var operation;
var PAGE_DATA = {};

function i18nCallBack() {
    param = getParentParam_();
    // operation = param.operation;
    // setFlightInfo(param);
    InitFuncCodeRequest_({
        data: {
            domainCode: "FLB_WORK_TYPE",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code === RESULT_CODE.SUCCESS_CODE) {
                PAGE_DATA['workType'] = DomainCodeToMap_(jdata.data["FLB_WORK_TYPE"]);

                $('#workType').combobox({
                    panelHeight: '50px',
                    data: jdata.data.FLB_WORK_TYPE,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    editable: false, // 是否可编辑
                    multiple: false, //是否可多选
                    require: true, //是否必须
                    onLoadSuccess: function () {
                        $('#workType').combobox('setValue', 'TBFTR')
                    }
                });

            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

//设置航段选择框信息
function setFlightInfo(data) {
    $("#addWo").val(data.flightId);
    $("#fltt").val(data.AC + " " + data.FLIGHT_NO + " " + data.FLIGHT_DATE + " " + data.DEPARTURE + "-" + data.ARRIVAL);
}


/*打开航段选择窗口*/
$('#flbno_seach_btn').click(function () {
    var title_ = $.i18n.t('添加航段滑回任务');
    var currentWidth = (1000).toString();
    var currentHeight = (400).toString();
    ShowWindowIframe({
        width: currentWidth,
        height: currentHeight,
        title: title_,
        param: {currentWidth: currentWidth},
        url: "/views/tbm/flb/select_flight_record.shtml"
    });
});

/*添加航段滑回任务保存按钮*/
function btn_save() {
    var $form_ = $("#addWorkOrderForm");
    var isValidate = $form_.form('validate');

    if (isValidate) {

    } else {

    }

    var datas = $form_.serializeObject();
    datas = $.extend({}, datas, {FunctionCode: 'ADD_WORKORDER'});
    InitFuncCodeRequest_({
        data: datas, successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {

                MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                param.OWindow.searchData();
                CloseWindowIframe();
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}