/**
 * Created by tpeng on 2016/7/28.
 */

var indexs_cbdata = [{TEXT: "NORMAL", VALUE: 'NORMAL'}, {TEXT: "UNIQUE", VALUE: 'UNIQUE'}
    , {TEXT: "BITMAP", VALUE: 'BITMAP'}];

function InitIdxsDataGrid(resData) {
    var identity = 'dgidx';
    $("#dgidx").MyDataGrid({
        identity: identity,
        fit: true,
        data: resData.ResourceData.IndexDataList ? resData.ResourceData.IndexDataList : [],
        columns: [
            {
                field: 'INDEX_NAME', title: '名称', width: 220,
                formatter: function (value, row) {
                    if (row.N_EDIT) {
                        return "<span style='color:red;'>" + row.INDEX_NAME + "</span>";
                    }
                    return row.INDEX_NAME;
                },
                editor: {
                    type: 'validatebox',
                    options: {required: true, tipPosition: 'top', validType: ['field', 'length[1,125]']}
                }
            },
            {
                field: 'INDEX_TYPE', title: '类型', width: 120,
                editor: {
                    type: 'combobox',
                    options: {
                        valueField: 'VALUE',
                        textField: 'TEXT',
                        data: indexs_cbdata,
                        required: true,
                        tipPosition: 'top'
                    }
                }
            },
            {
                field: 'COLUMN_NAMES', title: '列', width: 160,
                editor: {
                    type: 'combogrid',
                    options: {
                        required: true,
                        idField: 'FIELD_NAME',
                        textField: 'FIELD_NAME',
                        panelWidth: 500,
                        pagination: false,
                        multiple: true,
                        fitColumns: true,
                        editable: false,
                        data: [],
                        columns: [[
                            {field: 'FIELD_NAME', title: '字段名称', width: 110},
                            {field: 'FIELD_TYPE', title: '数据元素名称', width: 90},
                            {field: 'FIELD_LENGTH', title: '数据类型', width: 60},
                            {field: 'FIELD_SCALE', title: '长度', width: 60},
                            {field: 'ALLOW_NULL', title: '是否为空', width: 60}
                        ]],
                        loadFilter: function (data) {
                            return getFieldDgRowsData2_();
                        }
                    }
                }
            }
        ],
        toolbar: '#tbidx',
        singleSelect: true,
        pagination: false,
        onClickCell: function (index, field) {
            var recard = $('#dgidx').datagrid('getRows')[index];
            if (recard && recard.N_EDIT) {
                return;
            }
            onClickCell(index, field, identity);
        },
        onEndEdit: function (index, row) {
        },
        loadFilter: function (data) {
            $.each(data, function (k, v) {
                v = toUnderlineCase(v);
                if (("," + resData.ResourceData.ConstraintNameDelimiter + ",").indexOf("," + v.INDEX_NAME + ",") > -1) {
                    v.N_EDIT = true;
                }
                data[k] = v;
            });
            return data;
        },
        onLoadSuccess: function () {
            onLoadSuccess(identity, {
                INDEX_NAME: '',
                INDEX_TYPE: "NORMAL"
            });
        },
        queryParams: {tableCode: resData.TABLE_CODE ? resData.TABLE_CODE : ''},
        contextMenus: [
            {
                id: "m-edit", i18nText: "common:COMMON_OPERATION.EDIT_ROW", auth: "",
                onclick: function () {
                    var row = getDG(identity).datagrid('getSelected');
                    var rowIndex = getDG(identity).datagrid('getRowIndex', row);
                    if (row && row.N_EDIT) {
                        return;
                    }
                    onClickCell(rowIndex, 'INDEX_NAME', identity);
                }
            },
            {
                id: "m-redo-edit", i18nText: "common:COMMON_OPERATION.CANCEL_EDIT_ROW", auth: "",
                onclick: function () {
                    cancelEdit(identity);
                }
            },
            {
                id: "m-delete", i18nText: "common:COMMON_OPERATION.DEL_ROW", auth: "",
                onclick: function () {
                    var row = getDG(identity).datagrid('getSelected');
                    var rowIndex = getDG(identity).datagrid('getRowIndex', row);
                    deleteRow(identity, rowIndex);
                }
            }
        ],
        validAuth: function (row, items) {
            if (row && row.N_EDIT) {
                items['common:COMMON_OPERATION.EDIT_ROW'].enable = false;
            }
            return items;
        }
    });
}

function getIdxsDgRowsData_() {
    var rows = $('#dgidx').datagrid('getRows');
    var rdata = [];
    $.each(rows, function (k, m) {
        if (m.INDEX_NAME && m.INDEX_NAME != ""
            && m.COLUMN_NAMES && m.COLUMN_NAMES != '') {
            rdata.push(toCamelCase(m));
        }
    });
    return rdata;
}