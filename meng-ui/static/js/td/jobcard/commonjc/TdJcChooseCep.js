var PAGE_DATA = {};
var param;
var jcPkid;
var diffUrl;
var cepCheckout;
var cepPath;
var fleet;
var jcType;
var companyCode;

function i18nCallBack() {
    param = getParentParam_();
    jcPkid = param.jcPkid;
    cepCheckout = param.cepCheckout;
    fleet = param.fleet;
    jcType = param.jcType;
    companyCode = param.companyCode;


    //绑定回车查询事件
    bindFormonSearch_('#ffSearch', function () {
        searchData();
    });

    InitFuncCodeRequest_({
        data: {
            domainCode: "DA_FLEET,TD_JC_STATUS",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            $("#fleet").combobox({
                panelHeight: '140px',
                data: jdata.data.DA_FLEET,
                valueField: 'VALUE',
                textField: 'TEXT'
            });
            $("#status").combobox({
                panelHeight: '120px',
                data: jdata.data.TD_JC_STATUS,
                valueField: 'VALUE',
                textField: 'TEXT'
            });
            //工卡流程状态
            PAGE_DATA['status'] = DomainCodeToMap_(jdata.data["TD_JC_STATUS"]);
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
            companyCode: companyCode,
            fleet: fleet,
            jcType: jcType
        },
        columns: {
            param: {FunctionCode: 'TD_SELECT_JOBCARD_CEP'},
            alter: {
                STATUS: {
                    formatter: function (value) {
                        return PAGE_DATA['status'][value];
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
    searchData();
}

//选取工卡的最新工序，插入到当前工卡工序中，生成新的工序
function addJcNewCep() {
    var rowData = getDG('dg').datagrid('getSelected');
    if (rowData.length == 0) {
        MsgAlert({content: '请至少选择一行数据', type: 'error'});
        return false;
    }
    //当前工卡ID
    var currentJcId = jcPkid;
    var newJcId = rowData.PKID;
    //选取工卡ID
    if (confirm("复制工卡工序会生成一条新的工序，是否确定进行？")) {
        if (cepCheckout == 'N') {
            MaskUtil.mask("复制工序中...");
            InitFuncCodeRequest_({
                data: {currentJcId: currentJcId, newJcId: newJcId, FunctionCode: "TD_JC_CREATE_NEW_CEP"},
                successCallBack: function (jdata) {
                    if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                        MaskUtil.unmask();
                        MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                        param.OWindow.refreshForm(currentJcId);
                        param.OWindow.reload_();
                        param.OWindow.param.OWindow.param.OWindow.reload_();
                        CloseWindowIframe();
                    }
                }
            });
        } else {
            MsgAlert({content: "此工卡已检出！！", type: 'error'});
        }
    }
}