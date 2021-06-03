//初始化按钮
var sub_win = frameElement.api, win = sub_win.opener;
var s_params = sub_win.data;
var methodType = s_params["methodType"];
sub_win.button(
    {
        id: 'mt_submit_btn',
        name: 'Submit',
        callback: function () {
            sub_win.button(
                {
                    id: 'mt_submit_btn',
                    disabled: true
                });

            submitEntity();
            return false;
        }
    },
    {
        id: 'mt_save_btn',
        name: 'Save',
        callback: function () {
            sub_win.button(
                {
                    id: 'mt_save_btn',
                    disabled: true
                });

            saveEntity();
            return false;
        }
    },
    {
        name: 'Cancel'
    }
);

//显示下拉列表数据
$(function () {
    //下载模板
    $("#downTemplate").click(function () {
        // $(this).attr("href",basePath +"/mccdoc/template/mt_template.docx");
        $(this).attr("href", basePath + "/mccdoc/mt_management_template.action");
        $(this)[0].click();
    });
    //上传文件
    $("#upload_detail_btn").click(function () {
        var rowId = $("#mtBaseInfoId").val();
        var parameters = {
            "methodType": "view",
            "id": rowId
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
            lock: true,
            parent: sub_win,
            close: function () {
                // 关闭后是否标注为要刷新
                if (this.data['reload'] && this.data['reload'] == true) {
                    //重加载页面数据
                    //this.opener.location.reload();
                    //deleteOldAttachement();
                    $("#qc_table_detail #appendTr").remove();
                    searchAttachment();
                }
            },
            content: 'url:mccdoc/edit/upload_attachment.jsp',
            data: parameters
        });
    });
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
    var distribution_hidden = $("[name='mtBaseInfo.distribution']");
    if (distribution_hidden.val()) {
        var cat_arr = distribution_hidden.val().split(",");
        for (var i = 0; i < cat_arr.length; i++) {
            $("#distribution :checkbox[value=" + cat_arr[i] + "]").attr("checked", "checked");
        }
    }
});

function submitEntity() {
    sub_win.button({id: 'mt_submit_btn', disabled: true});
    //先进行数据保存操作
    saveEntity('submitBtn');
}

function saveEntity(submitBtn) {
    var actionUrl = "mt_management_add.action";

    var valiresult = $("#mt_form").valid();

    //校验subject字段
    var subject = $('[name="mtBaseInfo.subject"]');
    subject.nextAll("div").text('');
    if (subject == null || $.trim($(subject).val()) == "") {
        $('[name="mtBaseInfo.subject"]').nextAll("div").text("The field is required.");
        sub_win.button({id: 'mt_save_btn', disabled: false});
        sub_win.button({id: 'mt_submit_btn', disabled: false});
        return false;
    } else if ($.trim($(subject).val()) && ($.trim($(subject).val())).length > 300) {
        $('[name="mtBaseInfo.subject"]').nextAll("div").text("Please enter no more than 300 characters!");
        sub_win.button({id: 'mt_save_btn', disabled: false});
        sub_win.button({id: 'mt_submit_btn', disabled: false});
        return false;
    }
    //校验distribution
    var distribution_str = "";
    $("#distribution").find(":checked").each(function () {
        distribution_str = distribution_str + $(this).val() + ",";
    });
    if (distribution_str.length > 0) {
        $("[name='mtBaseInfo.distribution']").val(distribution_str.substring(0, distribution_str.length - 1));
    } else {
        $("[name='mtBaseInfo.distribution']").val("");
    }
    var dataInput = $("[name='mtBaseInfo.distribution']");
    dataInput.nextAll("div").text('');
    if (dataInput == null || !dataInput.val()) {
        $("[name='mtBaseInfo.distribution']").nextAll("div").text("distribution Can not be empty!");
        sub_win.button({id: 'mt_save_btn', disabled: false});
        sub_win.button({id: 'mt_submit_btn', disabled: false});
        return false;
    }
    if (!valiresult) {
        sub_win.button({id: 'mt_save_btn', disabled: false});
        sub_win.button({id: 'mt_submit_btn', disabled: false});
        return false;
    } else {
        sub_win.button({id: 'mt_save_btn', disabled: false});
        sub_win.button({id: 'mt_submit_btn', disabled: false});
        valiresult &= checkAtaOption();
    }
    if (!valiresult) {
        sub_win.button({id: 'mt_save_btn', disabled: false});
        sub_win.button({id: 'mt_submit_btn', disabled: false});
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
                sub_win.data['isReload'] = "reload";
                // 关闭当前窗口
                if (!submitBtn) {
                    win.$.dialog.alert('Save Success!');
                    //sub_win.close();
                } else if (submitBtn == 'submitBtn') {
                    updateStatus();
                    //sub_win.close();
                }
            } else {
                msg = 'Save failed. Please flush and try again';
                if (submitBtn) {
                    msg = 'Sumbit failed. Please flush and try again';
                }
                win.$.dialog.alert(msg);
                sub_win.button({id: 'mt_save_btn', disabled: false});
                sub_win.button({id: 'mt_submit_btn', disabled: false});
            }
        }
    });
}

