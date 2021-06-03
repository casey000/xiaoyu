var api = frameElement.api, win = api.opener;
var s_params = api.data;
//var methodType = s_params["methodType"];

api.button(
    {
        id: 'terminate',
        name: 'Terminate',
        callback: function () {
            toTerminate();
            return false;
        }
    },
    {
        id: 'view_pdf',
        name: 'View PDF',
        callback: function () {
            window.location.href = basePath + '/mccdoc/mt_managementPdf_createMT.action?id=' + $("#mtBaseInfoId").val();
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

$(function () {
    //获取log信息
    var data = {
        'flowIds': flowInstanceId,//流程实例Id或者为单节点taskId
        'type': '1'//1：流程，2：单节点任务；默认为1
    };

    $("#showProcessLog").logger(data);

    //获取terminate log信息
    var data = {
        'flowIds': terminateInstanceId,//流程实例Id或者为单节点taskId
        'type': '1'//1：流程，2：单节点任务；默认为1
    };

    $("#showTerminateProcessLog").logger(data);

    roles = {};
    if ($('#rule_mt_terminate').length > 0) {
        roles['mt:terminate'] = $('#rule_mt_terminate').val();
    }
    if ($('#rule_mt_pdf').length > 0) {
        roles['mt:exportPDF'] = $('#rule_mt_pdf').val();
    }
    if ($('#rule_mt_modify').length > 0) {
        roles['mt:modify'] = $('#rule_mt_modify').val();
    }
    var distribution_hidden = $("[name='mtBaseInfo.distribution']");
    if (distribution_hidden.val()) {
        var cat_arr = distribution_hidden.val().split(",");
        for (var i = 0; i < cat_arr.length; i++) {
            $("#distribution :checkbox[value=" + cat_arr[i] + "]").attr("checked", "checked");
            $("#distribution :checkbox").attr("disabled", "disabled");
        }
    }

    /*
     * 页面处于不同状态下的控制
     * add  新增时
     * edit 编辑时
     * */
    if ($('#editStatus').val() != 5) {
        // 仅留保存与取消
        api.button({id: 'terminate', disabled: true, width: 0});
        // 版本控制按钮隐藏
        $('#revion_create').parents('.ui_buttons').hide();
    } else {
        // 配合版本控制显示
        win.$.dialog.tips("Success", 0.1, 'loading.gif');
        //编辑状态下，
        var otherStatus = $('#otherStatus').val();

        _disabled = false;
        // 是否已经有编辑状态, 版本控制按钮致灰
        if (otherStatus && otherStatus > 0) {

            $('#revion_create').hide();

            api.button({id: 'terminate', disabled: true, width: 0});
        } else {

            //是否有撤销权限
            if (roles['mt:terminate']) {
                api.button({id: 'terminate', disabled: false, width: 0});
            } else {
                api.button({id: 'terminate', disabled: true, width: 0});
            }

            $('#revion_create').live('click', function () {
                // 版本控制事件
                cloneFun();
            });
        }

        //如果是从撤销页面过来的预览，不能再显示撤销按钮,改版按钮
        if (null != $("#flag").val() && $("#flag").val() == 'no') {
            api.button({id: 'terminate', disabled: true, width: 0});
            $('#revion_create').parents('.ui_buttons').hide();
        }
    }

    if (!roles['mt:exportPDF']) {
        api.button({id: 'view_pdf', disabled: true, width: 0});
    }
    // 隐藏已经被致灰的按钮
    api.DOM.buttons.find(":button").show().end().find(':disabled').hide();


});

//下载附件
function download(fileid) {
    $("#down").attr("href", basePath + "/ee/attachment_download.action?fileId=" + fileid);
    $("#down")[0].click();
}

function toTerminate() {

    var id = $("#mtBaseInfoId").val();
    //进行撤销流程
    var url = basePath + "/mccdoc/form/mt_terminate_process.jsp";
    url += "?businessKey=" + id + "&step=";
    var parameters = {};

    win.$.dialog({
        title: 'MT Terminate',
        width: '500px',
        height: '150px',
        top: dialog_top,
        lock: true,
        esc: true,
        cache: false,
        max: false,
        min: false,
        parent: this,
        close: function () {
            if (this.data['operate']) {
                this.opener.location.reload();
                //window.location.href = basePath + '/mccdoc/mt_management_view.action?id=' + $("#mtBaseInfoId").val();
            }
        },
        content: 'url:' + url,
        data: parameters
    });

}

/**改版函数*/
function cloneFun() {
    P.$.dialog.confirm('确认要进行改版操作？', function () {

        var mtId = $('#mtBaseInfoId').val();
        var status = $('#editStatus').val();
        if (!mtId) return false;

        if (!status || status == 1) return P.$.dialog.alert('The MT is uncomplete status.');

        $('#revion_create').attr('disabled', 'disabled');
        //P.$.dialog.tips("Creating new reveision...",1200,'loading.gif');
        api.lock();
        $.ajax({
            url: basePath + '/mccdoc/mt_management_revionCreate.action?targetId=' + mtId,
            dataType: "json",
            cache: false,
            success: function (data) {
                api.unlock();
                //P.$.dialog.tips('Creating..',0.1,'loading.gif');
                data = JSON.parse(data);
                if (data && data.msg && data.msg.indexOf('success') != -1) {

                    var curUser = $("#curUserId").val();

                    //新增页面关闭后直接跳转编辑页面 ,先判断有没有权限
                    if (curUser == data.creator && roles['mt:modify']) {

                        var parameters = {
                            "methodType": "view",
                            "rowId": data.id
                        };
                        var actionUrl = 'url:mccdoc/mt_management_edit.action?id=' + data.id;
                        P.$.dialog({
                            title: 'Edit MT Information',
                            width: '1000px',
                            height: '550px',
                            top: dialog_top,
                            esc: true,
                            cache: false,
                            max: false,
                            min: false,
                            parent: this,
                            lock: true,
                            content: actionUrl,
                            data: parameters,
                            close: function () {
                                P.location.reload();
                            }
                        });
                        api.hide();
                    } else {
                        P.$.dialog.success("Success.", function () {
                            win.location.reload();
                        });
                    }
                } else {
                    if (data && data.errorMessage) {
                        P.$.dialog.alert(data.errorMessage);
                    }
                }
            },
            error: function (textStatus, error) {
                P.$.dialog.tips('Creating Failed.', 0.1, 'loading.gif');
            }

        });
    });
}

var dialog_width = '1000px';
var dialog_height = '200px';
var dialog_top = '15%';
