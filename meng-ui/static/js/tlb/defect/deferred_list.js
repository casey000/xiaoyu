var sub_win = frameElement.api;
var P = (sub_win == null ? null : sub_win.opener);

$(function () {
    /* DD导出按钮点击事件 */
    $("#export_btn").click(function () {
        var data = $(document).sfaQuery().postData();
        if(data.qname.indexOf('startDate') > -1 && data.qname.indexOf('endDate') > -1){
            $.exportExcel({
                url: "/api/v1/defect/defect/dfrl/exportDDIInfo",
                filename: "DD",
                success:function (data) {
                    console.log(data)
                }
            })
        }else{
            MsgAlert({type: "error", content: "导出excel必须限制StartDate和EndDate"})
        }

    });

    var s_params = {};
    var allConds = {};
    if (sub_win && sub_win.data && sub_win.data.isDialog == 1) {
        s_params = {
            'sidx': 'defectNo',
            'sord': 'desc'
        };
        allConds = {
            'startDate': {
                name: 'startDate',
                colNameEn: 'Start Date',
                colNameCn: 'Start Date',
                type: 'date'
            },

            'endDate': {
                name: 'endDate',
                colNameEn: 'End Date',
                colNameCn: 'End Date',
                type: 'date'
            },
            'editStatus': {hidden: true},
            'executionStatus': {hidden: true},
            'sourceType': {hidden: true}
        };
    }
    $('.date_input').datebox({});
    //最简配置
    var options_simple = {
        view: 'V_DEFECT_DEFERRED_QUERY',	//列表名称, 必填
        defaultParam: s_params, //默认查询参数
        //查询条件(可选配置)
        qcOptions: {
            qcBoxId: 'qc_box', // 查询框Id, 默认值: qc_box
            showConnector: true,
            allConds: {
        'startDate' : {
            name : 'startDate',
                colNameEn : 'Start Date',
                colNameCn : 'Start Date',
                type : 'date'
        },

        'endDate' : {
            name : 'endDate',
                colNameEn : 'End Date',
                colNameCn : 'End Date',
                type : 'date'
        }
    }
        },
        //结果列表(可选配置)
        gridOptions: {
            gridId: 'common_list_grid', //列表Id
            // optsCols: ['oper']
            optsCols: [] //要显示的操作列,默认值:[], 如果不显示，则用默认值
        }
    };
    $(document).sfaQuery(options_simple);
});

var customModelSettings = {
    'DEFECT_PEND_QUERY': {
        // 列表项配置
        gridOptions: {
            allColModels: {
                'creator': {
                    formatter: formaterCreator
                },
                'reasonOther': {
                    formatter: formaterReasonOther
                },
                'postfltStation': {
                    formatter: formaterPof
                },
                "reMain": {
                    formatter: formaterReMain
                },
                'pendNo': {
                    formatter: formaterPendNo
                },
                'reference': {
                    formatter: formaterReference
                },
                'deferredNo': {
                    formatter: formatterDeferredNo
                },
                'defectNo': {
                    formatter: formatterDefectNo
                },
                "faultReportChn": {
                    formatter: formatTlbStr
                },
                "faultReportEng": {
                    formatter: formatTlbStr
                },
                "status": {
                    formatter: customerizeStaus
                },
                "profession": {
                    formatter: formaterProfession
                },
                "dfrlCategory": {
                    formatter: formatDfrlCategory
                },
                "type": {
                    formatter: customerizeType
                },
                "mechanic": {},
                "inspector": {},
                "defectCategory": {
                    formatter: formaterCategory
                },
                "applyDate": {
                    formatter: formatterApplyDate
                },
                "closeDate": {
                    formatter: formatterCloseDate
                },
                "expiredDate": {
                    formatter: formatterExpiredDate
                },
                'oper': {
                    isOpts: true,
                    colNameEn: "Operate",
                    colNameCn: "Operate",
                    width: 45,
                    formatter: oper_edit
                },
                'assign': {
                    name: 'Assign',
                    colNameEn: 'Assign',
                    isOpts: true,
                    width: 50,
                    formatter: formatAssignDefect
                },
                'mrNo': {
                    sortable: false
                },
                'descriptionChineseAndEnglish': {
                    name: 'descriptionChineseAndEnglish',
                    colNameCn: "中英文描述",
                    colNameEn: '中英文描述',
                    width: 100,
                    formatter: formatDescriptionChineseAndEnglish
                }
            }
        }
    }
};

