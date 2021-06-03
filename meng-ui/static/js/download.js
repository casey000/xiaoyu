/**
 * 下载文件并弹出等待提示框
 * @param urls
 */
function download(option) {
    var o = {
        urls: [],
        files: [],
        props: {
            "group": "default",
            "name": "default",
            "fileName": "default.zip"
        }
    };

    $.extend(true, o, option);

    //打印文件
    var $form = $("<form method='post' style='display:none' action='" + basePath + "/dload/download.action'></form>");
    var host = location.protocol + "//" + location.host + basePath;
    $.each(o.urls, function (key, val) {
        $form.append($("<input name='urls' value = '" + host + val + "'/>"));
    });

    $.each(o.files, function (key, val) {
        $form.append($("<input name='files' value = '" + val + "'/>"));
    });

    $.each(o.props, function (key, val) {
        $form.append($("<input name='props." + key + "' value = '" + val + "'/>"));
    });

    $(this).parent().append($form);

    //AJAX提交表单
    var options = {
        success: function (data) {
            data = JSON.parse(data);
            if (data.ajaxResult == "success") {
                var taskInst = data.taskInst;
                $(document).sfaExecutorDialog({
                    waitingDlg: {
                        auto: true,
                        close: function () {
                            if (o.props.reload) {
                                location.reload();
                            }
                        }
                    }
                }).showWaiting(taskInst.id);
            } else {
                if (data.message != null && data.message != "") {
                    $.dialog.alert(data.message);
                } else {
                    $.dialog.alert("下载失败");
                }
            }
        }
    };

    $form.ajaxForm(options).submit();
    $form.remove();
}