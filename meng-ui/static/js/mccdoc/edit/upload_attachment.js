//初始化按钮
var api = frameElement.api, win = api.opener;
var s_params = api.data;
var methodType = s_params["methodType"];

api.button(
    {
        name: 'Save',
        callback: function () {
            submitForm(false);
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
function submitForm(forceCover) {
    //api.button(name :'Save',disabled: true)
    var ret = $("#uploadForm").valid();
    if (!ret) {
        return;
    }
    var files = $('input[name="upload"]');
    var isEmpty = false;
    var isdump = false;
    var fileNameArr = [];
    files.each(function () {
        if ($(this).val() == '') {
            win.$.dialog.alert('The files should be one pdf and one doc(x)!');
            isEmpty = true;
            return false;
        }
    });

    var arrFile = [];
    for (var i = 0; i < files.size(); i++) {
        arrFile.push(files[i].value);
    }
    var currentName, currentType, nextName, nextType;
    var isOk = null;
    for (var i = 0; i < arrFile.length; i++) {
        isOk = true;
        currentName = arrFile[i].substring(arrFile[i].lastIndexOf("\\") + 1, arrFile[i].lastIndexOf("."));
        currentType = arrFile[i].substr(arrFile[i].lastIndexOf(".") + 1, arrFile[i].length);
        for (var j = i + 1; j < arrFile.length; j++) {
            nextName = arrFile[j].substring(arrFile[j].lastIndexOf("\\") + 1, arrFile[j].lastIndexOf("."));
            nextType = arrFile[j].substr(arrFile[j].lastIndexOf(".") + 1, arrFile[i].length);
            if (currentName.toLowerCase() == nextName.toLowerCase() &&
                (((currentType.toLowerCase() == "doc" || currentType.toLowerCase() == "docx") && nextType.toLowerCase() == "pdf")
                    || (currentType.toLowerCase() == "pdf" && (nextType.toLowerCase() == "doc" || nextType.toLowerCase() == "docx")))) {
                arrFile.splice(j, 1);
                arrFile.splice(i, 1);
                i = -1;
                isOk = false;
                break;
            }
        }
        if (isOk) {
            if (currentType.toLowerCase() == "pdf") {
                win.$.dialog.alert("请上传名称为\'" + currentName + "\'的WORD文件!");
            } else if (currentType.toLowerCase() == "doc" || currentType.toLowerCase() == "docx") {
                win.$.dialog.alert("请上传名称为\'" + currentName + "\'的PDF文件!");
            }
            return false;
        }
    }

    if (isEmpty) {
        return false;
    }

    var params = {"forceCover": forceCover, "mtBaseInfo.id": s_params["id"]};
    var actionUrl = basePath + "/mccdoc/mt_management_attachmentUpload.action";

    $("#uploadForm").ajaxSubmit({
        url: actionUrl,
        dataType: "json",
        data: params,
        cache: false,
        type: "post",


        success: function (obj, textStatus) {
            var data = JSON.parse(obj);
            if (data.ajaxResult == "success") {
                win.$.dialog.alert("File uploaded success!");
                s_params["reload"] = true;
                api.close();
            } else {
                //重复提交并覆盖之前文件
                if (data.needCover) {
                    win.$.dialog.confirm(data.fileUploadErrorMessage, function () {
                        submitForm(true);
                    });
                } else {

                    win.$.dialog.alert(data.fileUploadErrorMessage);
                }
            }
        },
        error: function (obj, textStatus, errorThrown) {

            if (obj && obj.responseText && (obj.responseText.indexOf('the request was rejected because its size') > -1 || obj.responseText.indexOf('exceeds the configured maximum') > -1)) {

                var text_ = obj.responseText;

                var str = text_.substring(text_.indexOf('the'), text_.indexOf('00)') + 3);

                if (str) {

                    win.$.dialog.alert(str);

                } else {

                    win.$.dialog.alert("上传的文件大小超出限制，请重新选择要上传的文件 !");
                }
            }
        }
    });

    return false;
}