var PAGE_DATA = {};
var param;
var appendixPkid;
var model;
var companyCode;
var appType;
var appendType;

function i18nCallBack() {
    param = getParentParam_();
    appendixPkid = param.appendixPkid;
    model = param.model;
    companyCode = param.companyCode;
    appType = param.appType;
    appendType = param.appendType;

    //绑定回车查询事件
    bindFormonSearch_('#ffSearch', function () {
        searchData();
    });
    InitFuncCodeRequest_({
        data: {
            domainCode: "TD_JC_APP_TYPE",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                //适用类型
                PAGE_DATA['appType'] = DomainCodeToMap_(jdata.data["TD_JC_APP_TYPE"]);
                if ("APPEN_CONTENT" == appendType) {
                    InitDataGrid1();//附加内容不能选EOJC,EAJC
                } else {
                    InitDataGrid();//附录及风险提示可以选EOJC,EAJC
                }
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

//附录及风险提示可以选EOJC,EAJC
function InitDataGrid() {
    $("#dg").MyDataGrid({
        identity: 'dg',
        sortable: true,
        singleSelect: true,
        pageSize: 15,
        queryParams: {
            appendixPkid: appendixPkid,
            companyCode: companyCode,
            model: model,
            appType: appType
        },
        columns: {
            param: {FunctionCode: 'TD_JC_APPENDIX_CHOOSE_JC'},
            alter: {
                APP_TYPE: {
                    formatter: function (value) {
                        return PAGE_DATA['appType'][value];
                    }
                }
            }
        }
    });
}

//附加内容不能选EOJC,EAJC
function InitDataGrid1() {
    $("#dg").MyDataGrid({
        identity: 'dg',
        sortable: true,
        singleSelect: true,
        pageSize: 15,
        queryParams: {
            appendixPkid: appendixPkid,
            companyCode: companyCode,
            model: model,
            appType: appType
        },
        columns: {
            param: {FunctionCode: 'TD_JC_APPENDIX_CHOOSE_JC_NOEOEA'},
            alter: {
                APP_TYPE: {
                    formatter: function (value) {
                        return PAGE_DATA['appType'][value];
                    }
                }
            }
        }
    });
}

//刷新
function reload_() {
    $("#dg").datagrid("reload");
}

//重置
function doClear_() {
    $("#ffSearch").form('clear');
}

function addRelateJcToAppendix() {
    var rowData = $('#dg').datagrid('getChecked');
    if (rowData.length == 0) {
        MsgAlert({content: '请至少选择一行数据', type: 'error'});
        return false;
    }
    var detailData = JSON.stringify(rowData);
    InitFuncCodeRequest_({
        data: {
            appendixPkid: appendixPkid,
            detailData: detailData,
            FunctionCode: 'TD_JC_APPENDIX_ADD_JC'
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                param.OWindow.reloadAppendixRelateJc();
                CloseWindowIframe();
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });

}