var successCallBack;
var param = {};
param = getParentParam_();
if (!param.cat) {
    $("#catBox").show();
} else {
    $("#catBox").hide();
    $("#fileCategory").val(param["cat"]);
    $("#sourceId").val(param["sourceId"]);
}

$(function () {
    $("#buttonSubmit").click(function () {
        var sourceId = $("#sourceId").val();
        var fileCategory = $.trim($('#fileCategory').val());
        if (fileCategory == "") {
            MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.WJBWK'), type: 'error'});
            return;
        }
        var fileToUpload = $.trim($('#fileToUpload').val());
        if (fileToUpload == "") {
            MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.WJBWKJ'), type: 'error'});
            return;
        }
        if (param["operation"]) {
            var f_index = fileToUpload.lastIndexOf(".");
            var f_fileType = fileToUpload.substring(f_index + 1, fileToUpload.length).toLowerCase();
            if (f_fileType != 'xls' && f_fileType != 'xlsx' && param["operation"]) {
                MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.WJBWKJW'), type: 'error'});
                return;
            }
        }
        if (!checkFile()) {
            return;
        }
        $.ajaxFileUpload({
            url: Constant.API_URL + 'ATTACHMENT_UPLOAD',
            secureuri: false,
            fileElementId: 'fileToUpload', //file控件id
            dataType: 'json',
            data: {
                "fileCategory": fileCategory,
                "sourceId": sourceId
            },
            success: function (jdata) {
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    if (jdata.data == 'repeat') {
                        tanchuang();
                        return;
                    }
                    if (jdata.data != 'repeat') {
                        afterUpload(sourceId, jdata.data.key);
                        if (param["operation"]) {
                            importData(jdata, sourceId, param["operation"])
                        } else {
                            param.OWindow.reload_();
                            param.OWindow.MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.UPLOAD_SUCCESS')});
                            CloseWindowIframe();
                        }
                    }

                } else {
                    MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.UPLOAD_FALIED') + jdata.msg, type: 'error'});
                }
            }

        })
    })
});

function tanchuang() {
    layerConfirm_({
        content: '己存在相同文件名的文件，是否覆盖并保存？',
        yesFunc: function (index) {
            var sourceId = $("#sourceId").val();
            var fileCategory = $.trim($('#fileCategory').val());
            if (fileCategory == "") {
                MsgAlert({content: "文件分类不能为空", type: 'error'});
                return;
            }
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
                        if (param["operation"]) {
                            importData(jdata, sourceId, param["operation"])
                        } else {
                            param.OWindow.MsgAlert({content: "上传成功"});
                            param.OWindow.reload_();
                            CloseWindowIframe();
                        }
                    }
                    else {
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

function importData(jdata, sourceId, functionCode) {
    //导入操作
    var key = jdata.data.key;
    if (!key) {
        MsgAlert({content: "上传失败" + jdata.msg, type: 'error'});
        return;
    }
    ajaxLoading();
    InitFuncCodeRequest_({
        //MM_RSPL_DETAIL_IMPORT
        data: {key: key, pkid: sourceId, FunctionCode: functionCode},
        successCallBack: function (jdata) {
            ajaxLoadEnd();
            if (jdata.code == 200) {
                param.OWindow.MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
            } else {
                param.OWindow.MsgAlert({content: jdata.msg ? jdata.msg : jdata.data, type: 'error'});
            }
            param.OWindow.reload_();
            CloseWindowIframe();
        }
    });
}

function ajaxLoading() {
    var id = "#textboxDiv";
    var left = ($(window).outerWidth(true) - 190) / 2;
    var top = ($(window).height() - 35) / 2;
    var height = $(window).height();
    $("<div class=\"datagrid-mask\"></div>").css({display: "block", width: "100%", height: height}).appendTo(id);
    $("<div class=\"datagrid-mask-msg\"></div>").html("正在导入,请稍候...Waiting...").appendTo(id).css({
        display: "block",
        left: left,
        top: top
    });
}

function ajaxLoadEnd() {
    $(".datagrid-mask").remove();
    $(".datagrid-mask-msg").remove();
}

//校验文件名称、类型、大小
function checkFile() {
    var errMsg;
    var file = document.getElementById('fileToUpload').files[0];
    var fileName = file.name;
    var fileSize = file.size;
    if (file == null || file == "") {
        MsgAlert({content: $.i18n.t('page:PAGE.UPLOAD_TIPS.FILE_NOT_EXISTS'), type: 'error'});//"请选择要上传的文件！"
        return false;
    }
    var reg = /[~#^$@%&!?%*\s]/gi;//文件名不能包含  ~#^$@%&!?%* 和 空格 等特殊字符
    if (reg.test(fileName.substring(0, fileName.lastIndexOf(".")))) {
        MsgAlert({content: $.i18n.t('page:PAGE.UPLOAD_TIPS.FILE_NAME_REG'), type: 'error'});//"上传文件名不能包含特殊字符或空格！"
        return false;
    }
    if (fileName.lastIndexOf('.') == -1) {//如果不存在".XXX"
        MsgAlert({content: $.i18n.t('page:PAGE.UPLOAD_TIPS.FILE_PATH'), type: 'error'});//"上传文件路径不正确！"
        return false;
    }
    var AllExt = ".pdf";//只允许上传pdf格式文件
    var extName = fileName.substring(fileName.lastIndexOf(".")).toLowerCase();//把文件类型的所有字母全部转换为小写
    if (AllExt.indexOf(extName + "|") == -1) {
        errMsg = $.i18n.t('page:PAGE.UPLOAD_TIPS.FILE_TYPE_A') + AllExt + $.i18n.t('page:PAGE.UPLOAD_TIPS.FILE_TYPE_B') + extName;
        //errMsg = "该文件类型不允许上传。</br>请上传 "+AllExt+" 类型的文件。</br>当前文件类型为"+extName;files of type
        MsgAlert({content: errMsg, type: 'error'});
        return false;
    }
    fileSize = Math.round(fileSize / 1024); //单位为KB
    if (fileSize > 10 * 1024) {
        MsgAlert({content: $.i18n.t('page:PAGE.UPLOAD_TIPS.FILE_SIZE'), type: 'error'});//"文件大小不能大于4M！"
        return false;
    }
    return true;
}

//文件上传成功后,状态改为待发布("03"),回填文件名称,url
function afterUpload(pkid, key) {
    InitFuncCodeRequest_({
        data: {
            pkid: pkid,
            fileKey: key,
            FunctionCode: 'DM_DATA_REC_UPLOAD'
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                param.OWindow.reload_();
            } else {
                MsgAlert({content: jdata.msg ? jdata.msg : jdata.data, type: 'error'});
            }
        }
    });
}