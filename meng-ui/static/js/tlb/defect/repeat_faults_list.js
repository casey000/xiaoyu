/*
 * Copyright 2017 SF Airlines Co., Ltd. All rights reserved.
 * 本文件仅限于顺丰航空有限公司内部传阅，禁止外泄以及用于其他的商业目的。
 */

$(function () {
    //todo 这个js中间不知道哪里出错了，这个方法放在下面绑定不生效，故暂时移到最前面
    $("#excel_btn").click(function(){
        $.exportExcel({
            url: "/api/v1/defect/repeat/export",
            filename: "Defect Repeat Faults"
        })
    });
    //最简配置
    var options_simple = {
        view: 'V_DEFECT_REPEATFAULTS_QUERY',	//列表名称, 必填
        //查询条件(可选配置)
        qcOptions: {
            qcBoxId: 'qc_box', // 查询框Id, 默认值: qc_box
        },
        //结果列表(可选配置)
        gridOptions: {
            gridId: 'gridTable', //列表Id
            optsCols: [], //要显示的操作列,默认值:[]
            optsFirst: true,
            jqGridSettings: {
                multiselect: false
            }
        }
    };
    $(document).sfaQuery(options_simple);
});

var customModelSettings = {
    'DEFECT_REPEATFAULTS': {
        //列表项配置
        gridOptions: {
            allColModels: {
                'repeatFaults': {
                    formatter: queryDefectNo
                },
                'archiveStatus': {
                    formatter: formatArchiveStatus
                },
                'isVerify': {
                    formatter: function (cellValue, options, rowObject) {
                        if (cellValue == "0") {
                            return "No";
                        } else if (cellValue == "1") {
                            return "Yes";
                        } else {
                            return "";
                        }
                    }
                },
                'src': {
                    formatter: function (cellValue, options, rowObject) {
                        if (cellValue == "USER") {
                            return "手动";
                        } else if (cellValue == "SYS") {
                            return "系统";
                        } else {
                            return "";
                        }
                    }
                },
                'status': {
                    formatter: function (cellValue, options, rowObject) {
                        if (cellValue == "1") {
                            return "有效";
                        } else if (cellValue == "0") {
                            return "失效";
                        } else {
                            return "";
                        }
                    }
                },
                'verifyResult': {
                    formatter: editVerifyResult
                },
                'archiveRemark': {
                    formatter: formatArchiveRemark
                }
            },

            jqGridSettings: {
                //jqGrid配置项
                id: "repeatFaults",
                multiselect: false// 可多选，出现多选框
            }
        }
    }
};

function selfPrompt(title, content, yes, value, _parent) {
    value = value || '';
    var input;
    return P.$.dialog({
        title: title,
        id: title,
        icon: 'confirm.gif',
        fixed: true,
        lock: true,
        parent: this,
        content: [
            '<div style="margin-bottom:5px;font-size:12px">',
            content,
            '</div>',
            '<div>',
            '<textarea rows="3" style="width:18em;padding:6px 4px" >' + value + '</textarea>',
            '</div>'
        ].join(''),
        init: function () {
            input = this.DOM.content[0].getElementsByTagName('textarea')[0];
            input.select();
            input.focus();
        },
        ok: function (here) {
            if(input.value == '') {
                P.$.dialog.alert("请输入归档备注");
                return false;
            }
            return yes && yes.call(this, input.value, here);
        },
        cancel: true
    });
}


/**
 * 编辑归档备注
 */
function editArchiveRemark(faultNo, remark) {
    let params = {
        'faultNo': faultNo,
        'archiveRemark': remark
    };
    $.ajax({
        url: basePath + "/api/v1/defect/archive/remark",
        type: 'post',
        cache: false,
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(params),
        success: function (dataMsg) {
            if(dataMsg.code == 200) {
                P.$.dialog.alert("编辑归档备注成功.");
                $(document).sfaQuery().reloadQueryGrid();
            } else {
                if(dataMsg.msg != null && dataMsg.msg != "") {
                    P.$.dialog.alert("归档归档备注失败." + dataMsg.msg);
                }
            }
        }
    });
}

