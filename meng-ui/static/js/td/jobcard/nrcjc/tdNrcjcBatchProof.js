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
            domainCode: "DA_FLEET,TD_JC_STATUS,YESORNO,TD_JC_FROM_TO,TD_JC_MODEL,TD_JC_STATE,TD_JC_EXTEND,TD_JC_NRCJC_WRITER",
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
                    value: "PROOF",
                    onlyview: true,
                    editable: false
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
        queryParams: {status: "PROOF", writer: user.accountId},
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
                REVIEWED_DATE: {
                    type: 'date'
                },
                APPROVED_DATE: {
                    type: 'date'
                },
                PULIC_TIME_DATE: {
                    type: 'date'
                }
            }
        },
        onLoadSuccess: function () {

        },
        validAuth: function (row, items) {
            items['校对'].enable = true;
            items['退回'].enable = true;
            items['PDF预览'].enable = true;

            return items;
        },
        contextMenus: [

            {
                id: "", i18nText: "校对", auth: "TD_JC_NRCJC_PROOF_EDIT",
                onclick: function () {
                    var rowData = getDG('dg1').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }

                    common_add_edit_({
                        identity: '', isEdit: '', width: 520, height: 300, title: $.i18n.t('选择处理人'),
                        param: {
                            roleId: '',
                            pkIds: rowData.PKID,
                            FunctionCode_: 'TD_JC_ALL_NRCJC_BATCH_SUBMIT',
                            processNode: 'PROOF',
                            submitType: 'doSubmit',
                            successCallback: reload_
                        },
                        url: "/views/td/jobcard/nrcjc/td_Nrcjc_work_flow_batch_deal.shtml"
                    });
                }
            },
            {
                id: "", i18nText: "退回", auth: "TD_JC_NRCJC_PROOF_TURNBACK",
                onclick: function () {
                    var rowData = getDG('dg1').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }

                    common_add_edit_({
                        identity: '', isEdit: '', width: 520, height: 300, title: $.i18n.t('退回'),
                        param: {
                            roleId: '',
                            pkIds: rowData.PKID,
                            FunctionCode_: 'TD_JC_ALL_NRCJC_BATCH_RETURN',
                            submitType: 'doReturn',
                            successCallback: reload_
                        },
                        url: "/views/td/jobcard/nrcjc/td_Nrcjc_work_flow_batch_deal.shtml"
                    });
                }
            },
            {
                id: "m-previewpdf",
                i18nText: "PDF预览",
                auth: "TD_JC_NRCJC_PROOF_PDFVIEW",
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
                key: "COMMON_ADD",
                text: "批量校对",
                auth: "TD_JC_NRCJC_PROOF_EDIT",
                handler: function () {
                    var rowData = getDG('dg1').datagrid('getChecked');
                    if (rowData.length == 0) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }

                    var pkIds = [];
                    $.each(rowData, function (index, obj) {
                        pkIds.push(obj.PKID);
                    });

                    common_add_edit_({
                        identity: '', isEdit: '', width: 520, height: 300, title: $.i18n.t('选择处理人'),
                        param: {
                            roleId: '',
                            pkIds: pkIds.join(","),
                            FunctionCode_: 'TD_JC_ALL_NRCJC_BATCH_SUBMIT',
                            processNode: 'PROOF',
                            submitType: 'doSubmit',
                            successCallback: reload_
                        },
                        url: "/views/td/jobcard/nrcjc/td_Nrcjc_work_flow_batch_deal.shtml"
                    });
                }
            },
            {
                key: "COMMON_ADD",
                text: "批量退回",
                auth: "TD_JC_NRCJC_PROOF_TURNBACK",
                handler: function () {
                    var rowData = getDG('dg1').datagrid('getChecked');
                    if (rowData.length == 0) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }

                    var pkIds = [];
                    $.each(rowData, function (index, obj) {
                        pkIds.push(obj.PKID);
                    });

                    common_add_edit_({
                        identity: '', isEdit: '', width: 520, height: 300, title: $.i18n.t('退回'),
                        param: {
                            roleId: '',
                            pkIds: pkIds.join(","),
                            FunctionCode_: 'TD_JC_ALL_NRCJC_BATCH_RETURN',
                            submitType: 'doReturn',
                            successCallback: reload_
                        },
                        url: "/views/td/jobcard/nrcjc/td_Nrcjc_work_flow_batch_deal.shtml"
                    });
                }
            }
        ],
        onClickRow: function (rowIndex, rowData) {
        },
        onDblClickRow: function (index, field, value) {
            openEdit("view", value.PKID);
        }
    });
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

//刷新
function reload_() {
    $("#dg1").datagrid("reload");
}

//打开工卡详情页
function openEdit(operation, pkid) {
    var title_ = $.i18n.t('NRC工卡详情');
    var dataFrom = "";
    if (operation == "cmpadd") {
        dataFrom = "CMP";
    } else {
        dataFrom = "CUS";
    }
    ShowWindowIframe({
        width: "850",
        height: "650",
        title: title_,
        param: {pkid: pkid, type: operation, from: dataFrom},
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
        value: "PROOF"
    });
    $('#writer').combobox({
        value: user.accountId,
    });
    searchData();
}