function formaterReasonOther(cellValue, options, rowObject) {
    let result = "";
    if("y" == rowObject.lackMater) {
        result += "Material,";
    }
    if("y" == rowObject.lackTime) {
        result += "Ground Time,";
    }
    if("y" == rowObject.lackTool) {
        result += "Tooling,";
    }
    if("y" == rowObject.lackTech) {
        result += "Engineering,";
    }
    if(cellValue) {
        result += cellValue;
    }
    if(result) {
        result = result.substring(0, result.length - 1);
    }
    return result;
}

// add by guozhigang 添加类型格式化。see[2657] MORE窗口TYPE栏无显示值
function formaterCategory(cellValue, options, rowObject) {
    if (cellValue == '1') {
        return "液体渗漏";
    } else if (cellValue == '2') {
        return '缺陷';
    } else if (cellValue == '3') {
        return '一般故障';
    } else if (cellValue == '4') {
        return '重大故障';
    } else {
        return "";
    }
}

//pend 编号 链接
function formaterPendNo(cellvalue, options, rowObject) {
    if (rowObject && rowObject.pendNo) {
        // var fun = 'pendClick(rowObject)';
        return '<a href="#" id="' + rowObject.defectId + '" style="color:#f60" onclick="pendClick(' + rowObject.defectId + ',' + cellvalue + ');"  >' + (cellvalue == null ? 'View' : cellvalue) + '</a>';
    }
    return "";
}


function oper_edit(cellvalue, options, rowObject) {
    //编辑图标
    var editDiv = '';
    // if (gridPermissionMap && gridPermissionMap.deferred_editPermission) {
    if (rowObject.auditStatus == 1 || rowObject.auditStatus == 5) {
        var id = rowObject.defectId;
        var pendId = rowObject.id;
        var category = rowObject.category;
        editDiv += '<div id="'
            + options.rowId
            + '" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit" title="'
            + $.jgrid.nav.edittitle
            + '" onclick="open_deferral(\'' + id + '\');"><span class="ui-icon ui-icon-pencil"></span></div>';
    }
    // }
    // if (gridPermissionMap && gridPermissionMap.deferred_deletePermission) {
    if (rowObject.auditStatus == 1 || rowObject.auditStatus == 5) {
        editDiv += '<div id="'
            + options.rowId
            + '" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit" title="'
            + $.jgrid.nav.edittitle
            + '" onclick="del(\'' + pendId + '\');"><span class="ui-icon ui-icon-trash"></span></div>';
    }
    // }
    return editDiv;
}

function del(pendId) {
    if (!confirm("确认删除?")) {
        return;
    }
    let opt = {};
    let form = new FormData();
    form.append('id', pendId);
    opt.headers = {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    };
    axios.post("/api/v1/defect/defect/pend/delete", form, opt).then(response => {
        if (response.data.msg.indexOf("SUCCESS") != -1) {
            MsgAlert({content: "删除成功"});
            $("#common_list_grid").jqGrid().trigger("reloadGrid");
        } else if (response.data.msg.indexOf("ERROR") != -1) {
            MsgAlert({type: "error", content: "删除失败"})
        }
    });


}


function open_deferral(defectId) {
    let title = "故障保留";
    let param = {
        defectId: defectId,
        operation: "DEFERRAL",
        successCallback: () => {
            let tab = $('#tt').tabs("getTab", 1);
            tab.panel('refresh', '/views/defect/PendingDeferal.shtml')
        }
    };
    ShowWindowIframe({
        width: "1100",
        height: "700",
        title: title,
        param: param,
        url: "/views/defect/defectPending.shtml"
    });
}

function formaterProfession(cellValue, options, rowObject) {
    if (cellValue == '1') {
        return "电子";
    } else if (cellValue == '2') {
        return '电气';
    } else if (cellValue == '3') {
        return '机械';
    } else if (cellValue == '4') {
        return '动力';
    } else if (cellValue == '5') {
        return '其他';
    } else {
        return "";
    }
}

function formatDfrlCategory(cellvalue, options, rowObject) {
    if (cellvalue == 'a') {
        var fh = rowObject.fh;
        var fc = rowObject.fc;
        var calendarDay = rowObject.calendarDay;
        var flightDay = rowObject.flightDay;
        var returnValue = "A:";
        if (fh != null) {
            returnValue = returnValue + fh + "FH";
        }
        if (fc != null) {
            returnValue = returnValue + fc + "FC";
        }
        if (calendarDay != null) {
            returnValue = returnValue + calendarDay + "日历日";
        }
        if (flightDay != null) {
            returnValue = returnValue + flightDay + "飞行日";
        }
        return returnValue;
    } else if (cellvalue == 'b') {
        return 'B:三天';
    } else if (cellvalue == 'c') {
        return 'C:十天';
    } else if (cellvalue == 'd') {
        return 'D:一百二十天';
    } else if (cellvalue == 'other') {
        var fh = rowObject.fh;
        var fc = rowObject.fc;
        var calendarDay = rowObject.calendarDay;
        var flightDay = rowObject.flightDay;
        var returnValue = "OTHER:";
        if (fh != null) {
            returnValue = returnValue + fh + "FH";
        }
        if (fc != null) {
            returnValue = returnValue + fc + "FC";
        }
        if (calendarDay != null) {
            returnValue = returnValue + calendarDay + "日历日";
        }
        if (flightDay != null) {
            returnValue = returnValue + flightDay + "飞行日";
        }
        return returnValue;
    } else {
        return "";
    }
}


