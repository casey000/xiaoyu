var sub_win = frameElement.api;
var P = (sub_win == null ? null : sub_win.opener);
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
$(function () {
    var s_params = {};
    var allConds = {};
    if (sub_win && sub_win.data && sub_win.data.isDialog == 1) {
        s_params = {
            "qname": ['editStatus', 'executionStatus', 'isNewest', 'sourceType'],
            'qoperator': ['equals', 'equals', 'equals', 'in'],
            'qvalue': ['5', '1', '1', sub_win.data.sourceType],
            'sidx': 'createTime,toNumber',
            'sord': 'asc,asc'
        };
        allConds = {
            'editStatus': {hidden: true},
            'executionStatus': {hidden: true},
            'sourceType': {hidden: true}
        };
        if ($("#add_btn")) {
            $("#add_btn").remove();
        }
        if ($("#excel_btn")) {
            $("#excel_btn").remove();
        }
    }
    $('.date_input').datebox({});
    //最简配置
    var options_simple = {
        view: 'V_TO_LIST',	//列表名称, 必填
        defaultParam: s_params, //默认查询参数
        //查询条件(可选配置)
        qcOptions: {
            qcBoxId: 'qc_box', // 查询框Id, 默认值: qc_box
            allConds: $.extend({
                'type': {
                    name: 'type',
                    type: 'select',
                    options: _to_type_names
                }
            }, allConds)
        },
        //结果列表(可选配置)
        gridOptions: {
            gridId: 'gridTable', //列表Id
            optsCols: ["edit"], //要显示的操作列,默认值:[]
            optsFirst: true,
            jqGridSettings: {
                multiselect: false
            }
        }
    };
    $(document).sfaQuery(options_simple);
});

var customModelSettings = {
    'TO_LIST': {
        //列表项配置
        gridOptions: {
            allColModels: {
                'toNumber': {formatter: viewTo},
                'type': {formatter: typeFormatter},
                'sourceType': {formatter: sourceTypeFormatter},
                'description': {sortable: false},
                'editStatus': {formatter: editStatusFormatter},
                'executionStatus': {formatter: executionStatusFormatter},
                'monitorNo': {formatter: monitorNoFormatter},
                'defectNo': {formatter: defectNoFormatter},
                'edit': {name: 'Operate', colNameEn: 'Operate', isOpts: true, width: 60, formatter: operation}
            },
            jqGridSettings: {
                loadComplete: function () {

                }
            }
        }
    }
};

//操作列（修改和删除功能）
function operation(cellvalue, options, rowObject) {

    var vauth_to_edit = "TO_EDIT";
    var vauth_to_delete = "TO_DELETE";
    var vauth_to_issue = "TO_ISSUE";
    var result_to_edit = VALID_AUTH(vauth_to_edit);
    var result_to_delete = VALID_AUTH(vauth_to_delete);
    var result_to_issue = VALID_AUTH(vauth_to_issue);

    //修改
    var updateDiv = "";
    //判断是否拥有(修改)权限
    if (result_to_edit) {
        updateDiv = '<div id="' + options.rowId
            + '" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit" title="Edit"'
            + ' onclick="editTo(this,event,' + rowObject.type + ');"><span class="ui-icon ui-icon-pencil"></span></div>';
    }
    //删除
    var delDiv = "";
    //判断是否拥有(删除)权限
    if (result_to_delete) {
        delDiv = '<div style="padding-left:8px" id="' + options.rowId
            + '" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit" title="Delete"'
            + ' onclick="confirmDel(this,event);"><span class="ui-icon ui-icon-close"></span></div>';
    }
    //下发
    var issuedDiv = "";
    //判断是否拥有(下发)权限
    if (result_to_issue) {
        issuedDiv = '<div style="padding-left:8px" id="issued_' + options.rowId
            + '" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit" title="Issued"><span class="ui-icon-issued"></span></div>';
        $("#issued_" + options.rowId).die('click').live("click", function () {
            issuedTo(rowObject);
        });
    }
    //关闭
    var closeDiv = "";
    //判断是否拥有(关闭)权限
    closeDiv = '<div style="padding-left:8px" id="close_' + options.rowId
        + '" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit" title="Close"><span class="ui-icon ui-icon-power"></span></div>';
    $("#close_" + options.rowId).die('click').live("click", function () {
        confirmClosed(rowObject);
    });
    var user = getLoginInfo();

    //编写状态等于 Editing 并且是同一个提交人
    if (rowObject.editStatus == 1 && user.accountNumber == rowObject.submitterSn) {
        return updateDiv + delDiv;
        //编写状态等于 Checking,Approving,Approved
    }
    // 串件类且checking状态
    if (rowObject.editStatus == 2 && user.accountNumber == rowObject.submitterSn) {
        if (rowObject.type == 5 || rowObject.type == 6 || rowObject.type == 7|| rowObject.type == 8) {
            return updateDiv;
            //编写状态等于 Checking,Approving
        }
    }

    if (rowObject.editStatus > 1 && rowObject.editStatus < 5) {
        return "";
        //编写状态等于 Active 并且执行状态等于 open
    } else if (rowObject.editStatus == 5 && rowObject.executionStatus == 1 && rowObject.isNewest == 1 ) {
        //故障类的TO不用下发
        if (rowObject.defectId) {
            return "";
        } else {
            //普查类只显示下发
            if (rowObject.type == 2) {
                return issuedDiv;
            } else {
                return issuedDiv + closeDiv;
            }
        }
    }
    return "";
}

