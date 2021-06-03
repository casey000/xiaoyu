//初始化按钮
var api = frameElement.api, win = api.opener;
var s_params = api.data;
var methodType = s_params["methodType"];

api.button(
    {
        name: 'Save',
        callback: function () {
            submitForm();
            return false;
        }
    },
    {
        name: 'Close'
    }
);

/**
 *    保存表单操作
 */
function submitForm(override) {

    $(".error").remove();

    if (!validForm()) {

        return false;
    }

    var params = {

        "entityId": s_params['entityId'],

        "moduleForPath": s_params['moduleForDb'],

        "moduleForDb": s_params['moduleForDb'],

        "jsonData": override,

        'licenType': 'save'
    };

    var actionUrl = basePath + "/er/fileUploadAuxiliary_uploadFile.action";
    $("#uploadForm").ajaxSubmit({

        url: actionUrl,

        dataType: "json",

        data: params,

        cache: false,

        type: "post",

        success: function (obj, textStatus) {
            var data = JSON.parse(obj);

            if (data && data.ajaxResult == "failure") {

                if (!data.errorIndex[0].type) {

                    win.$.dialog.alert(data.errorIndex[0].text);
                }
            }

            if (data && data.ajaxResult == "success") {
                win.$.dialog.success("File uploaded success!");
                s_params["reload"] = true;
                api.close();
            } else if (data && data.errorIndex) {

                var duplicate = false;

                $.each(data.errorIndex, function (i, n) {

                    var err_div = '<span class="error">' + n.text + '</span>';

                    $($(":file")[n.index]).nextAll(".errorMessage").append(err_div);

                    if (n.type) {

                        duplicate = true;
                    }
                });

                if (duplicate) {

                    win.$.dialog.alert("File is exist !");
                }
            }
        }
    });
}

function validForm() {

    var text = $(":file").val();

    if (!text) {

        var message = "Please choose a file !";

        win.$.dialog.alert(message);

        return false;
    }
    var maxIndex = text.lastIndexOf('\\') > text.lastIndexOf('/') ? text.lastIndexOf('\\') : text.lastIndexOf('/');
    if (text.substring(maxIndex + 1, text.lastIndexOf('.')).length > 100) {
        var message = "The file name length should be less than 100";
        win.$.dialog.alert(message);
        return false;
    }

    var fileCount = $("tr[name='fileList']").length;

    if (!(/\.pdf$/.test(text.toLowerCase()))) {
        var message = "The file should be one pdf .";
        win.$.dialog.alert(message);
        return false;
    }

    return true;
}