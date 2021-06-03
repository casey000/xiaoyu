var PAGE_DATA = {};
var user;
var hiddenBatchDelete = true;

function i18nCallBack() {
    //绑定回车查询事件
    bindFormonSearch_('#ffSearch1', function () {
        onSearch_('dg1', '#ffSearch1');
    });
    user = getLoginInfo();
    InitFuncCodeRequest_({
        data: {
            domainCode: "TD_JC_APP_TYPE,DA_FLEET,TD_JC_STATUS,YESORNO,TD_JC_FROM_TO,TD_JC_MODEL,TD_JC_STATE,TD_JC_EXTEND,TD_JC_NRCJC_WRITER,TD_JC_NRCJC_PROOF_BY,TD_JC_NRCJC_REVIEWED_BY,TD_JC_NRCJC_APPROVED_BY,TD_JC_NRCJC_PUBLIC_BY,TD_JC_CHECKLEVEL,TD_JC_CHANGE_FLAG",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                //适用类型
                $('#appType').combobox({
                    panelHeight: '80px',
                    data: jdata.data.TD_JC_APP_TYPE,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                //机队
                $('#fleet').combobox({
                    panelHeight: '140px',
                    data: jdata.data.DA_FLEET,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    onChange: function () {
                        var fleet = $("#fleet").textbox('getValue');
                        InitFuncCodeRequest_({
                            data: {
                                fleet: fleet,
                                domainCode: 'TD_JC_NRCJC_GET_JOBCARD_VER',
                                FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
                            },
                            successCallBack: function (jdata1) {
                                if (jdata1.code == RESULT_CODE.SUCCESS_CODE) {

                                }
                            }
                        });
                    }
                });
                //工卡流程状态
                $('#status').combobox({
                    panelHeight: '140px',
                    data: jdata.data.TD_JC_STATUS,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    value: 'EDIT'
                });
                //是否必检
                $('#ifRii').combobox({
                    panelHeight: '80px',
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
                /* $('#jcModel').combobox({
                 panelHeight: '140px',
                 data: jdata.data.TD_JC_MODEL,
                 valueField: 'VALUE',
                 textField: 'TEXT'
                 });*/
                $('#changeFlag').combobox({
                    panelHeight: '140px',
                    data: jdata.data.TD_JC_CHANGE_FLAG,
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
                //设置显示当前登录人数据

                //编写人
                $('#writer').combobox({
                    panelHeight: '100px',
                    data: jdata.data.TD_JC_NRCJC_WRITER,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    value: user.accountId
                });


                //机队
                // PAGE_DATA['fleet'] = DomainCodeToMap_(jdata.data["DA_FLEET"]);
                //工卡流程状态
                PAGE_DATA['status'] = DomainCodeToMap_(jdata.data["TD_JC_STATUS"]);
                //检验级别
                PAGE_DATA['checkLevel'] = DomainCodeToMap_(jdata.data["TD_JC_CHECKLEVEL"]);
                //是否必检
                PAGE_DATA['ifRii'] = DomainCodeToMap_(jdata.data["YESORNO"]);
                //是否超期
                PAGE_DATA['isExtend'] = DomainCodeToMap_(jdata.data["YESORNO"]);
                //项目来源
                PAGE_DATA['itemFrom'] = DomainCodeToMap_(jdata.data["TD_JC_FROM_TO"]);
                //工卡类型
                PAGE_DATA['jcModel'] = DomainCodeToMap_(jdata.data["TD_JC_MODEL"]);
                //修订标识
                PAGE_DATA['changeFlag'] = DomainCodeToMap_(jdata.data["TD_JC_CHANGE_FLAG"]);
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

                //工卡清单
                InitDataGrid();
                // //受影响清单
                // initJCAff();
                // //未受影响清单
                // initJCNoAff();
                // //未升级手册清单
                // initJCManual();
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

function InitDataGrid() {
    var pageSize = Math.floor(($(document.body).height() - $("fieldset").height() - 185) / 50);
    $("#dg1").MyDataGrid({
        identity: "dg1",
        sortable: true,
        singleSelect: true,
        pageSize: pageSize, pageList: [pageSize],
        queryParams: {writer: user.accountId, status: 'EDIT'},
        resize: function () {
            return tabs_standard_resize($("#tt"), 0.13, 0.0001, 5, 4);
        },
        columns: {
            param: {FunctionCode: 'TD_JC_LAST_COMPANY_NRCJC_LIST'},
            alter: {
                TEST_UPLOAD: {},
                // FLEET: {
                //     formatter: function (value) {
                //         return PAGE_DATA['fleet'][value];
                //     }
                // },
                STATUS: {
                    formatter: function (value) {
                        return PAGE_DATA['status'][value];
                    }
                },
                CHECK_LEVEL: {
                    formatter: function (value) {
                        return PAGE_DATA['checkLevel'][value];
                    }
                },
                IF_RII: {
                    formatter: function (value) {
                        return PAGE_DATA['ifRii'][value];
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
                CHANGE_FLAG: {
                    formatter: function (value) {
                        return PAGE_DATA['changeFlag'][value];
                    }
                },
                JC_STATUS: {
                    formatter: function (value) {
                        if ("N" == value) {
                            return "<lable style='background-color:red;'><font color='white'>" + PAGE_DATA['jcStatus'][value] + "</font></lable>";
                        } else {
                            return PAGE_DATA['jcStatus'][value];
                        }
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
                PROOF_BY: {
                    formatter: function (value) {
                        return PAGE_DATA['proofBy'][value];
                    }
                },
                REVIEWED_BY: {
                    formatter: function (value) {
                        return PAGE_DATA['reviewedBy'][value];
                    }
                },
                APPROVED_BY: {
                    formatter: function (value) {
                        return PAGE_DATA['approvedBy'][value];
                    }
                },
                PUBLIC_BY: {
                    formatter: function (value) {
                        return PAGE_DATA['publicBy'][value];
                    }
                },

                WRITE_LIMIT: {
                    type: 'date'
                },
                WRITE_DATE: {
                    type: 'datetime'
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
        contextMenus: [
            {
                id: "m-edit",
                i18nText: "编辑",
                auth: "TD_NSJC_LIST_EDIT",
                onclick: function () {
                    var rowData = getDG('dg1').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    openEdit("edit", rowData.PKID, rowData.JC_NO, rowData.APP_TYPE, rowData.FLEET, rowData.CEP_CHECKOUT, rowData.CEP_FILE_PATH, rowData.COMPANY_CODE, rowData.JC_TYPE, rowData.STATUS);
                }
            },
            {
                id: "m-copy",
                i18nText: "工卡转发",
                auth: "TD_NSJC_RETRANS",
                onclick: function () {
                    var rowData = getDG('dg1').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }

                    var title_ = $.i18n.t('工卡转发');
                    ShowWindowIframe({
                        width: "527",
                        height: "270",
                        title: title_,
                        param: {pkid: rowData.PKID},
                        url: "/views/td/jobcard/nrcjc/tdNrcjcForward.shtml"
                    });
                }
            },
            {
                id: "m-amend",
                i18nText: "改版",
                auth: "TD_NSJC_AMEND",
                onclick: function () {
                    var rowData = getDG('dg1').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    ajaxLoading();
                    InitFuncCodeRequest_({
                        data: {jcNo: rowData.JC_NO, ver: rowData.VER + 1, FunctionCode: "TD_JC_ALL_NRCJC_BEFOR_AMEND"},
                        successCallBack: function (jdata) {
                            ajaxLoadEnd();
                            if (jdata.data.length == 0) {
                                if (confirm("是否确认改版？")) {
                                    InitFuncCodeRequest_({
                                        data: {
                                            pkid: rowData.PKID,
                                            type: "amend",
                                            FunctionCode: "TD_JC_ALL_NRCJC_AMEND"
                                        },
                                        successCallBack: function (jdata) {
                                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                                reload_();
                                                MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                                CloseWindowIframe();
                                            }
                                        }
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
                id: "m-nrcjcpublish",
                i18nText: "发布",
                auth: "TD_NSJC_PUBLISH",
                onclick: function () {
                    var rowData = getDG('dg1').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (confirm("是否确认发布？")) {
                        InitFuncCodeRequest_({
                            data: {FunctionCode: 'TD_JC_ALL_NRCJC_PUBLISH', pkid: rowData.PKID},
                            successCallBack: function (jdata) {
                                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                    MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                    reload_();
                                } else {
                                    MsgAlert({content: jdata.msg, type: 'error'});
                                }
                            }
                        });
                    }
                }
            },
            {
                id: "m-submit",
                i18nText: "提交",
                auth: "TD_NSJC_SUBMIT",
                onclick: function () {
                    var rowData = getDG('dg1').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (rowData.STATUS != "EDITED") {
                        MsgAlert({content: "提交只能提交 【修订完成】的数据。", type: 'error'});
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
                    //校验编写期限是否到期
                    var curJcWriteLimit = rowData.WRITE_LIMIT;
                    InitFuncCodeRequest_({
                        data: {curJcWriteLimit: curJcWriteLimit, FunctionCode: "TD_CHECK_WRITE_LIMIT_IF_EXPIRE"},
                        successCallBack: function (jdata) {
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                if (!confirm("确认提交该记录？")) {
                                    return;
                                }
                                datas = $.extend({}, {}, {FunctionCode: 'TD_JC_ALL_NSJC_STATUS', pkid: rowData.PKID});
                                InitFuncCodeRequest_({
                                    data: datas, successCallBack: function (jdata) {
                                        if (jdata.data == null) {
                                            common_add_edit_({
                                                identity: '',
                                                isEdit: '',
                                                width: 520,
                                                height: 300,
                                                title: $.i18n.t('选择审批人'),
                                                param: {
                                                    roleId: '',
                                                    otherParam: rowData.PKID,
                                                    FunctionCode_: 'TD_JC_ALL_NRCJC_SUMBIT',
                                                    successCallback: reload_,
                                                    flowKey: "tdNrcjcFlow"
                                                },
                                                url: "/views/em/workflow/work_flow_account_select.shtml"
                                            });
                                        } else {
                                            MsgAlert({content: "该数据已被提交过了。", type: 'error'});
                                        }
                                    }
                                });
                            } else {
                                MsgAlert({content: jdata.msg, type: 'error'});
                            }
                        }
                    })
                }
            },
            {
                id: "m-delete",
                i18nText: "删除",
                auth: "TD_NSJC_DELETE",
                onclick: function () {


                    var rowData = getDG('dg1').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (!confirm("确认删除该记录？")) {
                        return;
                    }
                    InitFuncCodeRequest_({
                        data: {pkid: rowData.PKID, FunctionCode: 'TD_JC_NRCJC_DELETE'},
                        successCallBack: function (jdata) {
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                $("#dg1").datagrid("reload");
                            } else {
                                MsgAlert({content: jdata.msg, type: 'error'});
                            }
                        }
                    });
                }
            },
            {
                id: "m-wfchart",
                i18nText: "流程图",
                onclick: function () {
                    var rowData = getDG('dg1').datagrid('getSelected');
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
                                flow_key: "tdNrcjcFlow",//流程定义Key/流程Key
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
            }, {
                id: "m-wftrack",
                i18nText: "办理轨迹",
                onclick: function () {
                    var rowData = getDG('dg1').datagrid('getSelected');
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
            }, {
                id: "m-previewpdf",
                i18nText: "PDF预览",
                auth: "TD_NSJC_PDF_PREVIEW",
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
            },
            {
                id: "m-singelPreviewpdf",
                i18nText: "单机预览",
                auth: "TD_NSJC_SINGLE_PDF_PREVIEW",
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
                id: "m-previewArbortext",
                i18nText: "Arbortext预览",
                auth: "",
                onclick: function () {
                    var rowData = getDG('dg1').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (rowData.CEP_FILE_PATH == undefined || rowData.CEP_FILE_PATH == null || rowData.CEP_FILE_PATH == '') {
                        MsgAlert({content: "当前未查询到工序文件，无法预览!", type: 'error'});
                        return;
                    }
                    var userInfo = getLoginInfo();
                    var cepPath = "";
                    //获取最新的工序文件
                    InitFuncCodeRequest_({
                        data: {jcPkid: rowData.PKID, FunctionCode: 'TD_JC_GET_LATEST_CEP_BY_JCID'},
                        async: false,
                        successCallBack: function (jdata) {
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                if (jdata.data != null) {
                                    cepPath = jdata.data.CEP_PATH;
                                } else {
                                    MsgAlert({content: "当前未查询到工序文件，无法预览!", type: 'error'});
                                }
                            } else {
                                MsgAlert({content: jdata.msg ? jdata.msg : jdata.data, type: 'error'});
                            }
                        }
                    });
                    var i = cepPath.lastIndexOf("/");
                    var fileName = cepPath.slice(i + 1).replace(".xml", "");
                    var protocol = window.location.protocol;
                    var newProtocol = protocol.substring(0, protocol.length - 1);
                    var ip = window.location.hostname;
                    var pathName = window.location.pathname;
                    var port = window.location.port;
                    var controllerName = "jobcardcepcon/downcepfile";
                    var userName = "";
                    if (userInfo == null || userInfo == undefined || userInfo == '') {
                        userName = rowData.WRITER;
                    } else {
                        userName = userInfo.userName;
                    }
                    var openMode = "0";
                    var type = "JOBCARD";
                    var includeGnbr = "true";
                    var companyCode = "SFN";
                    var manual = "BULK";
                    var command = cepPath + ";" + fileName + ";"
                        + newProtocol + ";" + ip + ";" + port + ";" + controllerName + ";"
                        + userName + ";" + openMode + ";" + type + ";" + includeGnbr
                        + ";" + rowData.REFDATA_TYPE + ";" + rowData.REF_DATA + ";" + companyCode
                        + ";" + rowData.FLEET + ";" + rowData.PKID + ";" + manual;
                    console.log(command);
                    window.location.href = "openEditor:" + command;
                }
            }
        ],
        validAuth: function (row, items) {
            var user = getLoginInfo();
            // if (row.WRITER == user.accountId || user.accountId == '1') {
            // if (row.STATUS != "EDIT") {
            //     items['修订完成'].enable = false;
            // }
            if (row.STATUS != "EDITED") {
                items['提交'].enable = false;
            }
            if (row.STATUS != 'EDIT' && row.STATUS != "EDITED") {
                items['编辑'].enable = false;
                items['删除'].enable = false;
            }
            // if (row.STATUS != 'ISSUED') {
            //     items['退回'].enable = false;
            // }

            items['改版'].enable = false;
            if (row.STATUS == 'ISSUED') {
                items['改版'].enable = true;
            }

            items['发布'].enable = false;
            if (row.STATUS == 'ISSUE') {
                items['发布'].enable = true;
            }

            // items['拆分'].enable = false;
            // if (row.STATUS == "EDIT" || row.STATUS == "EDITED") {
            //     items['拆分'].enable = true;
            // }

            items['工卡转发'].enable = false;
            if (row.STATUS == "EDIT" || row.STATUS == "EDITED") {
                items['工卡转发'].enable = true;
            }

            if (row.APP_TYPE != "APL") {
                items['单机预览'].enable = false;
            }
            // } else {
            //     items['编辑'].enable = false;
            //     items['修订完成'].enable = false;
            //     // items['拆分'].enable = false;
            //     // items['工卡转发'].enable = false;
            //     items['提交'].enable = false;
            //     items['删除'].enable = false;
            //     // items['退回'].enable = false;
            //     items['改版'].enable = false;
            // }

            items['流程图'].enable = false;
            // items['办理轨迹'].enable = false;
            // if (row.STATUS == "PROOF" || row.STATUS == "RATIFY" || row.STATUS == "AUDIT" || row.STATUS == "TURNBACK" || row.STATUS == "ISSUED" || row.STATUS == "ISSUE" || row.STATUS == "PRINT" || row.STATUS == "ARCHIVED") {
            if (row.STATUS == "RATIFY" || row.STATUS == "AUDIT" || row.STATUS == "ISSUED" || row.STATUS == "PRINT" || row.STATUS == "ARCHIVED") {
                items['流程图'].enable = true;
            }
            // items['办理轨迹'].enable = true;
            // }
            return items;
        },
        toolbar: [
            //     {
            //     id: 'btnAdd',
            //     text: $.i18n.t('批量提交'),
            //     iconCls: 'icon-add',
            //     handler: function () {
            //         batchSubmit();
            //     }
            // },
            //
            // {
            //     id: 'btnAdd',
            //     text: $.i18n.t('批量删除'),
            //     iconCls: 'icon-add',
            //     auth: "TD_JC_NRCJC_EDIT",
            //     handler: function () {
            //         batchDelete();
            //     }
            // },

            '-', {
                key: "COMMON_ADD",
                text: $.i18n.t('增加'),
                auth: "TD_NSJC_ADD",
                handler: function () {
                    openEdit('add');
                }
            }, '-', {
                key: "COMMON_RELOAD",
                text: $.i18n.t('刷新'),
                handler: function () {
                    $("#dg1").datagrid("reload");
                }
            }, '-', {
                id: 'btnReload',
                text: $.i18n.t('导出excel'),
                auth: "TD_NSJC_EXPORT_EXCEL",
                iconCls: 'icon-page_excel',
                handler: function () {
                    excelExport('dg1', '工卡清单', {}, function () {
                        return {'PAGE_DATA': PAGE_DATA}
                    });
                }
            }],
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
function openEdit(operation, pkid, jcNo, appType, fleet, cepCheckout, cepFilePath, companyCode, jcType, status) {
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
            operation: operation,
            from: dataFrom,
            jcNo: jcNo,
            appType: appType,
            fleet: fleet,
            cepCheckout: cepCheckout,
            cepFilePath: cepFilePath,
            companyCode: companyCode,
            jcType: jcType,
            jcStatus: status
        },
        url: "/views/td/jobcard/nrcjc/tdNrcjcEditDetail.shtml"
    });
}

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

//查询
function searchData(grid, search) {
    onSearch_(grid, search);
}

//重置
function doClear_(search, grid) {
    $(search).form('clear');
    // searchData(grid, search);
}

function noVerUpManualListReset() {
    $("#fleetManual").combobox('setValue', '');
}

//批量提交
function batchSubmit() {
    var rowData = getDG('dg1').datagrid('getChecked');

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
        if (obj.STATUS != "EDITED") {
            MsgAlert({content: "批量提交只能提交 【修订完成】的数据。", type: 'error'});
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
                    FunctionCode_: 'TD_JC_ALL_NRCJC_SUMBIT',
                    successCallback: reload_
                },
                url: "/views/td/jobcard/cmjc/td_Cmjc_work_flow_account_select.shtml"
            });
        }
    }

}

//批量删除
function batchDelete() {
    var rowData = getDG('dg1').datagrid('getChecked');

    if (rowData.length == 0) {
        MsgAlert({content: "请选择数据！", type: 'error'});
        return;
    }
    if (!confirm("确认批量删除该记录？")) {
        return;
    }

    $.each(rowData, function (index, obj) {
        InitFuncCodeRequest_({
            data: {pkid: obj.PKID, FunctionCode: 'TD_JC_NRCJC_DELETE'},
            successCallBack: function (jdata) {
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                    $("#dg1").datagrid("reload");
                } else {
                    MsgAlert({content: jdata.msg, type: 'error'});
                }
            }
        });
    })
}

function importExcel() {
    InitFuncCodeRequest_({
        data: {FunctionCode: "TD_NRC_JC_CMP_IMPORT"},
        successCallBack: function (jdata) {
        }
    });
}

//对比
function openDiff(fleet, operation, pkid, cepFilePath) {
    if (operation == null || operation == "") {
        MsgAlert({content: "请选择需要对比的类型！", type: 'error'});
        return;
    }
    var rowData = getDG('dg1').datagrid('getSelected');
    if (!rowData.PKID) {
        MsgAlert({content: "请选择数据！", type: 'error'});
        return;
    }
    var curPath = window.document.location.href;
    var url;
    if (curPath.indexOf('me.sichuanair.com') >= 0 || curPath.indexOf('172.31.240.46') >= 0) {//生产
        url = 'http://172.30.129.125:8001';
    } else if (curPath.indexOf('172.30.129.101') >= 0) {//测试
        url = 'http://172.30.129.104:8001';
    } else if (curPath.indexOf('172.30.129.111') >= 0) {//开发
        url = 'http://172.30.129.113:8001';
    } else {//本地
        url = 'http://localhost:8001';
    }
    // if (fleet == "A350") {
    if (operation == "mm") {

        /**ajax加载遮罩层*/
        ajaxLoading();
        InitFuncCodeRequest_({
            data: {FunctionCode: 'TD_JC_MANUAL_DIFF', pkid: pkid},
            successCallBack: function (jdata) {
                /**ajax销毁遮罩层*/
                ajaxLoadEnd();
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    var filePaths = jdata.data;
                    console.log(filePaths);
                    var firstFilePath = "";
                    var secondFilePath = "";
                    if (filePaths.indexOf(",") != -1) {
                        var pathArr = filePaths.split(",");
                        if (pathArr.length == 2) {
                            firstFilePath = pathArr[0];
                            secondFilePath = pathArr[1];
                        } else if (pathArr.length == 1) {
                            firstFilePath = pathArr[0];
                            secondFilePath = pathArr[0];
                        } else {
                            MsgAlert({content: "手册对比出错，请联系管理员！", type: 'error'});
                            return;
                        }
                    }
                    window.open(url + "/diff/diff-ui/index.html?difffirstdoc=" + firstFilePath + "&diffseconddoc=" + secondFilePath);
                } else if (jdata.code == 201) {
                    MsgAlert({content: "当前手册与最新手册版本相同，无法对比。", type: 'error'});

                } else {
                    MsgAlert({content: jdata.msg, type: 'error'});
                }
            }
        });

    } else if (operation == "mj") {
        var firstFilePath = "";
        var secondFilePath = "";
        /**ajax加载遮罩层*/
        ajaxLoading();
        InitFuncCodeRequest_({
            data: {FunctionCode: 'TD_JC_MANUALJC_DIFF', pkid: pkid, async: false},
            successCallBack: function (jdata) {
                /**ajax销毁遮罩层*/
                ajaxLoadEnd();
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {

                    var filePaths = jdata.data;
                    console.log(filePaths);
                    var firstFilePath = "";
                    var secondFilePath = "";
                    if (filePaths.indexOf(",") != -1) {
                        var pathArr = filePaths.split(",");
                        if (pathArr.length == 2) {
                            firstFilePath = pathArr[0];
                            secondFilePath = pathArr[1];
                        } else if (pathArr.length == 1) {
                            firstFilePath = pathArr[0];
                            secondFilePath = pathArr[0];
                        } else {
                            MsgAlert({content: "手册对比出错，请联系管理员！", type: 'error'});
                        }
                    }
                    console.log(url);
                    window.open(url + "/diff/diff-ui/index.html?difffirstdoc=" + firstFilePath + "&diffseconddoc=" + secondFilePath);

                } else {
                    MsgAlert({content: jdata.msg, type: 'error'});
                }
            }
        });
    } else {

    }
}