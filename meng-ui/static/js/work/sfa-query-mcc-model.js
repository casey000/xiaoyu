var customModelSettings = {
    'TROUBLE_FOLLOW_UP': {
        //列表项配置
        gridOptions: {
            allColModels: {
                'tail': {
                    formatter: hr_status_all_type
                },
                'countsO': {
                    formatter: hr_status_o_type
                },
                'countsM': {
                    formatter: hr_status_m_type
                },
                "countsC": {
                    formatter: hr_status_c_type
                },
                "countsDdPending": {
                    formatter: hr_dd_pending
                },
                "countsNrc": {
                    formatter: hr_nrc_list
                }
            },

            jqGridSettings: {
                //jqGrid配置项
                id: "acId"
            }
        }
    },
    'WORK_TROUBLE': {
        //列表项配置
        gridOptions: {
            allColModels: {
                'updateTime': {
                    formatter: updateTime_redqi
                },
                'monitorNo': {
                    formatter: view_work_trouble
                },
                'description': {
                    formatter: row_cols_control
                }
            },

            jqGridSettings: {
                //jqGrid配置项
                id: "id"
            }
        }
    },
    'DEFECT_WORK_LOG_INFO': {
        /*'TROUBLE_DETAIL_QUERY' : {*/
        //列表项配置
        gridOptions: {
            allColModels: {
                'updateTime': {
                    formatter: updateTime_redqi
                },
                'defectNo': {
                    formatter: hr_link_minitor_workId,
                    index: "defectNo,id",
                },
                'troubleDate': {
                    formatter: hr_link_minitor
                },
                /*'description': {
                    align : 'left',
                    formatter: row_cols_control
                },*/
                'analysis': {
                    align: 'left',
                    formatter: row_cols_control
                },
                'workLog': {
                    align: 'left',
                    formatter: row_cols_control
                },
                'ctrlFileNo': {
                    formatter: link_dd_tlb_follow_main
                },
                "remark": {
                    align: 'left',
                    formatter: row_cols_control
                }
                /*"toFoc" :{
                    formatter : formatToFoc
                },
                "operator" :{
                    isOpts : true,
                    formatter : operation
                }*/
            },

            jqGridSettings: {
                //jqGrid配置项
                id: "workid"
            }
        }
    },
    'MCC_HANDOVER_FORM': {
        //列表项配置
        gridOptions: {
            allColModels: {
                'description': {
                    formatter: hr_link_view
                },
                'turnType': {
                    formatter: function (cellvalue, options, rowObject) {
                        if('D' == cellvalue) {
                            return '白班';
                        } else {
                            return '晚班';
                        }
                    }
                },
                'formType': {
                    formatter: function (cellvalue, options, rowObject) {
                        if('S' == cellvalue) {
                            return 'MCC Duty Manager';
                        } else if('M' == cellvalue) {
                            return 'Technology Support Group';
                        } else if('C' == cellvalue) {
                            return 'Maintenance Control Group';
                        }
                    }
                },
                'workType': {
                    formatter: function (cellvalue, options, rowObject) {
                        if('R' == cellvalue) {
                            return '例行';
                        } else {
                            return '非例行';
                        }
                    }
                },
                'active': {
                    formatter: function (cellvalue, options, rowObject) {
                        if('Y' == cellvalue) {
                            return '是';
                        } else {
                            return '否';
                        }
                    }
                },
                "operate": {
                    formatter: operationForm
                }
            },

            jqGridSettings: {
                //jqGrid配置项
                id: "id"
            }
        }
    },
    'MCC_HANDOVER': {
        //列表项配置
        gridOptions: {
            allColModels: {
                'handoverDate': {
                    formatter: function (cellvalue, options, rowObject) {
                        if(cellvalue != null && $.trim(cellvalue).split(" ").length > 0) {
                            if(rowObject.turnType == null) {
                                return '';
                            }
                            return cellvalue.split(" ")[0];
                        } else {
                            return $.trim(cellvalue);
                        }
                    }
                },
                'turnType': {
                    formatter: function (cellvalue, options, rowObject) {
                        if(cellvalue != null && $.trim(cellvalue) == 'D') {
                            return '白班';
                        } else if(cellvalue != null && $.trim(cellvalue) == 'N') {
                            return '晚班';
                        } else
                            return '';

                    }
                },
                'formTypeC': {
                    formatter: hr_formtype
                },
                "formTypeS": {
                    formatter: hr_formtype
                },
                'formTypeM': {
                    formatter: hr_formtype
                }
            },

            jqGridSettings: {
                //jqGrid配置项
                id: "id"
            }
        }
    },
    'MCC_HANDOVER_DETAIL': {
        //列表项配置
        gridOptions: {
            allColModels: {
                'handoverDate': {
                    formatter: function (cellvalue, options, rowObject) {
                        if(cellvalue != null && $.trim(cellvalue).split(" ").length > 0) {
                            if(rowObject.turnType == null) {
                                return '';
                            }
                            return cellvalue.split(" ")[0];
                        } else {
                            return $.trim(cellvalue);
                        }
                    }
                },
                'turnType': {
                    formatter: function (cellvalue, options, rowObject) {
                        if(cellvalue != null && $.trim(cellvalue) == 'D') {
                            return '白班';
                        } else if(cellvalue != null && $.trim(cellvalue) == 'N') {
                            return '晚班';
                        } else
                            return '';

                    }
                },
                'formType': {
                    formatter: function (cellvalue, options, rowObject) {
                        if('S' == cellvalue) {
                            return 'MCC Duty Manager';
                        } else if('M' == cellvalue) {
                            return 'Technology Support Group';
                        } else if('C' == cellvalue) {
                            return 'Maintenance Control Group';
                        }
                    }
                },
                'description': {
                    align: 'left',
                    formatter: row_cols_control
                },
                'remark': {
                    align: 'left',
                    formatter: row_cols_control
                },
                'formTypeOperate': {
                    formatter: hr_detail_formtype,
                    sortable: false,
                }
            },

            jqGridSettings: {
                //jqGrid配置项
                id: "id"
            }
        }
    }
};

