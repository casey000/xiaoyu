var PAGE_DATA = {};
var nalter = {};
var param = {};
var eoPkid;

function i18nCallBack() {
    window.resizeTo("1000", "500");
    window.moveTo(300, 200);

    param = getParentParam_();
    eoPkid = param.eoPkid;
    var domainCode = new Set();
    if (param.alter) {
        for (let i = 0; i < param.alter.length; i++) {
            domainCode.add(param.alter[i].pageData);
            let formatter = `{
                        formatter: function (value) {
                            return PAGE_DATA['${param.alter[i].field}'][value];
                        }
                    }`;
            nalter[param.alter[i].field] = eval('(' + formatter + ')');
        }
    }
    InitFuncCodeRequest_({
        data: {
            domainCode: "YESORNO",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                if (param.alter) {
                    for (let i = 0; i < param.alter.length; i++) {
                        PAGE_DATA[param.alter[i].field] = DomainCodeToMap_(jdata.data [param.alter[i].pageData]);
                    }
                }
                InitDataGrid()
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
        queryParams: {eoPkid: param.eoPkid, eoEa: 'EO'},
        pageSize: 15,
        columns: {
            param: {FunctionCode: 'EM_EO_DM_DATA_REC_ADD_LIST'},
            alter: {
                ISSUE_DATE: {
                    type: 'date'
                },
                EFFECT_DATE: {
                    type: 'date'
                },
                DATA_FROM:{//资料来源(AMOC取AMOC的OWNER,其他的取资料来源)
                    formatter: function (value, row, index) {
                        var dataType = row.DATA_TYPE;
                        if('AMOC' == dataType){
                            return row.AMOC_OWNER
                        }else{
                            return row.DATA_FROM
                        }
                    }
                }
            }
            /*,
            alter:  nalter*/
        },
        onLoadSuccess: function () {
            InitSuspend('a.attach', {
                'onmouseover': function (thiz, event, callback) {
                    var index = $(thiz).attr("rowindex");
                    var row = $("#dg").datagrid('getRows')[index];
                    InitFuncCodeRequest_({
                        data: {
                            SOURCE_ID: row.PKID,
                            CATEGORY: "dmDataRecExter",
                            FunctionCode: 'ATTACHMENT_RSPL_GET'
                        },
                        successCallBack: function (jdata) {
                            if (jdata.code === RESULT_CODE.SUCCESS_CODE) {

                            }

                        }
                    });
                }
            });
        }
    });
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

//打开资料类型详细页面
function openDetai() {
    var rows = $('#dg').datagrid('getChecked');
    var objs = [];
    var pkids = new Set();
    if (rows.length == 0) {
        MsgAlert({content: "请先选择明细数据！", type: 'error'});
        return;
    }
    for (i = 0; i < rows.length; i++) {
        let obj = {};
        obj["eoPkid"] = param.eoPkid;
        obj["sourceFilePkid"] = rows[i].PKID;
        objs.push(obj);
    }


    var detailData = JSON.stringify(objs);
    InitFuncCodeRequest_({
        data: {
            detailData: detailData,
            FunctionCode: "EM_EO_SOURCE_FILE_ADD"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                param.OWindow.MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                param.OWindow.reload_();
                var adCou = 0;
                InitFuncCodeRequest_({
                    data: {eoPkid: eoPkid, FunctionCode: 'EM_EO_GET_AD_COU'},
                    async: false,
                    successCallBack: function (jdata) {
                        if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                            if (jdata.data != null) {
                                adCou = jdata.data.COUNT;
                            }
                        } else {
                            MsgAlert({content: jdata.msg ? jdata.msg : jdata.data, type: 'error'});
                        }
                    }
                });
                if (adCou > 0) {
                    param.OWindow.parent.$('#ad').prop('checked', true);
                }else{
                    param.OWindow.parent.$('#ad').prop('checked', false);
                }

                CloseWindowIframe();
            } else {
                MsgAlert({content: jdata.msg ? jdata.msg : jdata.data, type: 'error'});
            }
        }
    });
}
