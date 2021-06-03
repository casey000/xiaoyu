var customModelSettings = {
    "NRC_CONTROL_MONITOR_LIST": {
        // 列表项配置
        gridOptions: {
            allColModels: {
                "cardNo": {
                    formatter: formatCardInfo
                },
                'remainDay': {
                    formatter: remaindayFun
                },
                'woNo': {
                    formatter: woNoFun
                },
                'mrs': {
                    formatter: mrFun
                },
                'fltNos': {
                    formatter: fltNoFun
                },
                "lastTsn":
                    {
                        formatter: tsnFun
                    },
                'station': {
                    formatter: fltStaFun
                },
                'mrStation': {
                    formatter: mrStaFun
                },
                'Assign': {
                    name: 'Assign',
                    colNameEn: 'Assign',
                    isOpts: true,
                    width: 50,
                    formatter: formatAssignDefect
                },
                'remark': {
                    formatter: remarkFun
                }
            }
        }
    }
};

function formatAssignDefect(cellvalue, options, rowObject) {

    var editDiv = '';
    editDiv = '<div style="padding-left:8px" id="'
        + options.rowId
        + '" class="ui-corner-all clever-jqgrid-action clever-jqgrid-edit edit" title="Assign"'
        + ' onclick=assignNrcTask(\"'
        + rowObject.cardId
        + '\",\"'
        + rowObject.cardNo
        + '\",\"'
        + rowObject.tail
        + '\",\"'
        + rowObject.cardType
        + '\","refreshNrc")><span class="ui-icon ui-icon-gear"></span></div>';
    return editDiv;
}

/**
 * 列表中的remark字段显示方法
 *
 * */
function remarkFun(cellvalue, options, rowObject) {

    cellvalue = (null == cellvalue) ? " " : cellvalue;
    var ele = "<div title='" + cellvalue + "' width='100%' height='100%' id='remark_" + rowObject.id + "'>" + cellvalue + "</div>";
    $("#remark_" + rowObject.id).die("dblclick").live("dblclick", function () {

        editRemark(rowObject.id, rowObject.cardNo, rowObject.cardType, rowObject.tail, rowObject.eng, cellvalue);
    });
    return ele;
}

/**
 * 修改列表中的remark字段信息
 * */
function editRemark(id, cardno, type, ac, eng) {
    var remark = $.trim($("#remark_" + id).html());
    P.$.dialog({
        title: "Edit remark",
        data: {'id': id, 'cardno': cardno, "type": type, "ac": ac, "eng": eng, "remark": remark},
        width: 500,
        height: 200,
        esc: true,
        cache: false,
        perent: this,
        content: "url:" + basePath + "/ppc/nrcControl_toUpdateRemark.action?id=" + id,
        close: function () {
            var newRemark = this.data['remark'];
            if (this.data['submit'] == 1) {
                var params = {"id": id, "remark": newRemark};
                $.ajax({
                    url: basePath + "/ppc/nrcControl_updateRemark.action",
                    type: "post",
                    data: params,
                    dataType: "json",
                    cache: false,
                    success: function (obj, textStatus) {
                        if (obj == null) {
                            $.dialog.alert('Error!');
                            return false;
                        }
                        var data = JSON.parse(obj);
                        var msglx = data.ajaxResult;
                        if (msglx == "success") {
                            $.dialog({
                                title: "Window",
                                icon: 'success.gif',
                                content: 'Save successfully!!',
                                lock: true
                            }).button({name: "OK"});
                            newRemark = newRemark == "" ? " " : newRemark;
                            $("#remark_" + id).html(newRemark);
                            $("#remark_" + id).attr("title", newRemark); // 当前节点和父节点都需显示title
                            $("#remark_" + id).parent().attr("title", newRemark);

                        } else {
                            var msg = data.error;
                            $.dialog.alert('Error!' + msg);
                        }
                        return false;
                    }
                });
            }

        }
    });
}

function assignNrcTask(id, cardNo, acreg, cardType, refresh) {

    var P = getOpener();
    if (cardType == "NRCTASK") {

        assignDialog({
            type: cardType,
            cardId: id,
            no: cardNo,
            acReg: acreg,
            actionType: 'assign',
            callback: refresh
        })

    } else {

        $.ajax({
            url: basePath + "/tbm/tbm_flow_findIsAssignedNrc.action?id=" + id + "&cardType=" + cardType,
            type: "get",
            dataType: "json",
            success: function (data) {
                var data = JSON.parse(data);
                if (data.ajaxResult == 'success') {
                    assignDialog({
                        type: cardType,
                        cardId: id,
                        no: cardNo,
                        acReg: acreg,
                        actionType: 'assign',
                        callback: refresh
                    })
                } else {
                    P.$.dialog.alert(data.msg);
                }
            }
        });

    }
}

function remaindayFun(cellValue, options, rowObject) {
    var id = rowObject.id;
    var div = '';
    if (cellValue != '0' && (cellValue == null || cellValue == "" || cellValue == "null")) {

    } else if (cellValue <= 5 && cellValue >= 0) {
        div = '<div style="background-color:#F2EC04;width:100%;height:100%; vertical-align:middle">  <font style="font-weight:bold" size="3" >' + cellValue + '</font> </div>';
    } else if (cellValue == '0') {
        div = '<div style="background-color:#F2EC04;width:100%;height:100%; vertical-align:middle">  <font style="font-weight:bold" size="3" >' + cellValue + '</font> </div>';
    } else if (cellValue < 0) {
        div = '<div style="background-color:#E26484;width:100%;height:100%;vertical-align:middle" >  <font style="font-weight:bold" size="3">' + cellValue + '</font> </div>';
    } else {
        div = '<div style="width:100%;height:100%;vertical-align:middle" >  <font style="font-weight:bold" size="3">' + cellValue + '</font> </div>';
    }
    return div;
}

