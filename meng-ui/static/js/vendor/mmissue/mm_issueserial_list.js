var partAttr = {};
var partCondition = {};
var propertyType = {};

function i18nCallBack() {
    InitDataGrid();
}

InitFuncCodeRequest_({
    data: {domainCode: 'MM_PART_CONDITION,MM_PROPERTY_TYPE', FunctionCode: "ANALYSIS_DOMAIN_BYCODE"},
    successCallBack: function (jdata) {
        partCondition = DomainCodeToMap_(jdata.data["MM_PART_CONDITION"]);
        propertyType = DomainCodeToMap_(jdata.data["MM_PROPERTY_TYPE"]);
        if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
        } else {
            MsgAlert({content: jdata.msg, type: 'error'});
        }
    }
});

function InitDataGrid() {
    var partAttr = getParentParam_().PART_ATTR;
    var identity = 'dg';
    var wind = getParentParam_().OWindow;
    var parentparam = getParentParam_().data;
    var index = getParentParam_().INDEX;
    var row = wind.$("#dg2").datagrid('getRows')[index];
//            console.log(e10d)
    var part_number = wind.getEditorValue(index);
//            var part_number =   $(e10d.target).combobox('getValue');

//            var part_number = row.PART_NUMBER;
    var warehouseNo = wind.$("#warehouseNo").combobox("getValue");
    var storageAreaNo = wind.$("#storageAreaNo").combobox("getValue");
    $("#dg").MyDataGrid({
        identity: identity,
//                columns: { param: { FunctionCode: 'MM_INVENTORY_LIST' } },
//                alter:{
//                    PART_CONDITION:{ formatter: function(value,row,index){
//                        return partCondition[value];
//                    }},
//                    PROPERTY_TYPE:{ formatter: function(value,row,index){
//                        return propertyType[value];
//                    }},
//                },
//                loadFilter: function(jdata){
//                    console.log(jdata.rows)
//                    jdata.rows = toUnderlineCaseArray(jdata.rows);
//                    return jdata;
//                },
        columns: {
            param: {FunctionCode: 'A6MM_INVENTORY_LIST'}, /*MM_PURCHASE_CONTRACT_LIST*/
            alter: {
                PART_CONDITION: {
                    formatter: function (value, row, index) {
                        return partCondition[value];
                    }
                },
                PROPERTY_TYPE: {
                    formatter: function (value, row, index) {
                        return propertyType[value];
                    }
                }
            }
        },
        validAuth: function (row, items) {

            if (row.FLAG) {
                items['确认'].enable = false;
            }
            return items;

        },


        queryParams: {part_number: part_number, warehouseNo: warehouseNo, storageAreaNo: storageAreaNo},
        contextMenus: [
            {
                id: "", i18nText: "common:RES.COMMON.CONFIRM", auth: "",
                onclick: function () {
                    sendData(parentparam, row, index, partAttr);
                }
            }
        ]
    });
}

/** 刷新列表数据 */
function reload_() {
    $("#dg").datagrid("reload");
}

/**
 * 回显数据
 */
