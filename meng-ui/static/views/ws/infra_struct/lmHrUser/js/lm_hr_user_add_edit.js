/**
 * Created by dell on 2017/6/28.
 */
var isEdit_;
var param = {};
var PKID;
var ACC_PKID; //账户ＩＤ
var roleIds; //角色列表
param = getParentParam_();
isEdit_ = param.isEdit;

function i18nCallBack() {
    chakan = param.chaKan;
    PKID = param.PKID;
    ACC_PKID = param.ACC_PKID;
    if (isEdit_ == 1) {
        $("fieldset legend").html("编辑");
    }
    if (chakan == 1 && isEdit_ == 1) {
        $("#saver").hide();
        $("#upload").hide();
        $("fieldset legend").html("查看");
    }
    $('#operateDate').textbox({value: formatDates(new Date())})
    $("#operator").textbox({value: getLoginInfo().userName});


    InitFuncCodeRequest_({
        data: {
            domainCode: "WS_LM_HR_USER_EMP_SEX,WS_LM_HR_USER_EMP_IF_MARRIED,WS_LM_HR_USER_EMP_NATION,WS_LM_HR_USER_EMP_POLITICAL,WS_USER_ORGAN,WS_LM_HR_USER_EMP_PRO,WS_LM_HR_USER_EMP_DATE,WS_LM_HR_USER_EMP_TYPE,WS_LM_HR_USER_EMP_STATUS,WS_LM_HR_USER_EMP_WORK_STATUS",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                $('#empSex').combobox({
                    panelHeight: '100px',
                    data: jdata.data.WS_LM_HR_USER_EMP_SEX,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                });
                $('#empIfMarried').combobox({
                    panelHeight: '100px',
                    data: jdata.data.WS_LM_HR_USER_EMP_IF_MARRIED,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                });
                $('#empNation').combobox({
                    panelHeight: '100px',
                    data: jdata.data.WS_LM_HR_USER_EMP_NATION,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                });
                $('#empPolitical').combobox({
                    panelHeight: '100px',
                    data: jdata.data.WS_LM_HR_USER_EMP_POLITICAL,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                });
                $('#empOrg').combobox({
                    panelHeight: '100px',
                    data: jdata.data.WS_USER_ORGAN,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                });
                $('#empPro').combobox({
                    panelHeight: '100px',
                    data: jdata.data.WS_LM_HR_USER_EMP_PRO,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                });
                $('#empDate').combobox({
                    panelHeight: '100px',
                    data: jdata.data.WS_LM_HR_USER_EMP_DATE,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                });
                $('#empType').combobox({
                    panelHeight: '100px',
                    data: jdata.data.WS_LM_HR_USER_EMP_TYPE,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                });
                $('#empStatus').combobox({
                    panelHeight: '100px',
                    data: jdata.data.WS_LM_HR_USER_EMP_STATUS,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                });
                $('#empWorkStatus').combobox({
                    panelHeight: '100px',
                    data: jdata.data.WS_LM_HR_USER_EMP_WORK_STATUS,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                });
            }
            else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });


    if (isEdit_) {
        //根据pkid查询该员工信息
        InitFuncCodeRequest_({
            data: {PKID: PKID, accPkid: (ACC_PKID ? ACC_PKID : ""), FunctionCode: "WS_LM_HR_USER_GET"},
            successCallBack: function (jdata) {
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    if (jdata.data.WS_ACCOUNT.data != null) {
                        $("#pw1").hide()
                        $("#pw2").hide()
                        $("#newPassword").textbox({required: false})
                        $("#newPassword2").textbox({required: false})
                        $('#accountNumber').textbox({value: jdata.data.WS_ACCOUNT.data.ACCOUNT_NUMBER})//editable:false,onlyview:true
                    } else {
                        $("#pw").hide()
                    }
                    ParseFormField_(jdata.data.WS_HR_USER.data, null, Constant.CAMEL_CASE);
                    $("#empWorkStatus").combobox({value: jdata.data.WS_HR_USER.data.EMP_WORK_STATUS})
                    $("#empStatus").combobox({value: jdata.data.WS_HR_USER.data.EMP_STATUS})
                    $("#empType").combobox({value: jdata.data.WS_HR_USER.data.EMP_TYPE})
                    $("#empDate").combobox({value: jdata.data.WS_HR_USER.data.EMP_DATE})
                    $("#empPro").combobox({value: jdata.data.WS_HR_USER.data.EMP_PRO})
                    $("#empSex").combobox({value: jdata.data.WS_HR_USER.data.EMP_SEX})
                    $("#empNation").combobox({value: jdata.data.WS_HR_USER.data.EMP_NATION})
                    $("#empIfMarried").combobox({value: jdata.data.WS_HR_USER.data.EMP_IF_MARRIED})
                    $("#empPolitical").combobox({value: jdata.data.WS_HR_USER.data.EMP_POLITICAL})
                    $("#empOrg").combobox({value: jdata.data.WS_HR_USER.data.EMP_ORG})
                    $("#empDate").combobox({value: jdata.data.WS_HR_USER.data.EMP_DATE})
                    $("#empWorkStatus").combobox({value: jdata.data.WS_HR_USER.data.EMP_WORK_STATUS})
                    $('#operateDate').textbox({value: jdata.data.WS_HR_USER.data.OPERATE_DATE})
                    $("#operator").textbox({value: jdata.data.WS_HR_USER.data.OPERATOR});
                    $("#pic").attr("src", jdata.data.WS_HR_USER.data.IMAGE_URL);
                    // $("#accountNumber").textbox({value: jdata.data.WS_ACCOUNT.data.ACCOUNT_NUMBER});
                    roleIds = "," + ArrayCollect_(jdata.data.UserRoleList.data, "ROLE_ID") + ",";
                }
            }
        })
    } else {
        $("#pw").hide()
    }

    InitDataGrid()
    InitEditForm_()

}

