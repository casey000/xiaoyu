var PAGE_DATA = {};
var COMBOBOX_DATA = {};
var user;

function i18nCallBack() {
    user = getLoginInfo();
    //绑定回车查询事件
    bindFormonSearch_('#ffSearch', function () {
        searchData()
    });

    InitFuncCodeRequest_({
        data: {
            domainCode: "DA_FLEET,TD_LMJC_TYPE,TD_MJC_STATUS,TD_JC_SMJC_WRITER",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            //有效性
            $('#fleet').combobox({
                panelHeight: '100px',
                data: jdata.data.DA_FLEET,
                valueField: 'VALUE',
                textField: 'TEXT'
            });
            $('#lmjcType').combobox({
                panelHeight: '100px',
                data: jdata.data.TD_LMJC_TYPE,
                valueField: 'VALUE',
                textField: 'TEXT'
            });
            $('#status').combobox({
                panelHeight: '160px',
                data: jdata.data.TD_MJC_STATUS,
                valueField: 'VALUE',
                textField: 'TEXT'
            });
            $('#status').combobox({
                value: "ISSUED",
                onlyview: true,
                editable: false
            });
            //编写人
            $('#writer').combobox({
                panelHeight: '100px',
                data: jdata.data.TD_JC_SMJC_WRITER,
                valueField: 'VALUE',
                textField: 'TEXT',
                value: user.accountId,
                onlyview: true,
                editable: false
            });

            // 因为后台获取到的是 对象 我们需要显示对象的text（因为对象中有value，还有text）
            PAGE_DATA['lmjcType'] = DomainCodeToMap_(jdata.data["TD_LMJC_TYPE"]);
            PAGE_DATA['status'] = DomainCodeToMap_(jdata.data["TD_MJC_STATUS"]);

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
            param: {FunctionCode: 'TD_JC_ALL_LMJC_RELESE_SEARCH'},
            alter: {
                LMJC_TYPE: {
                    formatter: function (value) {
                        return PAGE_DATA['lmjcType'][value];
                    }
                },
                STATUS: {
                    formatter: function (value) {
                        return PAGE_DATA['status'][value];
                    }
                },
                WRITE_DATE: {
                    type: 'date'
                },
                REVIEWED_DATE: {
                    type: 'date'
                },
                APPROVED_DATE: {
                    type: 'date'
                },
                WRITE_LIMIT: {
                    type: 'date'
                }
            }
        },
        onLoadSuccess: function () {
        },
        onDblClickRow: function (index, field, value) {
            openDetai("view", value.PKID, value.FLEET, value.JC_TYPE);
        },
        contextMenus: [
            {
                id: "m-pdf", i18nText: "PDF预览",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (rowData.PDF_PATH == null || rowData.PDF_PATH == "") {
                        MsgAlert({content: "工卡PDF存档不存在，请联系管理员。", type: 'error'});
                        return;
                    }
                    var data = $.extend(toCamelCase(rowData), {FunctionCode: 'TD_JC_PREVIEW'});
                    ajaxLoading();
                    InitFuncCodeRequest_({
                        data: data, successCallBack: function (jdata) {
                            ajaxLoadEnd();
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                if (jdata.data.length > 0) {
                                    var url = jdata.data;
                                    jcPreview(url);
                                }
                            } else {
                                MsgAlert({content: jdata.msg, type: 'error'});
                            }
                        }
                    });
                }
            }
        ],
        toolbar: [
            {
                id: 'btnReload',
                text: $.i18n.t('刷新'),
                iconCls: 'icon-reload',
                handler: function () {
                    reload_();
                }
            },
            {
                id: 'btnExport',
                text: $.i18n.t('导出excel'),
                iconCls: 'icon-page_excel',
                handler: function () {
                    excelExport('dg', '航线工卡清单', '');
                }
            }
        ],
    });
}

//刷新1
function reload_() {
    $("#dg").datagrid("reload");
}

//打开资料类型详细页面
function openDetai(operation, pkid, fleet, jcType) {
    var title_ = $.i18n.t('航线工卡编写');
    ShowWindowIframe({
        width: "1020",
        height: "260",
        title: title_,
        param: {operation: operation, pkid: pkid, fleet: fleet, jcType: jcType},
        url: " /views/td/jobcard/lmjc/tdLmjcEditDetail.shtml"
    });
}

//查询
function searchData() {
    onSearch_('dg', '#ffSearch');
}

//重置
function doClear_() {
    $("#ffSearch").form('clear');
    $('#status').combobox({
        value: "ISSUED"
    });
    searchData();
}

function jcPreview(url) {
    var title_ = $.i18n.t('航线工卡预览');
    ShowWindowIframe({
        width: "850",
        height: "650",
        title: title_,
        param: {url: url},
        url: "/views/td/jobcard/smjc/smjcedit/jobcardPreview.shtml"
    });
}