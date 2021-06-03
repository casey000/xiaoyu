var PAGE_DATA = {};
var param;
var pkid;
var diffUrl;
var cepPath;

function i18nCallBack() {
    param = getParentParam_();
    pkid = param.pkid;

    //绑定回车查询事件
    bindFormonSearch_('#ffSearch', function () {
        searchData();
    });

    InitFuncCodeRequest_({
        data: {
            domainCode: "DM_COMPANY_CODE2",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            $("#companycode").combobox({
                panelHeight: '140px',
                data: jdata.data.DM_COMPANY_CODE2,
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
    $("#dg").MyDataGrid({
        identity: 'dg',
        sortable: true,
        singleSelect: true,
        pageSize: 15,
        queryParams: {
            pkid: pkid
        },
        columns: {
            param: {FunctionCode: 'TD_SUPPLEMENT_SELECT_LC_MANUAL'}
        }
    });
}

//刷新
function reload_() {
    $("#dg").datagrid("reload");
}

//查询
function searchData() {
    onSearch_('dg', '#ffSearch');
}

//重置
function doClear_() {
    $("#ffSearch").form('clear');
    searchData();
}

//与上营运人手册对比
function editionDiffMerge() {
    var rowData = getDG('dg').datagrid('getSelected');
    if (rowData.length == 0) {
        MsgAlert({content: '请至少选择一行数据', type: 'error'});
        return false;
    }
    var manualUrl = rowData.MANUAL_FILE_PATH;//firstDoc
    var manualType = rowData.MANUAL_TYPE;//手册类型
    if (confirm("与新手册进行对比会生成一条新工序，是否确定进行对比？")) {
        InitFuncCodeRequest_({
            data: {pkid: pkid, FunctionCode: "TD_JC_SUPPLEMENT_EDITION_DIFF_MERGE"},
            successCallBack: function (jdata) {
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    param.OWindow.reload_();
                    if (jdata.data != null && jdata.data != "") {
                        cepPath = jdata.data;//secondDoc
                    }
                    var firstDoc = manualUrl.replace(/\\/g, "\\\\");
                    var secondDoc = cepPath;
                    ajaxLoading();
                    InitFuncCodeRequest_({
                        data: {pkid: pkid, FunctionCode: "TD_JC_ALL_GET_DIFF_URL"},
                        successCallBack: function (jdata) {
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                param.OWindow.reload_();
                                if (jdata.data != null && jdata.data != "") {
                                    diffURL = jdata.data;
                                }
                                ajaxLoading();
                                InitFuncCodeRequest_({
                                    data: {
                                        pkid: pkid,
                                        oemId: rowData.PKID,
                                        FunctionCode: "TD_JC_SUPPLEMENT_DIFF_CONVERT"
                                    },
                                    successCallBack: function (jdata) {
                                        ajaxLoadEnd();
                                        if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                            var transferOemManualPath = jdata.data;
                                            window.open(diffURL + "/diff/diff-ui/index.html?difffirstdoc=" + transferOemManualPath + "&diffseconddoc=" + secondDoc);
                                        } else {
                                            MsgAlert({content: jdata.msg, type: 'error'});
                                        }
                                    }
                                })
                            } else {
                                MsgAlert({content: jdata.msg, type: 'error'});
                            }
                        }
                    });
                }
            }
        });
    }
}