var PAGE_DATA = {};
var nalter = {};
var param = {};
var operation;
var applyType;
function i18nCallBack() {
    window.moveTo(400, 200);
    window.resizeTo("600", "500");
    param = getParentParam_();
    operation = param.operation;
    applyType = param.applyType;
    if('view' == operation){
        $('#saveBtn').attr('disabled', true);
    }
    if (applyType == "APL") {
        detailFun = "EM_EO_TLIMIT_APP_DETAIL_ACNO_LIST";
    } else if(applyType == 'ENG'){
        detailFun = "EM_EO_TLIMIT_APP_DETAIL_ENG_LIST2";
    } else if(applyType == 'PART'){
        detailFun = "EM_EO_TLIMIT_APP_DETAIL_PART_LIST2";
    }
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
            domainCode: "",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                if (param.alter) {
                    for (let i = 0; i < param.alter.length; i++) {
                        PAGE_DATA[param.alter[i].field] = DomainCodeToMap_(jdata.data [param.alter[i].pageData]);
                    }
                }
                $('#config').combobox({
                    panelHeight: '150px',
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    data: jdata.data.EO_GROUP_CONFIG
                });
                getGroupName(param.eoPkid);
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
        pagination: true,
        queryParams: {eoPkid: param.eoPkid, pkid: param.pkid},
        columns: {
            param: {FunctionCode: detailFun}
            ,
            alter: {
                CHECKBOX: {
                    formatter: function (value, row, index) {
                        if (value > 0) {
                            $("#dg").datagrid('checkRow', index);
                        }
                    }
                },
                COM_STATUS : {
                    formatter : function (value, row ,index) {
                        if(value && ('T'==value || 'C'==value)){
                            return '是'
                        }else{
                            return '否'
                        }
                    }
                }
            }
        },
        onLoadSuccess: function (jdata) {
            $.each(jdata.data, function (index, row) {
                if (row.CHECKBOX > 0) {
                    $("#dg").datagrid('checkRow', index);
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
    var obj = new Set();
    var detailData;
    if(rows.length != 0){
        for (i = 0; i < rows.length; i++) {
            obj.add(rows[i].PKID);
        }
        detailData = Array.from(obj).toString();
    }else{
        detailData = "";
    }
    InitFuncCodeRequest_({
        data: {
            pkid: param.pkid,
            detailData: detailData,
            FunctionCode: "EM_EO_TLIMIT_APP_DETAIL_ADD"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                param.OWindow.MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                param.OWindow.reload9_();
                CloseWindowIframe();

            } else {
                MsgAlert({content: jdata.msg ? jdata.msg : jdata.data, type: 'error'});
            }
        }
    });
}

function getGroupName(eoPkid) {
    var datas = $.extend({eoPkid: eoPkid}, {FunctionCode: 'EM_EO_GROUP_NAME'});
    InitFuncCodeRequest_({
        data: datas, successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                $('#groupName').combobox({
                    panelHeight: '150px',
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    data: jdata.data
                });
            } else {
                MsgAlert({content: jdata.msg ? jdata.msg : jdata.data, type: 'error'});
            }
        }
    });
}
