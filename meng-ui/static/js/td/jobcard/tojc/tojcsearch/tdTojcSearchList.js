var PAGE_DATA = {};

function i18nCallBack() {
    //绑定回车查询事件
    bindFormonSearch_('#ffSearch', function () {
        searchData()
    });

    //数据字典初始化
    InitFuncCodeRequest_({
        data: {
            domainCode: "TD_JC_STATUS,DA_FLEET,TD_JC_YOJC_WRITER,YESORNO",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                PAGE_DATA['status'] = DomainCodeToMap_(jdata.data["TD_JC_STATUS"]);
                PAGE_DATA['fleet'] = DomainCodeToMap_(jdata.data["DA_FLEET"]);
                PAGE_DATA['ifRii'] = DomainCodeToMap_(jdata.data["YESORNO"]);


                //机队
                $("#fleet").combobox({
                    panelHeight: '140px',
                    data: jdata.data.DA_FLEET,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });

                //工卡流程状态
                $("#status").combobox({
                    panelHeight: '140px',
                    data: jdata.data.TD_JC_STATUS,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    value: 'ISSUED',
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
        pageSize: 15,
        columns: {
            param: {FunctionCode: 'TD_TOJC_SEARCH_LIST'},
            alter: {
                STATUS: {
                    formatter: function (value) {
                        return PAGE_DATA['status'][value];
                    }
                },
                IF_RII: {
                    formatter: function (value) {
                        return PAGE_DATA['ifRii'][value];
                    }
                },
                FLEET: {
                    formatter: function (value) {
                        return PAGE_DATA['fleet'][value];
                    }
                },
                IF_UPLOAD: {
                    formatter: function (value) {
                        return PAGE_DATA['ifUpload'][value];
                    }
                },
                CREATE_DATE: {
                    type: 'datetime'
                },
                MODIFY_DATE: {
                    type: 'datetime'
                }
            }
        },
        onLoadSuccess: function () {
        },
        validAuth: function (row, items) {

            return items;
        },
        contextMenus: [
            {
                id: "m-view", i18nText: "预览", auth: "",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});

                    }

                }
            },

        ],
        toolbar: [{
            id: 'btnReload',
            text: $.i18n.t('刷新'),
            iconCls: 'icon-reload',
            handler: function () {
                $("#dg").datagrid("reload");
            }
        }],
        onClickRow: function (rowIndex, rowData) {
        },
        onDblClickRow: function (index, field, value) {
            openDetail("view", value.PKID);
        }
    });
}

//刷新
function reload_() {
    $("#dg").datagrid("reload");
}


//查看详情
function openDetail(operation, pkid) {
    var title_ = $.i18n.t('TO工卡编写');
    ShowWindowIframe({
        width: "810",
        height: "520",
        title: title_,
        param: {operation: operation, pkid: pkid},
        url: "/views/td/jobcard/tojc/tojcedit/tdTojcEditDetail.shtml"
    });
}

//查询
function searchData() {
    onSearch_('dg', '#ffSearch');
}

//重置
function doClear_() {
    $("#ffSearch").form('clear');
    $("#status").combobox("setValue", "ISSUED");
    searchData();
}