function hr_detail_formtype(cellvalue, options, rowObject) {

    var viewDiv = '';
    var pageType = 'detail';
    var turntype = rowObject.turnType;
    var handoverDate = "";
    if(rowObject.handoverDate != null) {
        handoverDate = (rowObject.handoverDate).split(" ")[0];
    }
    var formtype_id = rowObject.turnid;//main_Id
    var formtype_formType = rowObject.formType;//form类型
    var formtype_isSumbit = rowObject.isSubmit;//是否提交
    var formtype_readyTotake = rowObject.readyTotake;//是否交接
    if('Y' == formtype_isSumbit && 'N' == formtype_readyTotake) {//已提交,已交接
        if(gridPermissionMap && gridPermissionMap.handover_viewPermission) {
            viewDiv = '<input value="view(Y)" id="' + rowObject.id;
        } else {
            viewDiv = 'view(Y)';
        }
    } else if('Y' == formtype_isSumbit && 'Y' == formtype_readyTotake) {//已提交,已交接
        if(gridPermissionMap && gridPermissionMap.handover_viewPermission) {
            viewDiv = '<input value="view(N)" id="' + rowObject.id;
        } else {
            viewDiv = 'view(N)';
        }
    } else if('N' == formtype_isSumbit && 'N' == formtype_readyTotake) {//已接班，未提交
        if(gridPermissionMap && gridPermissionMap.handover_editPermission) {
            viewDiv = '<input value="edit" id="' + rowObject.id;
        } else {
            viewDiv = 'edit';
        }
    } else if('N' == formtype_isSumbit && 'Y' == formtype_readyTotake) {//未提交，未接班
        if(gridPermissionMap && gridPermissionMap.handover_turnPermission) {
            viewDiv = '<input value="handover(Y)" id="' + rowObject.id;
        } else {
            viewDiv = 'handover(Y)';
        }

    }
    if(viewDiv != '' && viewDiv != 'handover(Y)' && viewDiv != 'edit' && viewDiv != 'view(N)' && viewDiv != 'view(Y)') {
        viewDiv += '" type="button" width:"90px" onclick="view_link_detail(this,\'' + pageType + '\',\'' + handoverDate + '\',\'' + turntype + '\',\'' + formtype_formType + '\',\'' + formtype_id + '\',\'' + formtype_isSumbit + '\',\'' + formtype_readyTotake + '\',event)" ></input>';
    }
    return viewDiv;
}

