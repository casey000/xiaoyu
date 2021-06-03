//初始化按钮
var sub_win = frameElement.api, P = sub_win.opener;
var s_params = sub_win.data;
var id = s_params.id;
var toAppId = s_params.toAppId;
sub_win.button(
    {
        name: 'OK',
        callback: function () {
            closeTOByInputRemark();
            return false;
        }
    },
    {
        name: 'Cancel'
    }
);

/**
 * 删除TO时输入REMARK信息
 */
function closeTOByInputRemark() {
    if ($("#add_form .errorMessage").text()) {
        return false;
    }
    if (validForm()) {
        return false;
    }
    sub_win.button({name: 'OK', disabled: true});


    var contents = {
        "toBaseInfo.id": id,
        "toAppId": toAppId,
        "remark": $("#toCloseRemark").val()
    };
    var actionUrl = basePath + "/api/v1/mccdoc/to_base_info/generalSurveyClose";
    $.ajax({
        url: actionUrl,
        type: "post",
        data: contents,
        dataType: "json",
        cache: false,
        success: function (data) {
            if (data.code == 200) {
                P.$.dialog.success("Close success!", function () {
                    sub_win.data["isOk"] = true;
                    sub_win.close();
                });
            } else {
                P.$.dialog.alert(data.msg, function () {
                    sub_win.data["isOk"] = true;
                    sub_win.close();
                });
            }
        }
    });
}

/**
 * 验证Form表单
 */
function validForm() {
    var isValid = false;
    $("#add_form .error").remove();
    var errMsg = '<span class="error">This field is required.</span>';

    if (!$("#toCloseRemark").val()) {
        $("#toCloseRemark").nextAll("div.errorMessage").append(errMsg);
    }
    checkDMfn && checkDMfn.call();
    if ($("#add_form .errorMessage").text()) {
        isValid = true;
    }
    return isValid;
}

