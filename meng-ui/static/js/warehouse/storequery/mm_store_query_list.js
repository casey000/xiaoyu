var PAGE_DATA = {};
var warehouseNo = {};
var storageAreaNo = {};

function i18nCallBack() {

    $("#r_partNo").MyComboGrid({
        idField: 'TEXT',  //实际选择值
        textField: 'TEXT', //文本显示值
        width: 90,
        params: {FunctionCode: 'MM_PN_ID'},
        columns: [[
            {field: 'TEXT', title: '物料号', width: 60, sortable: true}
        ]]
    });

    $("#l_partNo").MyComboGrid({
        idField: 'TEXT',  //实际选择值
        textField: 'TEXT', //文本显示值
        width: 90,
        params: {FunctionCode: 'MM_PN_ID'},
        columns: [[
            {field: 'TEXT', title: '物料号', width: 60, sortable: true}
        ]]
    });

    InitFuncCodeRequest_({
        data: {
            domainCode: "MM_WAREHOUSE_NO,MM_PART_CONDITION,MM_PARTNUMBER_JIANHAO,MM_STORAGE_AREA_NO",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {

                $('#l_storageAreaNo').combobox({
                    panelHeight: '150px',
                    data: jdata.data.MM_STORAGE_AREA_NO,
                    valueField: 'VALUE',
                    textField: 'NAME'
                });

                $('#r_storageAreaNo').combobox({
                    panelHeight: '150px',
                    data: jdata.data.MM_STORAGE_AREA_NO,
                    valueField: 'VALUE',
                    textField: 'NAME'
                });

                $('#l_warehouseNo').combobox({
                    panelHeight: '150px',
                    data: jdata.data.MM_WAREHOUSE_NO,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                $('#r_warehouseNo').combobox({
                    panelHeight: '150px',
                    data: jdata.data.MM_WAREHOUSE_NO,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                $('#l_storeStatus').combobox({
                    panelHeight: '150px',
                    data: jdata.data.MM_PART_CONDITION,
                    valueField: 'VALUE',
                    textField: 'VALUE'
                });
                $('#r_storeStatus').combobox({
                    panelHeight: '150px',
                    data: jdata.data.MM_PART_CONDITION,
                    valueField: 'VALUE',
                    textField: 'VALUE'
                });
                PAGE_DATA['warehouseNo'] = DomainCodeToMap_(jdata.data["MM_WAREHOUSE_NO"]);
                PAGE_DATA['storageAreaNo'] = DomainCodeToMap2_(jdata.data["MM_STORAGE_AREA_NO"], 'NAME', 'VALUE');
                l_InitDataGrid();
                r_InitDataGrid();
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}


function DomainCodeToMap2_(list, text, value) {
    var d = {};
    $.each(list, function (k, it) {
        d[it[value]] = it[text];
    });
    return d;
}

$(function () {
    $(':checkbox[item=aa]').each(function () {
        $(this).click(function () {
            if ($(this).is(':checked')) {
                tdgSearch_();
            } else {
                tdgSearch_();
            }
        });
    });
});

//初始化单件库存查询列表
function l_InitDataGrid() {
    var identity = 'l_dg';
    $("#l_dg").MyDataGrid({
        identity: identity,
        firstLoad: false,
        sortable: true,
        pagination: false,
        loadFilter: function (jdata) {
            jdata.rows = toUnderlineCaseArray(jdata.rows);
            return jdata;
        },
        columns: {
            param: {FunctionCode: 'A6MM_STORE_QUERY_SINGLE_LIST'},
            alter: {
                WAREHOUSE_NO: {
                    formatter: function (value, row, index) {
                        if (PAGE_DATA['warehouseNo'][value]) {
                            return PAGE_DATA['warehouseNo'][value];
                        } else {
                            return value;
                        }
                    }
                },
                STORAGE_AREA_NO: {
                    formatter: function (value, row, index) {
                        return PAGE_DATA['storageAreaNo'][value];
                    }
                },
                STOCK_LIFE: {
                    type: 'date'
                }
            }
        },
        resize: function () {
            return tabs_standard_resize($('#tt'), 20);
        }
    });
}

//初始化库存清单查询列表
function r_InitDataGrid() {
    var identity = 'r_dg';
    $("#r_dg").MyDataGrid({
        identity: identity,
        sortable: true,
        loadFilter: function (jdata) {
            jdata.rows = toUnderlineCaseArray(jdata.rows);
            return jdata;
        },
        columns: {
            param: {FunctionCode: 'A6MM_STORE_QUERY_LIST'},
            alter: {
                WAREHOUSE_NO: {
                    nfield: 't.WAREHOUSE_NO',
                    formatter: function (value, row, index) {
                        return PAGE_DATA['warehouseNo'][value];
                    }
                },
                ITEM_NO: {
                    nfield: 't.ITEM_NO'
                },
                STORAGE_AREA_NO: {
                    nfield: 't.STORAGE_AREA_NO',
                    formatter: function (value, row, index) {
                        return PAGE_DATA['storageAreaNo'][value];
                    }
                },
                STOCK_LIFE: {
                    nfield: 't.STOCK_LIFE',
                    type: 'date'
                },

                STORAGE_BIN_NO: {
                    nfield: 't.STORAGE_BIN_NO'
                },
                PART_NO: {
                    nfield: 't.PART_NO'
                },
                BATCH_NO_SYS: {
                    nfield: 't.BATCH_NO_SYS'
                },
                BATCH_NO: {
                    nfield: 't.BATCH_NO'
                },
                SERIAL_NUMBER: {
                    nfield: 't.SERIAL_NUMBER'
                },

                PART_CONDITION: {
                    nfield: 't.PART_CONDITION'
                },
                STORE_QTY: {
                    nfield: 't.STORE_QTY'
                },
                LOCK_QTY: {
                    nfield: 't.LOCK_QTY'
                },
                STORE_UNIT: {
                    nfield: 't.STORE_UNIT'
                },
                PURCHASE_ORDER_PRICE: {
                    nfield: 't.PURCHASE_ORDER_PRICE'
                },
                PRICE_CURRENCY: {
                    nfield: 't.PRICE_CURRENCY'
                },


            }
        },
        contextMenus: [
            {
                id: "m-lock", i18nText: "锁定", auth: "",
                onclick: function () {
                    var rowdata = getDG(identity).datagrid('getSelected');
                    common_add_edit_({
                        identity: identity,
                        isEdit: 1,
                        width: 700,
                        height: 250,
                        title: $.i18n.t('锁定'),
                        param: {data: {rowdata}},
                        url: "/views/mm/warehouse/storequery/mm_store_query_lock.shtml"
                    });
                }
            },
            {
                id: "m-lock", i18nText: "解锁", auth: "",
                onclick: function () {
                    var rowdata = getDG(identity).datagrid('getSelected');
                    common_add_edit_({
                        identity: identity,
                        isEdit: 1,
                        width: 700,
                        height: 250,
                        title: $.i18n.t('解锁'),
                        param: {data: {rowdata}},
                        url: "/views/mm/warehouse/storequery/mm_store_query_unlocklist.shtml"
                    });
                }
            },
            {
                id: "m-lock", i18nText: "锁定明细", auth: "",
                onclick: function () {
                    var rowdata = getDG(identity).datagrid('getSelected');
                    common_add_edit_({
                        identity: identity,
                        isEdit: 1,
                        width: 700,
                        height: 250,
                        title: $.i18n.t('锁定明细'),
                        param: {data: {rowdata}},
                        url: "/views/mm/warehouse/storequery/mm_store_query_locklist.shtml"
                    });
                }
            }
        ],
        resize: function () {
            return tabs_standard_resize($('#tt'), 20);
        }
    });
}


/** 刷新列表数据 */
function reload_() {
    $("#l_dg").datagrid("reload");
    $("#r_dg").datagrid("reload");
}

//查询单件库存
function tdgSearch_() {
    var $form = $("#mform");
    var isValidate = $form.form('validate');
    if (!isValidate) {
        return false;
    }
    var fromId = '#mform';
    var queryParams = $(fromId).serializeObject();
    var dgopt = getDgOpts('l_dg');
    var url = dgopt.url;
    var $dg = $(dgopt.owner);
    $dg.datagrid({
        url: url,
        queryParams: queryParams
    });
}

//查询单件库存
function rightSearch_() {
    var $form = $("#ffSearch");
    var isValidate = $form.form('validate');
    if (!isValidate) {
        return false;
    }
    var fromId = '#ffSearch';
    var queryParams = $(fromId).serializeObject();
    var dgopt = getDgOpts('r_dg');
    var url = dgopt.url;
    var $dg = $(dgopt.owner);
    $dg.datagrid({
        url: url,
        queryParams: queryParams
    });
}