function assignPend(defectNo, acreg, gid, refresh) {
    var P = getOpener();
    var _this = $(this);
    var ddr = $(_this).closest("table.moduleMargin").find("tr:first").find("#mccRefresh");
    $.ajax({
        url: basePath + "/tbm/tbm_flow_findIsAssignedDefect.action?defectInfo.defectNo=" + defectNo,
        type: "get",
        dataType: "json",
        success: function (data) {
            var data = JSON.parse(data);
            if (data.ajaxResult == 'success') {
                assignDefectDialog({
                    type: "DEFECT",
                    no: defectNo,
                    acReg: acreg,
                    addDefect: "inputRemark",
                    actionType: 'assign',
                    callback: refresh,
                    thisTd: _this,
                    gid: gid

                });
            } else {
                P.$.dialog.alert(data.msg);
            }
        }
    });
}

function editRemark(id, gid) {
    var P = getOpener();
    var paramas = {
        id: id
    };
    P.$.dialog({
        id: 'edit_Remark',
        title: 'Edit Remark',
        esc: true,
        lock: true,
        cache: false,
        max: false,
        min: false,
        parent: this,
        content: 'url:' + basePath + "/tlb/defect/dfrl_pend/edit_remark.jsp",
        data: paramas,
        close: function () {
            $("#" + gid).closest("tr").prev("tr").find("img").click();
            /*var tds = P.$.find(".align_right");
            $(tds).each(function(){
                var _this = $(this);
                var clickValue=_this.find("img").attr("onclick");
                if(clickValue.indexOf("32")>0|| clickValue.indexOf("34")>0){
                    $(_this).find("#mccRefresh").click();
                }
            })*/
            if ($(document).sfaQuery()) {
                $(document).sfaQuery().reloadQueryGrid();
            }
        }
    });
}

function getOpener() {
    if (frameElement != null && frameElement.api != null) {
        P = frameElement.api.opener;
    } else {
        P = window;
    }

    return P;
}


/**
 * type, no, station, actionType, description, callback
 * 下发任务到航班
 * @param type
 * @param no
 * @param acReg
 * @param actionType
 * @param callback
 */
function assignDefectDialog(options) {
    P.$.dialog({
        id: 'assign_' + options.type,
        title: 'Assign ' + options.type,
        top: '60px',
        width: '1070px',
        height: '600px',
        content: 'url:' + basePath + "/tbm/tbm_station_task.jsp",
        data: options,
        close: function () {
            var gid = "#" + options.gid;
            $(gid).closest("tr").prev("tr").find("img").click();
            /*var tds = P.$.find(".align_right");
            $(tds).each(function(){
                var _this = $(this);
                var clickValue=_this.find("img").attr("onclick");
                if(clickValue.indexOf("32")>0|| clickValue.indexOf("34")>0 || clickValue.indexOf("35")>0){
                    $(_this).find("#mccRefresh").click();
                }
            });*/
            if ($(document).sfaQuery()) {
                $(document).sfaQuery().reloadQueryGrid();
            }
        }
    });
}

function formatDescriptionChineseAndEnglish(cellvalue, options, rowObject) {
    return rowObject.defectDescChn+"<br/>"+rowObject.defectDescEng;
}

function formatAssignDefect(cellvalue, options, rowObject) {
    var assignDiv = '';
    var editDiv = '';
    assignDiv = '<div style="padding-left:8px" id="'
        + options.rowId
        + '" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit" title="Assign"'
        + ' onclick=assignPend(\"'
        + rowObject.defectNo
        + '\",\"'
        + rowObject.acReg
        + '\",\"'
        + options.gid
        + '\","refresh")><span class="ui-icon ui-icon-gear"></span></div>';
    editDiv = '<div style="padding-left:8px" id="'
        + options.rowId
        + '" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit" title="Edit"'
        + ' onclick=editRemark(\"'
        + options.rowId
        + '\",\"'
        + options.gid
        + '\")><span class="ui-icon ui-icon-pencil"></span></div>';
    if (rowObject.status == 2) {
        return "";
    }
    if (rowObject.category == 'DFRL') {
        if (1 == rowObject.assignFlag || 2 == rowObject.assignFlag) {
            return editDiv;
        } else {
            return assignDiv + editDiv;
        }
    } else {
        if ("1" == rowObject.assignFlag) {
            return editDiv;
        } else {
            return assignDiv + editDiv;
        }
    }
}

