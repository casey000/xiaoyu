//初始化按钮
var sub_win = frameElement.api, P = sub_win.opener;
var s_params = sub_win.data;
var methodType = s_params["methodType"];
var _that = this;
sub_win.button(
    {
        name: 'Submit',
        callback: function () {
            saveForm('Submit');
            return false;
        }
    },
    {
        name: 'Save',
        callback: function () {
            saveForm('Save');
            return false;
        }
    },
    {
        name: 'Cancel'
    }
);

var saveForm = function (type) {

    $("#addForm").validate({

        debug: true,

        onkeyup: false,

        errorElement: "div",

        rules: {
            "teBaseInfo.acNo": {required: true},
            "teBaseInfo.ata": {required: true, digits: true, rangelength: [4, 4]},
            "teBaseInfo.evaluationType": {required: true},
            "teBaseInfo.description": {required: true, maxlength: 3000},
            "teBaseInfo.refDocument": {required: true, maxlength: 300},
            "teBaseInfo.technicalSupportAdvice": {required: true, maxlength: 500}

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
    sub_win.button({name: 'Save', disabled: true}, {name: 'Submit', disabled: true});
    var validFlag = $("#addForm").valid();
    if (!validFlag) {
        sub_win.button({name: 'Save', disabled: false}, {name: 'Submit', disabled: false});
        return false;
    }
    var actionUrl = basePath + "/mccdoc/te_management_save.action";
    $("input[name='teBaseInfo.model']").removeAttr("disabled");
    var params = $("#addForm").serialize();
    $("input[name='teBaseInfo.model']").attr("disabled", "disabled");
    params += "&type=" + type;
    if (type == "Submit") {
        sub_win.button({name: 'Save', disabled: false}, {name: 'Submit', disabled: false});
        submitFn(actionUrl, params, type);
    } else {
        saveFn(actionUrl, params, type);
    }
};

function saveFn(actionUrl, params, type) {
    sub_win.button({name: 'Save', disabled: true}, {name: 'Submit', disabled: true});
    $.ajax({
        url: actionUrl,
        type: "post",
        cache: false,
        dataType: "json",
        data: params,
        success: function (obj) {
            sub_win.button({name: 'Save', disabled: false}, {name: 'Submit', disabled: false});
            var data = JSON.parse(obj);
            if (data.ajaxResult != "success") {
                P.$.dialog.alert(data.message);
                return false;
            }
            $("input[name='teBaseInfo.id']").val(data.id);
            entityId = data.id;
            moduleForDb = data.moduleForDb;
            P.$.dialog.success(type + " success", function () {
                if (type == "Submit") {
                    sub_win.close();
                    return;
                }
                if (!data.te_editPermission) {
                    sub_win.close();
                }
                showSubmit();
            });
        },
        error: function () {
            sub_win.button({name: 'Save', disabled: false}, {name: 'Submit', disabled: false});
            P.$.dialog.alert(type + ' Error!');
        }
    });
}

function submitFn(actionUrl, params, type) {
    P.$.dialog.confirm("Are you sure to submit?", function () {
        saveFn(actionUrl, params, type);
    });
}

$(function () {

    setEvaluation();
    showSubmit();
    $("input[name='teBaseInfo.evaluationType']").live('click', function () {
        $(this).siblings().prop({checked: false});
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

function showSubmit() {
    if (!moduleForDb || !entityId) {
        $(P.parent.$.find("input[value='Submit']")).hide();
        $("#attachmentTrId").hide();
    } else {
        $(P.parent.$.find("input[value='Submit']")).show();
        $("#attachmentTrId").show();
    }
}

//获得飞机列表
function getAirplaneInfo() {
    //已经选择过的飞机ID
    var acIds = $("input[name='teBaseInfo.acId']").val();
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
            $("input[name='teBaseInfo.acId']").val(this.data['acId']);
            $("input[name='teBaseInfo.acNo']").val(this.data['tail']);
            $("input[name='teBaseInfo.model']").val(this.data['topAcType']);
            $("input[name='teBaseInfo.acNo']").blur();
        }
    });
}
