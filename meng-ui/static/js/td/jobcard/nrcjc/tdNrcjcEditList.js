var PAGE_DATA = {};
var user;
var hiddenBatchDelete = true;
var eflag = '';
var ifQua = '';
var jcType = '';
var name = getLoginInfo().userName;
var accountId = getLoginInfo().accountId;
var searchFlag = true;

function i18nCallBack() {

    //绑定回车查询事件
    bindFormonSearch_('#ffSearch1', function () {
        searchData('dg1', '#ffSearch1');
    });

    $(".easyui-tabs").tabs({
        onSelect: function (title, index) {
            if ("工卡清单" == title) {
                searchData('dg1', '#ffSearch1');
                bindFormonSearch_('#ffSearch1', function () {
                    searchData('dg1', '#ffSearch1');
                });
            }
        }
    });

    user = getLoginInfo();
    InitFuncCodeRequest_({
        data: {
            domainCode: "TD_JC_APP_TYPE,DA_FLEET,TD_NSJC_STATUS,YESORNO,TD_JC_FROM_TO,TD_JC_MODEL,TD_JC_STATE,TD_JC_EXTEND,TD_JC_CHECKLEVEL,TD_JC_CHANGE_FLAG,DA_ENG_TYPE,TD_ATA",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
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

                                    // //工卡版本
                                    $('#jobcardVer').combobox({
                                        panelHeight: '80px',
                                        data: jdata1.data.TD_JC_NRCJC_GET_JOBCARD_VER,
                                        valueField: 'VALUE',
                                        textField: 'TEXT'
                                    });
                                }
                            }
                        });
                    }
                });
                //章节号
                $('#ata').combobox({
                    panelHeight: '80px',
                    data: jdata.data.TD_ATA,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                //工卡流程状态
                $('#status').combobox({
                    panelHeight: '140px',
                    data: jdata.data.TD_NSJC_STATUS,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    value: 'EDIT'
                });

                //流程状态
                $("#status").combobox('setValue', 'EDIT');
                $("#statusAff").combobox('setValue', 'EDIT');
                $("#statusNoAff").combobox('setValue', 'EDIT');
                //编写人
                $('#quaManName').textbox("setValue", name);
                $('#quaManName2').textbox("setValue", name);
                $('#quaManName3').textbox("setValue", name);


                //机队
                // PAGE_DATA['fleet'] = DomainCodeToMap_(jdata.data["DA_FLEET"]);
                //工卡流程状态
                PAGE_DATA['status'] = DomainCodeToMap_(jdata.data["TD_NSJC_STATUS"]);
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

                //工卡清单
                InitDataGrid();
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

function InitDataGrid() {
    var quaManName = $("#quaManName").textbox("getValue");
    var pageSize = Math.floor(($(document.body).height() - $("fieldset").height() - 185) / 50);
    $("#dg1").MyDataGrid({
        identity: "dg1",
        sortable: true,
        singleSelect: true,
        pageSize: pageSize, pageList: [pageSize],
        resize: function () {
            return {width: '100%', height: '80%'}
        },
        rowStyler: function (index, row) {
            if ("EDIT" == row.STATUS || "EDITED" == row.STATUS) {
                var overDate = new Date(row.WRITE_LIMIT);
                var currentDate = new Date();
                if (overDate <= currentDate) {
                    return 'background-color:#FF0000;';
                }
            }
        },
        columns: {
            param: {FunctionCode: 'TD_JC_NRCJC_LIST'},
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
                // REVIEWED_BY: {
                //     formatter: function (value) {
                //         return PAGE_DATA['reviewedBy'][value];
                //     }
                // },
                // APPROVED_BY: {
                //     formatter: function (value) {
                //         return PAGE_DATA['approvedBy'][value];
                //     }
                // },
                // PUBLIC_BY: {
                //     formatter: function (value) {
                //         return PAGE_DATA['publicBy'][value];
                //     }
                // },

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
                }
            }
        },
        onLoadSuccess: function () {
            if (searchFlag) {
                onSearchFor('dg1');
                searchFlag = false;
            }
        },
        contextMenus: [
            {
                id: "m-edit",
                i18nText: "编辑",
                auth: "TD_NSJC_LIST_EDIT",
                onclick: function () {
                    var rowData = getDG('dg1').datagrid('getSelected');
                    var msgArr = [];
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (rowData.QUA_MAN_ID != accountId) {
                        // MsgAlert({content: "您不是此条记录的当前操作人，不允许操作！", type: 'error'});
                        // return;
                        msgArr.push("您不是此条记录的当前操作人，不允许操作！");
                    }
                    if (msgArr.length > 0) {
                        hints(msgArr);
                    } else {
                        openEdit("edit", rowData.PKID, rowData.JC_NO, rowData.APP_TYPE, rowData.FLEET, rowData.CEP_CHECKOUT, rowData.CEP_FILE_PATH, rowData.COMPANY_CODE, rowData.JC_TYPE, rowData.STATUS);
                    }
                }
            },
            {
                id: "m-copy",
                i18nText: "工卡转发",
                auth: "TD_NSJC_RETRANS",
                onclick: function () {
                    var rowData = getDG('dg1').datagrid('getSelected');
                    var msgArr = [];
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }

                    if (rowData.QUA_MAN_ID != accountId) {
                        // MsgAlert({content: "您不是此条记录的当前操作人，不允许操作！", type: 'error'});
                        // return;
                        msgArr.push("您不是此条记录的当前操作人，不允许操作！");
                    }
                    if (msgArr.length > 0) {
                        hints(msgArr);
                    } else {
                        transTdJc(rowData);
                    }
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
                id: "m-submit",
                i18nText: "提交",
                auth: "TD_NSJC_SUBMIT",
                onclick: function () {
                    var rowData = getDG('dg1').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    var msgArr = [];
                    if (rowData.QUA_MAN_ID != accountId) {
                        // MsgAlert({content: "您不是此条记录的当前操作人，不允许操作！", type: 'error'});
                        // return;
                        msgArr.push("您不是此条记录的当前操作人，不允许操作");
                    }
                    if (rowData.STATUS != "EDITED") {
                        // MsgAlert({content: "提交只能提交 【修订完成】的数据。", type: 'error'});
                        // return;
                        msgArr.push("提交只能提交【修订完成】的数据");
                    }
                    if (rowData.CEP_FILE_PATH == null || rowData.CEP_FILE_PATH == "") {
                        // MsgAlert({content: "当前没有工序文件，不能进行提交。", type: 'error'});
                        // return;
                        msgArr.push("当前没有工序文件，不能进行提交");
                    }
                    if (rowData.CEP_CHECKOUT != "" && rowData.CEP_CHECKOUT == "Y") {
                        // MsgAlert({content: "当前文件已被检出，不能进行提交。", type: 'error'});
                        // return;
                        msgArr.push("当前文件已被检出，不能进行提交");
                    }
                    if (msgArr.length > 0) {
                        hints(msgArr);
                    } else {
                        checkQua(rowData);
                    }
                }
            },
            {
                i18nText: "流程退回", auth: "",
                onclick: function () {
                    var row = $('#dg1').datagrid('getSelected');
                    var evapkid = row.PKID;
                    var msgArr = [];
                    if (row.WRITER != accountId && row.QUA_WRITER_ID != accountId) { //待修改
                        // MsgAlert({content: "您不是此条记录的OWNER或者处理人，不允许驳回！", type: 'error'});
                        // return;
                        msgArr.push("您不是此条记录的OWNER或者处理人，不允许驳回！");
                    }
                    //初始转发只能对状态为审核中,批准中且未有转发或转发已经转回的记录进行此操作
                    if ('EDIT' == row.STATUS || 'EDITED' == row.STATUS || 'ISSUE' == row.STATUS || 'ISSUED' == row.STATUS || 'ARCHIVED' == row.STATUS) {
                        // MsgAlert({content: '只有流程中状态的数据才能退回！', type: 'error'});
                        // return;
                        msgArr.push("只有流程中状态的数据才能退回！");
                    }
                    if (msgArr.length > 0) {
                        hints(msgArr);
                    } else {
                        turnEvalAct(row);
                    }
                }
            },
            {
                id: "m-turn",
                i18nText: "联合评估驳回",
                auth: "",
                onclick: function () {
                    var row = $('#dg1').datagrid('getSelected');
                    var jcPkid = row.PKID;
                    if (row.QUA_MAN_ID != accountId) {
                        MsgAlert({content: "您不是此条记录的当前操作人，不允许操作！", type: 'error'});
                        return;
                    }
                    var quacou = 0;
                    InitFuncCodeRequest_({
                        data: {jcPkid: jcPkid, FunctionCode: 'TD_JC_QUA_COU'},
                        async: false,
                        successCallBack: function (jdata) {
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                if (jdata.data != null) {
                                    quacou = jdata.data.COU;
                                }
                            } else {
                                MsgAlert({content: jdata.msg ? jdata.msg : jdata.data, type: 'error'});
                            }
                        }
                    });
                    if (quacou == 0) {
                        MsgAlert({content: "没有联合评估记录，不能驳回！", type: 'error'});
                        return;
                    }
                    //初始转发只能对状态为评估中且未有转发或转发已经转回的记录进行此操作
                    if (row.STATUS != 'EDIT' && row.STATUS != 'EDITED') {
                        MsgAlert({content: '状态不是编写中/修订完成，不允许驳回！', type: 'error'});
                        return;
                    }
                    turnTdJc(row);
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
                    if (rowData.QUA_MAN_ID != accountId) {
                        MsgAlert({content: "您不是此条记录的当前操作人，不允许操作！", type: 'error'});
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
                    var msgArr = [];
                    if (rowData.MOP_NO != null && rowData.MOP_NO != "" && rowData.MOP_NO != undefined) {
                        // MsgAlert({content: "ME系统PDF路径有值，不能做单机预览！", type: 'error'});
                        // return;
                        msgArr.push("ME系统PDF路径有值，不能做单机预览");
                    }
                    if (rowData.CEP_FILE_PATH == null || rowData.CEP_FILE_PATH == "") {
                        // MsgAlert({content: "当前未查询到工序文件，无法预览。", type: 'error'});
                        // return;
                        msgArr.push("当前未查询到工序文件，无法预览");
                    }
                    if (msgArr.length > 0) {
                        hints(msgArr);
                    } else {
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
                    tranHis(rowData.PKID);
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
            if (row.STATUS != "EDITED") {
                items['提交'].enable = false;
            }
            if (row.STATUS != 'EDIT' && row.STATUS != "EDITED") {
                items['编辑'].enable = false;
                items['删除'].enable = false;
            }

            items['改版'].enable = false;
            if (row.STATUS == 'ISSUED') {
                items['改版'].enable = true;
            }

            items['工卡转发'].enable = false;
            if (row.STATUS == "EDIT" || row.STATUS == "EDITED") {
                items['工卡转发'].enable = true;
            }

            if (row.APP_TYPE != "APL") {
                items['单机预览'].enable = false;
            }

            items['流程图'].enable = false;
            if (row.STATUS == "RATIFY" || row.STATUS == "AUDIT" || row.STATUS == "ISSUED" || row.STATUS == "PRINT" || row.STATUS == "ARCHIVED") {
                items['流程图'].enable = true;
            }
            return items;
        },
        toolbar: [
            {
                key: "COMMON_ADD",
                text: $.i18n.t('增加'),
                auth: "TD_NSJC_ADD",
                handler: function () {
                    openEdit('add');
                }
            },
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
    var title_ = $.i18n.t('NSJC工卡预览');
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
    $("#manualType").combobox('setValue', '');
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

//初始化受影响工卡清单
function initJCAff() {
    InitFuncCodeRequest_({
        data: {
            domainCode: "DA_FLEET,TD_JC_STATUS,TD_JC_STATE,TD_JC_FROM_TO,TD_JC_CHANGE_FLAG,TD_JC_SMJC_WRITER,TD_NSJC_JCVER,TD_NSJC_REFDATA_TYPE,TD_ATA",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                //机队
                $('#fleetAff').combobox({
                    panelHeight: '140px',
                    data: jdata.data.DA_FLEET,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    onChange: function () {
                        var fleet = $("#fleetAff").textbox('getValue');
                        InitFuncCodeRequest_({
                            data: {
                                fleet: fleet,
                                domainCode: 'TD_JC_SMJC_GET_JOBCARD_VER',
                                FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
                            },
                            successCallBack: function (jdata1) {
                                if (jdata1.code == RESULT_CODE.SUCCESS_CODE) {

                                    //工卡版本
                                    $('#jobcardVerAff').combobox({
                                        panelHeight: '80px',
                                        data: jdata1.data.TD_JC_SMJC_GET_JOBCARD_VER,
                                        valueField: 'VALUE',
                                        textField: 'TEXT'
                                    });
                                }
                            }
                        });
                    }
                });
                //章节号
                $('#ataAff').combobox({
                    panelHeight: '80px',
                    data: jdata.data.TD_ATA,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                $('#changeFlagAff').combobox({
                    panelHeight: '140px',
                    data: jdata.data.TD_JC_CHANGE_FLAG,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });

                //工卡版本
                $("#jobcardVerAff").combobox({
                    panelHeight: '100px',
                    data: jdata.data.TD_NSJC_JCVER,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                //参考手册版本
                $("#refDataTypeAff").combobox({
                    panelHeight: '140px',
                    data: jdata.data.TD_NSJC_REFDATA_TYPE,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });

                //机队
                PAGE_DATA['fleetAff'] = DomainCodeToMap_(jdata.data["DA_FLEET"]);
                //控制类别
                PAGE_DATA['statusAff'] = DomainCodeToMap_(jdata.data["TD_JC_STATUS"]);
                //工卡有效性
                PAGE_DATA['jcStatusAff'] = DomainCodeToMap_(jdata.data["TD_JC_STATE"]);
                //工卡来源
                PAGE_DATA['itemFromAff'] = DomainCodeToMap_(jdata.data["TD_JC_FROM_TO"]);
                //工卡分类
                PAGE_DATA['changeFlagAff'] = DomainCodeToMap_(jdata.data["TD_JC_CHANGE_FLAG"]);

            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}


//初始化未受影响工卡清单
function initJCNoAff() {
    InitFuncCodeRequest_({
        data: {
            domainCode: "DA_FLEET,TD_JC_STATUS,TD_JC_STATE,TD_JC_FROM_TO,TD_JC_MODEL,TD_JC_CHANGE_FLAG,TD_JC_SMJC_WRITER,TD_NSJC_REFDATA_TYPE,TD_ATA",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                //机队
                $('#fleetNoAff').combobox({
                    panelHeight: '100px',
                    data: jdata.data.DA_FLEET,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                //章节号
                $('#ataNoAff').combobox({
                    panelHeight: '80px',
                    data: jdata.data.TD_ATA,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });

                $('#changeFlagNoAff').combobox({
                    panelHeight: '140px',
                    data: jdata.data.TD_JC_CHANGE_FLAG,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                $("#refDataTypeNoAff").combobox({
                    panelHeight: '140px',
                    data: jdata.data.TD_NSJC_REFDATA_TYPE,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                //机队
                PAGE_DATA['fleetNoAff'] = DomainCodeToMap_(jdata.data["DA_FLEET"]);
                //控制类别
                PAGE_DATA['statusNoAff'] = DomainCodeToMap_(jdata.data["TD_JC_STATUS"]);
                //工卡有效性
                PAGE_DATA['jcStatusNoAff'] = DomainCodeToMap_(jdata.data["TD_JC_STATE"]);
                //工卡来源
                PAGE_DATA['itemFromNoAff'] = DomainCodeToMap_(jdata.data["TD_JC_FROM_TO"]);
                //工卡分类
                PAGE_DATA['changeFlagNoAff'] = DomainCodeToMap_(jdata.data["TD_JC_CHANGE_FLAG"]);

            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

//未升版手册清单
function initJCManual() {
    InitFuncCodeRequest_({
        data: {
            domainCode: "DA_FLEET,TD_NSJC_MANUAL_TYPE,DM_REC_VER_TYPE,TD_JC_MANUAL_IF_REV",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                //机队
                $('#fleetManual').combobox({
                    panelHeight: '100px',
                    data: jdata.data.DA_FLEET,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                //手册类型
                $('#manualType').combobox({
                    panelHeight: '80px',
                    data: jdata.data.TD_NSJC_MANUAL_TYPE,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                //机队
                PAGE_DATA['fleetManual'] = DomainCodeToMap_(jdata.data["DA_FLEET"]);
                PAGE_DATA['manualType'] = DomainCodeToMap_(jdata.data["TD_NSJC_MANUAL_TYPE"]);
                PAGE_DATA['isTr'] = DomainCodeToMap_(jdata.data["DM_REC_VER_TYPE"]);
                PAGE_DATA['ifJcRev'] = DomainCodeToMap_(jdata.data["TD_JC_MANUAL_IF_REV"]);
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}


//手册改版评估(用于手册升版)
function initManualUpJCManualEval() {
    InitFuncCodeRequest_({
        data: {
            domainCode: "DA_FLEET,MANUAL_UP_JC_EVAL_STATUS,TD_NSJC_ATA",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                //机队
                $('#manualUpJcEvalFleet').combobox({
                    panelHeight: '100px',
                    data: jdata.data.DA_FLEET,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                //章节
                $('#manualUpJcEvalAta').combobox({
                    panelHeight: '120px',
                    data: jdata.data.TD_NSJC_ATA,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                //状态
                $('#manualUpJcEvalStatus').combobox({
                    panelHeight: '120px',
                    data: jdata.data.MANUAL_UP_JC_EVAL_STATUS,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                //状态
                PAGE_DATA['manualUpJcEvalStatus'] = DomainCodeToMap_(jdata.data["MANUAL_UP_JC_EVAL_STATUS"]);
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}


function checkQua(rowData) {
    InitFuncCodeRequest_({
        data: {pkid: rowData.PKID, taskType: "NSJC", FunctionCode: 'TD_JC_CHECK_QUA'},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                eflag = jdata.data.eflag;
                ifQua = jdata.data.ifQua;
                var tips = '';
                if (eflag == "NO") {
                    tips = "当前用户没有该工卡的资质，请提交给有资质的用户！";
                }
                if (eflag == "ALL") {
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
                } else {
                    $.messager.confirm('', tips, function (r) {
                        if (r) {
                            ShowWindowIframe({
                                width: 550,
                                height: 250,
                                title: "联合评估",
                                param: {
                                    pkid: rowData.PKID,
                                    ata: rowData.ATA,
                                    fleet: rowData.FLEET,
                                    cflag: "commit",
                                    fluflag: "list",
                                    taskType: "NSJC",
                                    accountId: accountId,
                                    ifQua: ifQua,
                                    eflag: eflag
                                },
                                url: '/views/td/jobcard/smjc/smjcedit/tdJcTrans.shtml'
                            });
                        }
                    });
                }
            } else {
                MsgAlert({content: $.i18n.t(jdata.msg), type: 'error'});
            }
        }
    });
}

function turnTdJc(rowData) {
    var evaManId = rowData.WRITER;
    var pkid = rowData.PKID;
    var cflag = "turn";
    ShowWindowIframe({
        width: 550,
        height: 250,
        title: "驳回",
        param: {
            accId: evaManId,
            pkid: pkid,
            cflag: cflag,
            fluflag: "list",
            ata: rowData.ATA,
            fleet: rowData.FLEET,
            ifQua: "N",
            taskType: "NSJC",
            accountId: accountId
        },
        url: '/views/td/jobcard/smjc/smjcedit/tdJcTrans.shtml'
    });
}

function transTdJc(rowData) {
    var evaManId = rowData.WRITER;
    var pkid = rowData.PKID;
    var cflag = "zf";
    ShowWindowIframe({
        width: 550,
        height: 250,
        title: "转发",
        param: {
            accId: evaManId,
            pkid: pkid,
            cflag: cflag,
            fluflag: "list",
            taskType: "NSJC",
            ata: rowData.ATA,
            fleet: rowData.FLEET,
            accountId: accountId
        },
        url: '/views/td/jobcard/smjc/smjcedit/tdJcTrans.shtml'
    });
}

function tranHis(pkid) {
    var title_ = $.i18n.t('办理轨迹列表');
    ShowWindowIframe({
        width: "790",
        height: "519",
        title: title_,
        param: {pkid: pkid},
        url: "/views/td/jobcard/smjc/smjcedit/tdJcTransList.shtml"
    });
}

function reload_all() {
    $("#dg1").datagrid("reload");
}

function turnEvalAct(row) {
    var pkid = row.PKID;
    var objNo = pkid;
    var objKey = "TD_JC_ALL";
    var taskId = "";
    var procInstId = "";
    $.messager.confirm('提示?', "是否确认退回?", function (r) {
        if (r) {
            MaskUtil.mask("请求处理中...");
            InitFuncCodeRequest_({
                data: {
                    FunctionCode: 'WS_FLOW_EXECUTION_QUERY',
                    objNo: objNo,
                    objKey: objKey
                },
                async: false,
                successCallBack: function (jdata) {
                    if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                        taskId = jdata.data["TASK_ID"];
                        procInstId = jdata.data["PROC_INST_ID_"];
                        InitFuncCodeRequest_({
                            data: {pkid: pkid, procInstId: procInstId, FunctionCode: 'TD_NSJC_TURN_ACT'},
                            async: false,
                            successCallBack: function (jdata) {
                                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                    MaskUtil.unmask();
                                    reload_();
                                    MsgAlert({content: '操作成功!'});
                                } else {
                                    MaskUtil.unmask();
                                    MsgAlert({content: jdata.msg ? jdata.msg : jdata.data, type: 'error'});
                                }
                            }
                        });
                    }
                }
            });
        }
    });
}

function hints(mgs) {
    ShowWindowIframe({
        width: 320,
        height: 300,
        param: {mgs: mgs},
        title: "工卡提示",
        url: "/views/td/jobcard/commonjc/TdHints.shtml"
    });
}

//查询方法
function onSearchFor(identity, fromId, breforSearch) {
    fromId = fromId || "#ffSearch1";
    var dgopt = getDgOpts(identity);
    var $dg = $(dgopt.owner);
    var url = dgopt.url;
    if ($dg && url) {
        var queryParams = $(fromId).serializeObject();
        queryParams = $.extend({}, dgopt.queryParams, dgopt._params, queryParams);
        if (typeof(breforSearch) == 'function') {
            breforSearch(queryParams);
        }
        clearAdvancedQueryData(queryParams);
        if (dgopt.treeField) {
            $dg.treegrid('load', queryParams);
        } else {
            $dg.datagrid('load', queryParams);
        }
    }
}

function openManualUpgradeEval(operation, evalNo, fleet, status, jcType) {
    ShowWindowIframe({
        width: "1188",
        height: "636",
        title: "手册改版评估明细页面",
        param: {evalNo: evalNo, operation: operation, fleet: fleet, status: status, jcType: jcType},
        url: "/views/td/jobcard/smjc/smjcedit/tdSmjcManualUpgradeEvalDetail.shtml"
    });
}


function onSearchForEffect(identity, fromId, breforSearch) {
    fromId = fromId || "#ffSearch3";
    var dgopt = getDgOpts(identity);
    var $dg = $(dgopt.owner);
    var url = dgopt.url;
    if ($dg && url) {
        var queryParams = $(fromId).serializeObject();
        queryParams = $.extend({}, dgopt.queryParams, dgopt._params, queryParams);
        if (typeof(breforSearch) == 'function') {
            breforSearch(queryParams);
        }
        clearAdvancedQueryData(queryParams);
        if (dgopt.treeField) {
            $dg.treegrid('load', queryParams);
        } else {
            $dg.datagrid('load', queryParams);
        }
    }
}

function onSearchForNoEffect(identity, fromId, breforSearch) {
    fromId = fromId || "#ffSearch4";
    var dgopt = getDgOpts(identity);
    var $dg = $(dgopt.owner);
    var url = dgopt.url;
    if ($dg && url) {
        var queryParams = $(fromId).serializeObject();
        queryParams = $.extend({}, dgopt.queryParams, dgopt._params, queryParams);
        if (typeof(breforSearch) == 'function') {
            breforSearch(queryParams);
        }
        clearAdvancedQueryData(queryParams);
        if (dgopt.treeField) {
            $dg.treegrid('load', queryParams);
        } else {
            $dg.datagrid('load', queryParams);
        }
    }
}


//手册改版评估退回
function turnManualUpJcEvalAct(rowData) {
    var evalNo = rowData.EVAL_NO;
    var objNo = evalNo;
    var objKey = "TD_JC_MANUAL_UPGRADE";
    var taskId = "";
    var procInstId = "";
    $.messager.confirm('提示?', "是否确认退回?", function (r) {
        if (r) {
            MaskUtil.mask("请求处理中...");
            InitFuncCodeRequest_({
                data: {
                    FunctionCode: 'WS_FLOW_EXECUTION_QUERY',
                    objNo: objNo,
                    objKey: objKey
                },
                async: false,
                successCallBack: function (jdata) {
                    if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                        taskId = jdata.data["TASK_ID"];
                        procInstId = jdata.data["PROC_INST_ID_"];
                        InitFuncCodeRequest_({
                            data: {
                                evalNo: evalNo,
                                procInstId: procInstId,
                                FunctionCode: 'TD_JC_MANUAL_UPGRADE_TURN_ACT'
                            },
                            async: false,
                            successCallBack: function (jdata) {
                                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                    MaskUtil.unmask();
                                    reload_manual_upgrade();
                                    MsgAlert({content: '操作成功!'});
                                } else {
                                    MaskUtil.unmask();
                                    MsgAlert({content: jdata.msg ? jdata.msg : jdata.data, type: 'error'});
                                }
                            }
                        });
                    }
                }
            });
        }
    });
}