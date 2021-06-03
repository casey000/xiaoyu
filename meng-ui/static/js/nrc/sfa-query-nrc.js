var customModelSettings = {
    "NRC": {
        // 列表项配置
        gridOptions: {
            allColModels: {
                "aeName": {
                    sortable: false
                },
                "status": {
                    formatter: formatStatus,
                    formatType: 'map',
                    pattern: {
                        "1": "OPEN",
                        "2": "OPEN",
                        "3": "CLOSE",
                        "": ""
                    },
                },
                "itemCat": {
                    formatType: 'map',
                    pattern: {
                        "1": "STRUCTURE",
                        "2": "MINOR DEFECT",
                        "3": "CHK/SVC",
                        "4": "CM",
                        "": ""
                    },
                    formatter: formatItemCat
                },
                "nrcNo": {
                    formatter: formatNrcNo
                },
                "type": {
                    formatter: formatType,
                    sortable: false
                },
                "mrNo": {
                    formatter: formatMrNo
                },
                "mrStatus": {
                    formatter: formatMrStatus
                },
                "trNo": {
                    formatter: formatTrNo
                },
                "nrcer.name": {
                    formatter: formatClose
                },
                "nrcTime": {
                    formatter: formatClose
                },
                "edit": {
                    colNameEn: "E",
                    isOpts: true,
                    width: 25,
                    formatter: formatEdit
                },
                "reopen": {
                    colNameEn: "O",
                    isOpts: true,
                    width: 25,
                    formatter: formatReopen
                },
                "delete": {
                    colNameEn: "D",
                    isOpts: true,
                    width: 25,
                    formatter: formatDelete
                },
                "remark": {
                    formatter: formatRemark
                }
            }
        }
    }
};

function formatStatus(cellValue, options, rowObject) {
    if (cellValue == "1") {
        //OPEN状态
        return "<font style='color:red'>OPEN</font>";
    } else if (cellValue == "2") {
        rowObject.hoReason = rowObject.hoReason || '';
        //Holding状态, 推迟原因: 1-技术支援，2-航材，3-专业工具，4-停场时间
        var res = (rowObject.hoReason.indexOf("1") >= 0 ? (rowObject.fileStatus == "Y" ? true : false) : true)      //选择了技术支援,必须要有文件
            && (rowObject.hoReason.indexOf("2") >= 0 ? (rowObject.mrStatus == "Y" ? true : false) : true)           //选择了航材,航材必须满足
            && (rowObject.hoReason.indexOf("3") >= 0 ? (rowObject.trStatus == "Y" ? true : false) : true);          //选择了专业工具,工具必须满足
        return "<font style='color:" + (res ? "red" : "orange") + "'>OPEN</font>";
    } else if (cellValue == "3") {
        //Close状态
        return "<font style='color:green'>CLOSE</font>";
    } else {
        return "";
    }
}

function formatClose(cellValue, options, rowObject) {
    if (rowObject.status == "3") {
        return cellValue == null ? "" : cellValue;
    } else {
        return "";
    }
}

function formatItemCat(cellValue, options, rowObject) {
    if (cellValue == "1") {
        return "STRUCTURE";
    } else if (cellValue == "2") {
        return "MINOR DEFECT";
    } else if (cellValue == "3") {
        return "CHK/SVC";
    } else if (cellValue == "4") {
        return "CM";
    } else {
        return "";
    }
}

function formatNrcNo(cellValue, options, rowObject) {
    if (permissionMap.view) {
        return '<a href="#" style="color:#f60" title="View" onclick="view(this,event,'
            + rowObject.id + ');">' + (cellValue == null ? "" : cellValue) + '</a>';
    } else {
        return cellValue;
    }
}

function formatType(cellValue, options, rowObject) {
    if (cellValue == "LM") {
        return "<font style='color:red'>LM<font>";
    } else {
        return cellValue;
    }
}

function formatMrNo(cellValue, options, rowObject) {
    cellValue = rowObject.mrNo;
    if (null != cellValue) {
        if (permissionMap.mrview) {
            return "<a href='#' style='color:" + (rowObject.status == 3 ? "block" : ((rowObject.mrStatus == "Y") ? "green" : "red"))
                + "' title='View MR' onclick='viewMr(this,event,\"" + cellValue + "\");'>" + cellValue + "</a>";
        } else {
            return "<font style='color:" + (rowObject.status == 3 ? "block" : ((rowObject.mrStatus == "Y") ? "green" : "red")) + "'>" + cellValue + "</font>";
        }
    } else {
        return "";
    }
}

function formatMrStatus(cellValue, options, rowObject) {
    if (cellValue == "Y") {
        return "Yes";
    } else if (cellValue == "N") {
        return "No";
    } else {
        return "";
    }
}

function formatTrNo(cellValue, options, rowObject) {
    cellValue = rowObject.trNo;
    if (null != cellValue) {
        if (permissionMap.mrview) {
            return "<a href='#' style='color:" + (rowObject.status == 3 ? "block" : ((rowObject.trStatus == "Y") ? "green" : "red"))
                + "' title='View TR' onclick='viewTr(this,event,\"" + cellValue + "\");'>" + cellValue + "</a>";
        } else {
            return "<font style='color:" + (rowObject.status == 3 ? "block" : ((rowObject.trStatus == "Y") ? "green" : "red")) + "'>" + cellValue + "</font>";
        }
    } else {
        return "";
    }
}

