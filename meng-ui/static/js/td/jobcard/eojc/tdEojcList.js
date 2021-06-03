var PAGE_DATA = {};
var user;
var param;
var eflag = '';
var ifQua = '';
var jcType = '';
var name = getLoginInfo().userName;
var accountId = getLoginInfo().accountId;
var funcode;
var searchFlag = true;

function i18nCallBack() {
    user = getLoginInfo();
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
            domainCode: "DA_FLEET,TD_EOJC_OR_EAJC_STATUS,YESORNO,TD_JC_SMJC_WRITER,TD_JC_APP_TYPE,DA_ENG_TYPE,TD_EOJC_STATUS,TD_EAJC_STATUS,TD_ATA",
            FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
        },
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                PAGE_DATA['fleet'] = DomainCodeToMap_(jdata.data["DA_FLEET"]);//机队
                PAGE_DATA['status'] = DomainCodeToMap_(jdata.data["TD_EOJC_OR_EAJC_STATUS"]);//状态
                PAGE_DATA['ifRii'] = DomainCodeToMap_(jdata.data["YESORNO"]);//是否必检

                if ("EOJC" == jcType) {
                    //工卡类型 EOJC
                    $('#jcType').combobox({
                        value: "EOJC",
                        onlyview: true,
                        editable: false
                    });
                } else if ("EAJC" == jcType) {
                    //工卡类型 EAJC
                    $('#jcType').combobox({
                        value: "EAJC",
                        onlyview: true,
                        editable: false
                    });
                }
                $("#ata").combobox({
                    panelHeight: '80px',
                    data: jdata.data.TD_ATA,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
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



                if ("EOJC" == jcType) {
                    //工卡流程状态
                    $('#status').combobox({
                        panelHeight: '140px',
                        data: jdata.data.TD_EOJC_STATUS,
                        valueField: 'VALUE',
                        textField: 'TEXT',
                        value: 'EDIT'
                    });
                    //工卡流程状态
                    PAGE_DATA['status'] = DomainCodeToMap_(jdata.data["TD_EOJC_STATUS"]);
                } else if ("EAJC" == jcType) {
                    //工卡流程状态
                    $('#status').combobox({
                        panelHeight: '140px',
                        data: jdata.data.TD_EAJC_STATUS,
                        valueField: 'VALUE',
                        textField: 'TEXT',
                        value: 'EDIT'
                    });
                    //工卡流程状态
                    PAGE_DATA['status'] = DomainCodeToMap_(jdata.data["TD_EAJC_STATUS"]);
                }

                $("#status").combobox('setValue', 'EDIT');
                $('#quaManName').textbox("setValue", name);
                // //工卡流程状态
                // PAGE_DATA['status'] = DomainCodeToMap_(jdata.data["TD_EOJC_OR_EAJC_STATUS"]);
                //工序是否检出
                PAGE_DATA['cepCheckout'] = DomainCodeToMap_(jdata.data["YESORNO"]);
                //校对人
                PAGE_DATA['proofBy'] = DomainCodeToMap_(jdata.data["TD_JC_SMJC_PROOF_BY"]);
                //审核人
                PAGE_DATA['reviewedBy'] = DomainCodeToMap_(jdata.data["TD_JC_SMJC_REVIEWED_BY"]);
                //审批人
                PAGE_DATA['approvedBy'] = DomainCodeToMap_(jdata.data["TD_JC_SMJC_APPROVED_BY"]);
                //发布人
                PAGE_DATA['publicBy'] = DomainCodeToMap_(jdata.data["TD_JC_SMJC_PUBLIC_BY"]);

                InitDataGrid();
                // InitNoEoCmp();

            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

function InitDataGrid() {
    var quaManName = $("#quaManName").textbox("getValue");
    $("#dg").MyDataGrid({
        identity: "dg",
        sortable: true,
        singleSelect: true,
        queryParams: {jcType: jcType},
        resize: function () {
            return tabs_standard_resize($("#tt"), 0.04, 0.0001, 5, 4);
        },
        rowStyler: function (index, row) {
            if ("EDIT" == row.STATUS) {
                var overDate = new Date(row.WRITE_LIMIT);
                var currentDate = new Date();
                if (overDate <= currentDate) {
                    return 'background-color:#FF0000;';
                }
            }
        },
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
                CEP_CHECKOUT: {
                    formatter: function (value) {
                        return PAGE_DATA['cepCheckout'][value];
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
                },
            }
        },
        onLoadSuccess: function () {
            if (searchFlag) {
                onSearchFor('dg');
                searchFlag = false;
            }
        },
        contextMenus: [
            {
                id: "m-edit", i18nText: "编辑",
                auth: "TD_EOJC_LIST_EDIT",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
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
                        openDetai('edit', rowData.PKID, rowData.JC_TYPE, rowData.JC_NO, rowData.APP_TYPE, rowData.FLEET, rowData.COMPANY_CODE);
                    }
                }
            },
            {
                id: "m-copy",
                i18nText: "工卡转发",
                auth: "TD_EOJC_RETANS",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
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
                id: "", i18nText: "提交" ,
                auth: "TD_EOJC_SUBMIT",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
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
                    if (rowData.STATUS != "EDIT") {
                        // MsgAlert({content: "提交只能提交 【编写中】的数据。", type: 'error'});
                        // return;
                        msgArr.push("提交只能提交【编写中】的数据！");
                    }
                    if (rowData.SKILLS == null || rowData.SKILLS == "") {
                        // MsgAlert({content: "当前没有工序文件，不能提交。", type: 'error'});
                        // return;
                        msgArr.push("工种不能为空！");
                    }
                    if (rowData.CEP_FILE_PATH == null || rowData.CEP_FILE_PATH == "") {
                        // MsgAlert({content: "当前没有工序文件，不能提交。", type: 'error'});
                        // return;
                        msgArr.push("当前没有工序文件，不能提交！");
                    }
                    if (rowData.CEP_CHECKOUT != "" && rowData.CEP_CHECKOUT == "Y") {
                        // MsgAlert({content: "当前工序文件已被检出，不能提交。", type: 'error'});
                        // return;
                        msgArr.push("当前工序文件已被检出，不能提交！");
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
                    var row = $('#dg').datagrid('getSelected');
                    var msgArr = [];
                    if (row.WRITER != accountId && row.QUA_WRITER_ID != accountId) { //待修改
                        // MsgAlert({content: "您不是此条记录的OWNER或者处理人，不允许驳回！", type: 'error'});
                        // return;
                        msgArr.push("您不是此条记录的OWNER或者处理人，不允许驳回！");
                    }
                    //初始转发只能对状态为审核中,批准中且未有转发或转发已经转回的记录进行此操作
                    if ('EDIT' == row.STATUS || 'ISSUE' == row.STATUS || 'ISSUED' == row.STATUS || 'ARCHIVED' == row.STATUS) {
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
                    var row = $('#dg').datagrid('getSelected');
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
                auth: "TD_EOJC_DELETE",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (confirm("是否确认删除？")) {
                        InitFuncCodeRequest_({
                            data: {FunctionCode: 'TD_JC_ALL_EOJC_DELETEJOB', pkid: rowData.PKID},
                            successCallBack: function (jdata) {
                                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                    MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
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
                id: "", i18nText: "改版",
                auth: "TD_EOJC_AMEND",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (rowData.QUA_MAN_ID != accountId) {
                        MsgAlert({content: "您不是此条记录的当前操作人，不允许操作！", type: 'error'});
                        return;
                    }
                    //对已发布的数据进行改版，并且新增一条编写中的数据
                    var jcNo = rowData.JC_NO;
                    var ver = rowData.VER + 1;
                    InitFuncCodeRequest_({
                        data: {jcNo: jcNo, ver: ver, FunctionCode: "TD_JC_ALL_EOJC_BEFOR_AMEND"},
                        successCallBack: function (jdata) {
                            if (jdata.data == null || jdata.data.length == 0) {
                                if (confirm("是否确认改版？")) {
                                    InitFuncCodeRequest_({
                                        data: {pkid: rowData.PKID, FunctionCode: "TD_JC_ALL_EOJC_AMEND"},
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
                id: "", i18nText: "PDF预览",
                auth: "TD_EOJC_PDF_PREVIEW",
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
                                    jcPreview(url, rowData.JC_TYPE);
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
                auth: "TD_EOJC_SINGLE_PDF_PREVIEW",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    var msgArr = [];
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (rowData.MOP_NO != null && rowData.MOP_NO != "" && rowData.MOP_NO != undefined) {
                        // MsgAlert({content: "ME系统PDF路径有值，不能做单机预览！", type: 'error'});
                        // return;
                        msgArr.push("ME系统PDF路径有值，不能做单机预览！");
                    }
                    if (rowData.CEP_FILE_PATH == null || rowData.CEP_FILE_PATH == "") {
                        // MsgAlert({content: "当前未查询到工序文件，无法预览。", type: 'error'});
                        // return;
                        msgArr.push("当前未查询到工序文件，无法预览！");
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
            },
            // {
            //     id: "", i18nText: "PC端预览", auth: "",
            //     onclick: function () {
            //         var rowData = getDG('dg').datagrid('getSelected');
            //         if (!rowData.PKID) {
            //             MsgAlert({content: "请选择数据！", type: 'error'});
            //             return;
            //         }
            //         alert("PC端预览");
            //     }
            // },
            {
                id: "", i18nText: "流程图", auth: "",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    var userInfo = getLoginInfo();

                    if (rowData.STATUS == "PROOF" || rowData.STATUS == "RATIFY" || rowData.STATUS == "AUDIT") {
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
                    } else if (rowData.STATUS == "ARCHIVED" || rowData.STATUS == "ISSUED" || rowData.STATUS == "ISSUE") {
                        //获取整个流程最新的流程图有多个流程实例，使用最新的流程
                        InitFuncCodeRequest_({
                            data: {
                                FunctionCode: 'TD_JC_ALL_GET_PROC_DEF_ID',
                                flow_key: "tdEojcService",//流程定义Key
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
                    tranHis(rowData.PKID);
                }
            },
            {
                id: "m-previewArbortext",
                i18nText: "Arbortext预览",
                auth: "",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
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
            // if (row.WRIT1ER == user.accountId || user.accountId == '1') {
            if (row.STATUS != 'EDIT') {
                items['编辑'].enable = false;
                items['提交'].enable = false;
            }

            items['删除'].enable = false;
            if (row.STATUS == 'EDIT' && user.accountId == row.QUA_MAN_ID) {
                items['删除'].enable = true;
            }

            // if (row.STATUS == 'TURNBACK') {
            //     items['删除'].enable = true;
            // }
            // if (row.STATUS != 'ISSUED') {
            //     items['退回'].enable = false;
            // }
            items['工卡转发'].enable = false;
            if (row.STATUS == "EDIT" || row.STATUS == "EDITED") {
                items['工卡转发'].enable = true;
            }

            items['改版'].enable = false;
            if (row.STATUS == 'ISSUED') {
                items['改版'].enable = true;
            }

            if (row.APP_TYPE != "APL") {
                items['单机预览'].enable = false;
            }

            items['流程图'].enable = false;
            if (row.STATUS == "PROOF" || row.STATUS == "RATIFY" || row.STATUS == "AUDIT" || row.STATUS == "ISSUED" || row.STATUS == "ISSUE" || row.STATUS == "PRINT" || row.STATUS == "ARCHIVED") {
                items['流程图'].enable = true;
            }
            return items;
        },
        toolbar: [
            //     {
            //     id: 'btnAdd',
            //     text: $.i18n.t('增加'),
            //     iconCls: 'icon-add',
            //     handler: function () {
            //         openDetai("save", "");//打开新增页面
            //     }
            // }, '-',
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

// function InitNoEoCmp() {
//     //绑定回车查询事件
//     /* bindFormonSearch_('#ffSearch2', function () {
//      searchData('dg2', '#ffSearch2')
//      });*/
//     InitFuncCodeRequest_({
//         data: {
//             domainCode: "DA_FLEET,YESORNO",
//             FunctionCode: "ANALYSIS_DOMAIN_BYCODE"
//         },
//         successCallBack: function (jdata) {
//             if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
//                 //机队
//                 $('#fleetEo').combobox({
//                     panelHeight: '100px',
//                     data: jdata.data.DA_FLEET,
//                     valueField: 'VALUE',
//                     textField: 'TEXT',
//                     onChange: function (value) {
//                         searchData('dg2', '#ffSearch2');
//                     }
//                 });
//
//                 //是否关闭
//                 $("#ifClosed").combobox({
//                     panelHeight: '50px',
//                     data: jdata.data.YESORNO,
//                     valueField: 'VALUE',
//                     textField: 'TEXT'
//                 });
//
//                 //机队
//                 PAGE_DATA['fleetEo'] = DomainCodeToMap_(jdata.data["DA_FLEET"]);
//                 PAGE_DATA['ifClosed'] = DomainCodeToMap_(jdata.data["YESORNO"]);
//                 InitDataGridNoEo();
//             } else {
//                 MsgAlert({content: jdata.msg, type: 'error'});
//             }
//         }
//     });
// }

// function InitDataGridNoEo() {
//     $("#dg2").MyDataGrid({
//         identity: "dg2",
//         sortable: true,
//         singleSelect: true,
//         resize: function () {
//             return tabs_standard_resize($("#tt"), 0.02, 0.0001, 5, 4);
//         },
//         columns: {
//             param: {FunctionCode: 'TD_EO_NOTICE_LIST'},
//         },
//         contextMenus: [
//             {
//                 id: "m-edit",
//                 i18nText: "编卡",
//                 auth: "",
//                 onclick: function () {
//                     var rowData = getDG('dg2').datagrid('getSelected');
//                     if (!rowData.PKID) {
//                         MsgAlert({content: "请选择数据！", type: 'error'});
//                         return;
//                     }
//                     ShowWindowIframe({
//                         width: 1200,
//                         height: 850,
//                         param: {operation: 'save', noticePkid: rowData.PKID},
//                         url: "/views/td/jobcard/eojc/tdEojcDetail.shtml"
//                     });
//                 }
//             }, {
//                 id: "m-delete",
//                 i18nText: "关闭通知单",
//                 auth: "",
//                 onclick: function () {
//                     var rowData = getDG('dg2').datagrid('getSelected');
//                     if (!rowData.PKID) {
//                         MsgAlert({content: "请选择数据！", type: 'error'});
//                         return;
//                     }
//                     if (!confirm("确认关闭该通知单？")) {
//                         return;
//                     }
//                     var title_ = $.i18n.t('关闭通知单');
//                     ShowWindowIframe({
//                         width: "400",
//                         height: "60",
//                         title: title_,
//                         param: {pkid: rowData.PKID},
//                         url: "/views/td/jobcard/eojc/tdEoNoticeClose.shtml"
//                     });
//
//                 }
//             }
//         ],
//         validAuth: function (row, items) {
//             if (row.IF_CLOSED == 'Y') {
//                 items['关闭通知单'].enable = false;
//                 items['编卡'].enable = false;
//             }
//             return items;
//         },
//         onClickRow: function (rowIndex, rowData) {
//         },
//         onDblClickRow: function (index, field, value) {
//         }
//     });
// }

//刷新
function reload_() {
    $("#dg").datagrid("reload");
}

//打开资料类型详细页面
function openDetai(operation, pkid, jcType, jcNo, appType, fleet, companyCode) {
    var title_;
    if ("EOJC" == jcType) {
        title_ = $.i18n.t('EO工卡详情');
    } else if ("EAJC" == jcType) {
        title_ = $.i18n.t('EA工卡详情');
    }
    ShowWindowIframe({
        width: "1100",
        height: "740",
        title: title_,
        param: {
            operation: operation,
            pkid: pkid,
            jcType: jcType,
            jcNo: jcNo,
            appType: appType,
            fleet: fleet,
            companyCode: companyCode,
            title: title_
        },
        url: "/views/td/jobcard/eojc/tdEojcDetail.shtml"
    });
}

//查询
function searchData() {
    onSearch_('dg', '#ffSearch');
}

//查询
function searchData2() {
    onSearch_('dg2', '#ffSearch2');
}
//重置
function doClear_() {
    $("#ffSearch").form('clear');
    $("#jcType").combobox('setValue', jcType);
}

function jcPreview(url, jcType) {
    var title_;
    if ("EOJC" == jcType) {
        title_ = $.i18n.t('EO工卡预览');
    } else if ("EAJC" == jcType) {
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
            MsgAlert({content: "非编写者无法提交该条数据[ " + obj.SUBJECT_CN + " ]。", type: 'error'});
            flag = false;
            return;
        }
        if (obj.STATUS != "EDIT") {
            MsgAlert({content: "批量提交只能提交 【修订中】的数据。", type: 'error'});
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
                    FunctionCode_: 'TD_JC_ALL_EOJC_SUBMIT',
                    successCallback: reload_
                },
                url: "/views/td/jobcard/cmjc/td_Cmjc_work_flow_account_select.shtml"
            });
        }
    }

}

function checkQua(rowData) {
    InitFuncCodeRequest_({
        data: {pkid: rowData.PKID, taskType: "EOJC", FunctionCode: 'TD_JC_CHECK_QUA'},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                eflag = jdata.data.eflag;
                ifQua = jdata.data.ifQua;
                var tips = '';
                if (eflag == "NO") {
                    tips = "当前用户没有该工卡的资质，请提交给有资质的用户！";
                }
                if (eflag == "ALL") {
                    InitFuncCodeRequest_({
                        data: {
                            pkid: rowData.PKID,
                            FunctionCode: "TD_JC_ALL_QECJC_STATUS"
                        },
                        successCallBack: function (jdata3) {
                            if (jdata3.code == RESULT_CODE.SUCCESS_CODE) {
                                if (jdata3.data == null) {
                                    //校验编写期限是否到期
                                    var curJcWriteLimit = rowData.WRITE_LIMIT;
                                    InitFuncCodeRequest_({
                                        data: {
                                            curJcWriteLimit: curJcWriteLimit,
                                            FunctionCode: "TD_CHECK_WRITE_LIMIT_IF_EXPIRE"
                                        },
                                        successCallBack: function (jdata4) {
                                            if (jdata4.code == RESULT_CODE.SUCCESS_CODE) {
                                                //执行反馈对象校验
                                                InitFuncCodeRequest_({
                                                    data: {
                                                        cepFilePath: rowData.CEP_FILE_PATH,
                                                        exeFbObj: rowData.EXE_FEED_OBJ,
                                                        FunctionCode: "CHECK_EXE_FB_EMAIL"
                                                    },
                                                    successCallBack: function (jdata1) {
                                                        if (jdata1.code == RESULT_CODE.SUCCESS_CODE) {
                                                            //校验MARK信息中的必检与互检
                                                            InitFuncCodeRequest_({
                                                                data: {
                                                                    jcPkid: rowData.PKID,
                                                                    cepFilePath: rowData.CEP_FILE_PATH,
                                                                    FunctionCode: "TD_EOJC_LIST_CHECK_BJ_OR_HJ"
                                                                },
                                                                successCallBack: function (jdata2) {
                                                                    if (jdata2.code == RESULT_CODE.SUCCESS_CODE) {
                                                                        submitGeneral(rowData.PKID, rowData.JC_TYPE);
                                                                    } else {
                                                                        if (confirm(jdata2.msg)) {
                                                                            //根据不同的code值对MARK信息表实现相应的操作
                                                                            InitFuncCodeRequest_({
                                                                                data: {
                                                                                    codeValue: jdata2.code,
                                                                                    jcPkid: rowData.PKID,
                                                                                    FunctionCode: "TD_EOJC_LIST_MODIFY_MARKINFO"
                                                                                },
                                                                                successCallBack: function (jdata5) {
                                                                                    if (jdata5.code == RESULT_CODE.SUCCESS_CODE) {
                                                                                        submitGeneral(rowData.PKID, rowData.JC_TYPE);
                                                                                    } else {
                                                                                        MsgAlert({
                                                                                            content: jdata5.msg,
                                                                                            type: 'error'
                                                                                        });
                                                                                    }
                                                                                }
                                                                            })
                                                                        }
                                                                    }
                                                                }
                                                            })
                                                        } else {
                                                            MsgAlert({content: jdata1.msg, type: 'error'});
                                                        }
                                                    }
                                                })
                                            } else {
                                                MsgAlert({content: jdata4.msg, type: 'error'});
                                            }
                                        }
                                    })
                                } else {
                                    MsgAlert({content: "该数据已被提交过了。", type: 'error'});
                                }
                            }
                        }
                    });
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
                                    taskType: "EOJC",
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
            taskType: "EOJC",
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
            taskType: "EOJC",
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
    $("#dg").datagrid("reload");
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
                            data: {pkid: pkid, procInstId: procInstId, FunctionCode: 'TD_EOJC_TURN_ACT'},
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

function submitGeneral(pkid, jcType) {
    var flowKey = null;
    if ("EOJC" == jcType) {
        flowKey = "tdEojcService";
    } else if ("EAJC" == jcType) {
        flowKey = "tdEajcService";
    }
    $.messager.confirm('', '是否确认提交？', function (r) {
        if (r) {
            common_add_edit_({
                identity: '', isEdit: '', width: 520, height: 300, title: $.i18n.t('选择审批人'),
                param: {
                    roleId: '',
                    otherParam: pkid,
                    otherParam1: jcType,
                    FunctionCode_: 'TD_JC_ALL_EOJC_SUBMIT',
                    successCallback: reload_,
                    flowKey: flowKey
                },
                url: "/views/em/workflow/work_flow_account_select.shtml"
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

//查询方法
function onSearchFor(identity, fromId, breforSearch) {
    fromId = fromId || "#ffSearch";
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