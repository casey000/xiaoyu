var param;
var type, from, jcPkid, pageCount;
var PAGE_DATA = {};
var CEP_CHECKOUT = "N";
var CEP_FILE_PATH = "";
var obj;
var fleet;
var companyCode;
var operation;
var taskId;
var jcType;
var userLogin;
var flowStatus;
var userName;
var cepFileUrl;
var cepCheck;
var appType;
var msgData;
var accountId;
var jcNo;
var evaManId;
var jcProcessStatus;
var selectRow = {JOB_NO: '', NAME: '', EMAIL: ''};
var status;
var identity;

function i18nCallBack() {
    pageCount = 1;
    param = getParentParam_();
    type = param.type;
    from = param.from;
    userLogin = param.userLogin;
    userName = param.userName;
    flowStatus = param.flowStatus;
    fleet = param.fleet;
    companyCode = param.companyCode;
    operation = param.operation;
    taskId = param.taskId;
    jcType = param.jcType;
    cepFileUrl = param.cepFilePath;
    cepCheck = param.cepCheckout;
    appType = param.appType;
    msgData = param.msgData;
    accountId = param.accountId;
    jcNo = param.jcNo;
    jcProcessStatus = param.jcStatus;
    type = param.type;
    status = param.jcStatus;
    identity = param.identity;
    if(!identity){
        identity = "dg";
    }
    if (msgData) {
        jcPkid = param.recordId;
    } else {
        jcPkid = param.pkid;
    }

    var quaCou = 0;
    if (jcPkid) {
        InitFuncCodeRequest_({
            data: {pkid: jcPkid, FunctionCode: "TD_JC_QUA_TURN"},
            async: false,
            successCallBack: function (jdata) {
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    if (jdata.data != null) {
                        quaCou = jdata.data.COU;
                    }
                } else {
                    MsgAlert({content: jdata.msg, type: 'error'});
                }
            }
        });
    }

    if (quaCou == 0 || operation == 'view') {
        $("#turnBtn").hide();
    } else {
        $("#turnBtn").show();
    }


    if (taskId == 'task1541666749646') {
        $("#submitBtn").hide();
        $("#closeBtn").hide();
        $("#delayApplyBtn").hide();
    } else if (taskId == 'task1541666809251' || taskId == "task1541666829068") {
        $("#mFBtn").hide();
        $("#closeBtn").hide();
        $("#submitBtn").hide();
        $("#delayApplyBtn").hide();
    }

    if (appType != "APL") {
        $("#singleViewBtn").hide();
    }

    if (type == 'edit' || type == 'add') {
        $("#fileFrom").textbox({onlyview: true, editable: false});
        $("#applicability").textbox({onlyview: true, editable: false})
        // $("#ad").attr("disabled",true)
        // $("#ewis").attr("disabled",true)
        // $("#fts").attr("disabled",true)
        // $("#dm").attr("disabled",true)
        // $("#ifsd").attr("disabled",true)
    } else {
        $("#fileFrom").textbox({onlyview: false, editable: true});
        // $("#applicability").textbox({onlyview: false, editable: true});
        $("#manHours").textbox({onlyview: false, editable: true});
        $("#applicSelect").hide();
        $("#mFBtn").hide();
        $("#searchBar1").hide();
        $("#searchBar2").hide();
        $("#maintenDmJc").hide();
        $("#maintenIfsdJc").hide();
    }

    if (type == 'edit') {
        $("#appType").combobox({onlyview: true, editable: false});
        $("#fleet").combobox({onlyview: true, editable: false});
        $("#ata").combobox({onlyview: true, editable: false});
    }

    if (operation == 'view') {
        $(".easyui-combobox").combobox({onlyview: true, editable: false});
        $(".easyui-textbox").textbox({onlyview: true, editable: false});
        $("#saveBtn").hide();
        $("#editBtn").hide();
        $("#submitBtn").hide();
        $("#maintenDmJc").hide();
        $("#maintenIfsdJc").hide();
        $("#mFBtn").hide();
        $("#delayApplyBtn").hide();
        // $("#preRelateJc").hide();//未生效
        $(".addBtn").hide();
        $("input[type='checkbox']").attr("disabled", true);
        $("#highlight").textbox({required: false, onlyview: true, editable: false});
        $("#chooseZones").hide();
        $("#chooseAcpans").hide();
    }

    if (type == "tdJcQua") {
        $("#mFBtn").show();
        $("#maintenDmJc").show();
        $("#maintenIfsdJc").show();
    }

    $("#dmOrIfsdChoosePre").hide();
    $("#dmOrIfsdChooseSuff").hide();
    // $("#ifsdChoosePre").hide();
    // $("#ifsdChooseSuff").hide();
    $("#inputDays").hide();

    InitFuncCodeRequest_({
        data: {
            domainCode: "TD_JC_APP_TYPE,DA_FLEET,TD_JC_STATUS,YESORNO,TD_JC_FROM_TO,TD_JC_MODEL,TD_JC_STATE,TD_JC_CHECKLEVEL,TD_JC_SKILLS,TD_JC_MATER_SORT,TD_JC_MATER_TYPE,TD_JC_MATER_UNIT,TD_JC_MATER_IMPORTANCE,TD_JC_EXTEND,TD_RELAT_JC_PRE,TD_MANUAL_TYPE,TD_EXE_FEED_OBJ,TD_ATA,TD_JC_CHECKLEVEL,TD_JC_AHEAD_DAYS,TD_SMJC_WORK_TYPE,TD_RELAT_JC_PRE,DA_ENG_TYPE,QUANTITY_IF_DEMAND,TD_JC_APPENDIX_TYPE,TD_JC_APPENDIX_IF_APL",
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
                            $('#fleet').combobox({required: true, editable: false, onlyview: false});
                            $('#fleet').combobox({
                                panelHeight: '115px',
                                data: jdata.data.DA_FLEET,
                                valueField: 'VALUE',
                                textField: 'TEXT'
                            });
                        } else if (item.VALUE == 'ENG') { //发动机
                            $('#fleet').combobox({required: true, editable: false, onlyview: false});
                            $('#fleet').combobox({
                                panelHeight: '115px',
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
                //工卡类型
                $('#jcModel').combobox({
                    panelHeight: '140px',
                    data: jdata.data.TD_JC_MODEL,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                //检验级别
                $('#checkLevel').combobox({
                    panelHeight: '50px',
                    data: jdata.data.TD_JC_CHECKLEVEL,
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
                $('#checkLevel').combobox({
                    panelHeight: '60px',
                    data: jdata.data.TD_JC_CHECKLEVEL,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    value: 'B'
                });
                $('#skills').combobox({
                    panelHeight: '70px',
                    data: jdata.data.TD_JC_SKILLS,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                $('#ifSubstantRev').combobox({
                    panelHeight: '50px',
                    data: jdata.data.YESORNO,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    value: 'N',
                });
                //关联工卡
                $('#acJcPre').combobox({
                    panelHeight: '50px',
                    data: jdata.data.TD_RELAT_JC_PRE,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    onSelect: function (item) {
                        if (item.VALUE == 'PRE' || item.VALUE == 'ST') {
                            $("#acJcSuff").next().show();
                            $("#acJcSuff").textbox({required: true});
                            $("#preRelateJc").show();
                            $("#resetRelateJc").show();
                            $("#acJcSuff").textbox('setValue', '');
                        } else {
                            $("#acJcSuff").hide();
                            $("#preRelateJc").hide();
                            $("#acJcSuff").textbox('setValue', '');
                        }
                    }
                });
                //工作类型
                $("#taskCode").combobox({
                    panelHeight: '140px',
                    data: jdata.data.TD_SMJC_WORK_TYPE,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                //构型差异标识
                $('#configDiffIdenty').combobox({
                    panelHeight: '50px',
                    data: jdata.data.YESORNO,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    value: 'N',
                    onSelect: function (item) {
                        if (item.VALUE == 'Y') {
                            $("#configDiffContent").textbox({required: true, editable: true, onlyview: false})
                        } else {
                            $("#configDiffContent").textbox({required: false, editable: false, onlyview: true});
                            $("#configDiffContent").textbox('setValue', '');
                        }
                    }

                });
                //參考文件类型
                $('#refdataType').combobox({
                    panelHeight: '50px',
                    data: jdata.data.TD_MANUAL_TYPE,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                //执行反馈对象
                $('#exeFeedObj').combobox({
                    panelHeight: '70px',
                    data: jdata.data.TD_EXE_FEED_OBJ,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    value: 'NONE',
                    onSelect: function (item) {
                        $("#exeObjIds").val("");
                        if (item.VALUE == 'JC_EDITOR' || item.VALUE == 'OTHER') {
                            $("#exeFeedObjEmail").textbox({required: true, editable: false});
                            $("#exeFeedObjEmail").textbox('setValue', '');
                            $("#chooseExeFeedObj").show();
                        } else {
                            $("#exeFeedObjEmail").textbox({
                                value: '',
                                required: false,
                                editable: false,
                                onlyview: true
                            });
                            $("#chooseExeFeedObj").hide();
                            // //执行反馈对象邮箱
                            // $("#exeFeedObjEmail").MyComboGrid({
                            //     idField: 'EMAIL',  //实际选择值
                            //     textField: 'EMAIL', //文本显示值
                            //     panelWidth: '400px',
                            //     panelHeight: '200px',
                            //     width: 220,
                            //     required: true,
                            //     params: {FunctionCode: 'GET_EXE_FB_EMAIL'},
                            //     columns: [[
                            //         {field: 'JOB_NO', title: '工号', width: 50},
                            //         {field: 'NAME', title: '姓名', width: 50},
                            //         {field: 'EMAIL', title: '邮箱', width: 50}
                            //     ]],
                            //     onSelect: function (index, row) {
                            //         var otherFbObj = row.NAME + "(" + row.JOB_NO + ")";
                            //         selectRow = otherFbObj;
                            //         $("#exeFeedObjEmail").combogrid('setValue', otherFbObj);
                            //     },
                            //     onHidePanel: function () {
                            //         var t = $(this).combogrid('getValue');
                            //         if (t != null && t != '' & t != undefined) {
                            //             if (selectRow == null || t != selectRow) {//没有选择或者选项不相等时清除内容
                            //                 alert('请选择，不要直接输入！');
                            //                 $(this).combogrid({value: ''});
                            //             }
                            //         }
                            //     }
                            // });
                        }
                    }
                });
                // //执行反馈对象邮箱
                // $("#exeFeedObjEmail").MyComboGrid({
                //     idField: 'EMAIL',  //实际选择值
                //     textField: 'EMAIL', //文本显示值
                //     panelWidth: '400px',
                //     panelHeight: '200px',
                //     width: 220,
                //     params: {FunctionCode: 'GET_EXE_FB_EMAIL'},
                //     columns: [[
                //         {field: 'JOB_NO', title: '工号', width: 50},
                //         {field: 'NAME', title: '姓名', width: 50},
                //         {field: 'EMAIL', title: '邮箱', width: 50}
                //     ]],
                //     onSelect: function (index, row) {
                //         var otherFbObj = row.NAME + "(" + row.JOB_NO + ")";
                //         selectRow = otherFbObj;
                //         $("#exeFeedObjEmail").combogrid('setValue', otherFbObj);
                //     },
                //     onHidePanel: function () {
                //         var t = $(this).combogrid('getValue');
                //         if (t != null && t != '' & t != undefined) {
                //             if (selectRow == null || t != selectRow) {//没有选择或者选项不相等时清除内容
                //                 alert('请选择，不要直接输入！');
                //                 $(this).combogrid({value: ''});
                //             }
                //         }
                //     }
                // });
                //ATA
                $("#ata").combobox({
                    panelHeight: '80px',
                    data: jdata.data.TD_ATA,
                    valueField: 'VALUE',
                    textField: 'TEXT',
                    onChange: function (value) {
                        var nrcJcPkid = $("#pkid").val();
                        if (nrcJcPkid == null || nrcJcPkid == '' || nrcJcPkid == undefined) {
                            if ($('#fleet').combobox('getValue') == null || $('#fleet').combobox('getValue') == "") {
                                MsgAlert({content: "请先选择【型号】！", type: 'error'});
                                $("#ata").combobox('setValue', '');
                            } else {
                                proJcNo();
                            }
                        }
                    }
                });
                //
                $('#editRemindBeforeExeDays').combobox({
                    panelHeight: '90px',
                    data: jdata.data.TD_JC_AHEAD_DAYS,
                    valueField: 'VALUE',
                    textField: 'TEXT'
                });
                //航材/工具
                PAGE_DATA['materSort'] = DomainCodeToMap_(jdata.data["TD_JC_MATER_SORT"]);
                //航材类别
                PAGE_DATA['materType'] = DomainCodeToMap_(jdata.data["TD_JC_MATER_TYPE"]);
                //数量按需
                PAGE_DATA['qtyReq'] = DomainCodeToMap_(jdata.data["QUANTITY_IF_DEMAND"]);
                //单位
                // PAGE_DATA['unit'] = DomainCodeToMap_(jdata.data["TD_JC_MATER_UNIT"]);
                //适用情况（是否视情）
                PAGE_DATA['importance'] = DomainCodeToMap_(jdata.data["TD_JC_MATER_IMPORTANCE"]);
                //关联工卡
                PAGE_DATA['relateType'] = DomainCodeToMap_(jdata.data["TD_RELAT_JC_PRE"]);

                //适用类型
                PAGE_DATA['appendixAppType'] = DomainCodeToMap_(jdata.data["TD_JC_APP_TYPE"]);
                //附录类型
                PAGE_DATA['appendixType'] = DomainCodeToMap_(jdata.data["TD_JC_APPENDIX_TYPE"]);
                //是否适用
                PAGE_DATA['appendixIfApply'] = DomainCodeToMap_(jdata.data["TD_JC_APPENDIX_IF_APL"]);


            }

            if (type == 'view') {
                $("#saveBtn").hide();
                $("#editBtn").hide();
                $("#submitBtn").hide();
                $("#ffSearch").hide();
                $("#delayApplyBtn").hide();
            }

            var nrcJcPkid = $("#pkid").val();

            if (nrcJcPkid == null || nrcJcPkid == '' || nrcJcPkid == undefined) {
                if (type == "add" && from == "CUS") {
                    $('#ata').textbox({
                        onChange: function (value) {
                            // if ($('#fleet').combobox('getValue') == null || $('#fleet').combobox('getValue') == "") {
                            //     $('#ata').textbox('setValue', '');
                            //     MsgAlert({content: "请先选择【型号】！", type: 'error'});
                            // } else {
                            proJcNo();
                            // }
                        }
                    });
                    $('#fleet').combobox({
                        onChange: function (newValue, oldValue) {
                            // if ($("#fleet").combobox('getValue') != null && $("#fleet").combobox('getValue') != "") {
                            proJcNo();
                            // $("#jcNoPre").textbox('setValue', "NSJC" + "-" + $("#fleet").combobox('getValue') + "-");
                            // }
                        }
                    });
                }
            }


            if (jcPkid) {
                InitDataForm(jcPkid, jcNo);
                InitDataGrid(jcPkid);
                InitDataGrid1(jcPkid);
                InitDataGrid2(jcPkid);
                InitDataGrid3(jcNo);
            } else {
                $("#exeFeedObjEmail").textbox({required: false, editable: false, onlyview: true});
                $("#chooseExeFeedObj").hide();
                InitDataGrid(-1);
                InitDataGrid1(-1);
                InitDataGrid2(-1);
                InitDataGrid3("-1");
            }


            $("#planHours").textbox({
                onChange: function (value) {
                    calculateSH(value);
                }
            })

        }
    })
}

function InitDataForm(pkid, jcNo) {

    $("#pkid").val(pkid);
    InitFuncCodeRequest_({
        data: {pkid: pkid, jcNo: jcNo, FunctionCode: "TD_JC_NRCJC_BY_PKID"}, successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {

                ParseFormField_(jdata.data, $("#mform"), Constant.CAMEL_CASE);

                fleet = jdata.data.FLEET;
                companyCode = jdata.data.COMPANY_CODE;
                appType = jdata.data.APP_TYPE;
                jcType = jdata.data.JC_TYPE;

                //工卡号回显
                var nsjcNo = jdata.data.JC_NO;
                evaManId = jdata.data.WRITER;
                var num = nsjcNo.split("-").length - 1;
                if (num == 4) {
                    var nsjcNoPre = nsjcNo.substring(0, nsjcNo.lastIndexOf("-"));
                    $("#jcNoPre").textbox('setValue', nsjcNoPre);
                    var nsjcNoSuffix = nsjcNo.substring(nsjcNo.lastIndexOf("-") + 1, nsjcNo.length);
                    $("#jcNoSuffix").textbox('setValue', nsjcNoSuffix);
                } else if (num == 3) {
                    $("#jcNoPre").textbox('setValue', nsjcNo);
                }

                CEP_CHECKOUT = jdata.data.CEP_CHECKOUT;
                CEP_FILE_PATH = jdata.data.CEP_FILE_PATH;
                obj = jdata.data;
                $("#mopNo").val(jdata.data.MOP_NO);
                $("#exeObjIds").val(jdata.data.EXE_FEED_OBJ_EMAIL);

                // if (jdata.data.EXE_FEED_OBJ == 'OTHER') {
                //     $("#exeFeedObjEmail").combogrid({
                //         value: jdata.data.EXE_FEED_OBJ_EMAIL,
                //         editable: true,
                //         onlyview: false
                //     });
                //     selectRow.EMAIL = jdata.data.EXE_FEED_OBJ_EMAIL;
                // }
                if (jdata.data.EXE_FEED_OBJ == "NONE" || jdata.data.EXE_FEED_OBJ == "" || jdata.data.EXE_FEED_OBJ == undefined || jdata.data.EXE_FEED_OBJ == null) {
                    $("#exeFeedObjEmail").textbox({value: '', required: false, editable: false, onlyview: true});
                    $("#chooseExeFeedObj").hide();
                } else {
                    $("#exeFeedObjEmail").textbox({required: true, editable: true, onlyview: false})
                }

                if (jdata.data.EDIT_REMIND_BEFORE_EXE != null && jdata.data.EDIT_REMIND_BEFORE_EXE != undefined && jdata.data.EDIT_REMIND_BEFORE_EXE != '') {
                    if ("on" == jdata.data.EDIT_REMIND_BEFORE_EXE) {
                        $("#editRemindBeforeExe").attr("checked", true);
                        $("#inputDays").show();
                    } else {
                        $("#editRemindBeforeExe").attr("checked", false);
                        $("#inputDays").hide();
                    }
                }

                //获取MARK信息
                InitFuncCodeRequest_({
                    data: {
                        pkid: pkid,
                        FunctionCode: "TD_JC_EDIT_MARK_GET"
                    },
                    successCallBack: function (jdata1) {
                        if (jdata1.code == RESULT_CODE.SUCCESS_CODE) {
                            for (var i = 0; i < jdata1.data.length; i++) {
                                $("#" + jdata1.data[i].JC_MARK.toLowerCase()).attr("checked", true);
                            }
                            var dmCheck = $("#dm").is(':checked');
                            var ifsdCheck = $("#ifsd").is(':checked');

                            if (!dmCheck && !ifsdCheck) { //无DM无IFSD
                                $("#dmOrIfsdChoosePre").hide();
                                $("#dmOrIfsdChooseSuff").hide();
                                $("#dmOrIfsdRelateJc").textbox({required: false})
                            } else {
                                $("#dmOrIfsdChoosePre").show();
                                $("#dmOrIfsdChooseSuff").show();
                                $("#dmOrIfsdRelateJc").textbox({required: true});
                                console.log(jcNo);
                                //获取DM或IFSD关联工卡
                                InitFuncCodeRequest_({
                                    data: {
                                        jcPkid: pkid,
                                        FunctionCode: "TD_JC_EDIT_DM_IFSD_RELATE_GET_NEW"
                                    },
                                    successCallBack: function (jdata4) {
                                        if (jdata4.code == RESULT_CODE.SUCCESS_CODE) {
                                            if (jdata4.data != null) {
                                                $("#dmOrIfsdRelateJc").textbox('setValue', jdata4.data.RELATE_JC_NO)
                                            } else {
                                                $("#dmOrIfsdRelateJc").textbox('setValue', '')
                                            }
                                        }
                                    }
                                });
                            }

                            // if (ifsdCheck) {
                            //     $("#ifsdChoosePre").show();
                            //     $("#ifsdChooseSuff").show();
                            //     console.log(jcNo);
                            //     //获取DM或IFSD关联工卡
                            //     InitFuncCodeRequest_({
                            //         data: {
                            //             jcNo: jcNo,
                            //             FunctionCode: "TD_JC_EDIT_DM_IFSD_RELATE_GET"
                            //         },
                            //         successCallBack: function (jdata3) {
                            //             if (jdata3.code == RESULT_CODE.SUCCESS_CODE) {
                            //                 if (jdata3.data != null) {
                            //                     $("#ifsdRelateJc").textbox('setValue', jdata3.data.RELATE_JC_NO)
                            //                 } else {
                            //                     $("#ifsdRelateJc").textbox('setValue', '')
                            //                 }
                            //             }
                            //         }
                            //     });
                            // } else {
                            //     $("#ifsdChoosePre").hide();
                            //     $("#ifsdChooseSuff").hide();
                            // }
                        }
                    }
                });

                $("#cepCheckout").attr('value', CEP_CHECKOUT);

                var configDiffIdenty = $("#configDiffIdenty").combobox('getValue');
                if ("N" == configDiffIdenty) {
                    $("#configDiffContent").textbox('setValue', '');
                    $("#configDiffContent").textbox({editable: false, onlyview: true});
                } else {
                    $("#configDiffContent").textbox({editable: true, onlyview: false})
                }

                //获取适用性
                InitFuncCodeRequest_({
                    data: {pkid: jcPkid, appType: appType, FunctionCode: "TD_NSJC_EDIT_APPLY_GET"},
                    successCallBack: function (jdata4) {
                        if (jdata4.code == RESULT_CODE.SUCCESS_CODE) {
                            $("#applicability").textbox('setValue', jdata4.data);
                        }
                    }
                });

                //获取其他反馈对象
                InitFuncCodeRequest_({
                    data: {
                        exeObjs: jdata.data.EXE_FEED_OBJ_EMAIL,
                        exeObjType: jdata.data.EXE_FEED_OBJ,
                        FunctionCode: "TD_GET_EXE_FEED_OBJ_BYID"
                    },
                    successCallBack: function (jdata5) {
                        if (jdata5.code == RESULT_CODE.SUCCESS_CODE) {
                            $("#exeFeedObjEmail").textbox('setValue', jdata5.data);
                        }
                    }
                });

            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
}

function InitDataGrid(jc_pkid) {
    var pageSize = Math.floor(($(document.body).height() - $("fieldset").height() - 185) / 50);
    $("#dg").MyDataGrid({
        identity: "dg",
        sortable: true,
        singleSelect: true,
        pageSize: 10,
        pageList: [pageSize],
        resize: function () {
            return tabs_standard_resize($("#tt"), 0.13, 0.0001, 5, 4);
        },
        queryParams: {jcPkid: jc_pkid},
        columns: {
            param: {FunctionCode: 'TD_JC_MATER_LIST'},
            alter: {
                TEST_UPLOAD: {},
                MATER_SORT: {
                    formatter: function (value) {
                        return PAGE_DATA['materSort'][value];
                    }
                },
                MATER_TYPE: {
                    formatter: function (value) {
                        return PAGE_DATA['materType'][value];
                    }
                },
                QTY_REQ: {
                    formatter: function (value) {
                        return PAGE_DATA['qtyReq'][value];
                    }
                },
                // UNIT: {
                //     formatter: function (value) {
                //         return PAGE_DATA['unit'][value];
                //     }
                // },
                IMPORTANCE: {
                    formatter: function (value) {
                        return PAGE_DATA['importance'][value];
                    }
                }
            }
        },
        contextMenus: [
            {
                id: "m-edit",
                i18nText: "编辑",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    editMater("edit", rowData.PKID);
                }
            }, {
                id: "m-delete",
                i18nText: "删除",
                onclick: function () {
                    var rowData = getDG('dg').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (!confirm("确认删除该记录？")) {
                        return;
                    }
                    InitFuncCodeRequest_({
                        data: {pkid: rowData.PKID, FunctionCode: 'TD_JC_MATER_DELETE'},
                        successCallBack: function (jdata) {
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                reloadMaterAndTool();
                            } else {
                                MsgAlert({content: jdata.msg, type: 'error'});
                            }
                        }
                    });
                }
            }
        ],
        validAuth: function (row, items) {
            if (jcProcessStatus == 'EDIT' || jcProcessStatus == 'EDITED') {
                items['编辑'].display = true;
                items['删除'].display = true;
            } else {
                items['编辑'].display = false;
                items['删除'].display = false;
            }
            return items;
        },
        onClickRow: function (rowIndex, rowData) {

        }
    });
}

//关联手册
function InitDataGrid1(jc_pkid) {
    var pageSize = Math.floor(($(document.body).height() - $("fieldset").height() - 185) / 50);
    $("#dg1").MyDataGrid({
        identity: "dg1",
        sortable: true,
        singleSelect: true,
        pageSize: 10,
        pageList: [pageSize],
        resize: function () {
            return tabs_standard_resize($("#tt"), 0.13, 0.0001, 5, 4);
        },
        queryParams: {jcPkid: jc_pkid},
        columns: {
            param: {FunctionCode: 'TD_JC_RELATE_MANUAL_LIST'},
        },
        contextMenus: [
            {
                id: "m-delete",
                i18nText: "取消关联",
                onclick: function () {
                    var rowData = getDG('dg1').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (!confirm("确认取消关联吗？")) {
                        return;
                    }
                    InitFuncCodeRequest_({
                        data: {pkid: rowData.PKID, FunctionCode: 'TD_JC_RELATE_MANUAL_DELETE'},
                        successCallBack: function (jdata) {
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                reloadRelateManual();
                            } else {
                                MsgAlert({content: jdata.msg, type: 'error'});
                            }
                        }
                    });
                }
            }
        ],
        validAuth: function (row, items) {
            if (row.CREATE_BY == userLogin || userLogin == '1') {
                if (flowStatus == "AUDIT" || flowStatus == "RATIFY") { //审核
                    items['取消关联'].display = false;
                }
                if (status != 'EDIT') {
                    items['取消关联'].enable = false;
                }
            }
            if (flowStatus == "AUDIT" || flowStatus == "RATIFY") { //审核、审批
                items['取消关联'].display = false;
            }
            return items;
        },
        onClickRow: function (rowIndex, rowData) {

        }
    });
}

//关联工卡
function InitDataGrid2(jcPkid) {
    var pageSize = Math.floor(($(document.body).height() - $("fieldset").height() - 185) / 50);
    $("#dg2").MyDataGrid({
        identity: "dg2",
        sortable: true,
        singleSelect: true,
        pageSize: 10,
        pageList: [pageSize],
        resize: function () {
            return tabs_standard_resize($("#tt"), 0.13, 0.0001, 5, 4);
        },
        queryParams: {jcPkid: jcPkid},
        columns: {
            param: {FunctionCode: 'TD_JC_RELATE_JOBCARD_LIST'},
            alter: {
                RELATE_TYPE: {
                    formatter: function (value) {
                        return PAGE_DATA['relateType'][value];
                    }
                }
            }
        },
        contextMenus: [
            {
                id: "m-delete",
                i18nText: "取消关联",
                onclick: function () {
                    var rowData = getDG('dg2').datagrid('getSelected');
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (!confirm("确认删除该记录？")) {
                        return;
                    }
                    InitFuncCodeRequest_({
                        data: {pkid: rowData.PKID, FunctionCode: 'TD_JC_RELATE_JOBCARD_DELETE'},
                        successCallBack: function (jdata) {
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                reloadRelateJobcard();
                            } else {
                                MsgAlert({content: jdata.msg, type: 'error'});
                            }
                        }
                    });
                }
            }
        ],
        validAuth: function (row, items) {
            if (row.CREATE_BY == userLogin || userLogin == '1') {
                if (flowStatus == "AUDIT" || flowStatus == "RATIFY") { //审核、批准
                    items['取消关联'].display = false;
                }
                if (status != 'EDIT') {
                    items['取消关联'].enable = false;
                }
            }
            if (flowStatus == "AUDIT" || flowStatus == "RATIFY") { //审核、审批
                items['取消关联'].display = false;
            }
            return items;
        },
        onClickRow: function (rowIndex, rowData) {

        }
    });
}

//自定义参考资料
function InitDataGrid3(jcNo) {
    var pageSize = Math.floor(($(document.body).height() - $("fieldset").height() - 185) / 50);
    $("#dg3").MyDataGrid({
        identity: "dg3",
        sortable: true,
        singleSelect: true,
        pageSize: 10,
        pageList: [pageSize],
        resize: function () {
            return tabs_standard_resize($("#tt"), 0.13, 0.0001, 5, 4);
        },
        queryParams: {jcNo: jcNo},
        columns: {
            param: {FunctionCode: 'TD_JC_RELATE_APPENDIX_LIST'},
            alter: {
                APP_TYPE: {
                    formatter: function (value) {
                        return PAGE_DATA['appendixAppType'][value];
                    }
                },
                APPEND_TYPE: {
                    formatter: function (value) {
                        return PAGE_DATA['appendixType'][value];
                    }
                },
                APPEND_STATE: {
                    formatter: function (value) {
                        return PAGE_DATA['appendixIfApply'][value];
                    }
                }
            }
        },
        contextMenus: [
            {
                id: "m-delete",
                i18nText: "取消关联",
                onclick: function () {
                    var rowData = getDG('dg3').datagrid('getSelected');
                    var jcNoPre = $("#jcNoPre").textbox('getValue');
                    var jcNoSuffix = $("#jcNoSuffix").textbox('getValue');
                    var jcNo = jcNoPre + "-" + jcNoSuffix;
                    if (!rowData.PKID) {
                        MsgAlert({content: "请选择数据！", type: 'error'});
                        return;
                    }
                    if (!confirm("确认取消关联该条记录？")) {
                        return;
                    }
                    InitFuncCodeRequest_({
                        data: {appendixPkid: rowData.PKID, jcNo: jcNo, FunctionCode: 'TD_JC_RELATE_APPEND_DELETE'},
                        successCallBack: function (jdata) {
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
                                reloadRelateAppendix();
                            } else {
                                MsgAlert({content: jdata.msg, type: 'error'});
                            }
                        }
                    });
                }
            }
        ],
        validAuth: function (row, items) {
            if (row.CREATE_BY == userLogin || userLogin == '1') {
                if (flowStatus == "AUDIT" || flowStatus == "RATIFY") { //审核、批准
                    items['取消关联'].display = false;
                }
                if (status != 'EDIT') {
                    items['取消关联'].enable = false;
                }
            }
            if (flowStatus == "AUDIT" || flowStatus == "RATIFY") { //审核、审批
                items['取消关联'].display = false;
            }
            return items;
        },
        onClickRow: function (rowIndex, rowData) {

        }
    });
}

// 保存
function save() {
    var jcNo;
    console.log(type);
    var jcPkid = $("#pkid").val();
    var jcNoPre = $("#jcNoPre").textbox('getValue');
    var jcNoSuffix = $("#jcNoSuffix").textbox('getValue');
    if(jcNoSuffix == null || jcNoSuffix == '' || jcNoSuffix == undefined){
        jcNo = jcNoPre;
    }else{
        jcNo = jcNoPre + "-" + jcNoSuffix;
    }
    if (jcNo == null || jcNo == undefined || jcNo == '') {
        MsgAlert({content: "工卡号为空，不能保存！", type: 'error'});
        return;
    }
    var isValidate = $("#mform").form('validate');
    if (!isValidate) {
        return;
    }

    if (type == "add") {
        if (jcPkid == null || jcPkid == '' || jcPkid == undefined) {
            var ver = 0;
            InitFuncCodeRequest_({
                data: {jcNo: jcNo, ver: ver, FunctionCode: "TD_JC_ALL_REPEAT_CHECK"},
                successCallBack: function (jdata) {
                    if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                        console.log(jdata);
                        if (jdata.data != null) {
                            MsgAlert({content: "【工卡号】重复，请检查。保存失败！", type: 'error'});
                        } else {
                            saveOrEditJobcard(jcNo, type);
                        }
                    } else {
                        MsgAlert({content: "检查唯一性失败", type: 'error'});

                    }
                }
            });
        } else {
            type = 'edit';
            saveOrEditJobcard(jcNo, type);
        }
    } else {
        saveOrEditJobcard(jcNo, type);
    }
}

function saveOrEditJobcard(jcNo, operation) {
    var $form = $("#mform");
    var datas = $form.serializeObject();
    var ifsd, ad, rii, ali, cdccl, ewis, fts, dm, rci, cpcp, offAc, elt;
    var exeObjIdInfo = $("#exeObjIds").val();

    if ($("#ifsd").is(':checked')) {
        ifsd = $("#ifsd").attr("value") + ",";
    } else {
        ifsd = "";
    }

    if ($("#ad").is(':checked')) {
        ad = $("#ad").attr("value") + ",";
    } else {
        ad = "";
    }

    if ($("#rii").is(':checked')) {
        rii = $("#rii").attr("value") + ",";
    } else {
        rii = "";
    }

    if ($("#ali").is(':checked')) {
        ali = $("#ali").attr("value") + ",";
    } else {
        ali = "";
    }

    if ($("#cdccl").is(':checked')) {
        cdccl = $("#cdccl").attr("value") + ",";
    } else {
        cdccl = "";
    }

    if ($("#ewis").is(':checked')) {
        ewis = $("#ewis").attr("value") + ",";
    } else {
        ewis = "";
    }

    if ($("#fts").is(':checked')) {
        fts = $("#fts").attr("value") + ",";
    } else {
        fts = "";
    }

    if ($("#dm").is(':checked')) {
        dm = $("#dm").attr("value") + ",";
    } else {
        dm = "";
    }

    if ($("#rci").is(':checked')) {
        rci = $("#rci").attr("value") + ",";
    } else {
        rci = "";
    }


    if ($("#cpcp").is(':checked')) {
        cpcp = $("#cpcp").attr("value") + ",";
    } else {
        cpcp = "";
    }

    if ($("#off-ac").is(':checked')) {
        offAc = $("#off-ac").attr("value") + ",";
    } else {
        offAc = "";
    }

    if ($("#elt").is(':checked')) {
        elt = $("#elt").attr("value") + ",";
    } else {
        elt = "";
    }

    var markInfo = ifsd + ad + rii + ali + cdccl + ewis + fts + dm + rci + cpcp + offAc + elt;

    if (markInfo == "" || markInfo == null || markInfo == undefined) {
        markInfo = "";
    } else {
        markInfo = markInfo.substring(0, markInfo.lastIndexOf(","));
    }

    // MsgAlert({content:"[项目号]或[参考资料] 中包含空白格，已自动去除优化!"});
    datas = $.extend({
        jcType: jcType,
        type: operation,
        markInfo: markInfo,
        exeObjIdInfo: exeObjIdInfo,
        jcNo: jcNo
    }, datas, {FunctionCode: 'TD_JC_ALL_ADD_NSJC'});
    InitFuncCodeRequest_({
        data: datas, successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                // if (param.OWindow.onSearch_) {
                //     param.OWindow.onSearch_(identity, '#ffSearch1');
                // };
                if(onSearch_ && typeof onSearch_ === "function"){
                    onSearch_(identity, '#ffSearch1');
                };
                if (type == "add" || type == "cmpadd") {
                    $("#pkid").val(jdata.data.pkid);
                    jcPkid = jdata.data.pkid;
                    $("#appType").combobox({required: false, editable: false, onlyview: true});
                    $("#appType").combobox('setValue', jdata.data.appType);
                    $("#fleet").combobox({required: false, editable: false, onlyview: true});
                    $("#fleet").combobox('setValue', jdata.data.fleet);
                    $("#ata").combobox({required: false, editable: false, onlyview: true});
                    $("#ata").combobox('setValue', jdata.data.ata);
                    $("#ver").textbox('setValue', jdata.data.ver);
                    status = 'EDIT';
                }
                InitDataGrid(jdata.data.pkid);
                InitDataGrid1(jdata.data.pkid);
                InitDataGrid2(jdata.data.pkid);
                InitDataForm(jdata.data.pkid, jdata.data.jcNo);
                if (param.OWindow && typeof param.OWindow.reload_ == 'function') {
                    param.OWindow.reload_();
                }
                MsgAlert({content: jdata.msg ? jdata.msg : $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
            } else {
                MsgAlert({content: jdata.msg ? jdata.msg : jdata.data, type: 'error'});
            }
        }
    });
}

function submitWorkflow() {

    var isValidate = $("#mform").form('validate');
    if (!isValidate) {
        return;
    }
    var msgArr = [];
    if (obj.STATUS != "EDITED") {
        // MsgAlert({content: "提交只能提交 【修订完成】的数据。", type: 'error'});
        // return;
        msgArr.push("提交只能提交【修订完成】的数据！");
    }
    if (CEP_FILE_PATH == null || CEP_FILE_PATH == "") {
        // MsgAlert({content: "当前没有工序文件，不能进行提交。", type: 'error'});
        // return;
        msgArr.push("当前没有工序文件，不能进行提交");
    }
    if (CEP_CHECKOUT != "" && CEP_CHECKOUT == "Y") {
        // MsgAlert({content: "当前文件已被检出，不能进行提交。", type: 'error'});
        // return;
        msgArr.push("当前没有工序文件，不能进行提交");
    }
    if (msgArr.length > 0) {
        hints(msgArr);
    } else {
        //校验编写期限是否到期
        var curJcWriteLimit = $("#writeLimit").datebox('getValue');
        InitFuncCodeRequest_({
            data: {curJcWriteLimit: curJcWriteLimit, FunctionCode: "TD_CHECK_WRITE_LIMIT_IF_EXPIRE"},
            successCallBack: function (jdata) {
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    if (!confirm("确认提交该记录？")) {
                        return;
                    }
                    checkQua();
                } else {
                    MsgAlert({content: jdata.msg, type: 'error'});
                }
            }
        })
    }
}

function previewPDF() {
    var jc_pkid = $("#pkid").val();
    if (jc_pkid == null || jc_pkid == "") {
        MsgAlert({content: "请先保存工卡封面数据！", type: 'error'});
        return;
    }
    var data = $.extend({pkid: jcPkid}, {FunctionCode: 'TD_JC_PREVIEW'});
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

//打开航材详情页
function addMater(operation) {
    var pkid = $("#pkid").val();
    var fleet = $("#fleet").textbox('getValue');
    if ($.trim(pkid) == '') {
        alert("请先保存工卡封面，再添加航材信息！");
        return;
    }
    var title_ = $.i18n.t('航材工具详情');
    ShowWindowIframe({
        width: "600",
        height: "220",
        title: title_,
        param: {pkid: pkid, fleet: fleet, type: operation},
        url: "/views/td/jobcard/mater/tdJcMaterDetail.shtml"
    });
}

function editMater(operation, materPkid) {
    var fleet = $("#fleet").textbox('getValue');
    var title_ = $.i18n.t('航材工具详情');
    ShowWindowIframe({
        width: "600",
        height: "360",
        title: title_,
        param: {pkid: materPkid, fleet: fleet, type: operation},
        url: "/views/td/jobcard/mater/tdJcMaterDetail.shtml"
    });
}

function batchDelete() {
    var selectRows = $("#dg").datagrid('getChecked');
    var selectCount = selectRows.length;
    if (selectCount == 0) {
        MsgAlert({content: '请选择要删除的记录！', type: 'error'});
        return;
    }
    if (!confirm("确认删除选中的记录？")) {
        return;
    }
    var pkids = '';

    $.each(selectRows, function (k, item) {
        pkids += item.PKID + ',';
    });

    pkids = pkids.substring(0, pkids.length - 1);
    InitFuncCodeRequest_({
        data: {pkids: pkids, FunctionCode: 'TD_JC_MATER_DELETE_BATCH'},
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

function reload_() {
    $("#dg").datagrid("reload");
    var pkid = $("#pkid").val();
    var jcNoPre = $("#jcNoPre").textbox('getValue');
    var jcNoSuffix = $("#jcNoSuffix").textbox('getValue');
    var jcNo = "";
    if (jcNoSuffix == null || jcNoSuffix == undefined || jcNoSuffix == "") {
        jcNo = jcNoPre;
    } else {
        jcNo = jcNoPre + "-" + jcNoSuffix;
    }
    InitDataForm(pkid, jcNo);
}

function reloadRelateAppendix() {
    $("#dg3").datagrid("reload");
}

function manuallyExtractionMater() {
    if ($.trim(jcPkid) == null || $.trim(jcPkid) == "") {
        MsgAlert({content: "请先保存工卡封面，再进行手动提取航材信息！", type: 'error'});
        return;
    }
    if (!confirm("手动提取数据将会删除当前所有航材信息,是否继续？")) {
        return;
    }
    InitFuncCodeRequest_({
        data: {pkid: jcPkid, FunctionCode: 'TD_JC_ALL_NRCJC_MANUALLY'},
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

//验证工卡序列号只能输入一个字母
$.extend($.fn.validatebox.defaults.rules, {
    oneLetter: {
        validator: function (value) {
            return /[a-zA-Z]/i.test(value);
        },
        message: '只允许输入一个字母'
    }
});

function cepView(data) {
    $("#cepCheckout").val('N');
    $("#cepPkid").val(data.pkid);
    $("#cepFilePath").val(data.jcCepPath);
}

//选择DM
function chooseDm() {
    var dmCheck = $("#dm").is(':checked');
    var ifsdCheck = $("#ifsd").is(':checked');
    // if (ifsdCheck) {
    //     MsgAlert({content: "该工卡是IFSD类工卡！！！", type: 'error'});
    //     $("#dm").attr("checked", false);
    //     return;
    // }
    if ((dmCheck && !ifsdCheck) || (!dmCheck && ifsdCheck) || (dmCheck && ifsdCheck)) { // 有DM无IFSD、无DM有IFSD、有DM有IFSD
        $("#dmOrIfsdChoosePre").show();
        $("#dmOrIfsdChooseSuff").show();
        if ($.trim(jcPkid) == null || $.trim(jcPkid) == "") {
            $("#dmOrIfsdRelateJc").textbox({required: false});
        } else {
            $("#dmOrIfsdRelateJc").textbox({required: true});
        }
    } else if (!dmCheck && !ifsdCheck) { //无DM或无IFSD
        if (!confirm("确认取消DM/IFSD吗？若取消，DM/IFSD相关工卡信息则会清空")) {
            return;
        }
        //清除当前工卡下的DM/IFSD-MARK信息
        InitFuncCodeRequest_({
            data: {jcPkid: jcPkid, FunctionCode: "DELETE_DM_IFSD_MARK"},
            successCallBack: function (jdata) {
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    //清空DM/IFSD下的相关工卡信息
                    InitFuncCodeRequest_({
                        data: {jcNo: jcNo, FunctionCode: "DELETE_DM_IFSD_RELATE_JC"},
                        successCallBack: function (jdata) {
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                MsgAlert({content: $.i18n.t('DM/IFSD相关工卡已清空！')});
                            }
                        }
                    });
                }
            }
        });
        // //清空DM下的相关工卡信息
        // InitFuncCodeRequest_({
        //     data: {jcNo: jcNo, relateType: 'DM', FunctionCode: "DELETE_DM_RELATE_JC"},
        //     successCallBack: function (jdata) {
        //         if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
        //             MsgAlert({content: $.i18n.t('DM相关工卡已清空！')});
        //         }
        //     }
        // });
        $("#dmOrIfsdChoosePre").hide();
        $("#dmOrIfsdRelateJc").textbox('setValue', '');
        $("#dmOrIfsdRelateJc").textbox({required: false});
        $("#dmOrIfsdChooseSuff").hide();
    }
}

//选择IFSD
function chooseIfsd() {
    var ifsdCheck = $("#ifsd").is(':checked');
    var dmCheck = $("#dm").is(':checked');
    // if (dmCheck) {
    //     MsgAlert({content: "该工卡是DM类工卡！！！", type: 'error'});
    //     $("#ifsd").attr("checked", false);
    //     return;
    // }
    if ((ifsdCheck && !dmCheck) || (!ifsdCheck && dmCheck) || (ifsdCheck && dmCheck)) { //有IFSD无DM、无IFSD有DM、有IFSD有DM
        $("#dmOrIfsdChoosePre").show();
        $("#dmOrIfsdChooseSuff").show();
        if ($.trim(jcPkid) == null || $.trim(jcPkid) == "") {
            $("#dmOrIfsdRelateJc").textbox({required: false});
        } else {
            $("#dmOrIfsdRelateJc").textbox({required: true});
        }
    } else if (!ifsdCheck && !dmCheck) { //无IFSD无DM
        if (!confirm("确认取消DM/IFSD吗？若取消，DM/IFSD相关工卡信息则会清空")) {
            return;
        }
        //清楚当前工卡下的DM/IFSD-MARK信息
        InitFuncCodeRequest_({
            data: {jcPkid: jcPkid, FunctionCode: "DELETE_DM_IFSD_MARK"},
            successCallBack: function (jdata) {
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    //清空DM/IFSD下的相关工卡信息
                    InitFuncCodeRequest_({
                        data: {jcNo: jcNo, FunctionCode: "DELETE_DM_IFSD_RELATE_JC"},
                        successCallBack: function (jdata) {
                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                MsgAlert({content: $.i18n.t('DM/IFSD相关工卡已清空！')});
                            }
                        }
                    });
                }
            }
        });
        $("#dmOrIfsdChoosePre").hide();
        $("#dmOrIfsdRelateJc").textbox('setValue', '');
        $("#dmOrIfsdRelateJc").textbox({required: false});
        $("#dmOrIfsdChooseSuff").hide();
    }
}

//执行前编写提醒
function ifSelected() {
    var ifSelect = $("#editRemindBeforeExe").prop("checked");
    if (ifSelect) {
        $("#inputDays").show();
        $("#editRemindBeforeExeDays").combobox({required: true});
        // var aheadDays = "1";
        // $("#editRemindBeforeExeDays").combobox({value: aheadDays});
        InitFuncCodeRequest_({
            data: {domainCode: "TD_JC_AHEAD_DAYS", FunctionCode: "ANALYSIS_DOMAIN_BYCODE"},
            successCallBack: function (jdata) {
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    $('#editRemindBeforeExeDays').combobox({
                        panelHeight: '90px',
                        data: jdata.data.TD_JC_AHEAD_DAYS,
                        valueField: 'VALUE',
                        textField: 'TEXT'
                    });
                }
            }
        });
    } else {
        $("#inputDays").hide();
        $("#editRemindBeforeExeDays").combobox({required: false})

    }
}

//DM/IFSD关联工卡
function maintenDmOrIfsdJcFromMark() {
    if ($.trim(jcPkid) == null || $.trim(jcPkid) == "") {
        MsgAlert({content: "请先保存工卡封面！", type: 'error'});
        return;
    }
    var jcNo = "";
    var jcNoPre = $("#jcNoPre").textbox('getValue');
    var jcNoSuffix = $("#jcNoSuffix").textbox('getValue');
    if (jcNoSuffix == null || jcNoSuffix == '' || jcNoSuffix == undefined) {
        jcNo = jcNoPre;
    } else {
        jcNo = jcNoPre + "-" + jcNoSuffix;
    }
    var fleet = $("#fleet").textbox('getValue');
    var title_ = $("#maintenDmJc").val();
    var dmCheck = $("#dm").is(':checked');
    var ifsdCheck = $("#ifsd").is(':checked');
    var markType = "";
    if (dmCheck && !ifsdCheck) { //有DM无IFSD
        markType = "DM";
    } else if (dmCheck && ifsdCheck) { //有DM也有IFSD
        markType = "DM,IFSD";
    } else if (!dmCheck && ifsdCheck) { //无DM有IFSD
        markType = "IFSD";
    }
    ShowWindowIframe({
        width: "1280",
        height: "596",
        title: title_,
        param: {
            pkid: jcPkid,
            fleet: fleet,
            jcNo: jcNo,
            title: title_,
            jcType: jcType,
            companyCode: companyCode,
            markType: markType,
        },
        url: "/views/td/jobcard/smjc/smjcedit/tdRelateJc.shtml"
    });
}

// //DM/IFSD关联工卡
// function maintenDmOrIfsdJcFromMark(){
//     var jcNo = $("#jcNo").textbox('getValue');
//     var fleet = $("#fleet").textbox('getValue');
//     var title_ = $("#maintenDmOrIfsdJc").val();
//     var dmCheck = $("#dm").is(':checked');
//     var ifsdCheck = $("#ifsd").is(':checked');
//     var markType = "";
//     if(dmCheck && !ifsdCheck){ //有DM无IFSD
//         markType = "DM";
//     }else if(dmCheck && ifsdCheck){ //有DM也有IFSD
//         markType = "DM,IFSD";
//     }else if(!dmCheck && ifsdCheck){ //无DM有IFSD
//         markType = "IFSD";
//     }
//     ShowWindowIframe({
//         width: "1280",
//         height: "596",
//         title: title_,
//         param: {
//             pkid: jcPkid,
//             fleet: fleet,
//             jcNo: jcNo,
//             title: title_,
//             jcType: jcType,
//             companyCode: companyCode,
//             markType: markType
//         },
//         url: "/views/td/jobcard/smjc/smjcedit/tdRelateJc.shtml"
//     });
// }

// //IFSD关联工卡
// function maintenIfsdJcFromMark() {
//     var jcNo = "";
//     var fleet = $("#fleet").textbox('getValue');
//     var title_ = $("#maintenIfsdJc").val();
//     var jcNoPre = $("#jcNoPre").textbox('getValue');
//     var jcNoSuffix = $("#jcNoSuffix").textbox('getValue');
//     if (jcNoSuffix == null || jcNoSuffix == '' || jcNoSuffix == undefined) {
//         jcNo = jcNoPre;
//     } else {
//         jcNo = jcNoPre + "-" + jcNoSuffix;
//     }
//     ShowWindowIframe({
//         width: "1280",
//         height: "596",
//         title: title_,
//         param: {
//             pkid: jcPkid,
//             fleet: fleet,
//             jcNo: jcNo,
//             title: title_,
//             jcType: jcType,
//             companyCode: companyCode,
//             markType: 'IFSD'
//         },
//         url: "/views/td/jobcard/smjc/smjcedit/tdRelateJc.shtml"
//     });
// }

// //新件号申请
// function newPnRequest() {
//     partRequest();
// }

//添加其他参考文件
function addRelateManual() {
    var pkid = $("#pkid").val();
    if ($.trim(pkid) == '') {
        alert("请先保存工卡封面，再添加关联手册！");
        return;
    }
    var title_ = $.i18n.t('添加其他参考文件');
    ShowWindowIframe({
        width: "720",
        height: "300",
        title: title_,
        param: {pkid: pkid, fleet: fleet, companyCode: companyCode},
        url: "/views/td/jobcard/tdRelateManual/tdRelateManualSelect.shtml"
    });
}

//添加关联工卡
function addRelateJobcard() {
    var pkid = $("#pkid").val();
    if ($.trim(pkid) == '') {
        alert("请先保存工卡封面，再添加关联工卡！");
        return;
    }
    var title_ = $.i18n.t('添加关联工卡');
    var jcNo = "";
    var jcNoPre = $("#jcNoPre").textbox('getValue');
    var jcNoSuffix = $("#jcNoSuffix").textbox('getValue');
    if (jcNoSuffix == null || jcNoSuffix == '' || jcNoSuffix == undefined) {
        jcNo = jcNoPre;
    } else {
        jcNo = jcNoPre + "-" + jcNoSuffix;
    }
    ShowWindowIframe({
        width: "960",
        height: "500",
        title: title_,
        param: {jcPkid: pkid},
        url: "/views/td/jobcard/smjc/smjcedit/tdRelateJobcardSelect.shtml"
    });
}

function reloadRelateManual() {
    $("#dg1").datagrid("reload");
}

function reloadRelateJobcard() {
    $("#dg2").datagrid("reload");
}

function calculateSH(value) {

    var regex = new RegExp("[0-9]+([.]{1}[0-9]+){0,1}");
    if (regex.test(value)) {
        var standHours = value * 2;
        $("#standHours").textbox('setValue', standHours);
    }
}

//选择适用性
function chooseApplic() {
    var pkid = $("#pkid").val();
    if ($.trim(pkid) == '') {
        alert("请先保存工卡封面，再选择适用性!");
        return;
    }
    var appType = $("#appType").combobox('getValue');
    var aplApplic = $("#applicability").textbox('getValue');
    var fleet = $("#fleet").combobox('getValue');
    var title_ = $.i18n.t('添加适用性');
    if ("APL" == appType) { //机身
        ShowWindowIframe({
            width: "460",
            height: "500",
            title: title_,
            param: {nrcJcId: pkid, appType: appType, aplApplic: aplApplic, fleet: fleet},
            url: "/views/td/jobcard/nrcjc/tdNrcjcAplAppSelect.shtml"
        });
    } else { //发动机与部件
        ShowWindowIframe({
            width: "1180",
            height: "500",
            title: title_,
            param: {nrcJcId: pkid, appType: appType},
            url: "/views/td/jobcard/nrcjc/tdNrcjcEngOrPartAppSelect.shtml"
        });
    }
}

//编辑工序
function editScheduledCheckProcedure() {
    var title_ = $.i18n.t('编辑工序选项');
    var pkid = $("#pkid").val();
    var fleet = $("#fleet").combobox('getValue');
    var checkout = $("#cepCheckout").val();
    var cepFilePath = $("#cepFilePath").val();
    var refType = $("#refdataType").val();
    var refData = $("#refData").val();
    if ($.trim(pkid) == '') {
        MsgAlert({content: "请先保存工卡封面，再进行工序编辑。", type: 'error'});
        return;
    }
    ShowWindowIframe({
        width: "500",
        height: "200",
        title: title_,
        param: {
            jcPkid: pkid,
            fleet: fleet,
            cepcheckout: checkout,
            cepfilepath: cepFilePath,
            refType: refType,
            refData: refData,
            companyCode: companyCode,
            pageCounter: pageCount,
            userlogin: userLogin,
            userName: userName,
            jcType: jcType
        },
        url: "/views/td/jobcard/nrcjc/TdJcSelectCep.shtml"
    });
}

//修订完成
function modifyFinished() {
    //校验
    var isValidate = $("#mform").form('validate');
    if (!isValidate) {
        return;
    }
    var applicability = $("#applicability").textbox('getValue');
    var jcStatus = $("#jcStatus").combobox('getValue');//工卡状态
    var subjectCn = $("#subjectCn").textbox('getValue');//中文标题
    var subjectEn = $("#subjectEn").textbox('getValue');//英文标题
    var ata = $("#ata").textbox('getValue');//ATA
    var configDiffIdenty = $("#configDiffIdenty").combobox('getValue');//构型差异标识
    var taskCode = $("#taskCode").combobox('getValue');//工作类别
    var skills = $("#skills").combobox('getValue');//工种
    var writeLimit = $("#writeLimit").datebox('getValue');//编写期限
    var ifSubstantRev = $("#ifSubstantRev").combobox('getValue');//是否强制替换
    var exeFbObj = $("#exeFeedObj").combobox('getValue');
    var rciCheck = $("#rci").is(':checked');
    var riiCheck = $("#rii").is(':checked');
    var configDiffIdenty = $("#configDiffIdenty").combobox('getValue');
    var msgArr = [];

    if (null == applicability || undefined == applicability || "" == applicability) {
        msgArr.push("工卡适用性不能为空！");
    }

    if (null == jcStatus || undefined == jcStatus || "" == jcStatus) {
        // MsgAlert({content: "工卡状态不能为空！", type: 'error'});
        // return;
        msgArr.push("工卡状态不能为空！");
    }
    if (null == subjectCn || undefined == subjectCn || "" == subjectCn) {
        // MsgAlert({content: "中文标题不能为空！", type: 'error'});
        // return;
        msgArr.push("中文标题不能为空！");
    }
    if (null == subjectEn || undefined == subjectEn || "" == subjectEn) {
        // MsgAlert({content: "英文标题不能为空！", type: 'error'});
        // return;
        msgArr.push("英文标题不能为空！");
    }
    if (null == ata || undefined == ata || "" == ata) {
        // MsgAlert({content: "ATA不能为空！", type: 'error'});
        // return;
        msgArr.push("ATA不能为空！");
    }
    if (null == configDiffIdenty || undefined == configDiffIdenty || "" == configDiffIdenty) {
        // MsgAlert({content: "构型差异标识不能为空！", type: 'error'});
        // return;
        msgArr.push("构型差异标识不能为空！");
    }
    if (null == taskCode || undefined == taskCode || "" == taskCode) {
        // MsgAlert({content: "工作类别不能为空！", type: 'error'});
        // return;
        msgArr.push("工作类别不能为空！");
    }
    if (null == skills || undefined == skills || "" == skills) {
        // MsgAlert({content: "工种不能为空！", type: 'error'});
        // return;
        msgArr.push("工种不能为空！");
    }
    if (null == writeLimit || undefined == writeLimit || "" == writeLimit) {
        // MsgAlert({content: "编写期限不能为空！", type: 'error'});
        // return;
        msgArr.push("编写期限不能为空！");
    }
    if (null == ifSubstantRev || undefined == ifSubstantRev || "" == ifSubstantRev) {
        // MsgAlert({content: "是否强制替换不能为空！", type: 'error'});
        // return;
        msgArr.push("是否强制替换不能为空！");
    }

    if (msgArr.length > 0) {
        hints(msgArr);
    } else {
        //检验工卡的工序
        if (flowStatus == null || flowStatus == undefined || flowStatus == '') {
            InitFuncCodeRequest_({
                data: {pkid: jcPkid, FunctionCode: "TD_JC_CURRENT_CEP_STATUS"}, successCallBack: function (jdata) {
                    if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                        if (jdata.data.length == 0) {
                            MsgAlert({content: "当前没有工序文件，不能完成修订。", type: 'error'});
                        } else {
                            var cepFilePath = jdata.data[0].JC_CEP_PATH;
                            var cepStatus = jdata.data[0].CEP_STATUS;
                            if (cepFilePath == null || cepFilePath == "") {
                                MsgAlert({content: "当前没有工序文件，不能完成修订。", type: 'error'});
                                return;
                            }
                            if (cepStatus != "" && cepStatus == "Y") {
                                MsgAlert({content: "当前文件已被检出，不能完成修订。", type: 'error'});
                                return;
                            }
                            //校验工卡适用性与构型差异一致性
                            InitFuncCodeRequest_({
                                data: {
                                    cepFilePath: cepFilePath,
                                    configDiffIdenty: configDiffIdenty,
                                    FunctionCode: "CHECK_IF_CONFIG_DIFF"
                                },
                                successCallBack: function (jdata5) {
                                    if (jdata5.code == RESULT_CODE.SUCCESS_CODE || jdata5.code == "907") {
                                        if (jdata5.code == "907") {
                                            var msg = jdata5.msg.substring(jdata5.msg.indexOf(":") + 1, jdata5.msg.length);
                                            if (!confirm(msg)) {
                                                return;
                                            }
                                        }
                                        //执行反馈对象校验
                                        InitFuncCodeRequest_({
                                            data: {
                                                cepFilePath: cepFilePath,
                                                exeFbObj: exeFbObj,
                                                FunctionCode: "CHECK_EXE_FB_EMAIL"
                                            },
                                            successCallBack: function (jdata3) {
                                                if (jdata3.code == RESULT_CODE.SUCCESS_CODE) {
                                                    InitFuncCodeRequest_({
                                                        data: {pkid: jcPkid, FunctionCode: "GET_JC_MATER_PN"},
                                                        successCallBack: function (jdata) {
                                                            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                                                                if (jdata.data.length == 0) { //没有航材信息
                                                                    //校验MARK信息中的必检与互检
                                                                    InitFuncCodeRequest_({
                                                                        data: {
                                                                            jcType: jcType,
                                                                            rciCheck: rciCheck,
                                                                            riiCheck: riiCheck,
                                                                            cepFilePath: cepFilePath,
                                                                            FunctionCode: "CHECK_BJ_OR_HJ"
                                                                        },
                                                                        successCallBack: function (jdata4) {
                                                                            if (jdata4.code == RESULT_CODE.SUCCESS_CODE) {
                                                                                mFGeneral();
                                                                            } else {
                                                                                if (jdata4.code == "901") { //如果工序中仅包含RII,封面仅包含RCI,则勾掉RCI,勾起RII
                                                                                    if (confirm(jdata4.msg)) {
                                                                                        $("#rci").prop("checked", false);
                                                                                        $("#rii").prop("checked", true);
                                                                                    } else {
                                                                                        return;
                                                                                    }
                                                                                } else if (jdata4.code == "902") { //如果工序中仅包含RII,封面上RII与RCI都不存在,则勾起RII
                                                                                    if (confirm(jdata4.msg)) {
                                                                                        $("#rii").prop("checked", true);
                                                                                    } else {
                                                                                        return;
                                                                                    }
                                                                                } else if (jdata4.code == "903") {
                                                                                    if (confirm(jdata4.msg)) {
                                                                                        $("#rci").prop("checked", false);
                                                                                    } else {
                                                                                        return;
                                                                                    }
                                                                                } else if (jdata4.code == "904") {
                                                                                    if (confirm(jdata4.msg)) {
                                                                                        $("#rii").prop("checked", false);
                                                                                        $("#rci").prop("checked", true);
                                                                                    } else {
                                                                                        return;
                                                                                    }
                                                                                } else if (jdata4.code == "905") {
                                                                                    if (confirm(jdata4.msg)) {
                                                                                        $("#rci").prop("checked", true);
                                                                                    } else {
                                                                                        return;
                                                                                    }
                                                                                } else if (jdata4.code == "906") {
                                                                                    if (confirm(jdata4.msg)) {
                                                                                        $("#rii").prop("checked", false);
                                                                                    } else {
                                                                                        return;
                                                                                    }
                                                                                } else if (jdata4.code == "909") {
                                                                                    if (confirm(jdata4.msg)) {
                                                                                        $("#rii").prop("checked", true);
                                                                                        $("#rci").prop("checked", true);
                                                                                    } else {
                                                                                        return;
                                                                                    }
                                                                                } else if (jdata4.code == "912") {
                                                                                    if (confirm(jdata4.msg)) {
                                                                                        $("#rii").prop("checked", false);
                                                                                        $("#rci").prop("checked", false);
                                                                                    } else {
                                                                                        return;
                                                                                    }
                                                                                }
                                                                                mFGeneral();
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                                else { //有航材信息
                                                                    //检验航材件号重复
                                                                    InitFuncCodeRequest_({
                                                                        data: {
                                                                            pkid: jcPkid,
                                                                            FunctionCode: "CHECK_JC_MATER_PN_REPEAT"
                                                                        },
                                                                        successCallBack: function (jdata2) {
                                                                            if (jdata2.code == RESULT_CODE.SUCCESS_CODE) {
                                                                                if (jdata2.data.IF_REPEAT > 0) {
                                                                                    MsgAlert({
                                                                                        content: "航材列表件号有重复值，请审核！",
                                                                                        type: 'error'
                                                                                    });

                                                                                } else {
                                                                                    var noPn = "";
                                                                                    var pnDataList = [];
                                                                                    MaskUtil.mask("航材件号与件号主数据比对中...");
                                                                                    InitFuncCodeRequest_({
                                                                                        data: {FunctionCode: "GET_PN_MAIN_DATA"},
                                                                                        successCallBack: function (jdata1) {
                                                                                            if (jdata1.code == RESULT_CODE.SUCCESS_CODE) {
                                                                                                for (var j = 0; j < jdata1.data.length; j++) {
                                                                                                    pnDataList.push(jdata1.data[j].PARTNO);
                                                                                                }
                                                                                            }
                                                                                            for (var i = 0; i < jdata.data.length; i++) {
                                                                                                if ("TEORDEVICE" == jdata.data[i].MATER_SORT) {
                                                                                                    continue;
                                                                                                }
                                                                                                if ("UNSPECIFIC" != (jdata.data[i].MATER_SORT)) {
                                                                                                    var io = pnDataList.indexOf(jdata.data[i].PN);
                                                                                                    if (io == -1) {
                                                                                                        noPn = noPn + jdata.data[i].PN + ",";
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                            noPn = noPn.substring(0, noPn.lastIndexOf(","));
                                                                                            MaskUtil.unmask();
                                                                                            if (noPn.length > 0) {
                                                                                                MsgAlert({
                                                                                                    content: "不存在的件号有：[" + noPn + "]",
                                                                                                    type: 'error'
                                                                                                });
                                                                                            } else {
                                                                                                //校验MARK信息中的必检与互检
                                                                                                InitFuncCodeRequest_({
                                                                                                    data: {
                                                                                                        jcType: jcType,
                                                                                                        rciCheck: rciCheck,
                                                                                                        riiCheck: riiCheck,
                                                                                                        cepFilePath: cepFilePath,
                                                                                                        FunctionCode: "CHECK_BJ_OR_HJ"
                                                                                                    },
                                                                                                    successCallBack: function (jdata4) {
                                                                                                        if (jdata4.code == RESULT_CODE.SUCCESS_CODE) {
                                                                                                            mFGeneral();
                                                                                                        } else {
                                                                                                            if (jdata4.code == "901") { //如果工序中仅包含RII,封面仅包含RCI,则勾掉RCI,勾起RII
                                                                                                                if (confirm(jdata4.msg)) {
                                                                                                                    $("#rci").prop("checked", false);
                                                                                                                    $("#rii").prop("checked", true);
                                                                                                                } else {
                                                                                                                    return;
                                                                                                                }
                                                                                                            } else if (jdata4.code == "902") { //如果工序中仅包含RII,封面上RII与RCI都不存在,则勾起RII
                                                                                                                if (confirm(jdata4.msg)) {
                                                                                                                    $("#rii").prop("checked", true);
                                                                                                                } else {
                                                                                                                    return;
                                                                                                                }
                                                                                                            } else if (jdata4.code == "903") {
                                                                                                                if (confirm(jdata4.msg)) {
                                                                                                                    $("#rci").prop("checked", false);
                                                                                                                } else {
                                                                                                                    return;
                                                                                                                }
                                                                                                            } else if (jdata4.code == "904") {
                                                                                                                if (confirm(jdata4.msg)) {
                                                                                                                    $("#rii").prop("checked", false);
                                                                                                                    $("#rci").prop("checked", true);
                                                                                                                } else {
                                                                                                                    return;
                                                                                                                }
                                                                                                            } else if (jdata4.code == "905") {
                                                                                                                if (confirm(jdata4.msg)) {
                                                                                                                    $("#rci").prop("checked", true);
                                                                                                                } else {
                                                                                                                    return;
                                                                                                                }
                                                                                                            } else if (jdata4.code == "906") {
                                                                                                                if (confirm(jdata4.msg)) {
                                                                                                                    $("#rii").prop("checked", false);
                                                                                                                } else {
                                                                                                                    return;
                                                                                                                }
                                                                                                            } else if (jdata4.code == "909") {
                                                                                                                if (confirm(jdata4.msg)) {
                                                                                                                    $("#rii").prop("checked", true);
                                                                                                                    $("#rci").prop("checked", true);
                                                                                                                } else {
                                                                                                                    return;
                                                                                                                }
                                                                                                            } else if (jdata4.code == "912") {
                                                                                                                if (confirm(jdata4.msg)) {
                                                                                                                    $("#rii").prop("checked", false);
                                                                                                                    $("#rci").prop("checked", false);
                                                                                                                } else {
                                                                                                                    return;
                                                                                                                }
                                                                                                            }
                                                                                                            mFGeneral();
                                                                                                        }
                                                                                                    }
                                                                                                })
                                                                                            }
                                                                                        }
                                                                                    })
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            }
                                                        }
                                                    })
                                                } else {
                                                    MsgAlert({content: jdata3.msg, type: 'error'});

                                                }
                                            }
                                        })
                                    } else {
                                        MsgAlert({content: jdata5.msg, type: 'error'});
                                    }
                                }
                            })
                        }
                    }
                }
            });
        } else {
            if (cepFileUrl == null || cepFileUrl == "") {
                MsgAlert({content: "当前没有工序文件，不能完成修订。", type: 'error'});
                return;
            }
            if (cepCheck != "" && cepCheck == "Y") {
                MsgAlert({content: "当前文件已被检出，不能完成修订。", type: 'error'});
                return;
            }
            mFGeneral();
        }
    }
}

//修订完成
function mFGeneral() {
    if (!confirm("确认完成修订？")) {
        return;
    }
    var $form = $("#mform");
    var datas = $form.serializeObject();
    var ifsd, ad, rii, ali, cdccl, ewis, fts, dm, rci, cpcp, offAc, elt;
    var exeObjIdInfo = $("#exeObjIds").val();

    if ($("#ifsd").is(':checked')) {
        ifsd = $("#ifsd").attr("value") + ",";
    } else {
        ifsd = "";
    }

    if ($("#ad").is(':checked')) {
        ad = $("#ad").attr("value") + ",";
    } else {
        ad = "";
    }

    if ($("#rii").is(':checked')) {
        rii = $("#rii").attr("value") + ",";
    } else {
        rii = "";
    }

    if ($("#ali").is(':checked')) {
        ali = $("#ali").attr("value") + ",";
    } else {
        ali = "";
    }

    if ($("#cdccl").is(':checked')) {
        cdccl = $("#cdccl").attr("value") + ",";
    } else {
        cdccl = "";
    }

    if ($("#ewis").is(':checked')) {
        ewis = $("#ewis").attr("value") + ",";
    } else {
        ewis = "";
    }

    if ($("#fts").is(':checked')) {
        fts = $("#fts").attr("value") + ",";
    } else {
        fts = "";
    }

    if ($("#dm").is(':checked')) {
        dm = $("#dm").attr("value") + ",";
    } else {
        dm = "";
    }

    if ($("#rci").is(':checked')) {
        rci = $("#rci").attr("value") + ",";
    } else {
        rci = "";
    }


    if ($("#cpcp").is(':checked')) {
        cpcp = $("#cpcp").attr("value") + ",";
    } else {
        cpcp = "";
    }

    if ($("#off-ac").is(':checked')) {
        offAc = $("#off-ac").attr("value") + ",";
    } else {
        offAc = "";
    }

    if ($("#elt").is(':checked')) {
        elt = $("#elt").attr("value") + ",";
    } else {
        elt = "";
    }

    var markInfo = ifsd + ad + rii + ali + cdccl + ewis + fts + dm + rci + cpcp + offAc + elt;

    if (markInfo == "" || markInfo == null || markInfo == undefined) {
        markInfo = "";
    } else {
        markInfo = markInfo.substring(0, markInfo.lastIndexOf(","));
    }
    datas = $.extend(datas, {
        FunctionCode: 'TD_JC_NSJC_EDITED',
        jcType: jcType,
        markInfo: markInfo,
        exeObjIdInfo: exeObjIdInfo
    });

    InitFuncCodeRequest_({
        data: datas, successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                if (param.OWindow && typeof param.OWindow.reload_ == 'function') {
                    param.OWindow.reload_();
                }
                InitDataForm(jdata.data.pkid, jdata.data.jcNo);
                MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    });
    // saveOrEditJobcard(jcNo);
    // var $form = $("#mform");
    // var datas = $form.serializeObject();
    // datas = $.extend(datas, {FunctionCode: 'TD_JC_NSJC_EDITED'});
    // InitFuncCodeRequest_({
    //     data: datas,
    //     successCallBack: function (jdata) {
    //         if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
    //             // MsgAlert({content: $.i18n.t('msg_tip:TIP.COMMON.OPT_SUCCESS')});
    //             if (param.OWindow && typeof param.OWindow.reload_ == 'function') {
    //                 param.OWindow.reload_();
    //             }
    //             InitDataForm(jcPkid, jcNo);
    //         } else {
    //             MsgAlert({content: jdata.msg, type: 'error'});
    //
    //         }
    //     }
    // });
}

//自动生成工卡号（SNJC-机型-章节-流水号）
function proJcNo() {
    $("#jcNoPre").val("");
    //型号
    var fleet = $("#fleet").combobox('getValue');
    //章节
    var ata = $("#ata").combobox('getValue');
    //流水号(通过型号+章节去数据库找最新的并在原有版本上加1)
    var sn;
    if (fleet != "" && ata != "") {
        InitFuncCodeRequest_({
            data: {fleet: fleet, ata: ata, FunctionCode: "TD_NRC_JC_GET_SN"},
            successCallBack: function (jdata) {
                if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                    sn = jdata.data.NUM;
                    if (sn < 10) {
                        sn = "000" + sn;
                    } else if (sn >= 10 && sn < 100) {
                        sn = "00" + sn;
                    } else if (sn >= 100 && sn < 1000) {
                        sn = sn;
                    }
                    $("#jcNoPre").textbox('setValue', 'NSJC' + '-' + fleet + '-' + ata + "-" + sn);
                }
            }
        });
    } else if (fleet != "" && ata == "") { //型号有值,ata没值
        $("#jcNoPre").textbox('setValue', 'NSJC' + '-' + fleet);
    } else if (fleet == "" && ata != "") { //型号没值,ata有值
        MsgAlert({content: "请先选择型号！", type: 'error'});
        $("#ata").combobox('setValue', '');
        $("#jcNoPre").textbox('setValue', '');
    } else {
        $("#jcNoPre").textbox('setValue', '');
    }

}

//添加机身适用性
function addAplApplic(acnos) {
    $("#applicability").textbox('setValue', acnos);
}

//添加发动机或部件适用性
function addEngOrPart(applic) {
    $("#applicability").textbox('setValue', applic);
}

// //将选择的单机适用性存入表单封面
// function addSingleAppIntoForm(applic){
//     $("#nsjcAplApplic").val(applic);
// }

//选择单机
function singlePreviewPDF() {

    var mopNo = $("#mopNo").val();
    var msgArr = [];
    if(mopNo != null && mopNo != undefined && mopNo != ''){
        // MsgAlert({content: "ME系统PDF路径有值，不能做单机预览！", type: 'error'});
        // return;
        msgArr.push("ME系统PDF路径有值，不能做单机预览！");
    }
    if (CEP_FILE_PATH == null || CEP_FILE_PATH == "") {
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
                jcId: jcPkid,
                fleet: fleet,
                action: "EMSINGLEPREVIEW"
            },
            url: "/views/td/jobcard/tdAcnoChoose.shtml"
        });
    }
}

function cepView(data) {
    $("#cepCheckout").val('N');
    $("#cepPkid").val(data.pkid);
    $("#cepFilePath").val(data.jcCepPath);
}

//从区域与盖板主数据中取区域值
function chooseZonesFromMD() {
    var title_ = $.i18n.t('选择区域值');
    var zoneIds = $("#zoneIds").val();
    ShowWindowIframe({
        width: "980",
        height: "500",
        param: {
            companyCode: companyCode,//同营运人
            fleet: fleet,//同机型
            zonesIds: zoneIds,
            title: title_,
        },
        url: "/views/td/jobcard/smjc/smjcedit/tdZonesChoose.shtml"
    });
}

//从区域与盖板主数据中取盖板值
function chooseAcpansFromMD() {
    var title_ = $.i18n.t('选择接近盖板值');
    var acpanIds = $("#acpanIds").val();
    ShowWindowIframe({
        width: "980",
        height: "500",
        param: {
            companyCode: companyCode,//同营运人
            fleet: fleet,//同机型
            acpanIds: acpanIds,
            title: title_,
        },
        url: "/views/td/jobcard/smjc/smjcedit/tdAcpansChoose.shtml"
    });
}

function setZonesFromMd(zones, zoneIds) {
    $("#zones").textbox('setValue', zones);
    $("#zoneIds").val(zoneIds);
}

function setAcpansFromMd(acpans, acpanIds) {
    $("#accessNo").textbox('setValue', acpans);
    $("#acpanIds").val(acpanIds);
}

//工卡页面选取自定义附加内容
function addAppendix() {
    var jcNo;
    var title_ = $.i18n.t('选取自定义附加内容');
    var pkid = $("#pkid").val();
    var jcNoPre = $("#jcNoPre").textbox('getValue');
    var jcNoSuffix = $("#jcNoSuffix").textbox('getValue');
    if (jcNoSuffix == null || jcNoSuffix == '' || jcNoSuffix == undefined) {
        jcNo = jcNoPre;
    } else {
        jcNo = jcNoPre + "-" + jcNoSuffix;
    }
    if ($.trim(pkid) == '') {
        alert("请先保存工卡封面,再选取附加内容！");
        return;
    }
    ShowWindowIframe({
        width: "1000",
        height: "500",
        param: {
            model: fleet,//同型号
            companyCode: companyCode,//同营运人
            jcNo: jcNo,
            appType: appType,
            title: title_,
            jcType: jcType
        },
        url: "/views/td/jobcard/smjc/smjcedit/tdAppendixChoose.shtml"
    });
}

//延期申请
function delayApply() {
    var pkid = $("#pkid").val();
    var jcNo;
    if (pkid == "") {
        MsgAlert({content: '请先保存基本信息！', type: 'error'});
        return false;
    }
    var isValidate = $("#mform").form('validate');
    if (!isValidate) {
        MsgAlert({content: '请完整填写页面必填内容保存后再进行该操作', type: 'warn'});
        return false;
    }
    var jcNoPre = $("#jcNoPre").textbox('getValue');
    var jcNoSuffix = $("#jcNoSuffix").textbox('getValue');
    if (jcNoSuffix == null || jcNoSuffix == '' || jcNoSuffix == undefined) {
        jcNo = jcNoPre;
    } else {
        jcNo = jcNoPre + "-" + jcNoSuffix;
    }
    var writeLimit = $("#writeLimit").datebox('getValue');//编写期限
    InitFuncCodeRequest_({
        data: {postponeObjectPkid: pkid, postponeSort: "NSTK", FunctionCode: "TD_JC_CHECK_IF_SUBMIT_DELAY"},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                if (jdata.data.COU != 0) {
                    MsgAlert({content: '已有未审批完成的延期申请，请勿重复提交!', type: 'error'});
                } else {
                    ShowWindowIframe({ //链接MP综合查询页面
                        width: 610,
                        height: 330,
                        param: {
                            postponeSort: "NSTK",
                            postponeObjectPkid: pkid,
                            postponeObjectNo: jcNo,
                            originalDeadline: writeLimit
                        },
                        title: "工卡延期申请",
                        url: "/views/em/empostpone/empostpone_add.shtml"
                    });
                }
            } else {
                MsgAlert({content: jdata.msg, type: 'error'});
            }
        }
    })
}

//从TC手册中带出区域与盖板数据
function setZonesAndAcpans(zones, acpans, manualType) {
    if ("TC" == manualType) {
        $("#zones").textbox('setValue', zones);
        $("#accessNo").textbox('setValue', acpans);
    }
}

//从选取的原厂手册中带出手册版本
function setManualVer(manualVer) {
    $("#oemManualVer").textbox('setValue', manualVer);
}

//刷新航材信息
function reloadMaterAndTool() {
    $("#dg").datagrid("reload");
}



function checkQua() {
    var ata = $("#ata").combobox('getValue');
    var fleet = $("#fleet").combobox('getValue');
    InitFuncCodeRequest_({
        data: {pkid: jcPkid, taskType: "NSJC", FunctionCode: 'TD_JC_CHECK_QUA'},
        successCallBack: function (jdata) {
            if (jdata.code == RESULT_CODE.SUCCESS_CODE) {
                eflag = jdata.data.eflag;
                ifQua = jdata.data.ifQua;
                var tips = '';
                if (eflag == "NO") {
                    tips = "当前用户没有该工卡的资质，请提交给有资质的用户！";
                }
                if (eflag == "ALL") {
                    var datas = $.extend({}, {}, {FunctionCode: 'TD_JC_ALL_NSJC_STATUS', pkid: jcPkid});
                    InitFuncCodeRequest_({
                        data: datas, successCallBack: function (jdata) {
                            if (jdata.data == null) {
                                common_add_edit_({
                                    identity: '', isEdit: '', width: 520, height: 300, title: $.i18n.t('选择审批人'),
                                    param: {
                                        roleId: '',
                                        otherParam: jcPkid,
                                        msgData: msgData,
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
                    $.messager.confirm('', tips, function (r) {
                        if (r) {
                            ShowWindowIframe({
                                width: 550,
                                height: 250,
                                title: "联合评估",
                                param: {
                                    pkid: jcPkid,
                                    ata: ata,
                                    fleet: fleet,
                                    cflag: "commit",
                                    fluflag: "edit",
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

function turnTdJc() {
    var ata = $("#ata").combobox('getValue');
    var fleet = $("#fleet").combobox('getValue');
    var cflag = "turn";
    ShowWindowIframe({
        width: 550,
        height: 250,
        title: "驳回",
        param: {
            accId: evaManId,
            pkid: jcPkid,
            cflag: cflag,
            ata: ata,
            fleet: fleet,
            ifQua: "N",
            taskType: "NSJC",
            accountId: accountId
        },
        url: '/views/td/jobcard/smjc/smjcedit/tdJcTrans.shtml'
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

//显示所有修订内容（不包含当前版本）
function showAllModifyContent() {
    var jcPkid = $("#pkid").val();
    ShowWindowIframe({
        width: 600,
        height: 600,
        param: {jcPkid: jcPkid},
        title: "修订内容详情",
        url: "/views/td/jobcard/commonjc/TdJcModifyContentHints.shtml"
    });
}

//显示所有改版记录（不包含当前版本）
function showAllRevRecord() {
    var jcPkid = $("#pkid").val();
    ShowWindowIframe({
        width: 600,
        height: 600,
        param: {jcPkid: jcPkid},
        title: "改版记录详情",
        url: "/views/td/jobcard/commonjc/TdJcRevRecordHints.shtml"
    });
}

function clearRefDate() {
    $("#refdataType").combobox('setValue', '');
    $("#refData").textbox('setValue', '');
}

//复制航材
function copyMaterialAndTools() {
    var title_ = $.i18n.t('选择工卡');
    var pkid = $("#pkid").val();
    if ($.trim(pkid) == '') {
        alert("请先保存工卡封面，再进行工序编辑。");
        return;
    }
    ShowWindowIframe({
        width: "1000",
        height: "500",
        param: {
            fleet: fleet,//同机型
            companyCode: companyCode,//同营运人
            pkid: pkid,//原工卡ID
            title: title_
        },
        url: "/views/td/jobcard/smjc/smjcedit/tdChooseOtherJcMT.shtml"
    });
}

//手动录入关联手册
function handImportRelateManual() {
    var pkid = $("#pkid").val();
    if ($.trim(pkid) == '') {
        alert("请先保存工卡封面，再进行工序编辑。");
        return;
    }
    var title_ = $.i18n.t('手动录入--其他参考资料');
    ShowWindowIframe({
        width: "520",
        height: "220",
        title: title_,
        param: {pkid: pkid},
        url: "/views/td/jobcard/tdRelateManual/tdRelateManualHandImport.shtml"
    });
}

function reloadMt() {
    $("#dg").datagrid("reload");
}

//选择其他反馈对象
function chooseOtherExeFeedObjEmail() {
    var exeObjIdInfo = $("#exeObjIds").val();
    var exeFeedObj = $("#exeFeedObj").combobox('getValue');
    var flag = "";
    if (exeFeedObj == "JC_EDITOR") {
        flag = "USER";
    } else if (exeFeedObj == "OTHER") {
        flag = "GROUP";
    }
    ShowWindowIframe({
        width: 730,
        height: 600,
        title: "选择反馈人",
        param: {exeObjIdInfo: exeObjIdInfo, flag: flag},
        url: "/views/td/jobcard/commonjc/TdChooseOtherExeObjEmail.shtml"
    });
}

function setOtherExeObjValue(otherExeObj, exeObjIds) {
    $("#exeFeedObjEmail").textbox('setValue', otherExeObj);
    $("#exeObjIds").val(exeObjIds);
}

function newPnRequest() {
    common_add_edit_({
        identity: 'dg', isEdit: 0, width: 800, height: 400,
        url: "/views/mm/pnApply/mm_pn_apply_add_edit.shtml"
    });
}