//添加按钮click事件方法
$("#add_btn").live("click", function () {
    $.dialog({
        id: 'addToDialog',
        title: 'Add TO',
        width: '1000px',
        height: '600px',
        top: '35%',
        esc: true,
        cache: false,
        max: false,
        min: false,
        parent: top,
        content: 'url:/views/mccdoc/edit/add_to_for_check_type.shtml'
    });
});


//导出Excel
$("#excel_btn").live("click", function () {
    var data = $(document).sfaQuery().postData();
    var form = $("<form method='post' style='display:none' action='" + basePath + "/api/v1/mccdoc/to_base_info/exportExcel'></form>");
    $.each(data, function (key, val) {
        if (typeof (val) == "object") {
            $.each(val, function (k1, v1) {
                form.append($("<input name='" + key + "' value = '" + v1 + "'/>"));
            });
        } else {
            form.append($("<input name='" + key + "' value = '" + val + "'/>"));
        }
    });
    $(this).parent().append(form);
    form.submit();
    form.remove();
});

//编辑TO
function editTo(obj, event, type) {
    var id = $(obj).attr("id");
    var url_ = "";
    if (type == '1') {
        url_ = "/views/mccdoc/edit/edit_fault_isolate_to.shtml";
    } else if (type == '2') {
        url_ = "/views/mccdoc/edit/edit_general_survey_to.shtml";
    } else if (type == '3') {
        url_ = "/views/mccdoc/edit/edit_other_to.shtml";
    } else if (type == '4') {
        url_ = "/views/mccdoc/edit/edit_other_to.shtml";
    }else if (type == '5') {
        url_ = "/views/mccdoc/edit/qiangjian_to.shtml";
    }else if (type == '6') {
        url_ = "/views/mccdoc/edit/grab_piece_recovery.shtml";
    } else if (type == '7') {
        url_ = "/views/mccdoc/edit/borrowreturn_to.shtml";
    } else if (type == '8') {
        url_ = "/views/mccdoc/edit/edict_installation_verification.shtml";
    }
    var parameters = {
        "toType": type,
        "pageType": "edit",
        "id": id
    };
    console.log(id);
    $.dialog({
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
        data: parameters,
        close: function () {
            if (this.data['reload'] == '1' && $(document).sfaQuery()) {
                $(document).sfaQuery().reloadQueryGrid();
            }
        }
    });
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
    /*if (gridPermissionMap.to_viewPermission) {*/
    if (true) {
        if (cellvalue == null) {
            html = '<a href="#" id="' + options.rowId + '" style="color:#f60" title="TO NO" onclick="view(this,event,\'' + rowObject.type + '\');" >view</a>';
        } else {
            html = '<a href="#" id="' + options.rowId + '" style="color:#f60" title="TO NO" onclick="view(this,event,\'' + rowObject.type + '\');" >' + cellvalue + '</a>';
        }
    } else {
        if (cellvalue == null) {
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
    if ('0' == cellvalue) {
        return "MCC";
    } else if ('1' == cellvalue) {
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

    if ('1' == cellvalue) {
        return "Editing";
    } else if ('2' == cellvalue) {
        return "Checking";
    } else if ('3' == cellvalue) {
        return "Approving";
    } else if ('4' == cellvalue) {
        return "Approved";
    } else if ('5' == cellvalue) {
        return "Active";
    } else if ('6' == cellvalue) {
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
    if ('1' == cellvalue) {
        return "open";
    } else if ('2' == cellvalue) {
        return "process";
    } else if ('3' == cellvalue) {
        return "complete";
    } else if ('4' == cellvalue) {
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
    if (cellvalue != null) {
        html = cellvalue;
    }
    return html;
}

/**
 * 查看故障单
 *
 * @param cellvalue
 * @param options
 * @param rowObject
 */
function defectNoFormatter(cellvalue, options, rowObject) {
    var html = "";
    if (cellvalue != null) {
        html = '<a href="#" id="' + rowObject.defectId + '" style="color:#f60"  onclick="showDefect(this);" >' + cellvalue + '</a>';
    }
    return html;
}


function showDefect(obj) {
    var curHeight;
    if( window.screen.height < 800){
        curHeight = $(window).height()*1.1.toString()
    }else{
        curHeight = '700'
    }
    var defectId = $(obj).attr('id');
    var defectNo = obj.innerText;    //多传一个defectNo 故障详情页的子页面调的是父页面的defectNo
    ShowWindowIframe({
        width: "1000",
        height: curHeight,
        title: "查看故障",
        param: {defectId: defectId,defectNo:defectNo},
        url: "/views/defect/defectDetails.shtml"
    });
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
    if (type == '1') {
        url_ = "/views/mccdoc/view/view_fault_isolate_to.shtml";
    } else if (type == '2') {
        url_ = "/views/mccdoc/view/view_general_survey_to.shtml";
    } else if (type == '3') {
        url_ = "/views/mccdoc/view/view_other_to.shtml";
    } else if (type == '4') {
        url_ = "/views/mccdoc/view/view_other_to.shtml";
    }else if (type == '5') {
        url_ = "/views/mccdoc/view/view_qiangjian_to.shtml";
    }else if (type == '6') {
        url_ = "/views/mccdoc/view/view_grab_piece_recovery.shtml";
    }
    else if (type == '7') {
        url_ = "/views/mccdoc/view/view_borrowreturn_to.shtml";
    }
    else if( type == 8){
        url_ = "/views/mccdoc/view/view_installation_verification.shtml";
    }
    var parameters = {
        "toType": type,
        "pageType": "view",
        "id": $(obj).attr("id"),
        "toNo":$(obj).context.innerText
    };

    var to_no = $(obj).text() || 'TO';
    if (to_no == 'view') to_no = 'TO';
    var dialog_param = {
        title: 'View ' + to_no,
        width: '1050px',
        height: '600px',
        top: '35%',
        esc: true,
        cache: false,
        max: false,
        lock: true,
        min: false,
        parent: null,
        close: function () {
            //  $(document).sfaQuery().reloadQueryGrid();
        },
        content: 'url:' + url_,
        data: parameters
    };
    if (P) {
        P.$.dialog(dialog_param);
    } else {
        $.dialog(dialog_param);
    }
}


//提示删除
function confirmDel(obj, event) {
    if (!obj.id) {
        $.dialog.alert("Please select Date!");
        return false;
    }
    var params = {
        "id": obj.id
    };

    if (confirm('你确定要删除当前TO吗 ?')) {
        $.dialog({
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
                if (this.data["isOk"]) {
                    $(document).sfaQuery().reloadQueryGrid();
                }
            }
        });
    }
}
var dialog_top = '15%';