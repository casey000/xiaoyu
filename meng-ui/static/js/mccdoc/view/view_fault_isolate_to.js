//初始化按钮
var sub_win = frameElement.api, P = sub_win.opener;
var s_params = sub_win.data;
var isView = s_params["pageType"];
var to_pdfPermission = $("#to_pdfPermission").val();
if (isView == "" || isView == null) {
    /*if (to_pdfPermission == "true") {*/
    if (true) {
        sub_win.button(
            {
                name: 'View PDF',
                callback: function () {
                    window.location.href = basePath + '/api/v1/mccdoc/to_managementPdf/createTO?id=' + $("[name='toBaseInfo.id']").val() + "&tail=" + $("#toBaseInfoVOTail").val();
                    return false;
                }
            },
            {
                name: 'Cancel',
                callback: function () {
                    return true;
                }
            }
        );
    } else {
        sub_win.button(
            {
                name: 'Cancel',
                callback: function () {
                    return true;
                }
            }
        );
    }
} else {
    sub_win.button(
        {
            name: 'Cancel',
            callback: function () {
                return true;
            }
        }
    );
}


function showDialog_ViewOrEdit() {
    var defectId = $("#defectId").val();
    var defectNo = $("#defectId_a").text();
    ShowWindowIframe({
        width: "1000",
        height: "700",
        title: "查看故障",
        param: {defectId: defectId,defectNo:defectNo},
        url: "/views/defect/defectDetails.shtml"
    });

}

var isEdit = false;

/**
 * 编辑反馈
 */
function editFeedback() {
    //获取class=feedback属性的元素
    $(".feedback").each(function () {
        if ($(this).val() != '') {
            isEdit = true;
            $(this).attr("readonly", false);
            $(this).attr("style", "width: 99.5%");
        }
    });
}

/**
 * 保存反馈
 */
function saveFeedback() {
    if (!isEdit) {
        return;
    }
    var isNull = false;
    var form = $("<form></form>");
    var index = 0;
    $(".feedback").each(function (i) {
        if ($(this).val().trim() == "" && $(this).attr("readonly") == undefined) {
            isNull = true;
            return;
        }
        var oldFeedback = $("#feedback" + i).val();
        if ($(this).attr("readonly") == undefined && oldFeedback != $(this).val()) {
            var idInput = "<input type='text' name='toTroubleShootings[" + index + "].id' value='" + $(this).attr("id") + "' />";
            var actionAndFeedbackInput = "<input type='text' name='toTroubleShootings[" + index + "].actionAndFeedback' value='" + $(this).val() + "' />";
            form.append(idInput);
            form.append(actionAndFeedbackInput);
            index++;
        }
    });
    if (isNull) {
        P.$.dialog.alert("Action & Feedback不能为空！");
        return;
    }
    var params = form.serialize();
    var actionUrl = basePath + "/api/v1/mccdoc/to_base_info/updateFeedback";
    $.ajax({
        url: actionUrl,
        type: "post",
        data: params,
        dataType: "json",
        cache: false,
        success: function (data) {
            if (data.code == 200) {
                P.$.dialog.success("Success");
                $(".feedback").each(function () {
                    isEdit = false;
                    $(this).attr("readonly", true);
                    $(this).attr("style", "width: 99.5%;background-color: #f0f0f0");
                });
            } else {
                P.$.dialog.alert(data.msg);
            }
        }
    });
}