/**发布申请*/
function updateStatus() {
    var fileNum = $("#qc_table_detail .ui_buttons_upload").length;
    if (fileNum != 3) {
        win.$.dialog.alert('请上传成对的Word和PDF文件');
        sub_win.button({id: 'mt_submit_btn', disabled: false});
        return false;
    }
    var flg = true;
    var id = $('#mtBaseInfoId').val();
    var flowIds = $('#flowInstanceId').val();
    var context = 'url:mccdoc/form/submit_mt_edit.jsp?id=' + id;
    if (flowIds) {
        flowIds = $.each(flowIds.split(','), function (i, e) {
            if (this && this.indexOf('-') == -1) return this;
        });
    }
    var parameters = {
        "methodType": "view",
        "rowId": 1,
        'flowIds': flowIds,
        'mtId': id
    };
    win.$.dialog({
        title: 'MT Submit',
        width: '400px',
        height: '150px',
        top: '15%',
        esc: true,
        cache: false,
        resize: false,
        cancel: false,
        max: false,
        min: false,
        lock: true,
        parent: sub_win,
        close: function () {
            if (this.data['operate'] == 1) {
//					submitDatas = {};
//					$.extend(submitDatas,this.data);
                //win.location.reload();
                sub_win.close();
            } else {
                sub_win.button({id: 'mt_submit_btn', disabled: false});
            }
        },
        content: context,
        data: parameters
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
            var dataInput = $("[name='mtBaseInfo.subject']");
            dataInput.parent().nextAll("div").text('');
            if (!dataInput.val()) {
                dataInput.parent().nextAll("div").append("subject Can not be empty!");
            }
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

$(function () {
    //加载附件信息
    searchAttachment();
    /*
     * 页面处于不同状态下的控制
     * add  新增时
     * edit 编辑时
     * */
    if ($('#editStatus').val() == 1) {
        // 仅留保存与取消
        sub_win.button({id: 'terminate', disabled: true, width: 0});
        // 版本控制按钮隐藏
        $('#revion_create').parents('.ui_buttons').hide();
    } else {

        // 编辑模式，已提交或已审批状态,所有数据不可编辑
        _disabled = true;
        $(':text').attr('disabled', 'disabled');
        $('textarea').attr('disabled', 'disabled');
        $(':checkbox').attr('disabled', 'disabled');
        $('#downTemplate').hide();
        $('#upload_detail_btn').hide();
        // 配合版本控制显示
        sub_win.button({id: 'mt_submit_btn', disabled: true, width: 0});

        sub_win.button({id: 'mt_save_btn', disabled: true, width: 0});
    }

    sub_win.DOM.buttons.find(":button").show().end().find(':disabled').hide();
});

//下载附件
function download(fileid) {
    $("#down").attr("href", basePath + "/ee/attachment_download.action?fileId=" + fileid);
    $("#down")[0].click();
}

//删除附件
function deleteFile(fileid) {
    var _url = basePath + "/ee/attachment_delete.action";
    var selectedIds = fileid;
    win.$.dialog.confirm('Delete Selected ?', function () {

        $.ajax({

            url: _url,

            type: "post",

            data: {'selectedIds': selectedIds},

            dataType: "json",

            cache: false,

            success: function (obj, textStatus) {

                var data = JSON.parse(obj);

                if (data && data.ajaxResult && data.ajaxResult.indexOf('success') != -1) {

                    win.$.dialog.alert(data.ajaxResult);
                    //deleteOldAttachement();
                    $("#qc_table_detail #appendTr").remove();
                    searchAttachment();
                    //refresh();
                }
            }
        });
    }, function () {
    });
}

function deleteOldAttachement() {
    var content = "<tr><td colspan='8' align='right' style='border-right:20px;'>" +
        "<div align='right' class='ui_buttons_upload' style='vertical-align: middle; padding-right:9.6%'>" +
        "<span style='padding-right:2%'><a href='#' style='color:#f60' id='downTemplate'>Download Template</a></span>" +
        "<input type='button' id='upload_detail_btn'  value='Upload' style='cursor: pointer;' /></div></td></tr>" +
        "<tr >td  class='td-line30-with-bg-center' width='17%;'>Doc Name</td><td  class='td-line30-with-bg-center' width='17%;'>Doc Type</td>" +
        "<td  class='td-line30-with-bg-center' width='17%;'>Uploader</td><td  class='td-line30-with-bg-center' width='17%;'>Upload Date</td>" +
        "<td  class='td-line30-with-bg-center' width='22%;'>Operate</td></tr><a href=''   id='down'></a>";
    $("#qc_table_detail").empty();
    $("#qc_table_detail").append(content);
}

//查询现有的附件信息
function searchAttachment() {
    var params = {
        id: $("#mtBaseInfoId").val()
    };
    var actionUrl = basePath + '/mccdoc/mt_management_searchAttachment.action';
    $.ajax({
        url: actionUrl,
        type: "get",
        cache: false,
        dataType: "json",
        data: params,
        success: function (obj) {
            var data = JSON.parse(obj);
            var val = null;
            var content = "";
            var statusVlaue = $("#editStatus").val();
            if (data.attachments != null && data.attachments.length > 0) {
                for (var i = 0; i < data.attachments.length; i++) {
                    val = data.attachments[i];
                    content += "<tr id='appendTr'><td ><div align='center'>" + val.name + "</div></td>";
                    content += "<td ><div align='center'>" + val.type + "</div></td>";
                    content += "<td ><div align='center'>" + val.uploadByName + "</div></td>";
                    content += "<td ><div align='center'>" + val.createDate + "</div></td>";
                    if (statusVlaue == 5) {
                        content += "<td ><div align='right' class='ui_buttons_upload' style='padding-right:33%;vertical-align: middle;'>" +
                            "<input type='button' onclick='deleteFile(" + val.id + ")' value='Delete' style='cursor: pointer;' disabled='disabled'/>" +
                            "</div></td></tr>";
                    } else {
                        content += "<td ><div align='right' class='ui_buttons_upload' style='padding-right:33%;vertical-align: middle;'>" +
                            "<input type='button' onclick='deleteFile(" + val.id + ")' value='Delete' style='cursor: pointer;' />" +
                            "</div></td></tr>";
                    }
                }
            } else {
                content += "<tr id='appendTr'><td colspan='5'><div align='center'>No attachment available.</div></td></tr>";
            }
            $("#qc_table_detail").append(content);

        },

    });
}

function refresh() {
    var rowId = $("#mtBaseInfoId").val();
    $("#location").attr("href", basePath + '/mccdoc/mt_management_edit.action?id=' + rowId);
    $("#location")[0].click();
}

var dialog_width = '600px';
var dialog_height = '200px';
var dialog_top = '15%';
