//初始化按钮
var sub_win = frameElement.api, P = sub_win.opener;
var s_params = sub_win.data;
var methodType = s_params["methodType"];

sub_win.button(
    {
        name: 'Save',
        callback: function () {
            saveForm('save');
            return false;
        }
    },
    {
        name: 'Cancel'
    }
);

var saveForm = function () {
    $("#addForm").validate({

        debug: true,

        onkeyup: false,

        errorElement: "div",

        rules: {
            "taBaseInfo.acNo": {required: true},
            "taBaseInfo.ata": {required: true, digits: true, rangelength: [4, 4]},
            "taBaseInfo.subject": {required: true, maxlength: 300},
            "taBaseInfo.distribution": {required: true}
        },
        errorPlacement: function (error, element) {

            error.appendTo(element.nextAll("div"));
        },

        highlight: function (element, errorClass) {

            $(element).addClass(errorClass);
        },

        success: function (label) {

            label.remove();
        }
    });

    sub_win.button({name: 'Save', disabled: true});
    var validFlag = $("#addForm").valid();
    if (!validFlag) {
        sub_win.button({name: 'Save', disabled: false});
        return false;
    }
    var actionUrl = basePath + "/mccdoc/ta_management_save.action";
    $("input[name='taBaseInfo.model']").removeAttr("disabled");
    var params = $("#addForm").serialize();
    $.ajax({
        url: actionUrl,
        type: "post",
        cache: false,
        dataType: "json",
        data: params,
        success: function (obj) {
            sub_win.button({name: 'Save', disabled: false});
            var data = JSON.parse(obj);
            if (data.ajaxResult != "success") {
                P.$.dialog.alert(data.message);
                return false;
            }
            if (!data.ta_editPermission) {
                P.$.dialog.success('Save Successfully!', function () {
                    sub_win.close();
                });
                return true;
            }
            P.$.dialog.success("Save Successfully", function () {
                sub_win.data.reload = '1';
                sub_win.data.id = data.id;
                sub_win.close();
            });
        },
        error: function () {
            sub_win.button({name: 'Save', disabled: false});
            P.$.dialog.alert('Save Error!');
        }
    });
};

$(function () {
    var distributions = $("#distributions").val();
    if (!distributions) return;
    var arr = distributions.split(",");
    $.each(arr, function (i, e) {
        var id = $.trim(arr[i]);
        $("input:checkbox[value=" + id + "]").attr("checked", "checked");
    });

});


// 获得飞机列表
function getAirplaneInfo() {
    //已经选择过的飞机ID
    var acIds = $("input[name='taBaseInfo.acId']").val();
    //需要显示的飞机状态
    var acStatus = ["Running"];
    var actionUrl = basePath + '/mccdoc/aircraft_tree.jsp';
    P.$.dialog({
        title: 'Select Aircraft',
        width: '690px',
        height: '400px',
        top: '10%',
        esc: true,
        cache: false,
        max: false,
        min: false,
        parent: this,
        content: 'url:' + actionUrl,
        data: {
            "acIds": acIds,
            "acStatus": acStatus,
            "multipleSelect": false
        },
        close: function () {
            $("input[name='taBaseInfo.acId']").val(this.data['acId']);
            $("input[name='taBaseInfo.acNo']").val(this.data['tail']);
            $("input[name='taBaseInfo.model']").val(this.data['topAcType']);
            $("input[name='taBaseInfo.acNo']").blur();
        }
    });
}

var dialog_width = '1000px';
var dialog_height = '400px';
var dialog_top = '15%';
