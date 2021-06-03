function getOpener() {
    if (frameElement != null && frameElement.api != null) {
        P = frameElement.api.opener;
    } else {
        P = window;
    }

    return P;
}

function assignTLB(defectNo, acreg, refresh) {
    var P = getOpener();
    $.ajax({
        url: basePath + "/tbm/tbm_flow_findIsAssignedDefect.action?defectInfo.defectNo=" + defectNo,
        type: "get",
        dataType: "json",
        success: function (data) {
            var data = JSON.parse(data);
            if (data.ajaxResult == 'success') {
                assignDialog({
                    type: "DEFECT",
                    no: defectNo,
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


function assignDD(ddNo, acreg, refresh) {
    var P = getOpener();
    if (ddNo == null || ddNo == "") {
        P.$.dialog.alert('DD No. is not exists, can not operate.');
        return;
    }
    $.ajax({
        url: basePath + "/tbm/tbm_flow_findIsAssigned.action?ddi.ddNo=" + ddNo,
        type: "get",
        dataType: "json",
        success: function (data) {
            var data = JSON.parse(data);
            if (data.ajaxResult == 'success') {
                assignDialog({
                    type: "DD",
                    no: ddNo,
                    acReg: acreg,
                    actionType: 'assign',
                    callback: refresh
                });
            } else {
                P.$.dialog.alert(data.errorMsg);
            }
        }
    });
}

/**
 * 创建MCC任务并下发
 * 2016/6/6 新加方法
 * @param docType
 * @param docNo
 * @param acReg            下发到飞机时传入
 * @param station        下发到航站时传入
 * @param callback
 */
function createAndassignMCC(assignType, options) {
    var P = getOpener();
    if (options.type == null || options.no == null || $.trim(options.no) == "") {
        P.$.dialog.alert(options.no + ' No. is not exists, can not operate.');
    }
    var params = {
        "mccInfo.docNo": options.no,
        "mccInfo.type": options.type,
        "mccInfo.acReg": options.acReg
    };
    $.ajax({
        url: basePath + "/api/v1/station_task/docIsAssigned",
        type: "post",
        dataType: "json",
        data: params,
        success: function (data) {
            if (data.code == 200) {
                if (assignType == 'AC') {
                    assignDialog(options);
                } else if (assignType == 'STA') {
                    assignDialog4Sta(options);
                }
            } else {
                P.$.dialog.alert(data.msg);
            }
        }
    });
}

function assignCard(actionType, description, callback) {
    assignDialog({
        type: "TLB",
        actionType: actionType,
        callback: callback
    });
}

function assignMCC(actionType, description, callback) {
    assignDialog({
        type: "MCC",
        actionType: actionType,
        callback: callback
    });
}

function assignDefect(actionType, description, acReg, sourceType, callback) {
    assignDialogDefect({
        type: "Defect",
        actionType: actionType,
        callback: callback
    });
}

function assignMCC2Sta(actionType, description, callback) {
    assignDialog4Sta({
        type: "MCC",
        actionType: actionType,
        callback: callback
    });
}

function assignPPC(acReg, actionType, callback) {
    assignDialog({
        type: "PPC",
        acReg: acReg,
        actionType: actionType,
        callback: callback
    });
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
        //content: 'url:' + basePath + "/tbm/tbm_station_task.jsp",
        content: 'url:/views/defect/chooseFlight.shtml',
        data: options,
        close: function () {
            options.callback(this);
        }
    });
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
function assignDialogDefect(options) {
    P.$.dialog({
        id: 'assign_' + options.type,
        title: 'Assign ' + options.type,
        top: '60px',
        width: '1070px',
        height: '600px',
        content: 'url:' + basePath + "/tbm/tbm_station_task_Defect.jsp",
        data: options,
        close: function () {
            options.callback(this);
        }
    });
}

/**
 * type, no, station, actionType, description, callback
 * 下发任务到航站
 * @param type
 * @param no
 * @param acReg
 * @param actionType
 * @param callback
 */
function assignDialog4Sta(options) {
    P.$.dialog({
        id: 'assign_' + options.type,
        title: 'Assign ' + options.type,
        top: '60px',
        width: '800px',
        height: '600px',
        content: 'url:/views/tbm/tbm_station_task4sta.shtml',
        data: options,
        close: function () {
            options.callback(this);
        }
    });
}