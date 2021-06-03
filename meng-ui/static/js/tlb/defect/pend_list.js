var sub_win = frameElement.api;
var P = (sub_win == null ? null : sub_win.opener);

$(function () {
    var s_params = {};
    var allConds = {};
    if (sub_win && sub_win.data && sub_win.data.isDialog == 1) {
        s_params = {
            'sidx': 'defectNo',
            'sord': 'desc'
        };
        allConds = {
            'editStatus': {hidden: true},
            'executionStatus': {hidden: true},
            'sourceType': {hidden: true}
        };
    }
    $('.date_input').datebox({});
    //最简配置
    var options_simple = {
        view: 'V_DEFECT_PEND_QUERY',	//列表名称, 必填
        defaultParam: s_params, //默认查询参数
        //查询条件(可选配置)
        qcOptions: {
            qcBoxId: 'qc_box', // 查询框Id, 默认值: qc_box
            allConds: allConds
        },
        //结果列表(可选配置)
        gridOptions: {
            gridId: 'common_list_grid', //列表Id
            //optsCols: ["edit"], //要显示的操作列,默认值:[]
            optsCols: [], //要显示的操作列,默认值:[], 如果不显示，则用默认值
            optsFirst: true,
            jqGridSettings: {
                multiselect: false
            }
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
                    // formatter : formaterReference
                },
                'deferredNo': {
                    formatter: formaterDeferredNo
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
                "mechanic": {
                    /*formatter : formatMechanic*/
                },
                "inspector": {
                    /*formatter : formatInspector*/
                },
                "defectCategory": {
                    formatter: formaterCategory
                },
                "applyDate": {
                    formatter: formatterApplyDate
                },
                "expiredDate": {
                    formatter: formatterApplyDate
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

function formatDescriptionChineseAndEnglish(cellvalue, options, rowObject) {
    return rowObject.defectDescChn+"<br/>"+rowObject.defectDescEng;
}


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

function oper_edit(cellvalue, options, rowObject) {
    //编辑图标
    var editDiv = '';
    if (gridPermissionMap && gridPermissionMap.deferred_editPermission) {
        if (rowObject.auditStatus == 1 || rowObject.auditStatus == 5) {
            var id = rowObject.defectId;
            var pendId = rowObject.id;
            var category = rowObject.category;
            editDiv += '<div id="'
                + options.rowId
                + '" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit" title="'
                + $.jgrid.nav.edittitle
                + '" onclick="edit(\'' + id + '\',\'' + category + '\',this,event);"><span class="ui-icon ui-icon-pencil"></span></div>';
        }
    }
    if (gridPermissionMap && gridPermissionMap.deferred_deletePermission) {
        if (rowObject.auditStatus == 1 || rowObject.auditStatus == 5) {
            editDiv += '<div id="'
                + options.rowId
                + '" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit" title="'
                + $.jgrid.nav.edittitle
                + '" onclick="deletePend(\'' + pendId + '\',\'' + category + '\',this,event);"><span class="ui-icon ui-icon-trash"></span></div>';
        }
    }
    return editDiv;
}

function deletePend(pendId, category, obj, event) {
    var params = {
        "id": pendId
    };
    var actionUrl = "tlb/defect_dd_flow_delete.action";
    if (pendId != "" && pendId != null) {
        $.dialog.confirm('Are you sure to delete?', function () {
            $.ajax({
                url: actionUrl,
                data: params,
                dataType: "json",
                cache: false,

                success: function (obj, textStatus) {
                    var data = JSON.parse(obj);
                    if (data.ajaxResult == "success") {
                        //$("#common_list_grid").jqGrid('delRowData',n);
                        /*var arr = selectIds.toString().split(',');
                          $.each(arr,function(i,n){
                                if(arr[i]!=""){
                                }
                          });*/
                        $.dialog.alert("Delete Success");

                        $("#common_list_grid").jqGrid().trigger("reloadGrid");
                    } else {
                        $.dialog.alert(data.ajaxResult);
                    }
                }
            })
        }, function () {
            //$.dialog.tips('执行取消操作');
        })
    } else {
        $.dialog.alert("Please select records to delete");
    }
}


function edit(defectId, category, obj, event) {
    var actionUrl = basePath + "/tlb/defect_pend_createDfrl.action?id=" + defectId + "&category=" + category;

    P.$.dialog({
        id: 'Page',
        title: 'Edit Deferred Info ',
        width: '1200px',
        height: '600px',
        top: '80px',
        esc: true,
        cache: false,
        close: function () {
            // 弹出的窗口被关闭后,主页面刷新
            P.$("#common_list_grid").jqGrid().trigger("reloadGrid");
        },
        lock: true,
        max: false,
        min: false,
        parent: this,
        content: 'url:' + actionUrl
//		data : parameters
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

function formatMechanic(cellvalue, options, rowObject) {

    if (rowObject.mechanicNo && rowObject.mechanic) {

        return rowObject.mechanic + '(' + rowObject.mechanicNo + ')';

    }
    return "";
}

function formatInspector(cellvalue, options, rowObject) {

    if (rowObject.mechanicNo && rowObject.mechanic) {

        return rowObject.mechanic + '(' + rowObject.mechanicNo + ')';

    }
    return "";
}

function assignPend(defectNo, acreg, gid, refresh) {
    let filter = {
        "openPageType": "DEFECT",
        "ac": acreg
    };
    $.chooseFlight({
        filter: filter,
        success: function(data){
            editMccRemark(data, defectInfo, gid)
        }
    });

}

function editRemark(id, gid) {
    //remark edit
    var url = basePath + "/views/defect/monitor/edit_remark.shtml";
    var P = getOpener();
    var paramas = {
        id:id,
        type: "EDIT",
        refresh: function(){
            $(`#${gid}`).sfaQuery().reloadQueryGrid();
        }
    };
    P.$.dialog({
        id : 'edit_Remark',
        title : 'Edit Remark',
        width:	'400px',
        height: '200px',
        esc:true,
        lock:true,
        cache:false,
        max: false,
        min: false,
        parent:this,
        content : 'url:' + url,
        data : paramas,
        close : function(){
            $("#"+gid).closest("tr").prev("tr").find("img").click();
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
        },
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
        if ("1" == rowObject.assignFlag || "2" == rowObject.assignFlag) {
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

//解析日期函数
function parseDate(dateStr) {
    if (dateStr == null) {
        return "";
    }
    var dateArr = null;
    var timeArr = null;
    var arr1 = dateStr.split(" ");
    if (arr1[0] != null) {
        dateArr = arr1[0].split("-");
    }
    if (arr1[1] != null) {
        timeArr = arr1[1].split(":");
    }
    if (timeArr == null) {
        return new Date(dateArr[0], dateArr[1] - 1, dateArr[2]);
    } else {
        return new Date(dateArr[0], dateArr[1] - 1, dateArr[2], timeArr[0], timeArr[1], timeArr[2]);
    }
}

// deferred 编号链接
function formaterDeferredNo(cellvalue, options, rowObject) {
//	var fun = "viewDeferred(this,event)";
    var sty = 'color:black';

    if (rowObject.auditStatus == 1 || rowObject.auditStatus == 2) {
        //未审核: 黄色
        sty = 'color:#a0a030';
    } else if (rowObject.auditStatus == 3) {
        //未批准: 橙色
        sty = 'color:orange';
    }
    /*else if (rowObject.auditStatus == 4){
        //已批准: 灰色
        sty = 'color:gray';
    }*/

    /*if (rowObject.auditStatus == 4 && rowObject.isMrTrOk){
        //条件满足: 绿色
        sty = 'color:green';
    }*/
    if (rowObject.auditStatus == 4) {
        //条件满足: 绿色
        sty = 'color:green';
    }

    if (rowObject.status == 1) {
        var now = new Date();
        var applyDate = parseDate(rowObject.applyDate);
        var expiredDate = parseDate(rowObject.expiredDate);
        if (expiredDate == "") {
            sty = 'color:red';
        } else {
            var total = expiredDate.getTime() - applyDate.getTime();
            var remain = expiredDate.getTime() - now.getTime();
            if (remain < 3 * 24 * 3600 * 1000 || remain < total * 0.15) {
                //预警: 红色
                sty = 'color:red';
            }
        }
    }


    if (rowObject.status == 2) {
        sty = 'color:black';
    }
    return '<a href="#" id="' + rowObject.defectId + '" style=' + sty + ' onclick="viewDeferred(this,event,\'' + rowObject.category + '\');"  >' + (cellvalue == null ? 'View' : cellvalue) + '</a>';
}

//pend 编号 链接
function formaterPendNo(cellvalue, options, rowObject) {
    if (rowObject && rowObject.pendNo) {
        // var fun = 'pendClick(rowObject)';
        return '<a href="#" id="' + rowObject.defectId + '" style="color:#f60" onclick="pendClick(' + rowObject.defectId + ',' + cellvalue + ');"  >' + (cellvalue == null ? 'View' : cellvalue) + '</a>';
    }
    return "";
}

function pendClick(defectId, pendNo) {
    if (!defectId) {
        return
    }
    let title = `【故障推迟查看----${pendNo || ""}】`;
    let param = {
        defectId: defectId,
        operation: "PEND"
    };
    ShowWindowIframe({
        width: "1100",
        height: "700",
        title: title,
        param: param,
        url: "/views/defect/viewPending.shtml"
    });
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

function viewDeferred(rowObj, event, category) {
    var url = basePath + '/tlb/defect_pend_view_viewPend.action?id=' + rowObj.id + '&category=' + category;
    var titleName = "View Deferred Information";

    if (null != category && category == 'PEND') {
        titleName = "View Pend Information";
    }
    P.$.dialog({
        title: titleName,
        width: '1024px',
        height: '500px',
        esc: true,
        max: false,
        min: false,
        lock: true,
        content: 'url:' + url,
        close: function () {
            //$(document).sfaQuery().reloadQueryGrid();
        }
    });
}

function formatterApplyDate(cellValue, options, rowObject) {
    if (cellValue != null) {
        var arr1 = cellValue.split(" ");
        if (arr1 != null) {
            return arr1[0];
        }
    }
    N;

    return "";
}





