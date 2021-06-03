var customModelSettings = {
    "FLB_LINE_JOB": {
        gridOptions: {
            jqGridSettings: {
                multiselect: false
            },

            allColModels: {
                'checkType': {
                    colNameEn: 'Task',
                    colNameCn: 'Task',
                    sortable: false,
                    formatter: formatPreTask
                },

                'pendItem': {
                    name: "pendItem",
                    colNameEn: 'A/C Status',
                    colNameCn: 'A/C Status',
                    width: 60,
                    sortable: false,
                    formatter: formatPendItem
                },

                'flt.flight': {
                    width: 60,
                    formatter: formatFlight
                },

                'pofLineJob.checkType': {
                    colNameEn: 'Task',
                    colNameCn: 'Task',
                    width: 60,
                    sortable: false,
                    formatter: formatPostTask
                },

                'flt.flightDate': {
                    formatter: format2Date
                },

                'jobDate': {
                    formatter: format2Date
                },

                'flt.planTakeoffDate': {
                    formatter: format2Time
                },

                'flt.planLandingDate': {
                    formatter: format2Time
                },

                'flt.prepareTakeoffDate': {
                    formatter: format2Time
                },

                'flt.prepareLandingDate': {
                    formatter: format2Time
                },

                'flt.takeoffDate': {
                    formatter: format2Time
                },

                'flt.landingDate': {
                    formatter: format2Time
                },

                'flt.fromStation': {
                    width: 60,
                    formatter: fromStation
                },

                'flt.toStation': {
                    width: 60,
                    formatter: fromStation
                },
                'limitNames': {
                    name: 'limitNames',
                    index: 'limitNames',
                    colNameEn: '运行限制',
                    colNameCn: '运行限制',
                    width: 70,
                    sortable: false,
                    formatter: function (v, c, o) {
                        v = v || '';
                        if (v) {
                            var str = '';
                            $.each(exists_params, function (i, e) {
                                if (v.indexOf(i) != -1) {
                                    str += ',' + e;
                                }
                            });
                            if (str) {
                                str = str.slice(1);
                            }
                            o.limitNames = str;

                            // edit by zdx (2018-05-22) start

                            var show = "";
                            var assignFlag = o.overWaterAssignFlag;
                            var gaoYuanFlag = o.gaoYuanAssignFlag;

                            if (str) {
                                var arr = str.split(",");
                                for (var i = 0; i < arr.length; i++) {
                                    var detail = arr[i];
                                    if (detail == "跨") {
                                        if (assignFlag == 1) {
                                            if (show) {
                                                show += "," + "<font color='green'>跨</font>";
                                            } else {
                                                show += "<font color='green'>跨</font>";
                                            }
                                        } else if (assignFlag == 2) {
                                            if (show) {
                                                show += "," + "<font color='red'>跨</font>";
                                            } else {
                                                show += "<font color='red'>跨</font>";
                                            }
                                        }
                                    }
                                    // add by zdx (2018-06-20) 高高原
                                    else if (detail == "高") {
                                        if (gaoYuanFlag == 1) {
                                            if (show) {
                                                show += "," + "<font color='green'>高</font>";
                                            } else {
                                                show += "<font color='green'>高</font>";
                                            }
                                        } else if (gaoYuanFlag == 2) {
                                            if (show) {
                                                show += "," + "<font color='red'>高</font>";
                                            } else {
                                                show += "<font color='red'>高</font>";
                                            }
                                        }
                                    } else {
                                        if (show) {
                                            show += ",<font class='red'>" + detail + "</font>";
                                        } else {
                                            show += "<font class='red'>" + detail + "</font>";
                                        }
                                    }
                                }
                            }

                            if (show) {
                                return show;
                            } else {
                                return '<font class="red">' + str + '</font>';
                            }

                            // edit by zdx (2018-05-22) end

                        }
                        return '';
                    }
                }
            }
        }
    }
};
var exists_params = {
    '高高原运行': '高',
    '延伸跨水': '跨',
    'TCAS 7.1': 'T',
    '基本RNP 1': 'R',
    '卫星电话（SATCOM': '星'
};