function sendData(parentparam, row, index, partAttr) {

    if (partAttr == "RO") {
        getParentParam_().OWindow.changeValue(index, "1", 'GI_QTY');
    }
    var identity = 'dg';
    var selectRow = getDG(identity).datagrid('getSelected');
    var SERIAL_NUMBER = "";
    var BATCH_NO = "";
    if (parentparam == "SERIAL_NUMBER") {
        SERIAL_NUMBER = selectRow.SERIAL_NUMBER;
        BATCH_NO = selectRow.BATCH_NO;
    } else if (parentparam == "BATCH_NO") {
        BATCH_NO = selectRow.BATCH_NO;
    }
    if (parentparam == "SERIAL_NUMBER") {
        if (row.__editing) {
            /*var e2d =   getParentParam_().OWindow.$("#dg2").datagrid('getEditor', {index: index, field: 'SERIAL_NUMBER'});
            console.log($(e2d.target));
            $(e2d.target).textbox('setValue', SERIAL_NUMBER)*/
            getParentParam_().OWindow.changeValue(index, SERIAL_NUMBER, 'SERIAL_NUMBER');
            getParentParam_().OWindow.changeValue(index, selectRow.STORAGE_BIN_NO, 'STORAGE_BIN_NO');
            getParentParam_().OWindow.changeValue(index, selectRow.STORE_UNIT, 'STORE_UNIT');
            getParentParam_().OWindow.changeValue(index, selectRow.STORAGE_BIN_NO, 'STORAGE_BIN_NO');
            getParentParam_().OWindow.changeValue(index, selectRow.PART_CONDITION, 'PART_CONDITION');

            getParentParam_().OWindow.changeValue(index, selectRow.BATCH_NO, 'BATCH_NO');

            getParentParam_().OWindow.changeValue(index, selectRow.PKID, 'PKID');
//                var e3d =   getParentParam_().OWindow. $("#dg2").datagrid('getEditor', {index: index, field: 'STORAGE_BIN_NO'});
//                $(e2d.target).textbox('setValue', selectRow.STORAGE_BIN_NO);
//
//                var e4d =   getParentParam_().OWindow. $("#dg2").datagrid('getEditor', {index: index, field: 'STORE_UNIT'});
//                $(e2d.target).textbox('setValue', selectRow.STORE_UNIT);

//                var e5d =   getParentParam_().OWindow. $("#dg2").datagrid('getEditor', {index: index, field: 'PKID'});
//                $(e2d.target).textbox('setValue', selectRow.PKID);
            CloseWindowIframe()
        } else {
            getParentParam_().OWindow.$("#dg2").datagrid("updateRow", {
                index: index,
                row: {
                    SERIAL_NUMBER: SERIAL_NUMBER,
                    STORAGE_BIN_NO: selectRow.STORAGE_BIN_NO,
                    STORE_UNIT: selectRow.STORE_UNIT,
                    PART_CONDITION: selectRow.PART_CONDITION,
                    PKID: selectRow.PKID,
                    BATCH_NO: BATCH_NO
                }

            });
            CloseWindowIframe()
        }
    } else {
        if (row.__editing) {
//                getParentParam_().OWindow.changeValue(index, SERIAL_NUMBER,'SERIAL_NUMBER');
            getParentParam_().OWindow.changeValue(index, selectRow.HANGTAG_NO, 'HANGTAG_NO');
            getParentParam_().OWindow.changeValue(index, selectRow.STORAGE_BIN_NO, 'STORAGE_BIN_NO');
            getParentParam_().OWindow.changeValue(index, selectRow.STORE_UNIT, 'STORE_UNIT');
            getParentParam_().OWindow.changeValue(index, selectRow.PART_CONDITION, 'PART_CONDITION');
            getParentParam_().OWindow.changeValue(index, selectRow.BATCH_NO, 'BATCH_NO');
            getParentParam_().OWindow.changeValue(index, selectRow.PKID, 'PKID');

//
//                var e2d =   getParentParam_().OWindow. $("#dg2").datagrid('getEditor', {index: index, field: 'HANGTAG_NO'});
//                $(e2d.target).textbox('setValue', HANGTAG_NO);
//
//                var e3d =   getParentParam_().OWindow. $("#dg2").datagrid('getEditor', {index: index, field: 'STORAGE_BIN_NO'});
//                $(e2d.target).textbox('setValue', STORAGE_BIN_NO);
//
//                var e4d =   getParentParam_().OWindow. $("#dg2").datagrid('getEditor', {index: index, field: 'STORE_UNIT'});
//                $(e2d.target).textbox('setValue', STORE_UNIT);
//
//                var e5d =   getParentParam_().OWindow. $("#dg2").datagrid('getEditor', {index: index, field: 'PKID'});
//                $(e2d.target).textbox('setValue', PKID);
//
//                var e5d =   getParentParam_().OWindow. $("#dg2").datagrid('getEditor', {index: index, field: 'PART_CONDITION'});
//                $(e2d.target).textbox('setValue', PART_CONDITION);
            CloseWindowIframe()


        } else {
            var dg = getParentParam_().OWindow.$("#dg2");
            dg.datagrid("updateRow", {
                index: index,
                row: {
                    BATCH_NO: BATCH_NO,
                    HANGTAG_NO: selectRow.HANGTAG_NO,
                    PART_CONDITION: selectRow.PART_CONDITION,
                    STORAGE_BIN_NO: selectRow.STORAGE_BIN_NO,
                    STORE_UNIT: selectRow.STORE_UNIT,
                    PKID: selectRow.PKID

                }

            });
            CloseWindowIframe()
        }
    }

}
