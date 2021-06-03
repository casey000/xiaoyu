//初始化按钮
var sub_win = frameElement.api, P = sub_win.opener;
var s_params = sub_win.data;
var methodType = s_params["methodType"];
var _that = this;
var saveForm = function (type) {
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

    sub_win.button({name: 'Save', disabled: true}, {name: 'Submit', disabled: true});
    var validFlag = $("#addForm").valid();
    $('td div.errorMessage', $("#uploadForm")).empty();
    var fileBool = type != "Save" ? !checkFile() : false;
    if (!validFlag || fileBool) {
        sub_win.button({name: 'Save', disabled: false}, {name: 'Submit', disabled: false});
        return false;
    }
    var actionUrl = basePath + "/mccdoc/ta_management_save.action";
    $("input[name='taBaseInfo.model']").removeAttr("disabled");
    var params = $("#addForm").serialize();
    params += "&type=" + type;
    if (type == 'Submit') {
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
            P.$.dialog.success(type + ' Successfully!', function () {
                if (type == "Submit") {
                    sub_win.close();
                }
            });
        },
        error: function () {
            sub_win.button({name: 'Save', disabled: false}, {name: 'Submit', disabled: false});
            P.$.dialog.alert(type + ' Error!');
        }
    });
}

function submitFn(actionUrl, params, type) {
    P.$.dialog({
        id: "submitTaDialog",
        title: 'Submit TA',
        width: "300px",
        height: "100px",
        top: "25%",
        esc: true,
        cache: false,
        max: false,
        min: false,
        lock: true,
        parent: _that,
        content: "Remark:<textarea id='submitRemark' maxlength='300' style='width:97%;height:80px;'></textarea><div id='errorMsg' style='display:none;color:#F00;'><div>",
        data: {},
        button: [
            {
                name: "Ok",
                callback: function () {
                    var submitRemark = window.parent.window.$("#submitRemark").val();
                    var $errorMsg = window.parent.window.$("#errorMsg");
                    $errorMsg.hide();
                    if ($.trim(submitRemark).length > 300) {
                        $errorMsg.show().text("Please enter no more than 300 characters.");
                        return false;
                    }
//		    		if($.trim(submitRemark).length<1){
//		    			$errorMsg.show().text("This field is required.");
//		    			return false ;
//		    		}
                    params += "&remark=" + submitRemark;
                    saveFn(actionUrl, params, type);
                }
            }, {
                name: "Cancel",
                callback: function () {
                    return true;
                }
            }]
    });
}

function checkFile() {
    var filesCount = $("tr[name='fileList']").length;
    if (filesCount == 2) {
        return true;
    } else {
        $('td div.errorMessage', $("#uploadForm")).empty().append('<div for="fileList" generated="true" class="error">请上传两个文件，一个为pdf文档，另一个为doc/docx文档 </div>');
        return false;
    }
}

$(function () {
    setDistributions();
    $("#downloadTemplate").live("click", function () {
        window.location.href = basePath + "/mccdoc/ta_management_template.action";
    });

    function setDistributions() {
        var distributions = $("#distributions").val();
        if (!distributions) return;
        var arr = distributions.split(",");
        $.each(arr, function (i, e) {
            var id = $.trim(arr[i]);
            $("input:checkbox[value=" + id + "]").attr("checked", "checked");
        });
    }
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
var dialog_height = '200px;';
var dialog_top = '15%';
