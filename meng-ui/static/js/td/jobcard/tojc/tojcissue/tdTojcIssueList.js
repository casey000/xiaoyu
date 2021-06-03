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
                    value: 'ISSUE',
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
            param: {FunctionCode: 'TD_TOJC_ISSUE_LIST'},
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
                id: "m-edit", i18nText: "发布", auth: "",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (!confirm("确认发布?")) {
                        return;
                    }
                    publish(rowData.PKID, rowData.JC_NO, rowData.VER);
                }
            },
            {
                id: "m-submit", i18nText: "退回", auth: "",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    var title_ = $.i18n.t('退回');
                    ShowWindowIframe({
                        width: "810",
                        height: "100",
                        title: title_,
                        param: {pkid: rowData.PKID},
                        url: "tdTojcIssueForBack.shtml"
                    });
                }
            },
            {
                id: "m-delete", i18nText: "PDF预览", auth: "",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});

                    }

                }
            },
            {
                id: "m-delete", i18nText: "延期申请", auth: "",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});

                    }

                }
            },
        ],
        toolbar: [{
            id: 'btnAdd',
            text: $.i18n.t('批量发布'),
            iconCls: 'icon-redo',
            handler: function () {
                batchPublic();
            }
        }, '-', {
            id: 'btnBack',
            text: $.i18n.t('批量退回'),
            iconCls: 'icon-undo',
            handler: function () {
                batchForback();
            }
        }, '-', {
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


//批量发布
function batchPublic() {
    var selectRows = getDG("dg").datagrid("getChecked");
    var selectCount = selectRows.length;
    if (selectCount === 0) {
        MsgAlert({content: '请选择要发布的记录！', type: 'error'});
        return;
    }
    var pkids = '';
    var jcNos = '';
    var vers = '';
    $.each(selectRows, function (k, item) {
        pkids += item.PKID + ',';
        jcNos += item.JC_NO + ",";
        vers += item.VER + ",";
    });
    pkids = pkids.substring(0, pkids.length - 1);
    jcNos = jcNos.substring(0, jcNos.length - 1);
    vers = vers.substring(0, vers.length - 1);

    var pkidArr = pkids.split(",");
    var jcNoArr = jcNos.split(",");
    var verArr = vers.split(",");

    alert("pkids = " + pkids + "   ,jcNos = " + jcNos + "   ,vers = " + vers);

    for (var i = 0; i < pkidArr.length; i++) {
        publish(pkidArr[i], jcNoArr[i], verArr[i]);
    }
}

//发布
function publish(pkid, jcNo, ver) {
    InitFuncCodeRequest_({
        data: {pkid: pkid, jcNo: jcNo, ver: ver, FunctionCode: "TD_TOJC_ISSUE"},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                reload_();
            } else {
                MsgAlert({content: jdata.msg, type: "error"});
            }
        }
    });
}

//批量退回
function batchForback() {
    var selectRows = getDG("dg").datagrid("getChecked");
    var selectCount = selectRows.length;
    if (selectCount === 0) {
        MsgAlert({content: '请选择要退回的记录！', type: 'error'});
        return;
    }
    var pkids = '';
    $.each(selectRows, function (k, item) {
        pkids += item.PKID + ',';
    });
    var title_ = $.i18n.t('退回');
    ShowWindowIframe({
        width: "810",
        height: "100",
        title: title_,
        param: {pkid: pkids},
        url: "tdTojcIssueForBack.shtml"
    });
}

//查询
function searchData() {
    onSearch_('dg', '#ffSearch');
}

//重置
function doClear_() {
    $("#ffSearch").form('clear');
    $("#status").combobox("setValue", "ISSUE");
    searchData();
}