function formatArchiveRemark(cellValue, options, rowObject) {
    if (cellValue == null) {
        return '';
    }

    // if ($.inArray('archive', perssions) < 0) {
    //     return cellValue;
    // }

    var retHtml = '<a id="repeat_edit_archive_remark_' + rowObject.repeatFaults + '" href="javascript:void(0)" style="color:#f60">' + cellValue + '</a>';
    $("#repeat_edit_archive_remark_" + rowObject.repeatFaults).die("click").live("click", function () {
        selfPrompt('编辑' + rowObject.repeatFaults + '归档备注', '请输入归档备注:', function (value) {
            editArchiveRemark(rowObject.repeatFaults, value);
        }, cellValue);
    });

    return retHtml;
}


function editVerifyResult(cellValue, options, rowObject) {
    var verifyResult = '';
    if (cellValue == "y") {
        verifyResult = "Yes";
    } else if (cellValue == "n") {
        verifyResult = "No";
    }
    //
    // if (rowObject.archiveStatus == '1' || $.inArray('confirm', perssions) < 0) {
    //     return verifyResult;
    // }

    var trHTML = '<a id="verifyResult_edit_' + rowObject.repeatFaults +
        '" href="javascript:void(0)"  style="color:#f60" title="Edit">' + verifyResult + '</a>';

    $("#verifyResult_edit_" + rowObject.repeatFaults).die("click").live("click", function () {
        if (cellValue == "n") {
            P.$.dialog.alert("不允许编辑校验结果为NO的记录，请手动重新创建。");
        } else {
            editVerifyResultInfo(rowObject);
        }
    });

    return trHTML;
}

function editVerifyResultInfo(rowObject) {
    P.$.dialog({
        id: "edit_verify_result",
        title: "Edit Verify Result",
        top: "30%",
        width: "800px",
        height: "550px",
        content: "url:" + basePath + "/views/defect/defect_rm_fault_verify.shtml?faultNo=" + rowObject.repeatFaults,
        close: function () {
            $(document).sfaQuery().reloadQueryGrid();
        }
    });
}



function queryDefectNo(cellValue, options, rowObject) {
    if (cellValue == null) {
        return '';
    }
    var trHTML = '';
    trHTML += '<a id="repeat_' + cellValue + '" href="javascript:void(0)" style="color:#f60">' + cellValue + '</a>';
    $("#repeat_" + cellValue).die("click").live("click", function () {
        showDefectNo(cellValue, rowObject);
    });
    return trHTML;
}

function formatArchiveStatus(cellValue, options, rowObject) {
    var retHtml = '';
    if (cellValue == '1') {
        retHtml = '已归档'
    } else if (cellValue == '0' && rowObject.verifyResult == 'y' && rowObject.status == '1') {
        // if ($.inArray('archive', perssions) < 0) {
        //     return '未归档';
        // }
        //针对有效的故障编号可以做归档操作
        retHtml += '<a id="repeat_archive_status_' + rowObject.repeatFaults + '" href="javascript:void(0)" style="color:#f60">未确认</a>';
        $("#repeat_archive_status_" + rowObject.repeatFaults).die("click").live("click", function () {
            selfPrompt(rowObject.repeatFaults + '归档', '请输入归档备注:', function (value) {
                archiveFault(rowObject.repeatFaults, value);
            });
        });
    } else if (cellValue == '0') {
        retHtml = '未确认';
    }

    return retHtml;
}


/**
 * 故障归档
 * @param remark
 */
function archiveFault(faultNo, remark) {
    let params = {
        'faultNo': faultNo,
        'archiveRemark': remark
    };
    $.ajax({
        url: basePath + "/api/v1/defect/archive",
        type: 'post',
        cache: false,
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data: JSON.stringify(params),
        success: function (dataMsg) {
            if(dataMsg.code == 200) {
                P.$.dialog.alert("归档成功.");
                $(document).sfaQuery().reloadQueryGrid();
            } else {
                if(dataMsg.msg) {
                    P.$.dialog.alert("归档失败." + dataMsg.msg);
                }
            }
        }
    });
}


