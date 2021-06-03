var sub_win = frameElement.api, P = sub_win.opener;
sub_win.data = sub_win.data || {};
var type;

sub_win.button({
    name: 'Submit',
    callback: function () {
        var flag = $("#submit_form").valid();
        if (flag) {
            doSubmit();
        }
        return false;
    }
}, {
    name: 'Cancel'
});

/**
 * 提交
 * @returns {Boolean}
 */
function doSubmit() {
    if(type == '4') {
        submitProductionSupport()
    } else {
        submit();
    }
    return false;
}

function submitProductionSupport() {
    let actionUrl = basePath + "/api/v1/mccdoc/to_base_info/submitProductionSupport";
    let params = $("#submit_form").serialize();
    sub_win.button({name: 'Submit', disabled: true});
    $.ajax({
        url: actionUrl,
        type: "post",
        data: params,
        dataType: "json",
        cache: false,
        success: function (data) {
            if(data.code == 200) {
                issuedTo(data.data);
            } else {
                sub_win.button({name: 'Submit', disabled: false});
                if(data.msg) {
                    P.$.dialog.alert(data.msg);
                } else {
                    P.$.dialog.alert('Submit failed, please contact the administrator.');
                }
            }
        }
    });
}

function issuedTo(_object) {
    let params = {};
    let dialog_param = {
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
            if(params && params.assignType) {
                let toInfo = {
                    "id": _object.id,
                    "toNumber": _object.number,
                    "description": _object.description,
                    "tail": _object.acReg,
                    "feedbackRequests": _object.feedbackRequests,
                    callBack: function () {
                        sub_win.close();
                    }
                };
                if(params.assignType == '2') {
                    assignedStation(toInfo);
                } else {
                    assignedFlight(toInfo);
                }
            }
        }
    };
    if(P) {
        P.$.dialog(dialog_param);
    } else {
        $.dialog(dialog_param);
    }
}

function submit() {
    let actionUrl = basePath + "/api/v1/mccdoc/to_base_info/submit";
    let params = $("#submit_form").serialize();
    sub_win.button({name: 'Submit', disabled: true});
    $.ajax({
        url: actionUrl,
        type: "post",
        data: params,
        dataType: "json",
        cache: false,
        success: function (data) {
            if (data.code == 200) {
                P.$.dialog.alert('Submit success.');
                sub_win.close();
            } else {
                sub_win.button({name: 'Submit', disabled: false});
                if (data.msg) {
                    P.$.dialog.alert(data.msg);
                } else {
                    P.$.dialog.alert('Submit failed, please contact the administrator.');
                }
            }
        }
    });
}

$(function () {
    $("#id").val(sub_win.data.id);
    type = sub_win.data.type
});
