var PAGE_DATA = {};
var param;
var jcPkid;
var fleet;
var checkout;
var cepFilePath;
var refType;
var sbNo;
var jcType;

function i18nCallBack() {
    param = getParentParam_();
    jcPkid = param.jcpkid;
    fleet = param.fleet;
    checkout = param.checkout;
    cepFilePath = param.cepfilepath;
    refType = param.reftype;
    sbNo = param.refdata;
    jcType = param.jcType;
    console.log(param);
    $("#sbNo").textbox({value: sbNo});
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

function InitDataGrid() {
    $("#dg").MyDataGrid({
        identity: 'dg',
        sortable: true,
        singleSelect: true,
        pageSize: 15,
        queryParams: {fleet: fleet},
        columns: {
            param: {FunctionCode: 'TD_SELECT_TASK_LIST_FOR_SB'}
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

function cepView(data) {
    param.OWindow.cepView(data);
}

//SB转EO工卡
function manualToJobcard() {
    var rowData = getDG('dg').datagrid('getSelected');
    if (!rowData || !rowData.PKID) {
        MsgAlert({content: "请选择数据！", type: 'error'});
        return;
    }
    MaskUtil.mask("手册转工序中...");
    InitFuncCodeRequest_({
        data: {
            jcPkid: jcPkid,
            manualFilePath: rowData.MANUAL_FILE_PATH,
            manualType: rowData.MANUAL_TYPE,
            oemTaskcode: rowData.OEM_TASKCODE,
            sbNo: rowData.SB_NO,
            sbVer: rowData.OEM_REV,
            FunctionCode: 'TD_JC_SBTOEO'
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                MaskUtil.unmask();
                MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                var title_ = $.i18n.t('工序编辑详情');
                ShowWindowIframe({
                    width: "900",
                    height: "500",
                    title: title_,
                    param: {jcpkid: jcPkid, jcType: jcType},
                    url: "/views/td/jobcard/commonjc/TdJcCepEditDetail.shtml"
                });
            } else {
                MsgAlert({content: jdata.data, type: 'error'});
            }
        }
    });
}