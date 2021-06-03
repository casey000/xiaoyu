var PAGE_DATA = {};
var param;
var jcPkid;
var fleet;
var checkout;
var cepFilePath;
var refType;
var refData;
var companyCode;
var jcType;

function i18nCallBack() {
    param = getParentParam_();
    jcPkid = param.jcpkid;
    fleet = param.fleet;
    checkout = param.checkout;
    cepFilePath = param.cepfilepath;
    refType = param.reftype;
    refData = param.refdata;
    companyCode = param.companyCode;
    jcType = param.jcType;

    $("#refData").textbox({value: refData});
    $("#fleet").textbox({value: fleet});
    //绑定回车查询事件
    bindFormonSearch_('#ffSearch', function () {
        searchData();
    });

    InitFuncCodeRequest_({
        data: {
            domainCode: "TD_TRANS_STATUS,TD_MANUAL_TYPE",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            $("#manualType").combobox({
                panelHeight: '80px',
                data: jdata.data.TD_MANUAL_TYPE,
                valueField: 'VALUE',
                textField: 'TEXT'
            });
            // if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
            //     InitDataGrid();
            // } else {
            //     MsgAlert({content: jdata.msg, type: 'error'});
            // }
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
        queryParams: {fleet: fleet, companyCode: companyCode,manualType:manualType,taskCode:taskCode},
        columns: {
            param: {FunctionCode: 'TD_SELECT_TASK_DIFF_LIST'},
            alter:{
                MANUAL_FILE_NAME:{
                    formatter: function (value, row, index) {
                        if(row.MANUAL_FILE_NAME){
                          var fileName = row.MANUAL_FILE_NAME;
                          var mFileName = fileName.substring(0,fileName.lastIndexOf("."));
                          return mFileName;
                        }
                    }
                }
            }
        }
    });
}

function InitDataGrid1() {
    var taskCode = $("#taskCode").textbox('getValue');
    var manualType = $("#manualType").combobox('getValue');
    $("#dg").MyDataGrid({
        identity: 'dg',
        sortable: true,
        singleSelect: true,
        pageSize: 15,
        queryParams: {fleet: fleet, companyCode: companyCode,manualType:manualType,taskCode:taskCode},
        columns: {
            param: {FunctionCode: 'TD_SELECT_TASK_DIFF_SAMM_LIST'},
            alter:{
                FILE_NAME:{
                    formatter: function (value, row, index) {
                        if(row.FILE_NAME){
                            var fileName = row.FILE_NAME;
                            var mFileName = fileName.substring(0,fileName.lastIndexOf("."));
                            return mFileName;
                        }
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

//查询
function searchData() {
    var manualType = $("#manualType").combobox('getValue');
    if(manualType == null || manualType == undefined || manualType == ''){
        MsgAlert({content: "请先选择手册类型，再进行查询！", type: 'warn'});
        return;
    }
    if("AMM" == manualType || "TC" == manualType){
        InitDataGrid();
    }else{
        InitDataGrid1();
    }
}

//重置
function doClear_() {
    $("#ffSearch").form('clear');
    searchData();
}

function manualToJobcard() {
    var oemTaskcode = "";
    var rowData = getDG('dg').datagrid('getSelected');
    var manualType = rowData.MANUAL_TYPE;
    var zones = "";
    var acpans = "";
    if ("AMM" == manualType || "TC" == manualType) {
        oemTaskcode = rowData.OEM_TASKCODE;
    } else {
        oemTaskcode = rowData.OEM_TASK_CODE;
    }
    var oemRev = rowData.OEM_REV;
    if (!rowData || !rowData.PKID) {
        MsgAlert({content: "请选择数据！", type: 'error'});
        return;
    }
    MaskUtil.mask("手册转工序中...");
    //获取原厂手册中区域与盖板数据
    InitFuncCodeRequest_({
        data: {
            jcPkid: jcPkid,
            manualFilePath: rowData.MANUAL_FILE_PATH,
            manualType: rowData.MANUAL_TYPE,
            FunctionCode: 'TD_JC_GET_ZONE_ACPAN'
        },
        successCallBack: function (jdata1) {
            if (jdata1.code == RESULT_CODE.SUCCESS_CODE) {
                if (rowData.MANUAL_TYPE == "TC") {
                    zones = jdata1.data.ZONES + "";
                    acpans = jdata1.data.ACPANS + "";
                }
                //原厂手册转工卡工序
                InitFuncCodeRequest_({
                    data: {
                        jcPkid: jcPkid,
                        manualFilePath: rowData.MANUAL_FILE_PATH,
                        manualType: manualType,
                        oemTaskcode: oemTaskcode,
                        oemRev: oemRev,
                        FunctionCode: 'TD_JC_TOJOBCARD'
                    },
                    successCallBack: function (jdata) {
                        if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                            MaskUtil.unmask();
                            MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                            param.OWindow.param.OWindow.param.OWindow.reload_();
                            var title_ = $.i18n.t('工序编辑详情');
                            ShowWindowIframe({
                                width: "900",
                                height: "500",
                                title: title_,
                                param: {jcpkid: jcPkid, jcType: jcType},
                                url: "/views/td/jobcard/commonjc/TdJcCepEditDetail.shtml"
                            });
                            param.OWindow.param.OWindow.reload_();
                            param.OWindow.param.OWindow.setZonesAndAcpans(zones, acpans, rowData.MANUAL_TYPE);
                            param.OWindow.param.OWindow.setManualVer(rowData.OEM_REV);
                        } else {
                            MsgAlert({content: jdata.data, type: 'error'});
                        }
                    }
                });
            } else {
                MsgAlert({content: jdata1.msg, type: 'error'});
            }
        }
    });
}

