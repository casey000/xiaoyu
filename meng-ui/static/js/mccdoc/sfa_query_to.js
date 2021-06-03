var sub_win = frameElement.api;
var P = (sub_win == null ? null : sub_win.opener);
var dialog_top = '15%';
var gid;
var _to_type_names = {
    '1': '排故类',
    '2': '普查类',
    '3': '飞机检查/维护类',
    '4': '生产保障类',
    '5': '串件类',
    '6': '串件恢复类',
    '7': '借件归还类',
    '8': '装机验证类',

};
var customModelSettings = {
    'TO_LIST': {
        //列表项配置
        gridOptions: {
            allColModels: {
                'toNumber': {
                    formatter: viewTo
                },
                'type': {
                    formatter: typeFormatter
                },
                'sourceType': {
                    formatter: sourceTypeFormatter
                },
                'description': {
                    sortable: false
                },
                'editStatus': {
                    formatter: editStatusFormatter
                },
                'executionStatus': {
                    formatter: executionStatusFormatter
                },
                'monitorNo': {
                    formatter: monitorNoFormatter
                },
                "createTime": {
                    formatter: dateTimeFormatter
                },
                'edit': {
                    name: 'Operate',
                    colNameCn: 'Operate',
                    colNameEn: 'Operate',
                    isOpts: true,
                    width: 60,
                    formatter: operation
                }
            }
        }
    }
};

//操作列（修改和删除功能）
function operation(cellvalue, options, rowObject) {
    gid = options.gid;
    //修改
    var updateDiv = "";
    //判断是否拥有(修改)权限
    /*if(gridPermissionMap.to_editPermission){*/
    updateDiv = '<div id="' + options.rowId
        + '" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit" title="Edit"'
        + ' onclick="editTo(this,event,' + rowObject.type + ');"><span class="ui-icon ui-icon-pencil"></span></div>';
    /*}*/
    //删除
    var delDiv = "";
    //判断是否拥有(删除)权限
    /*if(gridPermissionMap.to_deletePermission){*/
    delDiv = '<div style="padding-left:8px" id="' + options.rowId
        + '" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit" title="Delete"'
        + ' onclick="confirmDel(this,event);"><span class="ui-icon ui-icon-close"></span></div>';
    /*}*/
    //下发
    var issuedDiv = "";
    //判断是否拥有(下发)权限
    /*if(gridPermissionMap.to_suedPermission){*/
    issuedDiv = '<div style="padding-left:8px" id="issued_' + options.rowId
        + '" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit" title="Issued"><span class="ui-icon-issued"></span></div>';
    $("#issued_" + options.rowId).die('click').live("click", function () {
        issuedTo(rowObject);
    });
    /*}*/
    //关闭
    var closeDiv = "";
    //判断是否拥有(关闭)权限
    /*if(gridPermissionMap.to_closePermission){*/
    closeDiv = '<div style="padding-left:8px" id="close_' + options.rowId
        + '" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit" title="Close"><span class="ui-icon ui-icon-power"></span></div>';
    $("#close_" + options.rowId).die('click').live("click", function () {
        confirmClosed(rowObject);
    });
    /*}*/
    var user = window.top.document['_LOGIN_USER'];
    //编写状态等于 Editing 并且是同一个提交人
    if(rowObject.editStatus == 1 && user.accountNumber == rowObject.submitterSn) {
        return updateDiv + delDiv;
        //编写状态等于 Checking,Approving,Approved
    } else if(rowObject.editStatus > 1 && rowObject.editStatus < 5) {
        return "";
        //编写状态等于 Active 并且执行状态等于 open
    } else if(rowObject.editStatus == 5 && rowObject.executionStatus == 1 && rowObject.isNewest == 1) {
        if(rowObject.defectId) {
            return issuedDiv;
        } else {
            //普查类只显示下发
            if(rowObject.type == 2) {
                return issuedDiv;
            } else {
                return issuedDiv + closeDiv;
            }
        }
    } else {
        return "";
    }
}

function dateTimeFormatter(cellvalue){
    if(!cellvalue){ return ""}
    return new Date(cellvalue).Format("yyyy-MM-dd hh:mm:ss")
}

//编辑TO
function editTo(obj, event, type) {
    var id = $(obj).attr("id");
    var url_ = "";
    if(type == '1') {
        url_ = "/views/mccdoc/edit/edit_fault_isolate_to.shtml";
    } else if(type == '2') {
        url_ = "/views/mccdoc/edit/edit_general_survey_to.shtml";
    } else if(type == '3') {
        url_ = "/views/mccdoc/edit/edit_other_to.shtml";
    } else if(type == '4') {
        url_ = "/views/mccdoc/edit/edit_other_to.shtml";
    }
    var parameters = {
        "toType": type,
        "pageType": "edit",
        "id": id
    };
    var dialog_param = {
        title: 'Edit TO',
        width: '1000px',
        height: '600px',
        top: dialog_top,
        esc: true,
        cache: false,
        max: false,
        min: false,
        parent: this,
        content: 'url:' + url_,
        close: function () {
            $(document).sfaQuery().reloadQueryGrid();
        },
        data: parameters
    };
    if(P) {
        P.$.dialog(dialog_param);
    } else {
        $.dialog(dialog_param);
    }
}

/**
 * 查看TO
 *
 * @param cellvalue
 * @param options
 * @param rowObject
 */
