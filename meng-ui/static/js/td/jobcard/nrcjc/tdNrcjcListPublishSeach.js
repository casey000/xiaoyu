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
            domainCode: "DA_FLEET,TD_JC_STATUS,YESORNO,TD_JC_FROM_TO,TD_JC_MODEL,TD_JC_STATE,TD_JC_EXTEND," +
            "TD_JC_NRCJC_WRITER,TD_JC_NRCJC_PROOF_BY,TD_JC_NRCJC_REVIEWED_BY,TD_JC_NRCJC_APPROVED_BY,TD_JC_NRCJC_PUBLIC_BY,TD_ATA,DA_ENG_TYPE,TD_JC_APP_TYPE",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                //机队
                $('#fleet').combobox({
                    panelHeight: '140px',
                    data: jdata.data.DA_FLEET,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                //工卡流程状态
                $('#status').combobox({
                    panelHeight: '140px',
                    data: jdata.data.TD_JC_STATUS,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                //ETOPS
                $('#etops').combobox({
                    panelHeight: '50px',
                    data: jdata.data.YESORNO,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                //是否超期
                $('#isExtend').combobox({
                    panelHeight: '80px',
                    data: jdata.data.TD_JC_EXTEND,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                //项目来源
                $('#itemFrom').combobox({
                    panelHeight: '100px',
                    data: jdata.data.TD_JC_FROM_TO,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                //工卡类型
                $('#jcModel').combobox({
                    panelHeight: '140px',
                    data: jdata.data.TD_JC_MODEL,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                //工卡状态
                $('#jcStatus').combobox({
                    panelHeight: '50px',
                    data: jdata.data.TD_JC_STATE,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                //是否检出
                $('#cepCheckout').combobox({
                    panelHeight: '50px',
                    data: jdata.data.YESORNO,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                //编写人
                $('#writer').combobox({
                    panelHeight: '100px',
                    data: jdata.data.TD_JC_NRCJC_WRITER,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    value: user.accountId,
                    onlyview: true,
                    editable: false
                });

                $('#status').combobox({
                    value: "ISSUED",
                    onlyview: true,
                    editable: false
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

                //机队
                PAGE_DATA['fleet'] = DomainCodeToMap_(jdata.data["DA_FLEET"]);
                //工卡流程状态
                PAGE_DATA['status'] = DomainCodeToMap_(jdata.data["TD_JC_STATUS"]);
                //ETOPS
                PAGE_DATA['etops'] = DomainCodeToMap_(jdata.data["YESORNO"]);
                //是否超期
                PAGE_DATA['isExtend'] = DomainCodeToMap_(jdata.data["YESORNO"]);
                //项目来源
                PAGE_DATA['itemFrom'] = DomainCodeToMap_(jdata.data["TD_JC_FROM_TO"]);
                //工卡类型
                PAGE_DATA['jcModel'] = DomainCodeToMap_(jdata.data["TD_JC_MODEL"]);
                //工卡有效性
                PAGE_DATA['jcStatus'] = DomainCodeToMap_(jdata.data["TD_JC_STATE"]);
                //工序是否检出
                PAGE_DATA['cepCheckout'] = DomainCodeToMap_(jdata.data["YESORNO"]);
                //编写人
                PAGE_DATA['writer'] = DomainCodeToMap_(jdata.data["TD_JC_NRCJC_WRITER"]);

                //校对人
                PAGE_DATA['proofBy'] = DomainCodeToMap_(jdata.data["TD_JC_NRCJC_PROOF_BY"]);
                //审核人
                PAGE_DATA['reviewedBy'] = DomainCodeToMap_(jdata.data["TD_JC_NRCJC_REVIEWED_BY"]);
                //审批人
                PAGE_DATA['approvedBy'] = DomainCodeToMap_(jdata.data["TD_JC_NRCJC_APPROVED_BY"]);
                //发布人
                PAGE_DATA['publicBy'] = DomainCodeToMap_(jdata.data["TD_JC_NRCJC_PUBLIC_BY"]);

                InitDataGrid();
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}


function InitDataGrid() {
    var pageSize = Math.floor(($(document.body).height() - $("fieldset").height() - 185) / 50);
    $("#dg1").MyDataGrid({
        identity: 'dg1',
        sortable: true,
        singleSelect: true,
        queryParams: {status: "ISSUED"},
        pageSize: pageSize, pageList: [pageSize],
        resize: function () {
            return tabs_standard_resize($("#tt"), 0.13, 0.0001, 5, 4);
        },
        columns: {
            param: {FunctionCode: 'TD_JC_NRCJC_LIST'},
            alter: {
                TEST_UPLOAD: {},
                FLEET: {
                    formatter: function (value) {
                        return PAGE_DATA['fleet'][value];
                    }
                },
                STATUS: {
                    formatter: function (value) {
                        return PAGE_DATA['status'][value];
                    }
                },
                ETOPS: {
                    formatter: function (value) {
                        return PAGE_DATA['etops'][value];
                    }
                },
                ITEM_FROM: {
                    formatter: function (value) {
                        return PAGE_DATA['itemFrom'][value];
                    }
                },
                JC_MODEL: {
                    formatter: function (value) {
                        return PAGE_DATA['jcModel'][value];
                    }
                },
                JC_STATUS: {
                    formatter: function (value) {
                        return PAGE_DATA['jcStatus'][value];
                    }
                },
                CEP_CHECKOUT: {
                    formatter: function (value) {
                        return PAGE_DATA['cepCheckout'][value];
                    }
                },
                WRITER: {
                    formatter: function (value) {
                        return PAGE_DATA['writer'][value];
                    }
                },
                WRITE_LIMIT: {
                    type: 'date'
                },
                WRITE_DATE: {
                    type: 'date'
                },
                PROOF_BY: {
                    formatter: function (value) {
                        return PAGE_DATA['proofBy'][value];
                    }
                },
                PROOF_DATE: {
                    type: 'date'
                },
                REVIEWED_BY: {
                    formatter: function (value) {
                        return PAGE_DATA['reviewedBy'][value];
                    }
                },
                REVIEWED_DATE: {
                    type: 'date'
                },
                APPROVED_BY: {
                    formatter: function (value) {
                        return PAGE_DATA['approvedBy'][value];
                    }
                },
                APPROVED_DATE: {
                    type: 'date'
                },
                PUBLIC_BY: {
                    formatter: function (value) {
                        return PAGE_DATA['publicBy'][value];
                    }
                },
                PULIC_TIME_DATE: {
                    type: 'date'
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
                id: "m-nrcjcsearch",
                i18nText: "查看",
                auth: "TD_JC_NRCJC_SEARCH_QUERY",
                onclick: function () {
                    var rowData = getDG('dg1').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    openEdit("view", rowData.PKID);
                }
            },
            {
                id: "m-singelPreviewpdf",
                i18nText: "单机预览",
                // auth: "TD_JC_SMJC_PDFVIEW",
                onclick: function () {
                    var rowData = getDG('dg1').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (rowData.MOP_NO != null && rowData.MOP_NO != "" && rowData.MOP_NO != undefined) {
                        MsgAlert({content: "ME系统PDF路径有值，不能做单机预览！", type: 'error'});
                        return;
                    }
                    if (rowData.CEP_FILE_PATH == null || rowData.CEP_FILE_PATH == "") {
                        MsgAlert({content: "当前未查询到工序文件，无法预览。", type: 'error'});
                        return;
                    }
                    ShowWindowIframe({
                        width: "460",
                        height: "500",
                        param: {
                            jcId: rowData.PKID,
                            fleet: rowData.FLEET,
                            action: "EMSINGLEPREVIEW"
                        },
                        url: "/views/td/jobcard/tdAcnoChoose.shtml"
                    });
                }
            },
            {
                id: "m-pdfview",
                i18nText: "PDF预览",
                auth: "TD_JC_NRCJC_SEARCH_PDFVIEW",
                onclick: function () {
                    var rowData = getDG('dg1').datagrid('getSelected');
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
        toolbar: [
            {
                key: "COMMON_RELOAD",
                text: $.i18n.t('刷新'),
                handler: function () {
                    $("#dg1").datagrid("reload");
                }
            },
            {
                id: 'btnReload',
                text: $.i18n.t('导出excel'),
                iconCls: 'icon-page_excel',
                handler: function () {
                    excelExport('dg1', '标准非例行工卡清单', '');
                }
            }
        ],
        onClickRow: function (rowIndex, rowData) {
        },
        onDblClickRow: function (index, field, value) {
            openEdit("view", value.PKID, value.JC_NO, value.APP_TYPE, value.FLEET, value.CEP_CHECKOUT, value.CEP_FILE_PATH, value.COMPANY_CODE, value.JC_TYPE);
        }
    });
}

//刷新
function reload_() {
    $("#dg1").datagrid("reload");
}

//打开工卡详情页
function openEdit(operation, pkid, jcNo, appType, fleet, cepCheckout, cepFilePath, companyCode, jcType) {
    var title_ = $.i18n.t('NSJC工卡详情');
    var dataFrom = "";
    if (operation == "cmpadd") {
        dataFrom = "CMP";
    } else {
        dataFrom = "CUS";
    }
    ShowWindowIframe({
        width: "1430",
        height: "750",
        title: title_,
        param: {
            pkid: pkid,
            type: operation,
            from: dataFrom,
            jcNo: jcNo,
            appType: appType,
            fleet: fleet,
            cepCheckout: cepCheckout,
            cepFilePath: cepFilePath,
            companyCode: companyCode,
            jcType: jcType
        },
        url: "/views/td/jobcard/nrcjc/tdNrcjcEditDetail.shtml"
    });
}

//查询
function searchData() {
    onSearch_('dg1', '#ffSearch');
}

//重置
function doClear_() {
    $("#ffSearch").form('clear');
    $('#status').combobox({
        value: "ISSUED"
    });
    // $('#writer').combobox({
    //     value: user.accountId,
    // });
    searchData();
}

//PDF预览
function jcPreview(url) {
    var title_ = $.i18n.t('NRC工卡预览');
    ShowWindowIframe({
        width: "850",
        height: "650",
        title: title_,
        param: {url: url},
        url: "/views/td/jobcard/nrcjc/jobcardPreview.shtml"
    });
}