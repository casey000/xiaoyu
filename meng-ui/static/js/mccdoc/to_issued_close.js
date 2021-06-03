var sub_win = frameElement.api;
var P = (sub_win == null ? null : sub_win.opener);

/**
 * TO下发
 *
 * @param _object
 */
function issuedTo(_object) {
    var _assignType = 'AC';
    //只有生产保障类的TO才需要选择下发的类型
    //串件、串件恢复类
    if (_object.type == '4'||_object.type == '5'||_object.type == '6'||_object.type == '7'||_object.type == '8') {
        var params = {};
        var dialog_param = {
            title: 'Mcc Assign Task',
            width: '600px',
            height: '100px',
            top: "35%",
            esc: true,
            cache: false,
            max: false,
            min: false,
            lock: true,
            parent: this,
            data: params,
            content: "url:/views/mccdoc/view/view_issued_general_task.shtml",
            close: function () {
                if (params && params.assignType) {
                    if (params.assignType == '2') {
                        assignedStation({
                            "id": _object.id,
                            "toNumber": _object.toNumber,
                            "description": _object.description,
                            "tail": _object.tail,
                            "feedbackRequests": _object.feedbackRequests
                        });
                    } else {
                        assignedFlight({
                            "id": _object.id,
                            "toNumber": _object.toNumber,
                            "description": _object.description,
                            "tail": _object.tail,
                            "feedbackRequests": _object.feedbackRequests
                        });
                    }
                }
            }
        };
        if (P) {
            P.$.dialog(dialog_param);
        } else {
            $.dialog(dialog_param);
        }
    } else if (_object.type == '2') {
        //普查类TO进查看页面下发
        var url = basePath + "/views/mccdoc/view/view_general_survey_to.shtml";
        var parameters = {
            "toType": "2",
            "pageType": "view",
            "id": _object.id
        };
        var dialog_param = {
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
            close: function () {
                $(document).sfaQuery().reloadQueryGrid();
            },
            content: "url:" + url,
            data: parameters
        };
        if (P) {
            P.$.dialog(dialog_param);
        } else {
            $.dialog(dialog_param);
        }
    } else {
        assignedFlight({
            "id": _object.id,
            "toNumber": _object.toNumber,
            "description": _object.description,
            "tail": _object.tail,
            "feedbackRequests": _object.feedbackRequests
        });
    }
}

/**
 * 下发航班
 * @param toData
 */
function assignedFlight(toData) {
    let filter = {
        "openPageType": "TO",
        "ac": toData.tail
    };
    $.chooseFlight({
        filter: filter,
        success: function (data) {
            let params = {
                "parentId": data.CURRENT_TASK_ID,
                "workType": "TO",
                "cardNumber": toData.toNumber,
                "cardId": toData.id,
                "description": toData.description,
                "acId": data.ACID,
                "acReg": data.AC,
                "flightId": data.FLIGHT_ID,
                "flightNo": data.FLIGHT_NO,
                "station": data.STATION,
                "jobDateStr": data.FLIGHT_DATE.toString(),
                "requireFeedback": toData.feedbackRequests == 1 ? "y" : "n"
            }
            $.ajax({
                url: basePath + "/api/v1/station_task/addMccInfo",
                type: "post",
                contentType : 'application/json;charset=utf-8',
                // data: {
                //     "parentId": data.CURRENT_TASK_ID,
                //     "workType": "TO",
                //     "cardNumber": toData.toNumber,
                //     "cardId": toData.id,
                //     "description": toData.description,
                //     "acId": data.ACID,
                //     "acReg": data.AC,
                //     "flightId": data.FLIGHT_ID,
                //     "flightNo": data.FLIGHT_NO,
                //     "station": data.STATION,
                //     "jobDateStr": data.FLIGHT_DATE.toString(),
                //     "requireFeedback": toData.feedbackRequests == 1 ? "y" : "n"
                // },
                data: JSON.stringify(params),
                dataType: "json",
                // dataType:"application/json",
                success: function (data) {
                    if (data.code == 200) {
                        alert("Assign success");
                        if(toData.callBack()) {
                            toData.callBack();
                        }
                    } else {
                        alert(data.msg);
                    }
                    $(document).sfaQuery().reloadQueryGrid();
                }
            });
        }
    });
}

/**
 * 下发航站
 * @param toData
 */
function assignedStation(toData) {
    let filter = {
        "openPageType": "TO",
        // "ac": toData.tail
        "way":"station"
    };
    $.chooseFlight({
        filter: filter,
        success: function (data) {
            let params ={
                "parentId": data.id,
                "workType": "TO",
                "cardNumber": toData.toNumber,
                "cardId": toData.id,
                "description": toData.description,
                "station": data.station,
                "jobDateStr": data.jobDate,
                "requireFeedback": toData.feedbackRequests == 1 ? "y" : "n"
            };

            $.ajax({
                url: basePath + "/api/v1/station_task/addMccInfo",
                type: "post",
                contentType : 'application/json;charset=utf-8',
                // data: {
                //     "parentId": data.id,
                //     "workType": "TO",
                //     "cardNumber": toData.toNumber,
                //     "cardId": toData.id,
                //     "description": toData.description,
                //     "station": data.station,
                //     "jobDateStr": data.jobDate,
                //     "requireFeedback": toData.feedbackRequests == 1 ? "y" : "n"
                // },
                data:JSON.stringify(params),
                dataType: "json",
                // dataType:"application/json",
                success: function (data) {
                    if (data.code == 200) {
                        alert("Assign success");
                        if(toData.callBack()) {
                            toData.callBack();
                        }
                    } else {
                        alert(data.msg);
                    }
                    $(document).sfaQuery().reloadQueryGrid();
                }
            });
        }
    });
    // var params = {
    //     "actionType": "assign",
    //     "type": "TO",
    //     "no": toData.toNumber,
    //     "cardId": toData.id,
    //     "description": toData.description,
    //     "requireFeedback": toData.feedbackRequests == 1 ? "y" : "n"
    // };
    // var dialog_log = {
    //     id: 'assign_TO',
    //     title: 'Assign TO',
    //     top: '60px',
    //     width: '800px',
    //     height: '600px',
    //     parent: this,
    //     content: 'url:/views/tbm/tbm_station_task4sta.shtml',
    //     data: params,
    //     close: function () {
    //         $(document).sfaQuery().reloadQueryGrid();
    //     }
    // };
    // if (P) {
    //     P.$.dialog(dialog_log);
    // } else {
    //     $.dialog(dialog_log);
    // }
}

/**
 * TO手工关闭
 *
 * @param _object
 */
function confirmClosed(_object) {
    var params = {
        "id": _object.id
    };
    var dialog_log = {
        title: '关闭TO',
        width: '560px',
        height: '280px',
        top: '35%',
        esc: true,
        cache: false,
        max: false,
        min: false,
        parent: this,
        lock: true,
        data: params,
        content: 'url:/views/mccdoc/form/close_to_dialog.shtml'
    };
    if (P) {
        P.$.dialog(dialog_log);
    } else {
        $.dialog(dialog_log);
    }
}

function toIssuedCallback() {
    if ($(document).sfaQuery()) {
        $(document).sfaQuery().reloadQueryGrid();
    } else if ($("#to_content")) {
        showOrRefreshTO();
    }
}