/////////////////////////////////////////////////////////--mcc_handover.js	
function hr_formtype(cellvalue, options, rowObject) {

    var viewDiv = '';
    var pageType = 'handover';
    var currDate = dateFormat("yyyy-MM-dd");
    var handoverDate = (rowObject.handoverDate).split(" ")[0];
    var turntype = rowObject.turnType;
    var formtype_v = cellvalue.split('#');
    var formtype_id = formtype_v[0];//main_Id
    var formtype_formType = formtype_v[1];//form类型
    var formtype_isSumbit = formtype_v[2];//是否提交
    var formtype_readyTotake = formtype_v[3];//是否交接
    if('Y' == formtype_isSumbit && 'N' == formtype_readyTotake) {//已提交,已交接
        if(gridPermissionMap && gridPermissionMap.handover_viewPermission) {
            viewDiv = '<input value="view(Y)" id="' + rowObject.id;
        } else {
            viewDiv = 'view(Y)';
        }
    } else if('Y' == formtype_isSumbit && 'Y' == formtype_readyTotake) {//已提交,已交接
        if(gridPermissionMap && gridPermissionMap.handover_viewPermission) {
            viewDiv = '<input value="view(N)" id="' + rowObject.id;
        } else {
            viewDiv = 'view(N)';
        }
    } else if('N' == formtype_isSumbit && 'N' == formtype_readyTotake) {//已接班，未提交
        if(gridPermissionMap && gridPermissionMap.handover_editPermission) {
            viewDiv = '<input value="edit" id="' + rowObject.id;
        } else {
            viewDiv = 'edit';
        }

    } else if('N' == formtype_isSumbit && 'Y' == formtype_readyTotake) {//未提交，未接班
        if(gridPermissionMap && gridPermissionMap.handover_turnPermission) {
            viewDiv = '<input value="handover(Y)" id="' + rowObject.id;
        } else {
            viewDiv = 'handover(Y)';
        }

    } else if('' == formtype_id && handoverDate == currDate && null == turntype) {//未提交，未接班
        viewDiv = '<input value="handover(N)" id="' + formtype_id;
    }
    if(viewDiv != '' && viewDiv != 'handover(Y)' && viewDiv != 'edit' && viewDiv != 'view(N)' && viewDiv != 'view(Y)') {
        viewDiv += '" type="button" width:"90px" onclick="view_link_detail(this,\'' + pageType + '\',\'' + handoverDate + '\',\'' + turntype + '\',\'' + formtype_formType + '\',\'' + formtype_id + '\',\'' + formtype_isSumbit + '\',\'' + formtype_readyTotake + '\',event)" ></input>';
    }
    return viewDiv;
}

function fomatterDate(cellvalue) {
    if(cellvalue != null && $.trim(cellvalue).split(" ").length > 0) {
        return cellvalue.split(" ")[0];
    } else {
        return $.trim(cellvalue);
    }
}

function formatToFoc(cellvalue) {
    if(cellvalue == 'y') {
        return 'YES';
    } else {
        return 'NO';
    }
}

//查看数据详细信息
function view_link_detail(obj, pageType, handoverDate, turntype, formtype, mainId, isSumbit, readyTotake, event) {
    var url = '';
    if(mainId == '') {
        P.$.dialog.alert('please submit last handover!');
    } else if('N' == isSumbit && 'Y' == readyTotake) {
        if(mainId != '') {
            showDialog_modifystatus(mainId, formtype);
        }
    } else {
        if(mainId != '') {
            url = "mccHandover_toView.action?handoverCurrent.handoverDate=" + handoverDate
                + "&handoverCurrent.formType="
                + formtype + "&handoverCurrent.turnType="
                + turntype + "&handoverCurrent.mainId="
                + mainId + "&pageType=" + pageType;
            window.location.href = url;
        }
    }
}