function showDefectNo(repeatFaults, rowObject) {
    $.ajax({
        url: basePath + "/api/v1/defect/repeat/" + repeatFaults + "/faults",
        type: 'get',
        cache: false,
        dataType: "json",
        success: function (dataMsg) {
            if(dataMsg.code == 200) {
                let defectNoList = dataMsg.data.defectNoList;
                let deletedDefectNoList = dataMsg.data.deletedDefectNoList;
                let defectRepeatFaults = dataMsg.data.defectRepeatFaults;
                P.$.dialog({
                    id: 'repeatFaults_Info' + repeatFaults,
                    title: 'Repeat Faults Info',
                    top: '30%',
                    width: '600px',
                    height: '300px',
                    data: {
                        'rowObject': defectRepeatFaults,
                        'defectNoList': defectNoList,
                        'deletedDefectNoList': deletedDefectNoList
                    },
                    content: 'url:' + basePath + "/views/defect/multiple_faults/defect_repeatFaults.shtml"
                });
            } else {
                P.$.dialog.alert(dataMsg.msg);
            }
        }
    });
}

//操作列（修改和删除功能）
function operation(cellvalue, options, rowObject) {
    //修改
    var updateDiv = "";
    //判断是否拥有(修改)权限
    /*if (gridPermissionMap.to_editPermission) {*/
    updateDiv = '<div id="' + options.rowId
        + '" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit" title="Edit"'
        + ' onclick="editTo(this,event,' + rowObject.type + ');"><span class="ui-icon ui-icon-pencil"></span></div>';
    /*}*/
    //删除
    var delDiv = "";
    //判断是否拥有(删除)权限
    /*if (gridPermissionMap.to_deletePermission) {*/
    delDiv = '<div style="padding-left:8px" id="' + options.rowId
        + '" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit" title="Delete"'
        + ' onclick="confirmDel(this,event);"><span class="ui-icon ui-icon-close"></span></div>';
    /*}*/
    //下发
    var issuedDiv = "";
    //判断是否拥有(下发)权限
    /*if (gridPermissionMap.to_suedPermission) {*/
    issuedDiv = '<div style="padding-left:8px" id="issued_' + options.rowId
        + '" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit" title="Issued"><span class="ui-icon-issued"></span></div>';
    $("#issued_" + options.rowId).die('click').live("click", function () {
        issuedTo(rowObject);
    });
    /*}*/
    //关闭
    var closeDiv = "";
    //判断是否拥有(关闭)权限
    /*if (gridPermissionMap.to_closePermission) {*/
    closeDiv = '<div style="padding-left:8px" id="close_' + options.rowId
        + '" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit" title="Close"><span class="ui-icon ui-icon-power"></span></div>';
    $("#close_" + options.rowId).die('click').live("click", function () {
        confirmClosed(rowObject);
    });
    /*}*/
    var user = getLoginInfo();
    //编写状态等于 Editing 并且是同一个提交人
    if (rowObject.editStatus == 1 && user.accountNumber == rowObject.submitterSn) {
        return updateDiv + delDiv;
        //编写状态等于 Checking,Approving,Approved
    } else if (rowObject.editStatus > 1 && rowObject.editStatus < 5) {
        return "";
        //编写状态等于 Active 并且执行状态等于 open
    } else if (rowObject.editStatus == 5 && rowObject.executionStatus == 1 && rowObject.isNewest == 1) {
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
    } else {
        return "";
    }
}
//添加按钮click事件方法
$("#add_btn").live("click", function () {
    var params = {
        "methodType": "add",
        "faultType": "REPEAT"
    };
    let title = `【Add Multiple Fault】`;
    ShowWindowIframe({
        width: "1000",
        height: "800",
        title: title,
        param: params,
        url: "/views/defect/multiple_faults/defect_add_user_rm_fault.shtml"
    });
});

