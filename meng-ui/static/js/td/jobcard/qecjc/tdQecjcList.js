var PAGE_DATA = {};

function i18nCallBack() {
    //绑定回车查询事件
    bindFormonSearch_('#ffSearch', function () {
        searchData()
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
                PAGE_DATA['ifRii'] = DomainCodeToMap_(jdata.data["YESORNO"]);//状态

                //机队
                $('#fleet').combobox({
                    panelHeight: '140px',
                    data: jdata.data.DA_FLEET,
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

                //是否必检
                $('#ifRii').combobox({
                    panelHeight: '80px',
                    data: jdata.data.YESORNO,
                    valueField: 'VALUE',
                    textField: 'TEXT'
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
            // if (row.STATUS != "TURNBACK") {
            //     if (row.STATUS != 'EDIT' && row.STATUS != 'EDITED') {//已编写后可进行修订
            //         items['编辑'].enable = false;
            //     }
            //     if (row.STATUS != 'EDIT' && row.STATUS != 'EDITED') {//已编写/已修订后可进行提交
            //         items['提交'].enable = false;
            //     }
            //     if (row.STATUS != 'EDIT' && row.STATUS != 'EDITED') {//只有在编写中才可以删除
            //         items['删除'].enable = false;
            //     }
            //
            //     items['改版'].enable = false;
            //     if (row.STATUS == 'ISSUED') {
            //         items['改版'].enable = true;
            //     }
            //     if (row.STATUS == '05' || row.STATUS == '06' || row.STATUS == '07') {//状态为已归档，已注销，待生效时，取消按钮不可用
            //         items['PDF预览'].enable = true;
            //     }
            //     // if(row.STATUS == '05' || row.STATUS == '06' || row.STATUS == '07'){//状态为已归档，已注销，待生效时，取消按钮不可用
            //     // items['PC端预览'].enable = true;
            //     // }
            //
            //     items['流程图'].enable = false;
            //     items['办理轨迹'].enable = false;
            //     if (row.STATUS == "PROOF" || row.STATUS == "RATIFY" || row.STATUS == "AUDIT") {
            //         items['流程图'].enable = true;
            //     }
            //     if (row.STATUS == "PROOF" || row.STATUS == "ISSUED" || row.STATUS == "ISSUE" || row.STATUS == "RATIFY" || row.STATUS == "AUDIT") {//状态为已归档，已注销，待生效时，取消按钮不可用
            //         items['办理轨迹'].enable = true;
            //     }
            // } else {
            //     items['修订'].enable = false;
            //     items['提交'].enable = false;
            //     items['删除'].enable = false;
            //     items['改版'].enable = false;
            //     items['PDF预览'].enable = false;
            //     // items['PC端预览'].enable = false;
            //     items['流程图'].enable = false;
            //     items['办理轨迹'].enable = false;
            // }


            var user = getLoginInfo();
            if (row.WRITER == user.accountId) {
                if (row.STATUS != "EDIT") {
                    items['编辑'].enable = false;
                    items['删除'].enable = false;
                }
                if (row.STATUS != "EDIT") {
                    items['提交'].enable = false;
                }
                // if (row.STATUS != 'EDIT' && row.STATUS != "EDITED") {
                //     items['编辑'].enable = false;
                //     items['删除'].enable = false;
                // }
                // if (row.STATUS != 'ISSUED') {
                //     items['退回'].enable = false;
                // }

                items['改版'].enable = false;
                if (row.STATUS == 'ISSUED') {
                    items['改版'].enable = true;
                }

                // items['拆分'].enable = false;
                // if (row.STATUS == "EDIT" || row.STATUS == "EDITED") {
                //     items['拆分'].enable = true;
                // }
            } else {
                items['编辑'].enable = false;
                // items['修订完成'].enable = false;
                // items['拆分'].enable = false;
                items['删除'].enable = false;
                items['提交'].enable = false;
                // items['退回'].enable = false;
                items['改版'].enable = false;
            }

            items['流程图'].enable = false;
            items['办理轨迹'].enable = false;
            if (row.STATUS == "PROOF" || row.STATUS == "RATIFY" || row.STATUS == "AUDIT" || row.STATUS == "TURNBACK" || row.STATUS == "ISSUED" || row.STATUS == "ISSUE" || row.STATUS == "PRINT" || row.STATUS == "ARCHIVED") {
                items['流程图'].enable = true;
                items['办理轨迹'].enable = true;
            }


            return items;
        },
        contextMenus: [
            {
                id: "m-edit", i18nText: "编辑",
                // auth: "TD_JC_QECJC_EDIT_HANDLE",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    openDetai('edit', rowData.PKID);
                }
            },
            {
                id: "", i18nText: "提交",
                // auth: "TD_JC_QECJC_EDIT_HANDLE",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }

                    if (rowData.CEP_FILE_PATH == null || rowData.CEP_FILE_PATH == "") {
                        MsgAlert({content: "当前没有工序文件，不能进行提交。", type: 'error'});
                        return;
                    }

                    if (rowData.CEP_CHECKOUT != "" && rowData.CEP_CHECKOUT == "Y") {
                        MsgAlert({content: "当前文件已被检出，不能进行提交。", type: 'error'});
                        return;
                    }


                    datas = $.extend({}, {}, {FunctionCode: 'TD_JC_ALL_QECJC_STATUS', pkid: rowData.PKID});
                    InitFuncCodeRequest_({
                        data: datas, successCallBack: function (jdata) {
                            if (jdata.data != null) {
                                common_add_edit_({
                                    identity: '', isEdit: '', width: 520, height: 300, title: $.i18n.t('选择审批人'),
                                    param: {
                                        roleId: '',
                                        otherParam: rowData.PKID,
                                        FunctionCode_: 'TD_JC_ALL_QECJC_SUBMIT',
                                        successCallback: reload_
                                    },
                                    url: "/views/em/workflow/work_flow_account_select.shtml"
                                });
                            } else {
                                MsgAlert({content: "该数据已被提交过了。", type: 'error'});
                            }
                        }
                    });

                }
            },
            {
                id: "", i18nText: "删除",
                // auth: "TD_JC_QECJC_EDIT_HANDLE",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (confirm("是否确认删除？")) {
                        InitFuncCodeRequest_({
                            data: {FunctionCode: 'TD_JC_ALL_QECJC_DELETE', pkid: rowData.PKID},
                            successCallBack: function (jdata) {
                                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                    MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                    reload_();
                                }
                            }
                        });
                    }
                }
            },
            {
                id: "", i18nText: "改版",
                // auth: "TD_JC_QECJC_EDIT_REVISION",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }

                    //对已发布的数据进行改版，并且新增一条编写中的数据
                    var jcNo = rowData.JC_NO.substring(0, rowData.JC_NO.lastIndexOf("-") + 1) + (rowData.VER + 1);
                    InitFuncCodeRequest_({
                        data: {jcNo: jcNo, FunctionCode: "TD_JC_ALL_QECJC_BEFOR_AMEND"},
                        successCallBack: function (jdata) {
                            if (jdata.data.length == 0) {
                                if (confirm("是否确认改版？")) {
                                    //打开注销或恢复页面
                                    var title_ = $.i18n.t('飞机改版信息');
                                    ShowWindowIframe({
                                        width: "680",
                                        height: "80",
                                        title: title_,
                                        param: {pkid: rowData.PKID},
                                        url: "/views/td/jobcard/qecjc/tdQecjcAmend.shtml"
                                    });
                                }
                            } else {
                                MsgAlert({content: "该数据已改版过了。", type: 'error'});

                            }
                        }
                    });
                }
            },
            {
                id: "", i18nText: "PDF预览",
                auth: "TD_JC_QECJC_EDIT_VIEW",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (rowData.CEP_FILE_PATH == null || rowData.CEP_FILE_PATH == "") {
                        MsgAlert({content: "当前未查询到工序文件，无法预览。", type: 'error'});
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
            },
            {
                id: "", i18nText: "流程图", auth: "",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }

                    var userInfo = getLoginInfo();

                    if (rowData.STATUS == "PROOF" || rowData.STATUS == "RATIFY" || rowData.STATUS == "AUDIT" || rowData.STATUS == "TURNBACK") {
                        //获取当前在流程中的流程图，需要使用 pkid进行关联
                        InitFuncCodeRequest_({
                            data: {
                                FunctionCode: 'TD_JC_ALL_PROCESS',
                                objNo: rowData.PKID,
                                objKey: "TD_JC_ALL"
                            },
                            successCallBack: function (jdata) {
                                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                    ShowWindowIframe({
                                        width: "850",
                                        height: "650",
                                        title: "查看流程图",
                                        param: {
                                            PROC_DEF_ID: jdata.data.PROC_DEF_ID,
                                            PROC_INST_ID: jdata.data.PROC_INST_ID,
                                            BUSINESS_KEY: jdata.data.BUSINESS_KEY
                                        },
                                        url: "/views/ws/work_flow/flow_definition/flow_diagram_view.shtml"
                                    });
                                }
                            }
                        });
                    } else if (rowData.STATUS == "ARCHIVED" || rowData.STATUS == "ISSUED" || rowData.STATUS == "ISSUE" || rowData.STATUS == "PRINT" || rowData.STATUS == "PRINT") {
                        //获取整个流程最新的流程图有多个流程实例，使用最新的流程
                        InitFuncCodeRequest_({
                            data: {
                                FunctionCode: 'TD_JC_ALL_GET_PROC_DEF_ID',
                                flow_key: "tdSmjcFlow",//流程定义Key/流程Key
                            },
                            successCallBack: function (jdata) {
                                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                    ShowWindowIframe({
                                        width: "850",
                                        height: "650",
                                        title: "查看流程图",
                                        param: {PROC_DEF_ID: jdata.data.PROC_DEF_ID},
                                        url: "/views/ws/work_flow/flow_definition/flow_definition_diagram_view.shtml"
                                    });
                                }
                            }
                        });
                    }

                }
            },
            {
                id: "", i18nText: "办理轨迹", auth: "",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    ShowWindowIframe({
                        width: 1100,
                        height: 400,
                        title: $.i18n.t('审批轨迹'),
                        param: {objNo: rowData.PKID, objKey: "TD_JC_ALL"},
                        url: '/views/em/workflow/work_flow_history_task_list.shtml'
                    });
                }
            }
        ],
        toolbar: [
            {
                key: "COMMON_ADD",
                text: $.i18n.t('common:COMMON_OPERATION.ADD'),
                // auth: "TD_JC_QECJC_EDIT_HANDLE",
                handler: function () {
                    openDetai("save", "");//打开新增页面
                }
            },
            {
                key: "COMMON_RELOAD",
                text: $.i18n.t('common:COMMON_OPERATION.RELOAD'),
                handler: function () {
                    reload_();
                }
            }
            ,
            {
                key: "COMMON_ADD",
                text: $.i18n.t('批量提交'),
                // auth: "TD_JC_QECJC_EDIT_SUMIT",
                handler: function () {
                    var rowData = getDG('dg').datagrid('getChecked');
                    if (rowData.length == 0) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    var flag = true;
                    var user = getLoginInfo();
                    $.each(rowData, function (index, obj) {

                        if (obj.WRITER != user.accountId) {
                            MsgAlert({content: "无法操作该条数据[ " + obj.SUBJECT_CN + " ]，权限不够。", type: 'error'});
                            flag = false;
                            return;
                        }

                        if (obj.STATUS != "EDIT" && obj.STATUS != "EDITED") {
                            MsgAlert({content: "批量提交只能提交 [编写中，修订完成] 的数据。", type: 'error'});
                            flag = false;
                            return;
                        }

                        if (obj.CEP_FILE_PATH == null || obj.CEP_FILE_PATH == "") {
                            MsgAlert({content: "当前没有工序文件，不能进行提交。", type: 'error'});
                            flag = false;
                            return;
                        }

                        if (obj.CEP_CHECKOUT != "" && obj.CEP_CHECKOUT == "Y") {
                            MsgAlert({content: "当前文件已被检出，不能进行提交。", type: 'error'});
                            flag = false;

                        }

                    });
                    if (flag == true) {
                        if (confirm("是否批量提交？")) {
                            var ids = "";
                            $.each(rowData, function (index, obj) {
                                if (index == rowData.length - 1) {
                                    ids += obj.PKID;
                                }
                                else {
                                    ids += obj.PKID + ",";
                                }
                            });

                            common_add_edit_({
                                identity: '', isEdit: '', width: 520, height: 300, title: $.i18n.t('选择审批人'),
                                param: {
                                    roleId: '',
                                    otherParam: ids,
                                    FunctionCode_: 'TD_JC_ALL_QECJC_SUBMIT',
                                    successCallback: reload_
                                },
                                url: "/views/td/jobcard/qecjc/td_qecjc_work_flow_account_select.shtml"
                            });
                        }
                    }

                }
            },
            {
                id: 'btnExcel',
                text: $.i18n.t('导出excel'),
                iconCls: 'icon-add',
                // auth: "TD_JC_QECJC_EDIT_HANDLE",
                handler: function () {
                    excelExport('dg', 'QEC工卡编写', {}, function () {
                        return {'PAGE_DATA': PAGE_DATA}
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
    var title_ = $.i18n.t('QEC工卡详情');
    ShowWindowIframe({
        width: "740",
        height: "640",
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