function showDialog_modifystatus(mainId, formtype) {

    var parameters = {
        "mainId": mainId,
        "formType": formtype,
    };

    var actionUrl = basePath + '/work/mcc_handover_statusAnddate.jsp';

    $.dialog({
        id: mainId + 'Page',
        title: 'Mcc Handover Operator ',
        width: '350px',
        height: '400px',
        top: '100px',
        esc: true,
        cache: false,
        close: function () {

        },
        max: false,
        min: false,
        parent: this,
        content: 'url:' + actionUrl,
        data: parameters
    });
}

/////////////////////////////////////////////////////////--mcc_handover_form.js	
function hr_link_view(cellvalue, options, rowObject) {
    var viewDiv = cellvalue;
    if(gridPermissionMap && gridPermissionMap.mccForm_viewPermission) {
        viewDiv = '<a href="#" id="' + options.rowId
            + '" style="color:#f60" title="' + $.jgrid.nav.viewtitle
            + '" onclick="viewForm(this,event);" >' + cellvalue + '</a>';
    }
    return viewDiv;
}

/**
 * 查看航站信息
 */
function viewForm(obj, event) {
    var rowId = $(obj).attr('id');
    var actionUrl = basePath + '/work/mccHandoverForm_toView.action?formId=' + rowId;
    showDialogForm(actionUrl, 'view');
}


/**
 * 显示窗体
 */
function showDialogForm(actionUrl, doType) {
    var parameters = {
        "methodType": doType
    };
    $.dialog({
        id: doType + 'Page',
        title: 'Mcc HandoverForm Information ' + doType,
        width: '900px',
        height: '330px',
        top: '80px',
        esc: true,
        cache: false,
        close: function () {
            // 弹出的窗口被关闭后,主页面刷新
            P.$("#common_list_grid").jqGrid().trigger("reloadGrid");
        },
        max: false,
        min: false,
        parent: this,
        content: 'url:' + actionUrl,
        data: parameters
    });
}


function operationForm(cellvalue, options, rowObject) {
    var editDiv = '';
    var deleteDiv = '';
    if(rowObject.active == 'Y') {
        if(gridPermissionMap && gridPermissionMap.mccForm_updatePermission) {
            editDiv = '<div id="' + options.rowId + '" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit" title="' + $.jgrid.nav.edittitle + '" onclick="editForm(this,event);"><span class="ui-icon ui-icon-pencil"></span></div>';
        }
        if(gridPermissionMap && gridPermissionMap.mccForm_deletePermission) {
            deleteDiv = '<div id="' + options.rowId + '" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit" title="' + $.jgrid.nav.deltitle + '" onclick="confirmDelForm(this,event);" style="padding-left:8px"><span class="ui-icon ui-icon-close"></span></div>';
        }
    }

    return editDiv + deleteDiv;
}


/**
 * 编辑航站信息
 */
function editForm(obj, event) {
    var rowId = $(obj).attr('id');
    var actionUrl = basePath + '/work/mccHandoverForm_toAddOrEdit.action?formId=' + rowId + '&methodType=edit';
    showDialogForm(actionUrl, 'edit');
}


/**
 * 删除当前行航站信息
 */
function confirmDelForm(obj, event) {
    //获取当前行id
    var formId = $(obj).attr('id');
    deleteForm(formId);
}


//删除航站信息
function deleteForm(formId) {
    var actionUrl = basePath + "/work/mccHandoverForm_delete.action";
    var params = {"selectedIds": formId};
    if(formId != "" && formId != null) {
        $.dialog.confirm('Are you sure to delete?', function () {
            $.ajax({
                url: actionUrl,
                data: params,
                dataType: "json",
                cache: false,

                success: function (obj, textStatus) {
                    var data = JSON.parse(obj);
                    if(data.ajaxResult == "success") {
                        $.dialog.alert('Delete success.');
                        $("#common_list_grid").jqGrid().trigger("reloadGrid");
                    } else {
                        $.dialog.alert(data.ajaxResult);
                    }
                }
            })
        }, function () {

        })
    } else {
        $.dialog.alert("Please select records to delete");
    }
}

