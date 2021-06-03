var PAGE_DATA = {};
var param;
var user;

function i18nCallBack() {
    param = getParentParam_();
    user = getLoginInfo();
    //绑定回车查询事件
    bindFormonSearch_('#ffSearch', function () {
        searchData('dg1', '#ffSearch');
    });

    InitFuncCodeRequest_({
        data: {
            domainCode: "DA_FLEET,TD_JC_STATUS,YESORNO,TD_JC_FROM_TO,TD_JC_MODEL,TD_JC_STATE,TD_JC_EXTEND,TD_JC_SMJC_WRITER," +
            "TD_JC_SMJC_PROOF_BY,TD_JC_SMJC_REVIEWED_BY,TD_JC_SMJC_APPROVED_BY",
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

                $('#status').combobox({
                    value: "ISSUE",
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
                PAGE_DATA['writer'] = DomainCodeToMap_(jdata.data["TD_JC_SMJC_WRITER"]);
                //校对人
                PAGE_DATA['proofBy'] = DomainCodeToMap_(jdata.data["TD_JC_SMJC_PROOF_BY"]);
                //审核人
                PAGE_DATA['reviewedBy'] = DomainCodeToMap_(jdata.data["TD_JC_SMJC_REVIEWED_BY"]);
                //审批人
                PAGE_DATA['approvedBy'] = DomainCodeToMap_(jdata.data["TD_JC_SMJC_APPROVED_BY"]);
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
        queryParams: {status: "ISSUE"},
        pageSize: pageSize, pageList: [pageSize],
        resize: function () {
            return tabs_standard_resize($("#tt"), 0.13, 0.0001, 5, 4);
        },
        columns: {
            param: {FunctionCode: 'TD_JC_SMJC_LIST'},
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
                PUBLIC_DATE: {
                    type: 'date'
                },
                APPROVED_DATE: {
                    type: 'date'
                }

            }
        },
        onLoadSuccess: function () {

        },
        validAuth: function (row, items) {

            // if (row.STATUS != 'EDIT' && row.STATUS != 'EDITED') {//只有在编写中才可以删除
            items['发布'].enable = true;
            // items['退回'].enable = true;
            // items['定时发布'].enable = true;
            items['PDF预览'].enable = true;
            // }

            return items;
        },
        contextMenus: [

            {
                id: "m-smjcpublish",
                i18nText: "发布",
                // auth: "TD_JC_SMJC_PUBLISH_EDIT",
                onclick: function () {
                    var rowData = getDG('dg1').datagrid('getSelected');
                    if (!rowData || !rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    InitFuncCodeRequest_({
                        data: {
                            FunctionCode: 'TD_JC_SMJC_PUBLISH',
                            pkid: rowData.PKID
                        },
                        successCallBack: function (jdata) {
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                reload_("dg1");
                            } else {
                                MsgAlert({content: jdata.msg, type: 'error'});
                            }
                        }
                    });
                }
            },
            // {
            //     id: "m-turnback",
            //     i18nText: "退回",
            //     // auth: "TD_JC_SMJC_PUBLISH_TURNBACK",
            //     onclick: function () {
            //         var rowData = getDG('dg1').datagrid('getSelected');
            //         if (!rowData.PKID) {
            //             MsgAlert({content: "请选择数据！", type: 'error'});
            //             return;
            //         }
            //         if (confirm("是否退回？")) {
            //             //打开注销或恢复页面
            //             var title_ = $.i18n.t('部件工卡发布退回');
            //             ShowWindowIframe({
            //                 width: "680",
            //                 height: "80",
            //                 title: title_,
            //                 param: {pkid: rowData.PKID},
            //                 url: "/views/td/jobcard/smjc/smjcedit/tdSmjcPublishBack.shtml"
            //             });
            //         }
            //     }
            // },
            // {
            //     i18nText: "定时发布",
            //     // auth: "TD_JC_SMJC_PUBLISH_EDIT",
            //     onclick: function () {
            //         var rowData = getDG('dg1').datagrid('getSelected');
            //         if (!rowData.PKID) {
            //             MsgAlert({content: "请选择数据！", type: 'error'});
            //             return;
            //         }
            //         if (rowData.PULIC_TIME_DATE != null && rowData.PULIC_TIME_DATE != "") {
            //             MsgAlert({content: "该数据已设置过定时任务!", type: 'error'});
            //             return;
            //         }
            //         ShowWindowIframe({
            //             width: "465",
            //             height: "350",
            //             title: "定时发布",
            //             param: {pkid: rowData.PKID, type: "Single"},
            //             url: "/views/td/jobcard/commonjc/TdJcTimerPublish.shtml"
            //         });
            //
            //     }
            // },
            {
                id: "m-pdfview",
                i18nText: "PDF预览",
                // auth: "TD_JC_SMJC_PUBLISH_PDFVIEW",
                onclick: function () {
                    var rowData = getDG('dg1').datagrid('getSelected');
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
                key: "COMMON_ADD",
                text: "批量发布",
                handler: function () {
                    var rowData = getDG('dg1').datagrid('getChecked');
                    if (rowData.length == 0) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    var pkid_ = '';
                    $.each(rowData, function (index, obj) {
                        if (rowData.length == index) {
                            pkid_ += obj.PKID;
                        } else {
                            pkid_ += obj.PKID + ",";
                        }
                    });
                    if (confirm("是否批量发布？")) {
                        InitFuncCodeRequest_({
                            data: {FunctionCode: 'TD_JC_ALL_SMJC_PUBLISH', pkid: pkid_},
                            successCallBack: function (jdata) {
                                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                    MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                    reload_("dg1");
                                } else {
                                    MsgAlert({content: jdata.msg, type: 'error'});
                                }
                            }
                        });
                    }
                }
            }
        //     // {
        //     //     key: "COMMON_ADD",
        //     //     text: "批量定时发布",
        //     //     // auth: "TD_JC_SMJC_PUBLISH_EDIT",
        //     //     handler: function () {
        //     //         var rowData = getDG('dg1').datagrid('getChecked');
        //     //
        //     //         if (rowData.length == 0) {
        //     //             MsgAlert({content: "请选择数据！", type: 'error'});
        //     //             return;
        //     //         }
        //     //
        //     //         var flag = true;
        //     //         $.each(rowData, function (index, obj) {
        //     //             if (obj.PULIC_TIME_DATE != null && obj.PULIC_TIME_DATE != "") {
        //     //                 MsgAlert({content: "该数据已设置过定时任务!", type: 'error'});
        //     //                 flag = false;
        //     //
        //     //             }
        //     //         });
        //     //         if (flag == true) {
        //     //             var ids = "";
        //     //             $.each(rowData, function (index, obj) {
        //     //                 if (index == rowData.length - 1) {
        //     //                     ids += obj.PKID;
        //     //                 }
        //     //                 else {
        //     //                     ids += obj.PKID + ",";
        //     //                 }
        //     //             });
        //     //             ShowWindowIframe({
        //     //                 width: "465",
        //     //                 height: "350",
        //     //                 title: "定时发布",
        //     //                 param: {pkid: ids, type: "Multiple"},
        //     //                 url: "/views/td/jobcard/commonjc/TdJcTimerPublish.shtml"
        //     //             });
        //     //
        //     //         }
        //     //     }
        //     // },
        //     {
        //         key: "COMMON_ADD",
        //         text: "重新存档",
        //         // auth: "TD_JC_SMJC_TEMPLATE",
        //         handler: function () {
        //             var rowData = getDG('dg1').datagrid('getChecked');
        //             if (rowData.length == 0) {
        //                 MsgAlert({content: "请选择数据！", type: 'error'});
        //                 return;
        //             }
        //             if (confirm("是否重新打印？")) {
        //                 $.each(rowData, function (index, obj) {
        //                     InitFuncCodeRequest_({
        //                         data: {FunctionCode: 'TD_JC_REPEAT_TEMPLATE', pkid: obj.PKID},
        //                         successCallBack: function (jdata) {
        //                             if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
        //                                 MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
        //                                 reload_("dg1");
        //                             } else {
        //                                 MsgAlert({content: jdata.msg, type: 'error'});
        //                             }
        //                         }
        //                     });
        //                 })
        //             }
        //         }
        //     }
        ],
        onClickRow: function (rowIndex, rowData) {
        },
        onDblClickRow: function (index, field, value) {
            openEdit("view", value.PKID, value.CMP_ITEM_NO, value.FLEET, value.COMPANY_CODE, value.JC_TYPE, value.JC_NO);
        }
    });
}

//刷新
function reload_() {
    $("#dg1").datagrid("reload");
}

//打开工卡详情页
function openEdit(operation, pkid, cmpNo, fleet, companyCode, jcType, jcNo, cepCheckout, cepFilePath, appType) {
    var title_ = $.i18n.t('定检工卡详情');
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
            cmpNo: cmpNo,
            fleet: fleet,
            companyCode: companyCode,
            jcType: jcType,
            jcNo: jcNo,
            cepCheckout: cepCheckout,
            cepFilePath: cepFilePath,
            operation: operation,
            appType: appType
        },
        url: "/views/td/jobcard/smjc/smjcedit/tdSmjcEditDetail.shtml"
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
        value: "ISSUE"
    });
    searchData();
}

function jcPreview(url) {
    var title_ = $.i18n.t('定检工卡预览');
    ShowWindowIframe({
        width: "850",
        height: "650",
        title: title_,
        param: {url: url},
        url: "/views/td/jobcard/smjc/smjcedit/jobcardPreview.shtml"
    });
}