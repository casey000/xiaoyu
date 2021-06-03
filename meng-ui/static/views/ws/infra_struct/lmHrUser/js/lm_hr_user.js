/**
 * Created by dell on 2017/6/28.
 */
//var empOrg;
var PAGE_DATA = {};

function i18nCallBack() {
    InitDataGrid();
    //初始化部门数据域
    InitFuncCodeRequest_({
        data: {domainCode: "WS_USER_ORGAN,WS_LM_HR_USER_EMP_SEX", FunctionCode: "ANALYSIS_DOMAIN_BYCODE"},
        successCallBack: function (jdata) {
            console.log(jdata);
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                $('#empOrg').combobox({
                    panelHeight: '150px',
                    data: jdata.data.WS_USER_ORGAN,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                PAGE_DATA['empOrg'] = DomainCodeToMap_(jdata.data["WS_USER_ORGAN"]);
                PAGE_DATA['sex'] = DomainCodeToMap_(jdata.data["WS_LM_HR_USER_EMP_SEX"]);
                InitDataGrid();
            }
        }
    });
}

function InitDataGrid() {
    var identity = 'dg';
    $("#dg").MyDataGrid({
        identity: identity,
        columns: {
            //查询LM_HR_USER表的数据
            param: {FunctionCode: 'WS_LM_HR_USER_LIST'},
            //数据表格数据域回显
            alter: {
                EMP_ORG: {
                    formatter: function (value, row, index) {
                        return PAGE_DATA['empOrg'][value];
                    }
                },
                EMP_SEX: {
                    formatter: function (value, row, index) {
                        return PAGE_DATA['sex'][value];
                    }
                }
            }
        },
        contextMenus: [
            //右键编辑
            {
                id: "m-edit", i18nText: "common:COMMON_OPERATION.EDIT", auth: "",
                onclick: function () {
                    var ACC_PKID = $('#dg').datagrid('getSelected').ACC_PKID;
                    common_add_edit_({
                        identity: identity, isEdit: 1, width: 800, height: 420,
                        param: {
                            isEdit: 1, ACC_PKID: ACC_PKID
                        },
                        url: "/views/ws/infra_struct/lmHrUser/lm_hr_user_add_edit.shtml"
                    });
                }
            },
            //右键查看
            {
                id: "m-edit", i18nText: "common:COMMON_OPERATION.CHAKAN", auth: "",
                onclick: function () {
                    common_add_edit_({
                        identity: identity, isEdit: 1, width: 800, height: 420,
                        param: {
                            chaKan: 1, isEdit: 1
                        },
                        url: "/views/ws/infra_struct/lmHrUser/lm_hr_user_add_edit.shtml"
                    });
                }
            },
            //右键删除
            {
                id: "m-delete", i18nText: "common:COMMON_OPERATION.DEL", auth: "",
                onclick: function () {
                    common_delete_({
                        identity: identity,
                        cfmI18next: "msg_tip:TIP.COMMON.DEL_CONFIRM",
                        param: {PKID: "PKID"},
                        FunctionCode: "WS_LM_HR_USER_DELETE"
                    });
                }
            }


        ],
        toolbar: [
            {
                key: "COMMON_ADD", text: $.i18n.t('common:COMMON_OPERATION.ADD'), auth: "",
                handler: function () {
                    add_()
                }
            }, '-',
            {
                key: "COMMON_RELOAD", text: $.i18n.t('common:COMMON_OPERATION.RELOAD'),
                handler: function () {
                    common_reload_({identity: identity});
                }
            }
        ],

    });
}

//新增按钮跳转新增页面
function add_() {
    ShowWindowIframe({
        width: 800,
        height: 420,
        url: "/views/ws/infra_struct/lmHrUser/lm_hr_user_add_edit.shtml"
    });
}


/** 刷新列表数据 */
function reload_() {
    $("#dg").datagrid("reload");
}
