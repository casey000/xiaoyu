var PAGE_DATA = {};
var param;
var jcPkid;
var fleet;
var checkout;
var cepFilePath;
var refType;
var refData;
var jobcardVer;
var pageCount;

function i18nCallBack() {
    param = getParentParam_();
    jcPkid = param.jcpkid;
    fleet = param.fleet;
    checkout = param.checkout;
    cepFilePath = param.cepfilepath;
    refType = param.reftype;
    refData = param.refdata;
    jobcardVer = param.jobcardver;
    pageCount = param.pageCounter;

    //检查当前参考资料是否为container，如果为container通过后台解析后返回 一个或多个proced 参考资料
    var refDatas = checkRefData(refData);
    if (refDatas != null && checkRefData != "") {
        refData = refDatas;
    }
    $("#refData").textbox({value: refData});
    $("#fleet").textbox({value: fleet});
    //绑定回车查询事件
    bindFormonSearch_('#ffSearch', function () {
        searchData();
    });

    InitFuncCodeRequest_({
        data: {
            domainCode: "TD_TRANS_STATUS",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                InitDataGrid();
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

//解析参考资料
function checkRefData(refData) {
    var result = -1;
    ajaxLoading();
    InitFuncCodeRequest_({
        data: {pkid: jcPkid, refData: refData, FunctionCode: 'TD_JC_NRCJC_CHECKREFDATA'},
        async: false,
        successCallBack: function (jdata) {
            ajaxLoadEnd();
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                if (jdata.data == null || jdata.data == "" || jdata.data.length == 0) {
                    result = null;
                } else {
                    result = jdata.data;
                }
            }
        }
    });
    return result;
}

function InitDataGrid() {
    $("#dg").MyDataGrid({
        identity: 'dg',
        sortable: true,
        singleSelect: true,
        pageSize: 15,
        queryParams: {fleet: fleet, refData: refData, jobcardVer: jobcardVer},
        columns: {
            param: {FunctionCode: 'TD_SELECT_TASK_LIST'}
            // alter: {
            // TRANS_STATUS: {
            //     formatter: function (value, row, index) {
            //         if (value == '翻译中') {
            //             return '<a href="javascript:translateManual(\'' + row.PKID + '\');" class="attach">' + value + '</a>';
            //         } else {
            //             return value;
            //         }
            //     }
            // }
            // }
        }
    });
}

// 手册翻译
function translateManual(pkid) {
    var title_ = $.i18n.t('手册翻译');
    ShowWindowIframe({
        width: "900",
        height: "500",
        title: title_,
        param: {pkid: pkid},
        url: "/views/td/jobcard/nrcjc/tdNrcjcTranslateList.shtml"
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

function manualToJobcard() {
    var rowData = getDG('dg').datagrid('getSelected');
    if (!rowData.PKID) {
        MsgAlert({content: "请选择数据！", type: 'error'});
        return;
    }
    // if (rowData.TRANS_STATUS == "翻译中") {
    //     MsgAlert({content: "只能选择【翻译完成】的MP片段！", type: 'error'});
    //     return;
    // }

    $("#quding").attr("onclick", "");
    ajaxLoading();
    InitFuncCodeRequest_({
        data: {jcPkid: jcPkid, manualFilePath: rowData.MANUAL_FILE_PATH, FunctionCode: 'TD_NRC_JC_TOJOBCARD'},
        successCallBack: function (jdata) {
            ajaxLoadEnd();
            // $("#quding").attr("onclick","manualToJobcard();");
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                var title_ = $.i18n.t('工序编辑详情');
                ShowWindowIframe({
                    width: "900",
                    height: "500",
                    title: title_,
                    param: {jcpkid: jcPkid},
                    url: "/views/td/jobcard/commonjc/TdJcCepEditDetail.shtml"
                });
            } else {
                MsgAlert({content: jdata.data, type: 'error'});
            }
        }
    });

}