/**
 * 格式化为日期
 * @param cellvalue
 * @param options
 * @param rowObject
 * @returns
 */
function format2Date(cellvalue, options, rowObject) {
    if (cellvalue != null) {
        return cellvalue.split(" ")[0];
    }
    return "";
}

/**
 * 格式化为时间
 * @param cellvalue
 * @param options
 * @param rowObject
 * @returns
 */
function format2Time(cellvalue, options, rowObject) {
    if (cellvalue != null) {
        return cellvalue.split(" ")[1];
    }
    return "";
}

/**
 * 测试化航班号显示
 */
function formatFlight(cellvalue, options, rowObject) {
    if (cellvalue == null) {
        return "N/A";
    }

    var viewDiv = null;
    if (rowObject.flt != null) {
        viewDiv = flgVrToStr(rowObject.flt.flgVr);
    }

    if (viewDiv == null) {
        return cellvalue;
    } else {
        return cellvalue + "(" + viewDiv + ")";
    }
}

/**
 * 格式化航站信息， 如果没有关联航班条， 则显示Line Job中的station
 * @param cellvalue
 * @param options
 * @param rowObject
 * @returns
 */
function fromStation(cellvalue, options, rowObject) {
    if (cellvalue == null) {
        return rowObject.station;
    }
    return cellvalue;
}

/***
 * 格式化航站任务附加的TLB、DD等
 * @param cellvalue
 * @param options
 * @param rowObject
 * @returns {String}
 */
function formatPendItem(cellvalue, options, rowObject) {
    var viewDiv = '<input value="View" id="' + rowObject.acReg + '" type="button" width:"90px" onclick="queryAcStatus(\'' + rowObject.flbBase.acReg + '\')"></input>';
    return viewDiv;
}

function queryAcStatus(acReg) {
    var defaultParam = {
        'pageModel.qname': {0: "tail"},
        'pageModel.qoperator': {0: "equals"},
        'pageModel.qvalue': {0: acReg}
    };

    top.$(top).data("troubleFollowUpQueryDefaultParamFromTBM", defaultParam);

    var dlg = $(this).sfaQueryDialog({
        dialogId: "ac_status_dlg",
        dialogTitle: "AC Status",
        view: "V_TROUBLE_FOLLOW_UP",
        dialogWidth: 1000,
        dialogHeight: 300,
        qcOptions: {
            qcBoxId: 'qc_box',
            showSavedQueries: false
        },
        defaultParam: defaultParam,
        gridOptions: {},
        "fromPage": "tbmViewAcStatus"
    });
}

/**
 * 格式化前置检查工作
 * @param cellvalue
 * @param options
 * @param rowObject
 * @returns
 */
function formatPreTask(cellvalue, options, rowObject) {
    if (rowObject.flt == null) {
        return "";
    }
    var flgVr = rowObject.flt.flgVr;
    var viewDiv = "";
    if ("VC" == flgVr) {
        viewDiv = "备降取消";
        return viewDiv;
    } else if ("RC" == flgVr) {
        viewDiv = "返航取消";
        return viewDiv;
    } else if (!isNoFlt(rowObject)) {
        viewDiv = rowObject.workType
    }

    if (!gridPermissionMap.staTaskOperate) {
        return viewDiv;
    }

    var color = "#FFBF00";
    if ("N/A" == rowObject.workType) {
        color = "#999";
    } else if (isReleased(rowObject)) {
        color = "#00FF00";
    }

    attachFunc("pre_" + rowObject.id, rowObject);
    return "<input id='pre_" + rowObject.id + "' value='" + viewDiv + "' type='button' style='background:" + color + "; width:60px'></input>";
}

/**
 * 格式化后置航线工作
 * @param cellvalue
 * @param options
 * @param rowObject
 * @returns {String}
 */
