/**
 * Created by tpeng on 2016/8/5.
 */
function InitEnumDataGrid(resData) {
    var identity = 'dgenum';
    $("#" + identity).MyDataGrid({
        identity: identity,
        fit: true,
        data: resData.data ? resData.data : [],
        columns: [
            {field: 'VALUE', title: '数据值', width: 160},
            {field: 'TEXT', title: '描述', width: 160}
        ],
        singleSelect: true,
        pagination: false,
        toolbar: [
            {
                key: "COMMON_ADD", text: $.i18n.t('common:COMMON_OPERATION.ADD'), auth: "",
                handler: function () {
                    var data = $("#mform").serializeObject();
                    if (data.length == '' || data.prec == '') {
                        layer.msg("请先填写长度及小数位数据!", {icon: 5});
                        return;
                    }
                    var regTxt = returnValidReg(data.dataType, data.length, data.prec);
                    common_add_edit_({
                        identity: identity, isEdit: 0, width: 600, height: 300,
                        param: {regTxt: regTxt},
                        url: "/views/ws/data_dict/data_domain/data_domain_enum_add_edit.shtml"
                    });
                }
            }
        ],
        contextMenus: [
            {
                id: "m-edit", i18nText: "common:COMMON_OPERATION.EDIT", auth: "",
                onclick: function () {
                    var data = $("#mform").serializeObject();
                    if (data.length == '' || data.prec == '') {
                        layer.msg("请先填写长度及小数位数据!", {icon: 5});
                        return;
                    }
                    var rowData = $("#" + identity).datagrid('getSelected');
                    var idex = $("#" + identity).datagrid('getRowIndex', rowData);
                    var regTxt = returnValidReg(data.dataType, data.length, data.prec);
                    console.log("regTxt:"+regTxt);
                    common_add_edit_({
                        identity: identity, isEdit: 1, width: 600, height: 300,
                        param: {regTxt: regTxt, INDEX: idex},
                        url: "/views/ws/data_dict/data_domain/data_domain_enum_add_edit.shtml"
                    });
                }
            },
            {
                id: "m-delete", i18nText: "common:COMMON_OPERATION.DEL_ROW", auth: "",
                onclick: function () {
                    var row = $("#" + identity).datagrid('getSelected');
                    var rowIndex = $("#" + identity).datagrid('getRowIndex', row);
                    $("#" + identity).datagrid('deleteRow', rowIndex);
                }
            }
        ],
        resize: {
            height: '100%',
            width: 500
        },
        loadFilter: function (data) {
            $.each(data, function (k, v) {
                v = toUnderlineCase(v);
                data[k] = v;
            });
            return data;
        },
    });
}

function getEnumDgRowsData_() {
    var rows = $('#dgenum').datagrid('getRows');
    var rdata = [];
    $.each(rows, function (k, m) {
        rdata.push(toCamelCase(m));
    });
    return rdata;
}

function insertEnumRow(record) {
    var index = $("#dgenum").datagrid('getRows').length;
    $('#dgenum').datagrid('insertRow', {index: index, row: record});
}

function returnValidReg(vtype, vlength, vscale) {
    if (vtype.toUpperCase() == "NUMBER") {
        if (vscale && vscale > 0) {
            return "^\\\\d{1," + vlength + "}(\\\\.\\\\d{0," + vscale + "})?$";
        } else {
            return "^\\\\d{1," + vlength + "}$";
        }
    } else {
        return "^.{1," + vlength + "}$";
    }
}

function updateEnumRow(index, record) {
    $('#dgenum').datagrid('updateRow', {index: index, row: record});
}