function customerizeStaus(cellValue, options, rowObject) {
    if (cellValue == '1') {
        return "OPEN";
    } else if (cellValue == '2') {
        return 'CLOSE';
    } else {
        return "";
    }
}

function customerizeType(cellValue, options, rowObject) {
    if (cellValue == '1') {
        return "缺陷";
    } else if (cellValue == '2') {
        return '保留';
    }
    else {
        return "";
    }
}

function formaterCreator(cellvalue, options, rowObject) {

    if (rowObject.user) {

        if (rowObject.user.sn) {

            return rowObject.user.name + '(' + rowObject.user.sn + ')';

        } else {

            return rowObject.user.name + '(' + rowObject.user.loginName + ')';
        }
    }

    return "";
}

function formatterDefectNo(cellValue, options, rowObject) {
    if (rowObject && rowObject.defectNo) {
        return '<a href="#" id=' + rowObject.defectId
            + ' style="color:#f60" onclick="viewDefect(this,event);" >'
            + rowObject.defectNo + '</a>';
    }
    return "";

}


// deferred 编号链接
function formatterDeferredNo(cellvalue, options, rowObject) {
    var sty = 'color:black';

    if (rowObject.auditStatus == 1 || rowObject.auditStatus == 2) {
        //未审核: 黄色
        sty = 'color:#a0a030';
    } else if (rowObject.auditStatus == 3) {
        //未批准: 橙色
        sty = 'color:orange';
    }

    if (rowObject.auditStatus == 4) {
        //条件满足: 绿色
        sty = 'color:green';
    }

    if (rowObject.status == 1) {
        var now = new Date();
        // var applyDate = parseDate(rowObject.applyDate);
        // var expiredDate = parseDate(rowObject.expiredDate);
        var applyDate = rowObject.applyDate;
        var expiredDate = rowObject.expiredDate;
        if (!applyDate || !expiredDate) {
            sty = 'color:red';
        } else {
            // var total = expiredDate.getTime() - applyDate.getTime();
            // var remain = expiredDate.getTime() - now.getTime();
            var total = expiredDate - applyDate;
            var remain = expiredDate - now.getTime();
            if (remain < 3 * 24 * 3600 * 1000 || remain < total * 0.15) {
                //预警: 红色
                sty = 'color:red';
            }
        }

    }

    if (rowObject.status == 2) {
        sty = 'color:black';
    }


    if (rowObject.defectId) {
        return '<a href="#" id="' + rowObject.defectId + '" style=' + sty + ' onclick="viewDeferred(' + rowObject.defectId + "," + cellvalue + ');"  >' + (cellvalue == null ? 'View' : cellvalue) + '</a>';
    } else {
        return "";
    }

}

//解析日期函数
function parseDate(dateStr) {
    // if(dateStr == null){
    //     return "";
    // }
    // var dateArr = null;
    // var timeArr = null;
    // var arr1 = dateStr.split(" ");
    // if (arr1[0] != null) {
    //     dateArr = arr1[0].split("-");
    // }
    // if (arr1[1] != null) {
    //     timeArr = arr1[1].split(":");
    // }
    // if (timeArr == null) {
    //     return new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);
    // } else {
    //     return new Date(dateArr[0], dateArr[1] - 1, dateArr[2], timeArr[0], timeArr[1], timeArr[2]);
    // }
}

//剩余小时、天数、循环数
function formaterReMain(cellvalue, options, rowObject) {
    var span = '';
    if (rowObject.deferredNo == null) {
        span = '<div style="width : 95%"></div>';
    } else {
        if (rowObject.dfrlCategory == 'b'
            || rowObject.dfrlCategory == 'c' || rowObject.dfrlCategory == 'd') {
            if (rowObject.categoryDayRemain != null && rowObject.categoryDayRemain != '') {
                span = '<div style="width : 95%"> ' + rowObject.categoryDayRemain + 'day</div>';
            }
        } else if (rowObject.dfrlCategory == 'a' || rowObject.dfrlCategory == 'other') {
            span = '<div style="width : 95%"> ';
            //天数
            if (rowObject.categoryDayRemain != null && rowObject.categoryDayRemain != '') {
                span += rowObject.categoryDayRemain + 'day<br/>';
            }
            if (rowObject.fcRemain != null && rowObject.fcRemain != '') {
                span += rowObject.fcRemain + 'FC<br/>';
            }
            if (rowObject.fhRemain != null && rowObject.fhRemain != '') {
                span += rowObject.fhRemain + 'FH<br/>';
            }
            if (rowObject.calendarDayRemain != null && rowObject.calendarDayRemain != '') {
                span += rowObject.calendarDayRemain + '日历日<br/>';
            }
            if (rowObject.flightDayRemain != null && rowObject.flightDayRemain != '') {
                span += rowObject.flightDayRemain + '飞行日<br/>';
            }
            span += '</div>'
        }
    }
    return span;
}

