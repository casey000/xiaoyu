/**
 * Created by tpeng on 2016/7/28.
 */

var keys_cbdata = [{TEXT: "Primary", VALUE: 'P'},
    {TEXT: "Unique", VALUE: 'U'}, {TEXT: "Foreign", VALUE: 'R'}];

var keyMap = {"P": "Primary", "U": "Unique", "R": "Foreign"};

function InitKeysDataGrid(resData) {
    var identity = 'dgkey';
    $("#dgkey").MyDataGrid({
        identity: identity,
        fit: true,
        data: resData.ResourceData.ConstraintDataList ? resData.ResourceData.ConstraintDataList : [],
        columns: [
            {
                field: 'CONSTRAINT_NAME', title: '名称', width: 220, editor: {
                    type: 'validatebox',
                    options: {required: true, tipPosition: 'top', validType: ['field', 'length[1,125]']}
                }
            },
            {
                field: 'TYPE', title: '类型', width: 120,
                formatter: function (value, row) {
                    return row.TYPE_NAME;
                },
                editor: {
                    type: 'combobox',
                    options: {
                        valueField: 'VALUE',
                        textField: 'TEXT',
                        data: keys_cbdata,
                        required: true,
                        tipPosition: 'top'
                    }
                }
            },
            {
                field: 'FIELD_NAMES', title: '列', width: 180,
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
            },
            {
                field: 'FK_CONSTRAINT_NAME', title: '外键表', width: 155,
                formatter: function (value, row) {
                    return row.FK_TABLE_NAME;
                },
                editor: {
                    type: 'combogrid',
                    options: {
                        idField: 'FK_CONSTRAINT_NAME',
                        textField: 'TABLE_NAME',
                        panelWidth: 500,
                        pagination: true,
                        mode: 'remote',
                        fitColumns: true,
                        url: "/api/v1/plugins/FK_TABLE_FIELD_QLIST",
                        queryParams: {tableName: resData.ResourceData.WsTable.TABLE_NAME || '-'},
                        onSelect: function (rowIndex) {
                            CgridFkTableNameSelect_(rowIndex, identity);
                        },
                        columns: [[
                            {field: 'TABLE_NAME', title: '外键表', width: 120},
                            {field: 'COLUMN_NAMES', title: '列', width: 120},
                            {field: 'FK_CONSTRAINT_NAME', title: '键名', width: 80}
                        ]],
                        loadFilter: function (jdata) {
                            jdata.data.unshift({FK_CONSTRAINT_NAME: '', TABLE_NAME: '无'});
                            return jdata.data;
                        }
                    }
                }
            },
            {
                field: 'FK_FIELD_NAME', title: '外键列', width: 150, editor: {
                    type: 'validatebox', options: {tipPosition: 'top', validType: ['length[1,125]']}
                }
            }
        ],
        toolbar: '#tbkey',
        singleSelect: true,
        pagination: false,
        onClickCell: function (index, field) {
            onClickCell(index, field, identity);
            var record = $('#dgkey').datagrid('getRows')[index];
            if (record && record.FK_CONSTRAINT_NAME && record.FK_CONSTRAINT_NAME != '') {
                var ed = getDG(identity).datagrid('getEditor', {index: index, field: 'FK_FIELD_NAME'});
                $(ed.target).textbox({disabled: true});
            }
        },
        onEndEdit: function (index, row) {
            var ed = $(this).datagrid('getEditor', {index: index, field: 'TYPE'});
            var edbox = $(this).datagrid('getEditor', {index: index, field: 'FK_CONSTRAINT_NAME'});
            row.TYPE_NAME = $(ed.target).combobox('getText');
            var record = $(edbox.target).combogrid('grid').datagrid('getSelected');
            row.FK_TABLE_NAME = record.TABLE_NAME || "";
        },
        loadFilter: function (data) {
            $.each(data, function (k, v) {
                v = toUnderlineCase(v);
                v.TYPE_NAME = keyMap[v.TYPE];
                data[k] = v;
            });
            return data;
        },
        onLoadSuccess: function () {
            var hasData = resData.ResourceData.ConstraintDataList
            && resData.ResourceData.ConstraintDataList.length ? true : false;
            onLoadSuccess(identity, {
                TYPE: !hasData ? "P" : ""
            });
            EDIT_DG.DEFAULT_ROW[identity] = {TYPE: ""};
        },
        queryParams: {tableCode: resData.TABLE_CODE ? resData.TABLE_CODE : ''},
        contextMenus: [
            {
                id: "m-edit", i18nText: "common:COMMON_OPERATION.EDIT_ROW", auth: "",
                onclick: function () {
                    var row = getDG(identity).datagrid('getSelected');
                    var rowIndex = getDG(identity).datagrid('getRowIndex', row);
                    onClickCell(rowIndex, 'CONSTRAINT_NAME', identity);
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
        ]
    });
}

function getKeysDgRowsData_() {
    var rows = $('#dgkey').datagrid('getRows');
    var rdata = [];
    var isHasPk = false;
    $.each(rows, function (k, m) {
        if (m.CONSTRAINT_NAME && m.CONSTRAINT_NAME != ""
            && m.FIELD_NAMES && m.FIELD_NAMES != ''
            && m.TYPE && m.TYPE != '') {
            if (!isHasPk && m.TYPE == 'P') {
                isHasPk = true;
            }
            if (m.CONSTRAINT_NAME == '') {
                m.FK_TABLE_NAME = '';
                m.FK_FIELD_NAME = '';
            }
            rdata.push(toCamelCase(m));
        }
    });
    return {hasPkey: isHasPk, data: rdata};
}

function CgridFkTableNameSelect_(rowIndex, identity) {
    var editIndex = EDIT_DG.INDEX[identity];
    var dg = getDG(identity);
    var ed = dg.datagrid('getEditor', {index: editIndex, field: 'FK_FIELD_NAME'});
    var edbox = dg.datagrid('getEditor', {index: editIndex, field: 'FK_CONSTRAINT_NAME'});
    var record = $(edbox.target).combogrid('grid').datagrid('getRows')[rowIndex];
    var isSelect = record.FK_CONSTRAINT_NAME != "";
    $(ed.target).textbox({disabled: isSelect ? true : false});
    $(ed.target).val(record.COLUMN_NAMES);
}