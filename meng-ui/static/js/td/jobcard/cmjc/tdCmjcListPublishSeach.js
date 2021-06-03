var PAGE_DATA = {};
var param;
var user;

function i18nCallBack() {
    param = getParentParam_();

    user = getLoginInfo();
    //绑定回车查询事件
    bindFormonSearch_('#ffSearch', function () {
        searchData()
    });

    InitFuncCodeRequest_({
        data: {
            domainCode: "TD_JC_STATE,TD_JC_STATUS,TD_JC_SMJC_WRITER",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                PAGE_DATA['jcStatus'] = DomainCodeToMap_(jdata.data["TD_JC_STATE"]);//工卡状态、使用、不适用
                PAGE_DATA['status'] = DomainCodeToMap_(jdata.data["TD_JC_STATUS"]);//状态

                //工卡状态、使用、不适用
                $('#jcStatus').combobox({
                    panelHeight: '140px',
                    data: jdata.data.TD_JC_STATE,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });

                //状态
                $('#status').combobox({
                    panelHeight: '140px',
                    data: jdata.data.TD_JC_STATUS,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });

                // 对工卡编写发布页面做特殊处理
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
                    value: user.accountId
                });

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
        queryParams: {status: "ISSUED"},
        columns: {
            param: {FunctionCode: 'TD_CMJC_LIST'},
            alter: {
                STATUS: {
                    formatter: function (value) {
                        return PAGE_DATA['status'][value];
                    }
                },
                JC_STATUS: {
                    formatter: function (value) {
                        return PAGE_DATA['jcStatus'][value];
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
                PUBLIC_DATE: {
                    type: 'date'
                }
            }
        },
        toolbar: [
            {
                key: "COMMON_RELOAD",
                text: $.i18n.t('common:COMMON_OPERATION.RELOAD'),
                handler: function () {
                    reload_();
                }
            },
            {
                id: 'btnExport',
                text: $.i18n.t('导出excel'),
                iconCls: 'icon-page_excel',
                handler: function () {
                    excelExport('dg', '部件修理工卡清单', '');
                }
            }
        ],
        onLoadSuccess: function () {

        },
        validAuth: function (row, items) {
            items['PDF预览'].enable = true;
            return items;
        },
        contextMenus: [
            {
                id: "m-pdfPreview",
                i18nText: "PDF预览",
                // auth: "TD_JC_CMJC_PDFVIEW",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
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
        onClickRow: function (rowIndex, rowData) {
        },
        onDblClickRow: function (index, field, value) {
            openDetai("view", value.PKID);
        }
    });
}

//刷新
function reload_() {
    $("#dg").datagrid("reload");
}

//打开资料类型详细页面
function openDetai(operation, pkid) {
    var title_ = $.i18n.t('部件工卡详情');
    ShowWindowIframe({
        width: "1000",
        height: "498",
        title: title_,
        param: {operation: operation, pkid: pkid},
        url: "/views/td/jobcard/cmjc/tdCmjcDetail.shtml"
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
    var title_ = $.i18n.t('部件修理工卡预览');
    ShowWindowIframe({
        width: "850",
        height: "650",
        title: title_,
        param: {url: url},
        url: "/views/td/jobcard/cmjc/jobcardPreview.shtml"
    });
}