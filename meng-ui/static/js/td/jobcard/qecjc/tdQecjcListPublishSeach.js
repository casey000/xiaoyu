var PAGE_DATA = {};
var param;


function i18nCallBack() {
    param = getParentParam_();

    //绑定回车查询事件
    bindFormonSearch_('#ffSearch', function () {
        searchData()
    });

    InitFuncCodeRequest_({
        data: {
            domainCode: "DA_FLEET,TD_JC_STATUS",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                PAGE_DATA['fleet'] = DomainCodeToMap_(jdata.data["DA_FLEET"]);//机队
                PAGE_DATA['status'] = DomainCodeToMap_(jdata.data["TD_JC_STATUS"]);//状态

                //机队
                $('#fleet').combobox({
                    panelHeight: '140px',
                    data: jdata.data.DA_FLEET,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });


                $('#status').combobox({
                    value: "ISSUE",
                    onlyview: true,
                    editable: false
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
        queryParams: {status: "ISSUED"},
        pageSize: 15,
        columns: {
            param: {FunctionCode: 'TD_JC_ALL_QECJC_LIST'},
            alter: {
                STATUS: {
                    formatter: function (value) {
                        return PAGE_DATA['status'][value];
                    }
                },
                FLEET: {
                    formatter: function (value) {
                        return PAGE_DATA['fleet'][value];
                    }
                },
                WRITE_DATE: {
                    type: 'datetime'
                },
                REVIEWED_DATE: {
                    type: 'datetime'
                },
                APPROVED_DATE: {
                    type: 'datetime'
                },
                PUBLIC_DATE: {
                    type: 'datetime'
                }
            }
        },
        onLoadSuccess: function () {

        },
        validAuth: function (row, items) {
            items['预览'].enable = true;
            return items;
        },
        contextMenus: [
            {
                id: "", i18nText: "预览", auth: "TD_JC_QECJC_SEARCH_VIEW",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    openDetai("view", rowData.PKID);
                }
            }
        ],
        toolbar: [],
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
    var title_ = $.i18n.t('QEC工卡详情');
    ShowWindowIframe({
        width: "1050",
        height: "650",
        title: title_,
        param: {operation: operation, pkid: pkid},
        url: "/views/td/jobcard/qecjc/tdQecjcDetail.shtml"
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