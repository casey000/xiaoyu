var PAGE_DATA = {};
var param;
var model;
var companyCode;
var appType;
var jcNo;
var jcType;

function i18nCallBack() {
    param = getParentParam_();
    jcNo = param.jcNo;
    model = param.model;
    companyCode = param.companyCode;
    appType = param.appType;
    jcType = param.jcType;

    //绑定回车查询事件
    bindFormonSearch_('#ffSearch', function () {
        searchData();
    });
    InitFuncCodeRequest_({
        data: {
            domainCode: "TD_JC_APP_TYPE,DA_FLEET,DA_ENG_TYPE,TD_JC_APPENDIX_TYPE,TD_JC_APPENDIX_IF_APL,TD_JC_SMJC_WRITER",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                //附录类型
                $('#appendType').combobox({
                    panelHeight: '140px',
                    data: jdata.data.TD_JC_APPENDIX_TYPE,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                //是否适用
                $('#appendState').combobox({
                    panelHeight: '50px',
                    data: jdata.data.TD_JC_APPENDIX_IF_APL,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                //适用类型
                PAGE_DATA['appendixAppType'] = DomainCodeToMap_(jdata.data["TD_JC_APP_TYPE"]);
                //附录类型
                PAGE_DATA['appendType'] = DomainCodeToMap_(jdata.data["TD_JC_APPENDIX_TYPE"]);
                //是否适用
                PAGE_DATA['appendState'] = DomainCodeToMap_(jdata.data["TD_JC_APPENDIX_IF_APL"]);
                //修改人
                PAGE_DATA['writer'] = DomainCodeToMap_(jdata.data["TD_JC_SMJC_WRITER"]);
                if ("EOJC" == jcType || "EAJC" == jcType) { //EOJC,EAJC不能选择附加内容
                    InitDataGrid1();
                } else {
                    InitDataGrid();//除EOJC,EAJC外，其他JC均可选择附加内容
                }
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

function InitDataGrid() {
    $("#dg").MyDataGrid({
        identity: 'dg',
        sortable: true,
        singleSelect: true,
        pageSize: 15,
        queryParams: {
            jcNo: jcNo,
            companyCode: companyCode,
            model: model,
            appType: appType
        },
        columns: {
            param: {FunctionCode: 'TD_JC_CHOOSE_APPENDIX'},
            alter: {
                APP_TYPE: {
                    formatter: function (value) {
                        return PAGE_DATA['appendixAppType'][value];
                    }
                },
                APPEND_TYPE: {
                    formatter: function (value) {
                        return PAGE_DATA['appendType'][value];
                    }
                },
                APPEND_STATE: {
                    formatter: function (value) {
                        return PAGE_DATA['appendState'][value];
                    }
                },
                MODIFY_BY: {
                    formatter: function (value) {
                        return PAGE_DATA['writer'][value];
                    }
                }
            }
        }
    });
}

function InitDataGrid1() {
    $("#dg").MyDataGrid({
        identity: 'dg',
        sortable: true,
        singleSelect: true,
        pageSize: 15,
        queryParams: {
            jcNo: jcNo,
            companyCode: companyCode,
            model: model,
            appType: appType
        },
        columns: {
            param: {FunctionCode: 'TD_JC_CHOOSE_APPENDIX_NO_APPEN_CONTENT'},
            alter: {
                APP_TYPE: {
                    formatter: function (value) {
                        return PAGE_DATA['appendixAppType'][value];
                    }
                },
                APPEND_TYPE: {
                    formatter: function (value) {
                        return PAGE_DATA['appendType'][value];
                    }
                },
                APPEND_STATE: {
                    formatter: function (value) {
                        return PAGE_DATA['appendState'][value];
                    }
                },
                MODIFY_BY: {
                    formatter: function (value) {
                        return PAGE_DATA['writer'][value];
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

//添加附加内容
function addAppendixToJc() {
    var rowData = $('#dg').datagrid('getChecked');
    if (rowData.length == 0) {
        MsgAlert({content: '请至少选择一行数据', type: 'error'});
        return false;
    }
    var detailData = JSON.stringify(rowData);
    InitFuncCodeRequest_({
        data: {
            detailData: detailData,
            jcNo: jcNo,
            FunctionCode: 'TD_JC_ADD_APPENDIX'
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                param.OWindow.reloadRelateAppendix();
                CloseWindowIframe();
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });

}