//角色展示
function InitDataGrid() {
    $("#roleIds").MyDataGrid({
        pagination: false,
        columns: {
            param: {FunctionCode: 'WS_ROLES_LIST'},///api/v1/combobox/roleList
            alter: {
                SERV_STATUS: {
                    formatter: function (value, row, index) {
                        return PAGE_DATA['servStatus'][value];
                    }
                },
            },
        },
        onLoadSuccessOnce: function () {

            var rows = $('#roleIds').datagrid('getRows');
            console.log(rows)
            if (roleIds) {
                $.each(rows, function (k, row) {
                    if (roleIds.indexOf("," + row.PKID + ",") > -1) {
                        $('#roleIds').datagrid('checkRow', k);
                    }
                });
            }
        },
        resize: function () {
            return {width: 400};
        }
    })
}


function InitEditForm_() {
    var $form = $("#mform");
    $form.form({
        onSubmit: function () {
            var isValidate = $(this).form('validate');
            var isValidate1 = $("#mform1").form('validate');
            /** 校验必填框是否通过校验*/
            if (!isValidate) {
                return false;
            }
            if (!isValidate1) {
                $("#tabs").tabs("select", 1);
                return false;
            }
            //员工信息保存
            var data = $form.serializeObject();
            var data1 = $("#mform1").serializeObject();
            var nodes_ = $("#roleIds").datagrid('getChecked');
            data2 = $.extend({}, data, data1);
            data2.roleIds = ArrayCollect_(nodes_, "PKID");
            data2.createAcc = "1";//是否创建账号标志
            console.log(data);
            data2 = $.extend({}, data2, {
                //编辑页面保存按钮进入更新该条数据，新增页面插入该条数据
                FunctionCode: (isEdit_ ? 'WS_LM_HR_USER_EDIT' : 'WS_LM_HR_USER_ADD')
            });
            InitFuncCodeRequest_({
                data: data2,
                successCallBack: function (jdata) {
                    if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                        param.OWindow.reload_();
                        MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                        CloseWindowIframe();
                    } else {
                        MsgAlert({content: jdata.msg, type: 'error'});
                    }
                }
            });
            return false;
        }
    });
}

console.log(param)

function updatePwd() {
    ShowWindowIframe({
        width: 600, height: 280,
        title: "修改账户密码",//["+param.ACCOUNT_NUMBER+"]
        param: {pkid: param.USER_PKID},
        url: "/views/sysuser/sysuser_update_pwd.shtml"
    });

}

function formatDates(date) {
    var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
    var month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : "0"
        + (date.getMonth() + 1);
    var hor = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    return date.getFullYear() + '-' + month + '-' + day + " " + hor + ":" + min + ":" + sec;
};

/** 刷新列表数据 */
function reload_() {
    $("#dg").datagrid("reload");
}

function closeAdd() {
    $.messager.confirm('', '是否关闭', function (r) {
        if (r) {
            CloseWindowIframe();
            param.OWindow.reload_();
        }
    });
}

//上传照片跳转新的页面
function photo_upload_(edopt) {
    var title_ = $.i18n.t('common:COMMON_OPERATION.UPLOAD');
    ShowWindowIframe({
        width: 575,
        height: 400,
        title: title_,
        param: $.extend({}, edopt.param),
        url: '/views/ws/infra_struct/lmHrUser/upImage.shtml'
    });
}

//上传照片
function uploadImg() {
    photo_upload_({
        param: {cat: 'photo', sourceId: PKID, PKID: PKID, successCallBack: "aa", failCallBack: "bb"}

    });

}

//去除获得的url前面部分
function getUrl(url) {
    var str = url.substring(36);
    $("#pic").attr("src", url);
    $("#imageUrl").val(str);
}