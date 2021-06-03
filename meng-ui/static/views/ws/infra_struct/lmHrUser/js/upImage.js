var param;
param = getParentParam_();
$(function () {
    $("#buttonSubmit").click(function () {
        var sourceId = $("#sourceId").val();
        var fileToUpload = $.trim($('#fileToUpload').val());
        if (fileToUpload == "") {
            MsgAlert({content: "请选择上传文件", type: 'error'});
            return;
        }
        $.ajaxFileUpload({
            url: Constant.API_URL + 'ATTACHMENT_UPLOAD',
            secureuri: false,
            fileElementId: 'fileToUpload', //file控件id
            dataType: 'json',
            data: {
                "fileCategory": 'photo',
                "sourceId": sourceId
            },
            success: function (jdata) {
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    if (jdata.data == 'repeat') {
                        tanchuang();
                        return;
                    }
                    if (jdata.data != 'repeat') {
                        var url = jdata.data.url;
                        console.log(url);
                        return false
                        param.OWindow.getUrl(url);
                        var str = url.substring(36);
                        //上传成功将照片
                        param.OWindow.$("#pic").attr("src", str);

                        if (typeof(param.successCallBack) == 'function') {
                            param.successCallBack(jdata);
                        }
                        param.OWindow.MsgAlert({content: "上传成功"});
                        CloseWindowIframe();
                    }

                } else {
                    MsgAlert({content: "上传失败" + jdata.msg, type: 'error'});
                    if (typeof(failCallBack) == 'function') {
                        param.failCallBack(jdata);
                    }
                }
            }

        })
    })
})

//弹窗
function tanchuang() {
    var $form = $("#mform");
    layerConfirm_({
        content: '己存在相同文件名的文件，是否覆盖并保存？',
        yesFunc: function (index) {
            var sourceId = $("#sourceId").val();
            var fileToUpload = $.trim($('#fileToUpload').val());
            if (fileToUpload == "") {
                MsgAlert({content: "请选择上传文件", type: 'error'});
                return;
            }
            $.ajaxFileUpload({
                url: Constant.API_URL + 'ATTACHMENT_UPLOAD',
                secureuri: false,
                fileElementId: 'fileToUpload', //file控件id
                dataType: 'json',
                data: {
                    "fileCategory": fileCategory,
                    "sourceId": sourceId,
                    "repeat": "repeat"
                },
                success: function (jdata) {
                    if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                        param.OWindow.reload_();
                        param.OWindow.successCallBack(jdata);
                        MsgAlert({content: "上传成功"});
                        CloseWindowIframe();
                    } else {
                        MsgAlert({content: "上传失败" + jdata.msg, type: 'error'});
                    }
                }
            })
        },
        noFunc: function (index) {
            CloseWindowIframe();
        }
    });
}