function viewTo(cellvalue, options, rowObject) {
    var html = "";
    /*if(gridPermissionMap.to_viewPermission) {*/
    if(true) {
        if(cellvalue == null) {
            html = '<a href="#" id="' + options.rowId + '" style="color:#f60" title="TO NO" onclick="view(this,event,\'' + rowObject.type + '\');" >view</a>';
        } else {
            html = '<a href="#" id="' + options.rowId + '" style="color:#f60" title="TO NO" onclick="view(this,event,\'' + rowObject.type + '\');" >' + cellvalue + '</a>';
        }
    } else {
        if(cellvalue == null) {
            html = 'view';
        } else {
            html = cellvalue;
        }
    }
    return html;
}

function viewDetail(toId, type) {
    var url = basePath + "/mccdoc/to_management_editOrView.action?id=" + toId + "&type=" + type;
    $("#view_detail").live("click", function () {
        P.$.dialog({
            id: 'ViewTO',
            title: 'View TO',
            width: '1000px',
            height: '600px',
            top: '35%',
            esc: true,
            cache: false,
            max: false,
            min: false,
            parent: null,
            lock: true,
            content: "url:" + url
        });
    });
}

/**
 * type格式
 *
 * @param cellvalue
 * @param options
 * @param rowObject
 */
function typeFormatter(cellvalue, options, rowObject) {
    cellvalue = cellvalue || '';
    return _to_type_names[cellvalue] || 'N/A';
}

/**
 * sourceType格式
 *
 * @param cellvalue
 * @param options
 * @param rowObject
 */
function sourceTypeFormatter(cellvalue, options, rowObject) {
    if('0' == cellvalue) {
        return "MCC";
    } else if('1' == cellvalue) {
        return "PPC";
    } else {
        return "TS";
    }
}

/**
 * editStatus格式
 *
 * @param cellvalue
 * @param options
 * @param rowObject
 */
function editStatusFormatter(cellvalue, options, rowObject) {
    if('1' == cellvalue) {
        return "Editing";
    } else if('2' == cellvalue) {
        return "Checking";
    } else if('3' == cellvalue) {
        return "Approving";
    } else if('4' == cellvalue) {
        return "Approved";
    } else if('5' == cellvalue) {
        return "Active";
    } else if('6' == cellvalue) {
        return "Superseded";
    }
}

/**
 * executionStatus格式
 *
 * @param cellvalue
 * @param options
 * @param rowObject
 */
function executionStatusFormatter(cellvalue, options, rowObject) {
    if('1' == cellvalue) {
        return "open";
    } else if('2' == cellvalue) {
        return "process";
    } else if('3' == cellvalue) {
        return "complete";
    } else if('4' == cellvalue) {
        return "close";
    } else {
        return "";
    }

}

/**
 * 查看故障跟踪单
 *
 * @param cellvalue
 * @param options
 * @param rowObject
 */
function monitorNoFormatter(cellvalue, options, rowObject) {
    var html = "";
    if(cellvalue != null) {
        html = '<a href="#" id="' + rowObject.troubleFollowUpId + '" style="color:#f60"  onclick="showDialog_ViewOrEdit(this);" >' + cellvalue + '</a>';
    }
    return html;
}

function showDialog_ViewOrEdit(obj) {
    var troubleId = $(obj).attr('id');
    var doType = 'edit';
    var parameters = {
        "methodType": doType,
        "rowId": troubleId
    };
    var actionUrl = basePath + '/work/work_trouble_toView.action?troubleId=' + troubleId;
    var dialog_param = {
        id: 'Page',
        title: 'Track Basic Information ' + doType,
        width: '1050px',
        height: '500px',
        top: '80px',
        esc: true,
        lock: true,
        cache: false,
        close: function () {
            $(document).sfaQuery().reloadQueryGrid();
        },
        max: false,
        min: false,
        parent: this,
        content: 'url:' + actionUrl,
        data: parameters
    };
    if(P) {
        P.$.dialog(dialog_param);
    } else {
        $.dialog(dialog_param);
    }
}

/**
 * 查看详细信息
 *
 * @param obj
 * @param event
 * @param type
 */
function view(obj, event, type) {
    var url_ = "";
    if(type == '1') {
        url_ = "/views/mccdoc/view/view_fault_isolate_to.shtml";
    } else if(type == '2') {
        url_ = "/views/mccdoc/view/view_general_survey_to.shtml";
    } else if(type == '3') {
        url_ = "/views/mccdoc/view/view_other_to.shtml";
    } else if(type == '4') {
        url_ = "/views/mccdoc/view/view_other_to.shtml";
    }
    var parameters = {
        "toType": type,
        "pageType": "view",
        "id": $(obj).attr("id")
    };
    var dialog_param = {
        title: 'View TO',
        width: '1050px',
        height: '650px',
        top: dialog_top,
        esc: true,
        cache: false,
        max: false,
        lock: true,
        min: false,
        parent: this,
        close: function () {
            $(document).sfaQuery().reloadQueryGrid();
        },
        content: 'url:' + url_,
        data: parameters
    };
    if(P) {
        P.$.dialog(dialog_param);
    } else {
        $.dialog(dialog_param);
    }
}


//提示删除
function confirmDel(obj, event) {
    if(!obj.id) {
        $.dialog.alert("Please select Date!");
        return false;
    }
    var params = {
        "id": obj.id
    };

    if(confirm('你确定要删除当前TO吗 ?')) {
        var dialog_param = {
            id: "toDelRemark",
            title: "删除TO",
            width: 300,
            lock: true,
            esc: true,
            height: 240,
            top: "15%",
            cache: false,
            parent: this,
            data: params,
            content: "url:" + basePath + "/views/mccdoc/to_del_remark.shtml",
            close: function () {
                if(this.data["isOk"]) {
                    $(document).sfaQuery().reloadQueryGrid();
                }
            }
        };
        if(P) {
            P.$.dialog(dialog_param);
        } else {
            $.dialog(dialog_param);
        }
    }
}

