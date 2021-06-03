var partAttr = {};
var partTyPe = {};
var identity = 'dg';
var purchaseType = {};
param = getParentParam_();

function i18nCallBack() {
    InitFuncCodeRequest_({
        data: {domainCode: "MM_REPAIR_ORDER_TYPE", FunctionCode: "ANALYSIS_DOMAIN_BYCODE"},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                purchaseType = DomainCodeToMap_(jdata.data["MM_REPAIR_ORDER_TYPE"]);
                //合同类型
                $('#orderType').combobox({
                    panelHeight: '150px',
                    data: jdata.data.MM_REPAIR_ORDER_TYPE,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                });
                InitDataGrid();
            }
            else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });

}

// W,未批准的状态 planDeadline:param.planDeadline,,,PTXL,XSBX,GDBX
function InitDataGrid() {
    var vendorName = getParentParam_().vendorName;
    $("#vendorName").val(vendorName);
    $("#dg").MyDataGrid({
        identity: identity,
        sortable: true,
        singleSelect: false,
        queryParams: {vendorName: vendorName, orderType: 'X'},
        title: $.i18n.t('page:MM_OEDER_LIST.TITLE'),
        columns: {
            param: {FunctionCode: 'MM_OEDER_LIST'},
            alter: {
                ORDER_TYPE: {
                    formatter: function (value, row, index) {
                        return purchaseType[value];
                    }
                }
            }
        }
    });
}

function getWaybillNo() {
    var rows = $('#dg').datagrid('getChecked');

    if (rows.length == 0) {
        MsgAlert({content: '请选择数据项', type: 'error'});
        return false;
    }

    var ids = '';

    for (var i = 0; i < rows.length; i++) {
        ids += rows[i].ORDER_NO + "+" + rows[i].ITEM_NO + ";";
    }
//        param.OWindow.selectWno(rows);
    param.OWindow.insertInvoiceDetail(ids);
    CloseWindowIframe();
}

//查询
function searchList() {
    var fromId = '#ffSearch';
    var queryParams = $(fromId).serializeObject();
    if (queryParams.orderType == null || queryParams.orderType == '') {
        queryParams.orderType = 'X';
    }
    var dgopt = getDgOpts('dg');
    var url = dgopt.url;
    var $dg = $(dgopt.owner);
    $dg.datagrid({
        url: url,
        queryParams: queryParams
    });
}


/** 刷新列表数据 */
function reload_() {
    $("#dg").datagrid("reload");
}
