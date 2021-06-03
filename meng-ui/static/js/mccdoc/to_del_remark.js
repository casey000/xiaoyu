var api = frameElement.api, P = api.opener;
param = api.data;
id = param.id;
$(function () {
    api.button({
            name: "Ok",
            callback: function () {
                deleteTOByInputRemark();
                return false;
            }
        },
        {
            name: "Cancel"
        }
    );
});


/**
 * 删除TO时输入REMARK信息
 */
function deleteTOByInputRemark() {
    if ($("#add_form .errorMessage").text()) {
        return false;
    }
    if (validForm()) {
        return false;
    }
    api.button({name: 'Ok', disabled: true});
    var contents = {
        "toBaseInfo.id": id,
        "toBaseInfo.delRemark": $("#toDelRemark").val()
    };
    var actionUrl = basePath + "/api/v1/mccdoc/to_base_info/delete";
    $.ajax({
        url: actionUrl,
        type: "post",
        data: contents,
        dataType: "json",
        cache: false,
        success: function (data) {
            if (data.code == 200) {
                $.dialog.success("Delete success!");
            } else {
                $.dialog.alert(data.msg);
            }
            api.data["isOk"] = true;
            api.close();
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

    if (!$("#toDelRemark").val()) {
        $("#toDelRemark").nextAll("div.errorMessage").append(errMsg);
    }

    if ($("#add_form .errorMessage").text()) {
        isValid = true;
    }
    return isValid;
}