///////////////////////////////////////////////////--trouble_detail_query.js	
function hr_link_minitor_workId(cellvalue, options, rowObject) {
    var viewDiv = cellvalue;


    if(gridPermissionMap && gridPermissionMap.workDetail_viewPermission) {
        viewDiv = '<a href="#" id="' + rowObject.workid
            + '" style="color:#f60" title="' + $.jgrid.nav.viewtitle
            + '" onclick="edit(this,event);" >' + cellvalue + '</a>';
    }
    return viewDiv;

}

function hr_link_minitor(cellvalue, options, rowObject) {

    if(cellvalue != null && $.trim(cellvalue).split(" ").length > 0) {
        cellvalue = cellvalue.split(" ")[0];
    } else {
        cellvalue = $.trim(cellvalue);
    }
    var viewDiv = cellvalue;
    var troubleId = rowObject.workid;
    if(gridPermissionMap && gridPermissionMap.workDetail_viewPermission) {
        if(null == options.rowId || '' == options.rowId) {
            viewDiv = cellvalue;
        } else {
            viewDiv = '<a href="#" id="' + rowObject.id
                + '" style="color:#f60" title="' + $.jgrid.nav.viewtitle
                + '" onclick="edit_detail_query(\'' + rowObject.id + '\',event,\'' + troubleId + '\');" >' + cellvalue + '</a>';

        }
    }
    return viewDiv;

}


function edit_detail_query(detailId, event, troubleId) {
    var actionUrl = basePath + '/work/workTroubleDetail_toAddOrEdit.action?detailId=' + detailId + '&methodType=edit';
    show_dialog_query(actionUrl, 'view', troubleId);
}


function show_dialog_query(actionUrl, methodType, troubleId) {
    var parameters = {
        "methodType": methodType,
        "troubleId": troubleId,
        "parent": this.window
    };

    P.$.dialog({
        id: troubleId + 'Page',
        title: 'Track Basic Information ' + methodType,
        width: '1050px',
        height: '400px',
        top: '100px',
        esc: true,
        cache: false,
        lock: true,
        close: function () {

        },
        max: false,
        min: false,
        parent: this,
        content: 'url:' + actionUrl,
        data: parameters
    });
}

function link_dd_tlb_follow_main(cellvalue, options, rowObject) {
    var viewDiv = '';
    var ctrlFileType = rowObject.ctrlFileType;
    if(cellvalue != null && cellvalue != '' && cellvalue != 'null') {

        if(gridPermissionMap && gridPermissionMap.workDetail_viewPermission) {
            viewDiv = '<a href="#" id="' + cellvalue
                + '" style="color:#f60" title="' + $.jgrid.nav.viewtitle
                + '" onclick="link_dd_tlb(this,event,\'' + ctrlFileType + '\');" >' + cellvalue + '</a>';
        } else {
            viewDiv = cellvalue;
        }
    }

    return viewDiv;
}

function link_dd_tlb(obj, event, ctrlFileType) {
    // 获取当前行id
    var tlbDDNum = $(obj).attr('id');
    if(ctrlFileType == 'TLB') {
        viewTLB(tlbDDNum);
    } else if(ctrlFileType == 'DD') {
        viewDD(tlbDDNum)
    }
}

function viewTLB(tlbId) {
    P.$.dialog({
        id: 'view_tlb',
        title: 'TLB Detail',
        top: '60px',
        width: '1070px',
        height: '750px',
        resize: true,
        content: 'url:' + basePath + "/tlb/tlb_techlog_view.action?techLog.tlbNo=" + tlbId + "&_rd=" + Math.random()
    });
}