function formatEdit(cellValue, options, rowObject) {
    if (rowObject.status != "3") {
        return '<div class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit" title="Edit" onclick="edit(this,event,'
            + rowObject.id + ');"><span class="ui-icon ui-icon-pencil"></span></div>';
    } else {
        return "";
    }
}

function formatReopen(cellValue, options, rowObject) {
    if (rowObject.status == "3") {
        return '<div class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit" title="ReOpen" onclick="reopen(this,event,'
            + rowObject.id + ');"><span class="ui-icon ui-icon-folder-open"></span></div>';
    } else {
        return "";
    }
}

function formatDelete(cellValue, options, rowObject) {
    if (rowObject.status != "3") {
        return '<div class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit" title="Delete" onclick="del(this,event,'
            + rowObject.id + ');"><span class="ui-icon ui-icon-close"></span></div>';
    } else {
        return "";
    }
}

function formatRemark(cellValue, options, rowObject) {
    cellValue = (null == cellValue) ? " " : cellValue;
    if (permissionMap.remark) {
        var ele = "<div title='Double Click' width='100%' height='100%' id='remark_" + rowObject.id + "'>" + cellValue + "</div>";
        $("#remark_" + rowObject.id).die("dblclick").live("dblclick", function () {
            remark(this, event, rowObject.id);
        });
        return ele;
    } else {
        return cellValue;
    }
}

// 编辑
function edit(obj, event, id) {
    $.dialog({
        id: "editNrcPage",
        title: Config.dialog_edit_title,
        width: Config.dialog_width,
        height: Config.dialog_height,
        top: Config.dialog_top,
        lock: true,
        esc: true,
        cache: false,
        parent: this,
        content: "url:" + basePath + "/nrc/nrc_toEdit.action?id=" + id + "&type=toEdit",
        close: function () {
            if ($(document).sfaQuery()) {
                $(document).sfaQuery().reloadQueryGrid();
            }
        }
    });
}

// 重新打开
function reopen(obj, event, id) {
    var actionUrl = basePath + "/nrc/nrc_reopen.action?id=" + id;
    P.$.dialog.confirm("Are you sure to reopen?", function () {
        $.ajax({
            url: actionUrl,
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            cache: false,
            success: function (obj, textStatus) {
                var data = JSON.parse(obj);
                if (data.ajaxResult == "success") {
                    P.$.dialog.alert("Reopen success.", function () {
                        $(document).sfaQuery().reloadQueryGrid();
                    });

                } else {
                    var msg = "";
                    msg = data.messagekey + ": " + data.messageArgs;
                    if (msg) {
                        P.$.dialog.alert(msg);
                    }
                }
            }
        });
    });
}

// 删除
function del(obj, event, id) {
    $.dialog({
        title: Config.dialog_delete_title,
        width: Config.dialog_delete_width,
        height: Config.dialog_delete_height,
        top: Config.dialog_top,
        esc: true,
        cache: false,
        parent: this,
        content: "url:" + basePath + "/nrc/nrc_toDelete.action?id=" + id,
        close: function () {
            if ($(document).sfaQuery()) {
                $(document).sfaQuery().reloadQueryGrid();
            }
        }
    });
}

// 查看
function view(obj, event, id) {
    P.$.dialog({
        title: Config.dialog_view_title,
        width: Config.dialog_width,
        height: Config.dialog_view_height,
        top: Config.dialog_top,
        esc: true,
        cache: false,
        parent: this,
        content: "url:" + basePath + "/nrc/nrc_view.action?id=" + id
    });
}

// MR
function viewMr(obj, event, mrNo) {
    P.$.dialog({
        title: Config.dialog_mr_title,
        width: Config.dialog_width,
        height: Config.dialog_view_height,
        top: Config.dialog_top,
        esc: true,
        cache: false,
        parent: this,
        content: "url:" + basePath + "/mr/mr_view.action?mrNo=" + mrNo,
        data: {revise: false},
        close: function () {
            if ($(document).sfaQuery()) {
                $(document).sfaQuery().reloadQueryGrid();
            }
        }
    });
}

// TR
function viewTr(obj, event, trNo) {
    P.$.dialog({
        title: Config.dialog_tr_title,
        width: Config.dialog_width,
        height: Config.dialog_view_height,
        top: Config.dialog_top,
        esc: true,
        cache: false,
        parent: this,
        content: "url:" + basePath + "/te/tr_view.action?trNo=" + trNo
    });
}

// Remark
function remark(obj, event, id) {
    $.dialog({
        title: Config.dialog_remark_title,
        width: Config.dialog_delete_width,
        height: Config.dialog_delete_height,
        top: Config.dialog_top,
        esc: true,
        cache: false,
        perent: this,
        content: "url:" + basePath + "/nrc/nrc_toRemark.action?id=" + id,
        close: function () {
            if ($(document).sfaQuery()) {
                $(document).sfaQuery().reloadQueryGrid();
            }
        }
    });
}

var Config = {
    dialog_add_title: "Add Non-routine Card",
    dialog_delete_title: "Delete Non-routine Card",
    dialog_edit_title: "Edit Non-routine Card",
    dialog_view_title: "View Non-routine Card",
    dialog_remark_title: "Remark Non-routine Card",
    dialog_mr_title: "View Material Requires",
    dialog_tr_title: "View Tooling Requires",
    dialog_import_title: "Import Non-Routine Card",

    dialog_width: 900,
    dialog_delete_width: 500,
    dialog_height: 600,
    dialog_delete_height: 230,
    dialog_view_height: 600,
    dialog_top: "15%"
};