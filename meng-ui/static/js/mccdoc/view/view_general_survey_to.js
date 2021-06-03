//初始化按钮
var sub_win = frameElement.api, P = sub_win.opener;
var s_params = sub_win.data;
sub_win.button(
    {
        name: 'Cancel',
        callback: function () {
            return true;
        }
    }
);

//关闭TO
function closeTo(toId, toAppId) {
    var params = {
        "id": toId,
        "toAppId": toAppId
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
        content: 'url:/views/mccdoc/form/close_to_general_survey_dialog.shtml',
        close: function () {
            if (this.data["isOk"]) {
                location.reload();
            }
        }
    };
    if (P) {
        P.$.dialog(dialog_log);
    } else {
        $.dialog(dialog_log);
    }
}

//下发TO
function issuedTo(toId, toNumber, feedbackRequests, toAppId, acReg) {
    let description = $("#description").val();
    let filter = {
        "openPageType": "TO",
        "ac": acReg
    };
    $.chooseFlight({
        filter: filter,
        success: function (data) {
            let params = {
                "parentId": data.CURRENT_TASK_ID,
                "workType": "TO",
                "cardNumber": toNumber,
                "cardId": toId,
                "description": description,
                "acReg": acReg,
                "flightId": data.FLIGHT_ID,
                "flightNo": data.FLIGHT_NO,
                "station": data.STATION,
                "jobDateStr": data.FLIGHT_DATE,
                "requireFeedback": feedbackRequests == 1 ? "y" : "n"
            };
            $.ajax({
                url: basePath + "/api/v1/station_task/addMccInfo",
                type: "post",
                data:JSON.stringify(params),
                // data: params,
                dataType: "json",
                contentType : 'application/json;charset=utf-8',
                // dataType:"application/json",
                success: function (data) {
                    if (data.code == 200) {
                        P.$.dialog.alert("Assign success");
                    } else {
                        P.$.dialog.alert(data.msg);
                    }
                    location.reload();
                }
            });


        }
    });
}

//导出PDF
function exportPDF(id, tailId, tail) {
    window.location.href = basePath + '/api/v1/mccdoc/to_managementPdf/createTO?id=' + id + "&tail=" + tail;
    return false;
}

//批量导出PDF
function exportPDFZip() {
    let id = $("#toBaseInfoId").val();
    window.location.href = basePath + '/api/v1/mccdoc/to_managementPdf/createTOZip?id=' + id;
    return false;
}



