var api = frameElement.api, P = api.opener;
var s_params = api.data;


$(function () {
    setEvaluation();
    //New Reversion按钮绑定click事件
    $("#new_reversion_btn").live("click", function () {
        newRevision();
    });

    function setEvaluation() {
        var evaluationTypes = $("#evaluationTypes").val();
        if (!evaluationTypes) return;
        var arr = evaluationTypes.split(",");
        $.each(arr, function (i, e) {
            var id = $.trim(arr[i]);
            $("input:checkbox[value=" + id + "]").attr("checked", "checked");
        });
    }
});

function newRevision() {
    P.$.dialog.confirm("New Revision?", function () {
        var id = $("input[name='teBaseInfo.id']").val();
        var params = {"teBaseInfo.id": id};
        $.ajax({
            url: basePath + "/mccdoc/te_management_newRevision.action",
            type: "post",
            cache: false,
            dataType: "json",
            data: params,
            success: function (obj) {
                var data = JSON.parse(obj);
                if (data.ajaxResult != "success") {
                    P.$.dialog.alert(data.message);
                    return false;
                }
                var parameters = {
                    "methodType": "view",
                    "rowId": data.id
                };
                if (!data.te_editPermission) {
                    P.$.dialog.success('Save Successfully!', function () {
                        api.close();
                    });
                    return true;
                }

                P.$.dialog({
                    title: 'Edit TE Information',
                    width: dialog_width,
                    height: dialog_edit_height,
                    top: dialog_top,
                    esc: true,
                    cache: false,
                    max: false,
                    min: false,
                    parent: this,
                    lock: true,
                    content: 'url:' + basePath + '/mccdoc/te_management_edit.action?teBaseInfo.id=' + data.id,
                    data: parameters,
                    close: function () {
                        api.close();
                    }
                });
                api.hide();
            },
            error: function () {
                P.$.dialog.alert('New Revision Error!');
            }
        });
    }, function () {
    }, this);
}


var dialog_width = '1000px';
var dialog_height = '650px';
var dialog_edit_height = '420px';
var dialog_top = '15%';