function viewDD(ddId) {
    P.$.dialog({
        id: 'view_tlb',
        title: 'DD Detail',
        top: '60px',
        width: '1070px',
        height: '750px',
        content: 'url:' + basePath + "/tlb/tlb_ddi_signup_view.action?tlbDeferredDefect.ddNo=" + ddId + "&_=" + Math.random()
    });
}


///////////////////////////////////////////////////--work_trouble.js
function updateTime_redqi(cellvalue, options, rowObject) {
    viewDiv = '';
    var dateEnd = paserDate(cellvalue);
    var dateStart = new Date();
    dateStart.setDate(dateStart.getDate() - 1);
    if(dateEnd.getTime() > dateStart.getTime()) {
        viewDiv = '<img src=' + basePath + '/images/flag_red.png />';
    }
    return viewDiv;
}

//根据日期格式获取当前系统日期
function dateFormat(format) {
    var cur = new Date();
    var o =
        {
            "M+": cur.getMonth() + 1, //month
            "d+": cur.getDate(),    //day
            "h+": cur.getHours(),   //hour
            "m+": cur.getMinutes(), //minute
            "s+": cur.getSeconds(), //second
            "q+": Math.floor((cur.getMonth() + 3) / 3),  //quarter
            "S": cur.getMilliseconds() //millisecond
        };
    if(/(y+)/.test(format))
        format = format.replace(RegExp.$1, (cur.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if(new RegExp("(" + k + ")").test(format))
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    return format;
}

//解析日期函数
function paserDate(dateStr) {
    var dateArr = null;
    var timeArr = null;
    var arr1 = dateStr.split(" ");
    if(arr1[0] != null) {
        dateArr = arr1[0].split("-");
    }
    if(arr1[1] != null) {
        timeArr = arr1[1].split(":");
    }
    if(timeArr == null) {
        return new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);
    } else {
        return new Date(dateArr[0], dateArr[1] - 1, dateArr[2], timeArr[0], timeArr[1], timeArr[2]);
    }
}

function row_cols_control(cellvalue, options, rowObject) {
    if(cellvalue == 'null' || cellvalue == null)
        cellvalue = '';
    viewDiv = '<div style="word-break: break-all; white-space: normal;width : 95%">' + cellvalue + '</div>';
    return viewDiv;
}

function view_work_trouble(cellvalue, options, rowObject) {

    var viewDiv = cellvalue;
    if(gridPermissionMap && gridPermissionMap.workTrouble_viewPermission) {
        viewDiv = '<a href="#" id="' + options.rowId
            + '" style="color:#f60" title="' + $.jgrid.nav.viewtitle
            + '" onclick="link_work_trouble(this,event);" >' + cellvalue + '</a>';
    }
    return viewDiv;
}

function link_work_trouble(obj, event) {
    showDialog_ViewOrEdit(obj, 'view');
}


function operation(cellvalue, options, rowObject) {
    var editDiv = '';
    var deleteDiv = '';
    if(gridPermissionMap && gridPermissionMap.workTrouble_updatePermission) {

        editDiv = '<div id="'
            + options.rowId
            + '" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit" title="'
            + $.jgrid.nav.edittitle
            + '" onclick="edit(this,event);"><span class="ui-icon ui-icon-pencil"></span></div>';
    }
    if(gridPermissionMap && gridPermissionMap.workTrouble_deletePermission) {

        deleteDiv = '<div id="'
            + options.rowId
            + '" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit" title="'
            + $.jgrid.nav.deltitle
            + '" onclick="confirmDelWorkTrouble(this,event);" style="padding-left:8px"><span class="ui-icon ui-icon-close"></span></div>';
    }
    return editDiv + deleteDiv;
}

function edit(obj, event) {
    showDialog_ViewOrEdit(obj, 'edit');
}

/**
 * 删除当前行航站信息
 */
function confirmDelWorkTrouble(obj, event) {
    //获取当前行id
    var id = $(obj).attr('id');

    validateUrl_ = basePath + "/mccdoc/to_management_deleteWorkTroubleValidate.action?workTroubleIds=" + id;

    $.ajax({

        url: validateUrl_,

        contentType: "application/json; charset=utf-8",

        dataType: "json",

        cache: false,

        success: function (obj, textStatus) {

            var data = JSON.parse(obj);

            if(data && data.message) {

                $.dialog.alert(data.message);


            } else {

                //进行删除操作
                deleteWorkTrouble(id);
            }
        }
    })
}


//删除航站信息
function deleteWorkTrouble(Id) {
    var actionUrl = basePath + "/work/work_trouble_hasSubArrayList.action";
    var params = {"selectedIds": Id};
    if(Id != "" && Id != null) {
        $.ajax({
            url: actionUrl,
            data: params,
            dataType: "json",
            cache: false,

            success: function (obj, textStatus) {
                var data = JSON.parse(obj);
                if(data.ajaxResult == "success") {
                    var result = '';
                    if(data.hasSub == "true") {
                        result = 'has sub arrayList,';
                    }
                    P.$.dialog.confirm(result + 'Are you sure to delete?', function () {
                        deleteWorkTroubleCommit(Id);
                    }, function () {
                        //P.$.dialog.tips('执行取消操作');
                    });
                    $("#common_list_grid").jqGrid().trigger("reloadGrid");
                } else {
                    P.$.dialog.alert(data.ajaxResult);
                }
            }
        })

    } else {
        P.$.dialog.alert("Please select records to delete");
    }
}

//删除航站信息
function deleteWorkTroubleCommit(Id) {
    var actionUrl = basePath + "/work/work_trouble_delete.action";
    var params = {"selectedIds": Id};
    if(Id != "" && Id != null) {
        $.ajax({
            url: actionUrl,
            data: params,
            dataType: "json",
            cache: false,

            success: function (obj, textStatus) {
                var data = JSON.parse(obj);
                if(data.ajaxResult == "success") {
                    P.$.dialog.alert('Delete success.');
                    $("#common_list_grid").jqGrid().trigger("reloadGrid");
                } else {
                    P.$.dialog.alert(data.ajaxResult);
                }
            }
        })

    } else {
        P.$.dialog.alert("Please select records to delete");
    }
}

///////////////////////////////////////////////////--trouble_follow_up.js
function hr_status_o_type(cellvalue, options, rowObject) {

    var viewDiv = cellvalue;
    var status = 'O';
    var acNo = rowObject.tail;
    var acType = rowObject.acType;
    var station = rowObject.station;
    /*if (gridPermissionMap && gridPermissionMap.followup_viewPermission) {*/
    viewDiv = '<a href="#" id="' + rowObject.acId
        + '" style="color:#f60" title="' + $.jgrid.nav.viewtitle
        + '" onclick="hr_status_link(this,\'' + station + '\',\'' + status + '\',\'' + acNo + '\',\'' + acType + '\',event)" >' + cellvalue + '</a>';
    /*}*/
    return viewDiv;
}

function hr_status_m_type(cellvalue, options, rowObject) {

    var viewDiv = cellvalue;
    var status = 'M';
    var acNo = rowObject.tail;
    var acType = rowObject.acType;
    var station = rowObject.station;
    /*if (gridPermissionMap && gridPermissionMap.followup_viewPermission) {*/
    viewDiv = '<a href="#" id="' + rowObject.acId
        + '" style="color:#f60" title="' + $.jgrid.nav.viewtitle
        + '" onclick="hr_status_link(this,\'' + station + '\',\'' + status + '\',\'' + acNo + '\',\'' + acType + '\',event)" >' + cellvalue + '</a>';
    /*}*/
    return viewDiv;
}

function hr_status_c_type(cellvalue, options, rowObject) {

    var viewDiv = cellvalue;
    var status = 'C';
    var acNo = rowObject.tail;
    var acType = rowObject.acType;
    var station = rowObject.station;
    /*if (gridPermissionMap && gridPermissionMap.followup_viewPermission) {*/
    viewDiv = '<a href="#" id="' + rowObject.acId
        + '" style="color:#f60" title="' + $.jgrid.nav.viewtitle
        + '" onclick="hr_status_link(this,\'' + station + '\',\'' + status + '\',\'' + acNo + '\',\'' + acType + '\',event)" >' + cellvalue + '</a>';
    /*}*/
    return viewDiv;
}

function hr_status_all_type(cellvalue, options, rowObject) {
    let viewDiv = cellvalue;
    let acNo = rowObject.tail;
    let acType = rowObject.acType;
    let station = rowObject.station;
    /*if (gridPermissionMap && gridPermissionMap.followup_viewPermission) {*/
    viewDiv = '<a href="#" id="' + rowObject.acId
        + '" style="color:#f60" title="' + $.jgrid.nav.viewtitle
        + '" onclick="hr_statusAll_link(this,\'' + station + '\',\'' + acNo + '\',\'' + acType + '\',event)" >' + cellvalue + '</a>';
    /*}*/
    return viewDiv;
}

function hr_statusAll_link(obj, station, acNo, acType, event) {
    var rowId = $(obj).attr('id');
    var cur_page = $("#common_list_grid").jqGrid("getGridParam", "page");
    acType = acType.split('-')[0];
    var url = basePath + "/views/defect/defect_list_for_log.shtml?"
        + "&defect.acId=" + rowId
        + "&defect.acReg=" + acNo
        + "&parentPage=" + cur_page
        + "&station=" + station;
    if(frameElement != null && frameElement.api) {
        url += "&fromPage=" + frameElement.api.data.fromPage;
    }
    window.location = url;
}

function hr_status_link(obj, station, status, acNo, acType, event) {
    var rowId = $(obj).attr('id');
    var cur_page = $("#common_list_grid").jqGrid("getGridParam", "page");
    acType = acType.split('-')[0];
    var url = basePath + "/views/defect/defect_list_for_log.shtml?" +
        "defect.status=" + status
        + "&defect.acId=" + rowId
        + "&defect.acReg=" + acNo
        + "&parentPage=" + cur_page
        + "&station=" + station;

    if(frameElement != null && frameElement.api) {
        url += "&fromPage=" + frameElement.api.data.fromPage;
    }

    window.location = url;
}


function hr_dd_pending(cellvalue, options, rowObject) {
    var viewDiv = cellvalue;
    /*if (gridPermissionMap && gridPermissionMap.followup_viewPermission) {*/
    viewDiv = '<a href="#" id="' + rowObject.acId
        + '" style="color:#f60" title="' + $.jgrid.nav.viewtitle
        + '" onclick="fun_dd_pending_view(this,event)" >' + cellvalue + '</a>';
    /*}*/
    return viewDiv;
}

function hr_nrc_list(cellvalue, options, rowObject) {
    viewDiv = '<a href="#" id="' + rowObject.acId
        + '" style="color:#f60" title="' + $.jgrid.nav.viewtitle
        + '" onclick="view_nrc_list(this,\'' + rowObject.acId + '\',event)" >' + cellvalue + '</a>';
    return viewDiv;
}

function view_nrc_list(obj,acId,event) {
    var url = basePath + "/views/nrc/nrc_list.shtml?" +
        "acId=" + acId
        + "&fromPage=" + 'flightDetail'

    if(frameElement != null && frameElement.api) {
        url += "&fromPage=" + frameElement.api.data.fromPage;
    }

    window.location = url;
}

function fun_dd_pending_view(obj, event) {
    let rowId = $(obj).attr('id');
    let parameters = {
        "methodType": 'view',
        "parent": this.window
    };
    let actionUrl = basePath + '/views/tbm/station_task_tlbdd_view.shtml?acReg=' + rowId;
    P.$.dialog({
        id: rowId + 'Page',
        title: 'Work Trouble DD&PENDING Information View',
        width: '900px',
        height: '600px',
        top: '110px',
        esc: true,
        cache: false,
        close: function () {
        },
        max: false,
        min: false,
        parent: this,
        content: 'url:' + actionUrl,
        data: parameters
    });
}