//添加def rule按钮click事件方法
// $("#def_rule_btn").live("click", function () {
//     var params = {
//         "methodType": "def",
//         "faultType": "REPEAT"
//     };
//     let title = `【Define Rule】`;
//     ShowWindowIframe({
//         width: "1000",
//         height: "800",
//         title: title,
//         param: params,
//         url: "/views/defect/multiple_faults/defect_faults_rule_def.shtml"
//     });
// });


//用对话框来实现窗口功能,两种类型公用的方法,要改变以下参数即可：
//URL的controller接口地址
//dialog的id和title描述
//dialog传递给静态页面的参数defectType
//共用一个静态页面地址及结构
$("#def_rule_btn").live("click",function(){
    $.ajax({
        url: basePath + "/api/v1/defect/def/REPEAT",
        //url: basePath + "/api/v1/defect/def/MULTIPLE",
        //url: basePath + "/api/v1/defect/def/getAllLatestDefs",
        type: 'get',
        cache: false,
        dataType: "json",
        success: function (rs) {
            if(rs.code == 200) {

                let ruleList = rs.data.pageModel;
                //let ruleList = rs.data.rmFaultRules;

                P.$.dialog({
                    id: "Edit repeat fault rule",
                    title: "Edit Repeat Fault Rule",
                    top: '30%',
                    width: '600px',
                    height: '300px',
                    data: {
                        'rules': ruleList,
                        'defectType':'REPEAT'
                    },
                    content: 'url:' + basePath + "/views/defect/multiple_faults/defect_faults_rule_def.shtml"
                });
            } else {
                P.$.dialog.alert(rs.msg);
            }
        }
    });
});




// //导出Excel
// $("#excel_btn").live("click", function () {
//     var data = $(document).sfaQuery().postData();
//     var form = $("<form method='post' style='display:none' action='" + basePath + "/api/v1/mccdoc/to_base_info/exportExcel'></form>");
//     $.each(data, function (key, val) {
//         if (typeof (val) == "object") {
//             $.each(val, function (k1, v1) {
//                 form.append($("<input name='" + key + "' value = '" + v1 + "'/>"));
//             });
//         } else {
//             form.append($("<input name='" + key + "' value = '" + val + "'/>"));
//         }
//     });
//     $(this).parent().append(form);
//     form.submit();
//     form.remove();
// });


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
    }
    var parameters = {
        "toType": type,
        "pageType": "edit",
        "id": id
    };
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
        data: parameters
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

    if ('1' == cellvalue) {
        return "排故类";
    } else if ('2' == cellvalue) {
        return "普查类";
    } else if ('3' == cellvalue) {
        return "飞机检查/维护类";
    } else {
        return "生产保障类";
    }

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
        html = '<a href="#" id="' + rowObject.troubleFollowUpId + '" style="color:#f60"  onclick="showDialog_ViewOrEdit(this);" >' + cellvalue + '</a>';
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

        },
        max: false,
        min: false,
        parent: this,
        content: 'url:' + actionUrl,
        data: parameters
    };
    if (P) {
        P.$.dialog(dialog_param);
    } else {
        $.dialog(dialog_param);
    }
}

function showDefect(obj) {
    var url = basePath + '/tlb/defect_info_view.action?id=' + $(obj).attr('id');
    var dialog_param = {
        title: 'View Defecte Information',
        width: '1000px',
        height: '500px',
        top: '20%',
        esc: true,
        cache: false,
        max: false,
        min: false,
        lock: true,
        parent: this,
        content: 'url:' + url,
        data: {
            edit: false,
            revise: false
        },
        close: function () {
        }
    };
    if (P) {
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
    if (type == '1') {
        url_ = "/views/mccdoc/view/view_fault_isolate_to.shtml";
    } else if (type == '2') {
        url_ = "/views/mccdoc/view/view_general_survey_to.shtml";
    } else if (type == '3') {
        url_ = "/views/mccdoc/view/view_other_to.shtml";
    } else if (type == '4') {
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
