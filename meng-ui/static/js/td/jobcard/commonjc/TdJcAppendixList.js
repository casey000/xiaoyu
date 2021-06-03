var PAGE_DATA = {};
var user;
var param;

function i18nCallBack() {
    user = getLoginInfo();
    param = getParentParam_();
    //绑定回车查询事件
    bindFormonSearch_('#ffSearch', function () {
        onSearch_('dg', '#ffSearch')
    });

    InitFuncCodeRequest_({
        data: {
            domainCode: "TD_JC_APP_TYPE,DA_FLEET,DA_ENG_TYPE,TD_JC_APPENDIX_TYPE,TD_JC_APPENDIX_IF_APL,TD_JC_SMJC_WRITER",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                //适用类型
                $('#appendixAppType').combobox({
                    panelHeight: '80px',
                    data: jdata.data.TD_JC_APP_TYPE,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    onSelect: function (item) {
                        if (item.VALUE == 'APL') { //机身
                            $('#appendixModel').combobox({
                                panelHeight: '140px',
                                data: jdata.data.DA_FLEET,
                                valueField: 'VALUE',
                                textField: 'TEXT'
                            });
                        } else if (item.VALUE == 'ENG') { //发动机
                            $('#appendixModel').combobox({
                                panelHeight: '140px',
                                data: jdata.data.DA_ENG_TYPE,
                                valueField: 'VALUE',
                                textField: 'TEXT'
                            });
                        } else if (item.VALUE == 'PART') { //部件
                            $('#appendixModel').combobox('setValue', 'CM');
                        }
                    }
                });
                //型号
                $('#appendixModel').combobox({
                    panelHeight: '140px',
                    data: jdata.data.DA_FLEET,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                //附录类型
                $('#appendixType').combobox({
                    panelHeight: '140px',
                    data: jdata.data.TD_JC_APPENDIX_TYPE,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                //是否适用
                $('#appendixIfApply').combobox({
                    panelHeight: '50px',
                    data: jdata.data.TD_JC_APPENDIX_IF_APL,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });

                //适用类型
                PAGE_DATA['appendixAppType'] = DomainCodeToMap_(jdata.data["TD_JC_APP_TYPE"]);
                //附录类型
                PAGE_DATA['appendixType'] = DomainCodeToMap_(jdata.data["TD_JC_APPENDIX_TYPE"]);
                //是否适用
                PAGE_DATA['appendixIfApply'] = DomainCodeToMap_(jdata.data["TD_JC_APPENDIX_IF_APL"]);
                //修改人
                PAGE_DATA['writer'] = DomainCodeToMap_(jdata.data["TD_JC_SMJC_WRITER"]);
                InitDataGrid();
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

function InitDataGrid() {
    var pageSize = Math.floor(($(document.body).height() - $("fieldset").height() - 185) / 50);
    $("#dg").MyDataGrid({
        identity: "dg",
        sortable: true,
        singleSelect: true,
        pageSize: pageSize, pageList: [pageSize],
        resize: function () {
            return tabs_standard_resize($("#tt"), 0.08, 0.001, 5, 4);
        },
        columns: {
            param: {FunctionCode: 'TD_JC_APPENDIX_LIST'},
            alter: {
                APP_TYPE: {
                    formatter: function (value) {
                        return PAGE_DATA['appendixAppType'][value];
                    }
                },
                APPEND_TYPE: {
                    formatter: function (value) {
                        return PAGE_DATA['appendixType'][value];
                    }
                },
                APPEND_STATE: {
                    formatter: function (value) {
                        return PAGE_DATA['appendixIfApply'][value];
                    }
                }
            }
        },
        contextMenus: [
            {
                id: "m-edit",
                i18nText: "编辑",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    openAppendixEdit("edit", rowData.PKID, rowData.COMPANY_CODE, rowData.MODEL, rowData.APP_TYPE);
                }
            },
            {
                id: "m-delete",
                i18nText: "删除",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    deleteAppendix(rowData.PKID);
                }
            }
        ],
        validAuth: function (row, items) {

            items['删除'].enable = false;
            return items;

        },
        toolbar: [
            {
                key: "COMMON_ADD",
                text: $.i18n.t('增加'),
                handler: function () {
                    openAppendixEdit('add');
                }
            }, '-', {
                key: "COMMON_RELOAD",
                text: $.i18n.t('刷新'),
                handler: function () {
                    $("#dg").datagrid("reload");
                }
            }
        ]
    });
}

//刷新
function reload_() {
    $("#dg").datagrid("reload");
}

//打开附加内容详细页
function openAppendixEdit(operation, pkid, companyCode, model, appType) {
    var title_ = $.i18n.t('增加/编辑附加内容');
    ShowWindowIframe({
        width: "900",
        height: "680",
        title: title_,
        param: {operation: operation, pkid: pkid, companyCode: companyCode, model: model, appType: appType},
        url: "/views/td/jobcard/commonjc/TdJcAppendixDetail.shtml"
    });
}

//删除工卡附加内容
function deleteAppendix(pkid) {
    InitFuncCodeRequest_({
        data: {appendixPkid: pkid, FunctionCode: 'TD_JC_DELETE_APPENDIX_BYID'},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                reload_();
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

//重置
function doClear_(search) {
    $(search).form('clear');
    // searchData(grid, search);
}