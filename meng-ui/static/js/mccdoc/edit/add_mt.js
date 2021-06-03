//初始化按钮
var sub_win = frameElement.api, win = sub_win.opener;
var s_params = sub_win.data;
var methodType = s_params["methodType"];

sub_win.button(
    {
        name: 'Save',
        id: 'mt_Save',
        callback: function () {
            saveEntity();
            return false;
        }
    },
    {
        name: 'Cancel'
    }
);


function saveEntity() {
    var actionUrl = "mt_management_add.action";

    sub_win.button({id: 'mt_Save', disabled: true});

    var valiresult = $("#mt_form").valid();

    //校验subject字段
    var subject = $('[name="mtBaseInfo.subject"]');
    subject.nextAll("div").text('');
    if (subject == null || $.trim($(subject).val()) == "") {
        $('[name="mtBaseInfo.subject"]').nextAll("div").text("The field is required.");
        sub_win.button({id: 'mt_Save', disabled: false});
        return false;
    } else if ($.trim($(subject).val()) && ($.trim($(subject).val())).length > 300) {
        $('[name="mtBaseInfo.subject"]').nextAll("div").text("Please enter no more than 300 characters!");
        sub_win.button({id: 'mt_Save', disabled: false});
        return false;
    }
    //校验distribution字段
    var dataInput = $("[name='mtBaseInfo.distribution']:checked");
    dataInput.nextAll("div").text('');
    if (dataInput == null || !dataInput.val()) {
        $("#distribution").nextAll("div").text("distribution Can not be empty!");
        sub_win.button({id: 'mt_Save', disabled: false});
        return false;
    }

    if (!valiresult) {
        sub_win.button({id: 'mt_Save', disabled: false});
        return false;
    } else {
        sub_win.button({id: 'mt_Save', disabled: true});
        valiresult &= checkAtaOption();
    }
    if (!valiresult) {
        sub_win.button({id: 'mt_Save', disabled: false});
        return false;
    }

    win.$.dialog.tips('saving...', 10);
    $('#mt_form').ajaxSubmit({
        type: "post",
        url: actionUrl,
        dataType: "json",
        cache: false,
        success: function (obj, textStatus) {
            win.$.dialog.tips('saving...', 0.1);
            var data = JSON.parse(obj);
            if (data && data.message && data.message.indexOf('success') != -1) {
                //sub_win.data['isReload'] = "reload";
                //win.$.dialog.alert('Save Success!');
                sub_win.data.reload = '1';
                sub_win.data.id = data.id;
                sub_win.data.creator = data.creator;
                sub_win.close();
            } else {
                msg = 'Save failed. Please flush and try again';
                if (submitBtn) {
                    msg = 'Sumbit failed. Please flush and try again';
                }
                if (data && data.errorMsg) {
                    win.$.dialog.alert(data.errorMsg);
                }
                sub_win.button({id: 'manual_save_btn', disabled: false});
                sub_win.button({id: 'manual_publish_btn', disabled: false});
            }
        }
    });
}

function checkAtaOption() {
    var tel = /^[\d]{4}$/;
    var value = $('#ataInput').val();
    var divError = '<div class="error">请输入4位数字ATA章节.</div>';
    if (!tel.test($.trim($("#ataInput").val()))) {
        $('#ataInput').parents('td').find('.errorMessage').append(divError);
        return false;
    }

    var flg = true;
    $('#ataInput').parents('td').find('.errorMessage').empty();

    return flg;

}

function initValidate() {

    $("#mt_form").validate({
        debug: true,  //调试模式取消submit的默认提交功能
        onkeyup: false, //当键盘按键弹起时验证
        errorElement: "div",// 使用"div"标签标记错误， 默认:"label","span"默认直接在文本框右边显示

        rules: {//此处开始配置校验规则，下面会列出所有的校验规则
            "mtBaseInfo.type": {required: true},
            "mtBaseInfo.model": {required: true},
            "mtBaseInfo.ata": {required: true},
            "mtBaseInfo.expirationDate": {required: true},
            "mtBaseInfo.expirationDate": {required: true, rangelength: [0, 100]}
        },
        messages: {//自定义提示信息

            "mtBaseInfo.type": {required: "The field is required."},
            "mtBaseInfo.model": {required: "The field is required."},
            "mtBaseInfo.ata": {required: "The field is required."},
            "mtBaseInfo.expirationDate": {required: "The field is required."},

            "mtBaseInfo.expirationDate": {required: "Please enter a value between 0 and 100!"}
        },

        errorPlacement: function (error, element) {
            error.appendTo(element.nextAll("div"));//配置错误信息
        },

        highlight: function (element, errorClass) {  //针对验证的表单设置高亮
            $(element).addClass(errorClass);
        },

        success: function (label) {
            //为了兼容IE8
            label.remove();
        }


    });
}

//显示下拉列表数据
$(function () {

    //初始化Model
    var model_params = {
        //定义显示几级ATA
        level: 1,
        //当我们选择数据时，是否也加上父级的数据
        isCheckParentModel: false,
        //是否单选,true表示多选
        isRadio: false,
        //是否是展开所有的节点
        open: true,
        //显示下拉列表的宽度
        modelDropDownWidth: '160px',
        //显示下拉列表的高度
        modelDropDownHeight: '230px'
    };

    $("#modelInput").initModelList(model_params);
    initValidate();
});


//Upload按钮绑定click事件
$("#upload_detail_btn").live("click", function () {
    var rowId = "1";

    var parameters = {
        "methodType": "view",
        "rowId": rowId
    };
    win.$.dialog({
        title: 'Upload Attachment',
        width: dialog_width,
        height: dialog_height,
        top: dialog_top,
        esc: true,
        cache: false,
        max: false,
        min: false,
        parent: this,
        content: 'url:mccdoc/edit/upload_attachment.jsp',
        data: parameters
    });
});

//下载附件
function download(fileid) {

}

var dialog_width = '1000px';
var dialog_height = '200px;';
var dialog_top = '15%';
