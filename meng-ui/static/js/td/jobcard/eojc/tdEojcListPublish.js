var PAGE_DATA = {};
var param;

function i18nCallBack() {
    param = getParentParam_();
    //绑定回车查询事件
    bindFormonSearch_('#ffSearch', function () {
        searchData();
    });

    InitFuncCodeRequest_({
        data: {
            domainCode: "DA_FLEET,TD_JC_STATUS,YESORNO",
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

                $('#status').combobox({
                    panelHeight: '140px',
                    data: jdata.data.TD_JC_STATUS,
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
        queryParams: {status: "ISSUE", jcType: param.jcType},
        pageSize: 15,
        columns: {
            param: {FunctionCode: 'TD_JC_ALL_EAJC_LIST'},
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
            items['发布'].enable = true;
            // items['退回'].enable = true;
            items['PDF预览'].enable = true;

            return items;
        },
        contextMenus: [
            {
                id: "", i18nText: "发布",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (confirm("是否确认发布？")) {
                        InitFuncCodeRequest_({
                            data: {FunctionCode: 'TD_JC_ALL_EOJC_PUBLISH', pkid: rowData.PKID, jcType: rowData.JC_TYPE},
                            successCallBack: function (jdata) {
                                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                    MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                    reload_("dg");
                                } else {
                                    MsgAlert({content: jdata.msg, type: 'error'});
                                }
                            }
                        });
                    }
                }
            },
            // {
            //     id: "", i18nText: "退回",
            //     onclick: function () {
            //         var rowData = getDG('dg').datagrid('getSelected');
            //         if (!rowData.PKID) {
            //             MsgAlert({content: "请选择数据！", type: 'error'});
            //             return;
            //         }
            //         if (confirm("是否退回？")) {
            //             //打开注销或恢复页面
            //             var title_ = $.i18n.t('EO工卡发布退回');
            //             ShowWindowIframe({
            //                 width: "680",
            //                 height: "80",
            //                 title: title_,
            //                 param: {pkid: rowData.PKID},
            //                 url: "/views/td/jobcard/cmjc/tdCmjcPublishBack.shtml"
            //             });
            //         }
            //     }
            // },
            {
                id: "", i18nText: "PDF预览", auth: "",
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
        toolbar: [
            {
                key: "COMMON_ADD",
                text: "批量发布",
                auth: "TD_JC_EOJC_PUBLISH",
                handler: function () {
                    var rowData = getDG('dg').datagrid('getChecked');
                    if (rowData.length == 0) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (confirm("是否批量发布？")) {
                        $.each(rowData, function (index, obj) {
                            InitFuncCodeRequest_({
                                data: {FunctionCode: 'TD_JC_ALL_EOJC_PUBLISH', pkid: obj.PKID},
                                successCallBack: function (jdata) {
                                    if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                        MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                        reload_("dg");
                                    } else {
                                        MsgAlert({content: jdata.msg, type: 'error'});
                                    }
                                }
                            });
                        })
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

function jcPreview(url) {
    var title_ = $.i18n.t('EO工卡预览');
    ShowWindowIframe({
        width: "850",
        height: "650",
        title: title_,
        param: {url: url},
        url: "/views/td/jobcard/smjc/smjcedit/jobcardPreview.shtml"
    });
}