var api = frameElement.api, win = api.opener;
var s_params = api.data;


function newRevision() {
    P.$.dialog.confirm("New Revision?", function () {
        var id = $("input[name='taBaseInfo.id']").val();
        var params = {"taBaseInfo.id": id};
        api.lock();
        $.ajax({
            url: basePath + "/mccdoc/ta_management_newRevision.action",
            type: "post",
            cache: false,
            dataType: "json",
            data: params,
            success: function (obj) {
                api.unlock();
                var data = JSON.parse(obj);
                if (data.ajaxResult != "success") {
                    P.$.dialog.alert(data.message);
                    return false;
                }
                var parameters = {
                    "methodType": "view",
                    "rowId": data.id
                };
                if (!data.ta_editPermission) {
                    P.$.dialog.success('Save Successfully!', function () {
                        api.close();
                    });
                    return true;
                }
//				api.reload(window,basePath+'mccdoc/ta_management_edit.action?taBaseInfo.id='+data.id,function(){
//					this.title('Trouble Analyze Editing');
//				});
                P.$.dialog({
                    title: 'Edit TA Information',
                    width: dialog_width,
                    height: dialog_height,
                    top: dialog_top,
                    esc: true,
                    cache: false,
                    max: false,
                    min: false,
                    parent: this,
                    lock: true,
                    content: 'url:' + basePath + '/mccdoc/ta_management_edit.action?taBaseInfo.id=' + data.id,
                    data: parameters,
                    close: function () {
                        api.close();
                    }
                });
                api.hide();
            },
            error: function () {
                api.unlock();
                P.$.dialog.alert('New Revision Error!');
            }
        });
    }, function () {
    }, this);
}

$(function () {
    setDistribution();
    //New Reversion按钮绑定click事件
    $("#new_reversion_btn").live("click", function () {
        newRevision();
    });

    function setDistribution() {
        var distributions = $("#distributions").val();
        if (!distributions) return;
        var arr = distributions.split(",");
        $.each(arr, function (i, e) {
            var id = $.trim(arr[i]);
            $("input:checkbox[value=" + id + "]").attr("checked", "checked");
        });
    }
});


var dialog_width = '1000px';
var dialog_height = '400px';
var dialog_top = '15%';