function formatPostTask(cellvalue, options, rowObject) {

    //计算颜色
    var color = "#FFBF00";
    if (isNoFlt(rowObject) && isReleased(rowObject)) {
        color = "#00FF00";
    } else if (isReleased(rowObject.pofLineJob)) {
        color = "#00FF00";
    }

    //计算显示文本
    var viewDiv = "";
    if (rowObject.pofLineJob != null) {
        if (rowObject.djFlg) {
            viewDiv = "Periodic";
        } else {
            viewDiv = "Po/F";
        }
    } else if (isOG(rowObject)) {
        viewDiv = rowObject.workType;

    } else if (isSta(rowObject)) {
        viewDiv = rowObject.station;

    } else if (null != rowObject.flt && null != rowObject.flt.flgVr) {
        viewDiv = flgVrToStr(rowObject.flt.flgVr);
    }

    var tempLineJob = null;
    if (rowObject.pofLineJob != null) {
        tempLineJob = rowObject.pofLineJob;

    } else if (isNoFlt(rowObject)) {
        tempLineJob = rowObject;
    }

    if (tempLineJob != null && gridPermissionMap.staTaskOperate) {
        attachFunc("post_" + tempLineJob.id, tempLineJob);
        return "<input id='post_" + tempLineJob.id + "'value='" + viewDiv + "' type='button' style='background:" + color + "; width:60px'></input>";
    } else {
        return viewDiv;
    }
}

/**
 * 构造按钮事件
 * @param lineJob
 * @returns
 */
function attachFunc(id, lineJob) {
    var func;
    if (parentDialogParams != null && parentDialogParams["actionType"] == "assign") { //任务下发并直接生成MCC任务
        if (!isNoFlt(lineJob) && isReleased(lineJob)) {
            func = function () {
                P.$.dialog.alert('already Released.');
            }
        } else {
            func = assignTask;
        }
    } else if (parentDialogParams != null && parentDialogParams["actionType"] == "select") { //选择航班关联
        func = buildSelectedJobData;
        //如果是故障类型,并且航站已经放行就不能选择
        if (parentDialogParams["type"] == "Defect" && isReleased(lineJob)) {
            func = function () {
                P.$.dialog.alert('already Released.');
            }
        }
    } else {
        func = viewLineJob;
    }

    $("#" + id).die("click").live("click", function () {
        if (func != viewLineJob) {
            $("#" + id).die("click");
        }
        func(lineJob, $("#" + id));
    });
}

/**
 * 构造回填到选择页面的lineJob数据
 * @param lineJob
 */
function buildSelectedJobData(lineJob) {
    if (lineJob.id < 0) {
        createLineJob(lineJob, buildSelectedJobData);
        return;
    }

    if (lineJob.flt != null) {
        api.data['flightNo'] = lineJob.flt.flight;
        api.data['flightId'] = lineJob.flt.flightId;
        api.data['toStation'] = lineJob.flt.toStation;
    } else {
        api.data['flightNo'] = "N/A";
    }
    api.data['flightDate'] = lineJob.jobDate;
    api.data['acReg'] = lineJob.flbBase.acReg;
    api.data['workType'] = lineJob.workType;
    if (lineJob.workType == 'O/G') {
        api.data['toStation'] = lineJob.station;
    }
    api.data['station'] = lineJob.station;
    api.data['lineJobId'] = lineJob.id;
    api.close();
}

/**
 * 创建新的停场航线任务
 * @param lineJob
 */
function createLineJob(lineJob, callback) {
    $.ajax({
        url: basePath + "/api/v1/station_task/createLineJob",
        type: "post",
        dataType: "json",
        cache: false,
        data: {
            "acId": lineJob.acId,
            "acReg": lineJob.acReg,
            "jobDateStr": lineJob.jobDate.split(" ")[0],
            "station": lineJob.station,
        },
        success: function (data) {
            if (data.code == 200) {
                callback(data.data.lineJob);
            } else {
                P.$.dialog.alert(data.msg);
            }
        }
    });
}

/**
 * 是否已放行
 * @param lineJob
 * @returns
 */
function isReleased(lineJob) {
    if (lineJob == null) {
        return false;
    }

    if (isNoFlt(lineJob)) {
        if (lineJob.taskCnt > 0 && lineJob.openCnt == 0) {
            return true;
        }
        return false;
    }

    return 'y' == lineJob.isReleased;
}

/**
 * 转化航班标志
 * @param flgVr
 * @returns {String}
 */
