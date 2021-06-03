/**
 * Created by tpeng on 2016/7/29.
 */

var EDIT_DG = {
    DEFAULT_ROW: {},
    INDEX: {}
};

function onLoadSuccess(identity, defRowData) {
    EDIT_DG.INDEX[identity] = undefined;
    EDIT_DG.DEFAULT_ROW[identity] = defRowData ? defRowData : {};
    insertRow(getDG(identity).datagrid('getRows').length, identity);
}

function onClickCell(index, field, identity) {
    var editIndex = EDIT_DG.INDEX[identity];
    if (editIndex != index) {
        if (getDG(identity).datagrid('validateRow', editIndex)) {
            getDG(identity).datagrid('endEdit', editIndex);
        } else {
            getDG(identity).datagrid('cancelEdit', editIndex)
        }
        if (getDG(identity).datagrid('getRows').length - 1 == index) {
            insertRow(index + 1, identity);
        }
        getDG(identity).datagrid('selectRow', index)
            .datagrid('beginEdit', index);
        var ed = getDG(identity).datagrid('getEditor', {index: index, field: field});
        if (ed) {
            ($(ed.target).data('textbox') ? $(ed.target).textbox('textbox') : $(ed.target)).focus();
        }
        EDIT_DG.INDEX[identity] = index;
    }
}

function onEndEdit(index, row, identity) {
    //var ed = $(this).datagrid('getEditor', { index: index, field: 'productid' });
    //row.productname = $(ed.target).combobox('getText');
}

function insertRow(index, identity) {
    var defRow = $.extend({}, EDIT_DG.DEFAULT_ROW[identity]);
    getDG(identity).datagrid('insertRow', {index: index, row: defRow});
}

function removeit(identity) {
    var editIndex = EDIT_DG.INDEX[identity];
    if (editIndex == undefined) {
        return
    }
    getDG(identity).datagrid('cancelEdit', editIndex)
        .datagrid('deleteRow', editIndex);
    EDIT_DG.INDEX[identity] = undefined;
}

function deleteRow(identity, rowIndex) {
    var editIndex = EDIT_DG.INDEX[identity];
    if (!rowIndex) {
        var row = getDG(identity).datagrid('getSelected');
        rowIndex = getDG(identity).datagrid('getRowIndex', row);
    }
    getDG(identity).datagrid('deleteRow', rowIndex);
    if (rowIndex == editIndex) {
        getDG(identity).datagrid('cancelEdit', editIndex);
        EDIT_DG.INDEX[identity] = undefined;
    }
}

function cancelEdit(identity) {
    var editIndex = EDIT_DG.INDEX[identity];
    if (editIndex != undefined)
        getDG(identity).datagrid('cancelEdit', editIndex);
    EDIT_DG.INDEX[identity] = undefined;
}

function validCancelEdit(identity) {
    var editIndex = EDIT_DG.INDEX[identity];
    if (editIndex != undefined) {
        if (!getDG(identity).datagrid('validateRow', editIndex)) {
            getDG(identity).datagrid('cancelEdit', editIndex);
        } else {
            getDG(identity).datagrid('endEdit', editIndex);
        }
    }
}

function getChanges(identity) {
    var rows = getDG(identity).datagrid('getChanges');
    console.log(rows);
    alert(rows.length + ' rows are changed!');
}