//pof标记
function formaterPof(cellvalue, options, rowObject) {
    var span = '';
    if (rowObject.stationMRStatus == 1) {//满足
        span = '<div style="word-break: break-all; white-space: normal;background-color:green;padding:2px 0px;width : 95%"> ' + cellvalue + '</div>';
    } else if (rowObject.stationMRStatus == 2) {//部分满足
        span = '<div style="word-break: break-all; white-space: normal;background-color:yellow;padding:2px 0px;width : 95%"> ' + cellvalue + '</div>';
    } else if (rowObject.stationMRStatus == 3) {//不满足
        span = '<div style="word-break: break-all; white-space: normal;background-color:red;padding:2px 0px;width : 95%"> ' + cellvalue + '</div>';
    } else {
        if (cellvalue == '' || cellvalue == null) {
            span = '<div style="width : 95%"></div>';
        } else {
            span = '<div style="width : 95%"> ' + cellvalue + '</div>';
        }
    }
    return span;
}

function formaterReference(cellvalue, options, rowObject) {
    if (cellvalue == "MEL") {
        return '<a href="#" style="color:#f60" >' + (cellvalue == null ? 'View' : cellvalue) + '</a>';
    }
    return cellvalue;
}

function formatTlbStr(cellValue, options, rowObject) {
    if (cellValue != null) {
        var span = '<div style="word-break: break-all; white-space: normal;width : 95%"> ' + cellValue + '</div>';
        return span;
    }
    return "";
}

//
// //解析日期函数
// function parseDate(dateStr) {
//     if (dateStr == null) {
//         return "";
//     }
//     var dateArr = null;
//     var timeArr = null;
//     var arr1 = dateStr.split(" ");
//     if (arr1[0] != null) {
//         dateArr = arr1[0].split("-");
//     }
//     if (arr1[1] != null) {
//         timeArr = arr1[1].split(":");
//     }
//     if (timeArr == null) {
//         return new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);
//     } else {
//         return new Date(dateArr[0], dateArr[1] - 1, dateArr[2], timeArr[0], timeArr[1], timeArr[2]);
//     }
// }

function viewDefect(rowObj, event) {
    var curHeight;
    if( window.screen.height < 800){
        curHeight = $(window).height()*1.1.toString()
    }else{
        curHeight = '700'
    }
    let title = "故障详情----" + rowObj.text;
    ShowWindowIframe({
        width: "1000",
        height: curHeight,
        title: title,
        param: {defectId: rowObj.id, defectNo: rowObj.text},
        url: "/views/defect/defectDetails.shtml"
    });
}

function viewDeferred(defectId, deferredNo) {
    let title = `【故障保留查看】`;
    let param = {
        defectId: defectId,
        operation: "DEFERRAL"
    };
    ShowWindowIframe({
        width: "1100",
        height: "700",
        title: title,
        param: param,
        url: "/views/defect/viewPending.shtml"
    });
}


function dateFormatter(time) {
    var date = new Date();
    date.setTime(time);
    return getShortTime(date)
}

function getShortTime(date){
    return date.getFullYear() + "-" + addZeroPrefix(date.getMonth() + 1) + "-" + addZeroPrefix(date.getDate());//yyyy-MM-dd格式日期
}

function addZeroPrefix(num) {
    if (num < 0) return "00";

    if (num >= 0 && num < 10) {
        return "0" + num;
    }

    if (num >= 10) return num;
}

function formatterApplyDate(cellValue, options, rowObject) {
    if (cellValue) {
        return dateFormatter(cellValue);
    } else return "";
}

function formatterExpiredDate(cellValue, options, rowObject) {
    if (cellValue) {
        return dateFormatter(cellValue);
    } else return "";
}
function formatterCloseDate(cellValue, options, rowObject) {
    if (cellValue) {
        return dateFormatter(cellValue);
    } else return "";
}
