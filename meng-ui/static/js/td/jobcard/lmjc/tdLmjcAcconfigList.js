var PAGE_DATA = {};
var COMBOBOX_DATA = {};

function i18nCallBack() {
    //绑定回车查询事件
    bindFormonSearch_('#ffSearch', function () {
        searchData()
    });

    InitFuncCodeRequest_({
        data: {
            domainCode: "DA_FLEET",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            //有效性
            $('#fleet').combobox({
                panelHeight: '60px',
                data: jdata.data.DA_FLEET,
                valueField: 'VALUE',
                textField: 'TEXT'
            });
            // 因为后台获取到的是 对象 我们需要显示对象的text（因为对象中有value，还有text）
            PAGE_DATA['fleet'] = DomainCodeToMap_(jdata.data["DA_FLEET"]);

            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                InitDataGrid();
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

function InitDataGrid() {
    $("#dg").MyDataGrid({
        identity: 'dg',
        sortable: true,
        singleSelect: true,
        pageSize: 15,
        columns: {
            param: {FunctionCode: 'TD_JC_LMJC_ACCONFIG_LIST'},
            alter: {
                CREATE_DATE: {
                    type: 'date'
                },
                MODIFY_DATE: {
                    type: 'date'
                }
            }
        },
        onLoadSuccess: function () {
        },
        contextMenus: [
            {
                id: "m-edit",
                i18nText: "编辑",
                auth: "TD_JC_LMJC_ACCONFIG_EDIT",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    openDetai('edit', rowData.PKID);
                }
            },
            {
                id: "m-delete", i18nText: "删除", auth: "TD_JC_LMJC_ACCONFIG_EDIT",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (!confirm("确认删除该记录？")) {
                        return;
                    }
                    InitFuncCodeRequest_({
                        data: {pkid: rowData.PKID, FunctionCode: 'TD_JC_LMJC_ACCONFIG_DELETE'},
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
            }
        ],
        toolbar: [{
            id: 'btnAdd',
            text: $.i18n.t('增加'),
            iconCls: 'icon-add',
            auth: "TD_JC_LMJC_ACCONFIG_EDIT",
            handler: function () {
                editDetailData('add')
            }
        }]
    });
}

//刷新
function reload_() {
    $("#dg").datagrid("reload");
}

//新增
function editDetailData(operation) {
    openDetai(operation, '');
}

//打开资料类型详细页面1
function openDetai(operation, pkid) {
    var title_ = $.i18n.t('飞机分组维护详情页面');
    ShowWindowIframe({
        width: "650",
        height: "280",
        title: title_,
        param: {operation: operation, pkid: pkid},
        url: "/views/td/jobcard/lmjc/tdLmjcAcconfigDetail.shtml"
    });
}


//查询
function searchData() {
//        dateFormatter_();
    onSearch_('dg', '#ffSearch');
}

//重置
function doClear_() {
    $("#ffSearch").form('clear');
    searchData();
}