/**
 * Created by tpeng on 2016/7/28.
 */

function InitFieldDataGrid(resData) {
    var identity = 'dg';
    var data = resData.ResourceData.FieldDataList ? resData.ResourceData.FieldDataList : [];
    $("#dg").MyDataGrid({
        identity: identity,
        fit: true,
        data: data,
        columns: [
            {
                field: 'FIELD_NAME', title: '字段名称', width: 120,
                editor: {
                    type: 'validatebox',
                    options: {required: true, tipPosition: 'top', validType: ['field', 'length[1,125]']}
                }
            },
            {
                field: 'FIELD_DESC', title: '字段描述', width: 160,
                editor: {type: 'validatebox', options: {tipPosition: 'top', validType: ['length[1,100]']}}
            },
            {
                field: 'ELE_CODE', title: '数据元素', width: 155,
                formatter: function (value, row) {
                    return row.ELE_CODE_NAME;
                },
                editor: {
                    type: 'combogrid',
                    options: {
                        idField: 'CODE',
                        textField: 'ELE_NAME',
                        panelWidth: 500,
                        pagination: true,
                        mode: 'remote',
                        fitColumns: true,
                        url: "/api/v1/plugins/DATA_ELEMENT_QLIST",
                        onSelect: function (rowIndex) {
                            CgridEleCodeSelect_(rowIndex, identity);
                        },
                        columns: [[
                            {field: 'CODE', title: '编号', width: 80},
                            {field: 'ELE_NAME', title: '数据元素名称', width: 120},
                            {field: 'FIELD_TYPE', title: '数据类型', width: 120},
                            {field: 'FIELD_LEN', title: '长度', width: 80},
                            {field: 'FIELD_SCALE', title: '小数位', width: 80}
                        ]],
                        loadFilter: function (jdata) {
                            jdata.rows.unshift({CODE: '', ELE_NAME: '无'});
                            return jdata.rows;
                        }
                    }
                }
            },
            {
                field: 'FIELD_TYPE', title: '字段类型', width: 120, formatter: function (value, row) {
                    return row.FIELD_TYPE;
                },
                editor: {
                    type: 'combobox',
                    options: {
                        valueField: 'VALUE',
                        textField: 'TEXT',
                        data: resData.ResourceData.DataTypeList || [],
                        required: true,
                        tipPosition: 'top'
                    }
                }
            },
            {
                field: 'FIELD_LENGTH', title: '字段长度', width: 90,
                editor: {type: 'numberbox', options: {required: true, tipPosition: 'top', validType: ['maxLength[5]']}}
            },
            {
                field: 'FIELD_SCALE', title: '小数位', width: 90,
                editor: {type: 'numberbox', options: {required: true, tipPosition: 'top', validType: ['maxLength[3]']}}
            },
            {
                field: 'ALLOW_NULL', title: '是否为空', width: 80, formatter: function (value, row) {
                    return row.ALLOW_NULL != null ? (row.ALLOW_NULL == 1 ? '是' : '否') : '';
                },
                editor: {type: 'checkbox', options: {on: '1', off: '0'}}
            }
        ],
        toolbar: '#tb',
        singleSelect: true,
        pagination: false,
        onClickCell: function (index, field) {
            onClickCell(index, field, identity);
            var record = $('#dg').datagrid('getRows')[index];
            if (record && record.ELE_CODE && record.ELE_CODE != '') {
                var edFtyp = getDG(identity).datagrid('getEditor', {index: index, field: 'FIELD_TYPE'});
                var edFlen = getDG(identity).datagrid('getEditor', {index: index, field: 'FIELD_LENGTH'});
                var edFsale = getDG(identity).datagrid('getEditor', {index: index, field: 'FIELD_SCALE'});
                $(edFtyp.target).combobox({disabled: true, value: record.FIELD_TYPE});
                $(edFlen.target).numberbox({disabled: true});
                $(edFsale.target).numberbox({disabled: true});
            }
        },
        onEndEdit: function (index, row) {
            var ed = getDG(identity).datagrid('getEditor', {index: index, field: 'ELE_CODE'});
            row.ELE_CODE_NAME = $(ed.target).combobox('getText');
        },
        /*loadFilter: function(data){
            $.each(data, function(k,v){
               // v = toUnderlineCase(v);
                v.ALLOW_NULL_NAME = v.ALLOW_NULL == '1' ? '是' : '否';
                data[k] = v;
            });
            return data;
        },*/
        onLoadSuccess: function () {
            onLoadSuccess(identity, {
                ALLOW_NULL: null
                //FIELD_LENGTH : "0",
                //FIELD_SCALE : "0"
                /*
                 ELE_CODE : ""
                 FIELD_DESC: ""
                 FIELD_NAME : ""
                 FIELD_TYPE : ""*/
            });
        },
        queryParams: {tableCode: resData.TABLE_CODE ? resData.TABLE_CODE : ''},
        contextMenus: [
            {
                id: "m-edit", i18nText: "common:COMMON_OPERATION.EDIT_ROW", auth: "",
                onclick: function () {
                    var row = getDG(identity).datagrid('getSelected');
                    var rowIndex = getDG(identity).datagrid('getRowIndex', row);
                    onClickCell(rowIndex, 'FIELD_NAME', identity);
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

function CgridEleCodeSelect_(rowIndex, identity) {
    var editIndex = EDIT_DG.INDEX[identity];
    var dg = getDG(identity);
    var edEle = dg.datagrid('getEditor', {index: editIndex, field: 'ELE_CODE'});
    var edFtyp = dg.datagrid('getEditor', {index: editIndex, field: 'FIELD_TYPE'});
    var edFlen = dg.datagrid('getEditor', {index: editIndex, field: 'FIELD_LENGTH'});
    var edFsale = dg.datagrid('getEditor', {index: editIndex, field: 'FIELD_SCALE'});
    var record = $(edEle.target).combogrid('grid').datagrid('getRows')[rowIndex];
    var isSelect = record.CODE != "";
    $(edFtyp.target).combobox({disabled: isSelect ? true : false, value: record.FIELD_TYPE});
    $(edFlen.target).numberbox({disabled: isSelect ? true : false, value: record.FIELD_LEN});
    $(edFsale.target).numberbox({disabled: isSelect ? true : false, value: record.FIELD_SCALE});
}

function getFieldDgRowsData_() {
    var rows = $('#dg').datagrid('getRows');
    var rdata = [];
    $.each(rows, function (k, m) {
        if (m.FIELD_NAME && m.FIELD_NAME != "") {
            m.ALLOW_NULL = m.ALLOW_NULL_NAME == "是" ? 1 : 0;
            rdata.push(toCamelCase(m));
        }
    });
    return rdata;
}

function getFieldDgRowsData2_() {
    validCancelEdit('dg');
    var rows = $('#dg').datagrid('getRows');
    var rdata = [];
    $.each(rows, function (k, m) {
        if (m.FIELD_NAME && m.FIELD_NAME != "") {
            m.ALLOW_NULL = m.ALLOW_NULL_NAME == "是" ? 1 : 0;
            rdata.push(m);
        }
    });
    return rdata;
}
