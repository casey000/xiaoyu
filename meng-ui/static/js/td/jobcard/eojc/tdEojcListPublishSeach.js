var PAGE_DATA = {};
var param;
var jcType;
var funcode;

function i18nCallBack() {
    param = getParentParam_();
    jcType = param.jcType;

    if ("EOJC" == jcType) {
        funcode = 'TD_JC_ALL_EOJC_LIST';
    } else if ("EAJC" == jcType) {
        funcode = 'TD_JC_ALL_EAJC_LIST';
    }

    //绑定回车查询事件
    bindFormonSearch_('#ffSearch', function () {
        searchData();
    });

    InitFuncCodeRequest_({
        data: {
            domainCode: "DA_FLEET,TD_JC_STATUS,YESORNO,TD_JC_APP_TYPE,DA_ENG_TYPE,TD_ATA",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                PAGE_DATA['fleet'] = DomainCodeToMap_(jdata.data["DA_FLEET"]);//机队
                PAGE_DATA['status'] = DomainCodeToMap_(jdata.data["TD_JC_STATUS"]);//状态
                PAGE_DATA['ifRii'] = DomainCodeToMap_(jdata.data["YESORNO"]);//是否必检

                if ("EOJC" == param.jcType) {
                    //工卡类型 EOJC
                    $('#jcType').combobox({
                        value: "EOJC",
                        onlyview: true,
                        editable: false
                    });
                } else if ("EAJC" == param.jcType) {
                    //工卡类型 EAJC
                    $('#jcType').combobox({
                        value: "EAJC",
                        onlyview: true,
                        editable: false
                    });
                }

                //机队
                $('#fleet').combobox({
                    panelHeight: '140px',
                    data: jdata.data.DA_FLEET,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });

                //适用类型
                $('#appType').combobox({
                    panelHeight: '80px',
                    data: jdata.data.TD_JC_APP_TYPE,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    onSelect: function (item) {
                        if (item.VALUE == 'APL') { //机身
                            $('#fleet').combobox({onlyview: false});
                            $('#fleet').combobox({
                                panelHeight: '120px',
                                data: jdata.data.DA_FLEET,
                                valueField: 'VALUE',
                                textField: 'TEXT'
                            });
                        } else if (item.VALUE == 'ENG') { //发动机
                            $('#fleet').combobox({onlyview: false});
                            $('#fleet').combobox({
                                panelHeight: '120px',
                                data: jdata.data.DA_ENG_TYPE,
                                valueField: 'VALUE',
                                textField: 'TEXT'
                            });
                        } else if (item.VALUE == 'PART') { //部件
                            $('#fleet').combobox({onlyview: true});
                            $('#fleet').combobox('setValue', 'CM');
                        }
                    }
                });

                $("#ata").combobox({
                    panelHeight: '80px',
                    data: jdata.data.TD_ATA,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });

                $('#status').combobox({
                    panelHeight: '140px',
                    data: jdata.data.TD_JC_STATUS,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });

                $('#status').combobox({
                    value: "ISSUED",
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
        queryParams: {status: "ISSUED", jcType: param.jcType},
        pageSize: 15,
        columns: {
            param: {FunctionCode: funcode},
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
        validAuth: function (row, items) {
            items['PDF预览'].enable = true;
            return items;
        },
        contextMenus: [
            {
                id: "",
                i18nText: "PDF预览",
                auth: "",
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
                                    var type = rowData.JC_TYPE;
                                    jcPreview(url, type);
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
                    var jcListType = $("#jcType").combobox('getValue');
                    if ("EOJC" == jcListType) {
                        excelExport('dg', 'EO工卡清单', '');
                    } else if ("EAJC" == jcListType) {
                        excelExport('dg', 'EA工卡清单', '');
                    }
                }
            }
        ],
        onClickRow: function (rowIndex, rowData) {
        },
        onDblClickRow: function (index, field, value) {
            openDetai("view", value.PKID, value.JC_TYPE, value.JC_NO);
        }
    });
}

//刷新
function reload_() {
    $("#dg").datagrid("reload");
}

//打开资料类型详细页面
function openDetai(operation, pkid, jcType, jcNo, appType, fleet) {
    var title_;
    if ("EOJC" == jcType) {
        title_ = $.i18n.t('EO工卡详情');
    } else if ("EAJC" == jcType) {
        title_ = $.i18n.t('EA工卡详情');
    }

    ShowWindowIframe({
        width: "1100",
        height: "530",
        title: title_,
        param: {operation: operation, pkid: pkid, jcType: jcType, jcNo: jcNo, appType: appType, fleet: fleet},
        url: "/views/td/jobcard/eojc/tdEojcDetail.shtml"
    });
}

//查询
function searchData() {
    onSearch_('dg', '#ffSearch');
}

//重置
function doClear_() {
    $("#fleet").combobox("setValue", "");
    $("#jcNo").textbox("setValue", "");
    $("#subjectCn").textbox('setValue', '');
    $("#subjectEn").textbox('setValue', '');
    searchData();
}

function jcPreview(url, type) {
    var title_;
    if ("EOJC" == type) {
        title_ = $.i18n.t('EO工卡预览');
    } else if ("EAJC" == type) {
        title_ = $.i18n.t('EA工卡预览');
    }
    ShowWindowIframe({
        width: "850",
        height: "650",
        title: title_,
        param: {url: url},
        url: "/views/td/jobcard/smjc/smjcedit/jobcardPreview.shtml"
    });
}

function helpQuery(identity, functionCode, callback) {
    var jcType = $("#jcType").combobox('getValue');
    if ("EOJC" == jcType) {
        functionCode = "TD_JC_ALL_EOJC_LIST";
    } else if ("EAJC" == jcType) {
        functionCode = "TD_JC_ALL_EAJC_LIST";
    }
    ShowWindowIframe({
        width: 700,
        height: 420,
        title: '查询帮助',
        param: {identity: identity, functionCode: functionCode, callback: callback},
        url: '/views/query_help.shtml'
    });
}