function woNoFun(cellValue, options, rowObject) {

    var str = "";

    if (cellValue) {
        var arr = cellValue.split(',');
        for (var i = 0; i < arr.length; i++) {
            str += arr[i] + "<br/>";
        }
    }

    return str;
}

function fltNoFun(cellValue, options, rowObject) {

    var str = "";

    if (cellValue) {
        var arr = cellValue.split(',');
        for (var i = 0; i < arr.length; i++) {
            str += arr[i] + "<br/>";
        }
    }

    return str;
}

function fltStaFun(cellValue, options, rowObject) {

    var str = "";

    if (cellValue) {
        var arr = cellValue.split(',');
        for (var i = 0; i < arr.length; i++) {
            str += arr[i] + "<br/>";
        }
    }

    return str;
}

function mrStaFun(cellValue, options, rowObject) {

    var str = "";

    if (cellValue) {
        var arr = cellValue.split(',');
        for (var i = 0; i < arr.length; i++) {
            var detail = arr[i];
            if (detail) {
                var sta = "";
                var col = "";
                var detailArr = detail.split('-');

                if (detailArr.length > 0) {
                    sta = detailArr[0] || '';
                }

                if (detailArr.length > 1) {
                    col = detailArr[1] || '';
                }

                var style = "";
                if (col == 1) {
                    style = "style='background-color:green;padding:3px 5px;margin:3px 0px;'";
                } else if (col == 2) {
                    style = "style='background-color:yellow;padding:3px 5px;margin:3px 0px;'";
                } else if (col == 3) {
                    style = "style='background-color:red;padding:3px 5px;margin:3px 0px;'";
                }

                str += "<p " + style + ">" + sta + "</p>";
            }
        }
    }

    return str;
}

function mrFun(cellValue, options, rowObject) {

    var str = "";

    if (cellValue) {
        var arr = cellValue.split(',');
        for (var i = 0; i < arr.length; i++) {
            var mrNo = arr[i];
            if (mrNo) {
                var link = '<a href="###" style="color:#f60" title="View" onclick="viewMr(\'' + mrNo + '\');">' + mrNo + '</a><br/>';
                str += link;
            }
        }
    }

    return str;
}

function viewMr(mrNo) {

    var url = basePath + '/mr/mr_view.action?mrNo=' + mrNo;
    P.$.dialog({
        title: 'View Material Requires',
        width: '1400px',
        height: '500px',
        top: '20%',
        esc: true,
        cache: false,
        max: false,
        min: false,
        parent: this,
        content: 'url:' + url,
        close: function () {
            //$(document).sfaQuery().reloadQueryGrid();
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
function assignDialog(options) {

    P.$.dialog({
        id: 'assign_' + options.type,
        title: 'Assign ' + options.type,
        top: '60px',
        width: '1070px',
        height: '600px',
        content: 'url:' + basePath + "/tbm/tbm_station_task.jsp",
        data: options,
        close: function () {
            options.callback(this);
        }
    });
}


function formatCardInfo(cellValue, options, rowObject) {
    var type = rowObject.cardType;

    if (type == "NRC") {
        return '<a href="#" style="color:#f60" title="View" onclick="viewNrc(this,event,'
            + rowObject.cardId + ');">' + (cellValue == null ? "" : cellValue) + '</a>';
    } else if (type == "NRCTASK") {
        return '<a href="#" style="color:#f60" title="View" onclick="viewNrcTask(this,event,'
            + rowObject.cardId + ');">' + (cellValue == null ? "" : cellValue) + '</a>';
    }
}

function viewNrc(obj, event, id) {
    P.$.dialog({
        title: "View Non-routine Card",
        width: Config.dialog_width,
        height: Config.dialog_view_height,
        top: Config.dialog_top,
        esc: true,
        cache: false,
        parent: this,
        content: "url:" + basePath + "/nrc/nrc_view.action?id=" + id
    });
}

function viewNrcTask(obj, event, id) {
    P.$.dialog({
        title: "View NRC TASK Card",
        width: Config.dialog_width,
        height: Config.dialog_view_height,
        top: Config.dialog_top,
        esc: true,
        cache: false,
        parent: this,
        content: "url:" + basePath + "/nrctask/nrc_task_view.action?id=" + id
    });
}

function tsnFun(cellvalue, options, rowObject) {
    var tsn = "";
    if (cellvalue) {
        tsn = convertToTime(cellvalue);
    }

    return tsn;
}

function convertToTime(time) {
    if (time == null || time == "") {
        return "";
    }
    var hour = parseInt(time / 60);
    var minute = time % 60;

    minute = Math.abs(minute);
    if (minute < 10) {
        minute = "0" + minute;
    }

    return hour + ":" + minute;
}

var Config = {
    dialog_width: 900,
    dialog_height: 600,
    dialog_view_height: 600,
    dialog_top: "15%"
};















