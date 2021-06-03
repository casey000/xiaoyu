var PAGE_DATA = {};
var param;
var jcPkid;
var diffUrl;
var cepCheckout;
var cepPath;

function i18nCallBack() {
    param = getParentParam_();
    jcPkid = param.jcPkid;
    cepCheckout = param.cepCheckout;

    //绑定回车查询事件
    bindFormonSearch_('#ffSearch', function () {
        searchData();
    });

    InitFuncCodeRequest_({
        data: {
            domainCode: "DA_FLEET",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            $("#fleet").combobox({
                panelHeight: '140px',
                data: jdata.data.DA_FLEET,
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
            jcPkid: jcPkid
        },
        columns: {
            param: {FunctionCode: 'TD_SELECT_LATEST_MANUAL'}
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

//与新手册对比
function editionDiffMerge() {
    var rowData = getDG('dg').datagrid('getSelected');
    if (rowData.length == 0) {
        MsgAlert({content: '请至少选择一行数据', type: 'error'});
        return false;
    }
    var manualUrl = rowData.MANUAL_FILE_PATH;//firstDoc
    var manualType = rowData.MANUAL_TYPE;//手册类型
    if (confirm("与新手册对比会生成一条新的工序，是否确定进行对比？")) {
        if (cepCheckout == 'N') {
            InitFuncCodeRequest_({
                data: {pkid: jcPkid, FunctionCode: "TD_JC_ALL_SMJC_EDITION_DIFF_MERGE"},
                successCallBack: function (jdata) {
                    if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                        param.OWindow.reload_();
                        param.OWindow.param.OWindow.param.OWindow.reload_();
                        if (jdata.data != null && jdata.data != "") {
                            cepPath = jdata.data;//secondDoc
                        }
                        var firstDoc = manualUrl.replace(/\\/g, "\\\\");
                        var secondDoc = cepPath;
                        ajaxLoading();
                        InitFuncCodeRequest_({
                            data: {pkid: jcPkid, FunctionCode: "TD_JC_ALL_GET_DIFF_URL"},
                            successCallBack: function (jdata) {
                                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                    param.OWindow.reload_();
                                    if (jdata.data != null && jdata.data != "") {
                                        diffURL = jdata.data;
                                        // window.open(diffURL + "/diff/diff-ui/index.html?difffirstdoc=" + firstDoc + "&diffseconddoc=" + secondDoc);
                                    }
                                    ajaxLoading();
                                    InitFuncCodeRequest_({
                                        data: {
                                            firstFilePath: firstDoc,
                                            secondFilePath: secondDoc,
                                            manualType: manualType,
                                            jcPkid: jcPkid,
                                            FunctionCode: "TD_JC_ALL_MANUAL_DIFF_CONVERT"
                                        },
                                        successCallBack: function (jdata) {
                                            ajaxLoadEnd();
                                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                                var manualToJcPath = jdata.data;
                                                window.open(diffURL + "/diff/diff-ui/index.html?difffirstdoc=" + manualToJcPath + "&diffseconddoc=" + secondDoc);
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
            });
        } else {
            MsgAlert({content: "此工卡已检出！！", type: 'error'});
        }

    }
}