var PAGE_DATA = {};
var param;
var jcPkid;
var fleet;
var checkout;
var cepFilePath;
var refType;
var refData;
var companyCode;

function i18nCallBack() {
    param = getParentParam_();
    jcPkid = param.pkid;
    fleet = param.fleet;
    companyCode = param.companyCode;

    //绑定回车查询事件
    bindFormonSearch_('#ffSearch', function () {
        searchData();
    });

    InitFuncCodeRequest_({
        data: {
            domainCode: "TD_JC_RM_TYPE",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            $("#manualType").combobox({
                panelHeight: '120px',
                data: jdata.data.TD_JC_RM_TYPE,
                valueField: 'VALUE',
                textField: 'TEXT'
            });
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                InitDataGrid();
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

function InitDataGrid() {
    var taskCode = $("#taskCode").textbox('getValue');
    var manualType = $("#manualType").combobox('getValue');
    $("#dg").MyDataGrid({
        identity: 'dg',
        sortable: true,
        singleSelect: true,
        pageSize: 15,
        queryParams: {
            fleet: fleet,
            companyCode: companyCode,
            jcPkid: jcPkid,
            taskCode: taskCode,
            manualType: manualType
        },
        columns: {
            param: {FunctionCode: 'TD_SELECT_RELATE_MANUAL'}
        }
    });
}

//刷新
function reload_() {
    $("#dg").datagrid("reload");
}

//查询
function searchData() {
    // var manualType = $("#manualType").combobox('getValue');
    // if (manualType == null || manualType == undefined || manualType == '') {
    //     MsgAlert({content: "请先选择手册类型，再进行查询！", type: 'warn'});
    //     return;
    // }
    InitDataGrid();
}

//重置
function doClear_() {
    $("#ffSearch").form('clear');
    searchData();
}

function addRelateManualToDB() {
    var rowData = $('#dg').datagrid('getChecked');
    if (rowData.length == 0) {
        MsgAlert({content: '请至少选择一行数据', type: 'error'});
        return false;
    }
    var detailData = JSON.stringify(rowData);
    InitFuncCodeRequest_({
        data: {
            jcPkid: jcPkid,
            detailData: detailData,
            FunctionCode: 'TD_RELATE_MANUAL_ADD'
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                if (param.OWindow && typeof param.OWindow.reloadRelateManual == 'function') {
                    param.OWindow.reloadRelateManual();
                }
                CloseWindowIframe();
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });

}