function flgVrToStr(flgVr) {
    var viewDiv = flgVr;
    if ("RC" == flgVr) {
        viewDiv = "返航取消";
    }
    if ("VC" == flgVr) {
        viewDiv = "备降取消";
    }

    if ("R1" == flgVr) {
        viewDiv = "返航";
    }

    if ("V1" == flgVr) {
        viewDiv = "备降";
    }

    if ("R2" == flgVr) {
        viewDiv = '重飞';
    }

    if ("V2" == flgVr) {
        viewDiv = '调机';
    }
    return viewDiv;
}

/**
 * 查看航线任务
 * @param lineJobId
 */
function viewLineJob(lineJob) {
    //绑定查询参数到TOP, 供后续返回列表页面使用
    top.$(top).data("lineJobQuery", $(document).sfaQuery().postData());
    top.$(top).data("lineJobLimitNames", lineJob.limitNames);
    window.location = basePath + "/tbm/tbm_taskDetail_view.action?" + "lineJob.id=" + lineJob.id;
}

function viewPendItem(flightDate, flight, obj, event) {
    showDialog(flightDate, flight, obj, 'view');
}

/**
 * 显示窗体
 */
function showDialog(flightDate, flight, obj, doType) {
    var rowId = $(obj).attr('id');

    var parameters = {
        "methodType": doType,
        "parent": this.window
    };

    var actionUrl = basePath + '/tbm/tbm_staTask_toView.action?acReg=' + rowId + '&flightDate=' + flightDate + '&flight=' + flight;
    P.$.dialog({
        id: doType + 'Page',
        title: 'Station Basic Information ' + doType,
        width: '900px',
        height: '300px',
        top: '80px',
        esc: true,
        cache: false,
        close: function () {
            // 弹出的窗口被关闭后,主页面刷新
            //this.opener.location.reload();
        },
        max: false,
        min: false,
        parent: this,
        content: 'url:' + actionUrl,
        data: parameters
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
 * 下发任务前的弹框Remark
 */
function inputMccRemark(defectNo, parentParams) {
    var P = getOpener();
    var paramas = {
        defectNo: defectNo,
        parentParams: parentParams
    };
    P.$.dialog({
        id: 'edit_Remark',
        title: 'Edit Mcc Remark',
        esc: true,
        lock: true,
        cache: false,
        max: false,
        min: false,
        parent: this,
        content: 'url:' + basePath + "/tlb/defect/defect_edit_mcc_remark.jsp",
        data: paramas,
        close: function () {
            if ($(document).sfaQuery()) {
                $(document).sfaQuery().reloadQueryGrid();
            }
        }
    });
}

/**
 * 下发任务
 * @param lineJobId
 */
function assignTask(lineJob, $btn) {
    var type = parentDialogParams["type"]; //任务类型
    var woNo = parentDialogParams["no"]; //文件号
    var cardId = parentDialogParams["cardId"]; //cardId
    var description = parentDialogParams["description"]; //描述
    var requireFeedback = parentDialogParams["requireFeedback"]; //描述
    var assignParam = {
        lineJob: lineJob, "btn": $btn, type: type, woNo: woNo, cardId: cardId,
        description: description, requireFeedback: requireFeedback, api: api
    };
    //add by 80003187 2018-05-31进行remark弹框--start----
    if (type != '' && type == 'DEFECT') {//如果是故障类型则进行remark弹框，否则按照原逻辑执行
        inputMccRemark(parentDialogParams["no"], assignParam);
    } else {
        if (lineJob.id < 0) {
            createLineJob(lineJob, assignTask);
            return;
        }
        var type = parentDialogParams["type"]; //任务类型
        var woNo = parentDialogParams["no"]; //文件号
        var cardId = parentDialogParams["cardId"]; //cardId
        var description = parentDialogParams["description"]; //描述
        var requireFeedback = parentDialogParams["requireFeedback"]; //描述
        let  params ={
            "parentId": lineJob.id,
            "workType": type,
            "cardNumber": woNo,
            "cardId": cardId,
            "description": description,
            "requireFeedback": requireFeedback
        };
        $.ajax({
            url: basePath + "/api/v1/station_task/addMccInfo",
            type: "post",
            contentType : 'application/json;charset=utf-8',
            async: false,
            // data: {
            //     "parentId": lineJob.id,
            //     "workType": type,
            //     "cardNumber": woNo,
            //     "cardId": cardId,
            //     "description": description,
            //     "requireFeedback": requireFeedback
            // },
            data:JSON.stringify(params),
            dataType: "json",
            // dataType:"application/json",
            success: function (data) {
                if (data.code == 200) {
                    alert("Assign success");
                    api.close();
                } else if (data.code == 205) {
                    P.$.dialog.alert(data.msg);
                } else {
                    P.$.dialog.alert(data.msg);
                    $btn.live("click", function () {
                        $btn.die("click");
                        assignTask(lineJob, $btn);
                    });
                    api.close();
                }

            }
        });
    }
    //add by 80003187 2018-05-31进行remark弹框----end----

}

/**
 * 格式化关联操作
 * @param cellvalue
 * @param options
 * @param rowObject
 * @returns {String}
 */
function formatterOper(cellvalue, options, rowObject) {
    var flt = rowObject.flt;
    if (flt.flgVr == "VC" || flt.flgVr == "RC") {
        if (flt.refId != null) {
            return "已关联";
        }
        var html = '&nbsp;&nbsp;<div id="' + flt.flightId + '" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit" title="Edit"'
            + '><span class="ui-icon ui-icon-copy"></span></div>';
        $("#" + rowObject.flightId).die("click").live('click', function () {
            shuffle(flt.flightId, flt, this);
        });
        return html;
    } else {
        return "";
    }
    return "oper";
}

function shuffle(flightId, rowObject, ele) {
    var defaultParam = {
        'pageModel.qname': {
            0: 'acReg',
            1: 'fromStation',
            2: 'flightDate'
        },
        'pageModel.qoperator': {
            0: "equals",
            1: "equals",
            2: "g",
        },
        'pageModel.qvalue': {
            0: rowObject.acReg,
            1: rowObject.fromStation,
            2: rowObject.flightDate
        },
        'pageModel.page': 1,
        'pageModel.rows': 1,
    };

    var dlg = $(ele).sfaQueryDialog({
        dialogId: "dlg_flightLog",
        dialogTitle: "Process VC/RC FLT. " + rowObject.acReg + " " + rowObject.flightDate.split(" ")[0] + " " + rowObject.flight + " From "
            + rowObject.fromStation + " To " + rowObject.toStation,
        view: "M_FLB_FLIGHT_LOG",
        dialogWidth: 1000,
        defaultParam: defaultParam,
        qcOptions: {
            qcBoxId: 'qc_box',
            showSavedQueries: false
        },
        gridOptions: {
            jqGridSettings: {
                sortname: 'flightDate', // 默认排序字段
                sortorder: "asc", // 排序方式
                rowNum: 1
            },
            callback: function (rowdata, originalData) {
                P.$.dialog.confirm("确定将备降(返航)取消航班关联到选中的航班？ <br/><br/>" +
                    "1. 备降(返航)取消航班的FLB数据将转移到选中航班. <br/>" +
                    "2. 备降(返航)取消航班的其他数据会关联到选中的航班.", function () {
                    shuffleTask(rowObject, originalData, dlg);
                });
            }
        }
    });
}

function shuffleTask(rowObject, originalData, dlg) {
    $.ajax({
        url: basePath + "/tbm/tbm_staTask_shuffleTask.action?selectedIds=" + rowObject.flightId + "," + originalData.flightId,
        dataType: "json",
        cache: false,
        success: function (data, textStatus) {
            data = JSON.parse(data);
            if (data.ajaxResult == "success") {
                if (typeof (textArray) != 'undefined') {
                    textArray();
                }
                dlg.close();
            } else {
                P.$.dialog.alert(data.msg);
            }
        }
    });
}

/**
 * 是否为无具体航班类型任务
 * @param rowObject
 * @returns {Boolean}
 */
function isNoFlt(rowObject) {
    return isOG(rowObject) || isSta(rowObject);
}

function isOG(rowObject) {
    return rowObject.workType == "O/G";
}

function isSta(rowObject) {
    return rowObject.workType == "STA";
}